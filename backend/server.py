from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
from datetime import datetime, timezone
from enum import Enum
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import asyncio
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Enums
class AgreementStatus(str, Enum):
    DRAFT = "draft"
    PENDING_TENANT_SIGNATURE = "pending_tenant_signature"
    PENDING_LANDLORD_SIGNATURE = "pending_landlord_signature"
    PENDING_PAYMENT = "pending_payment"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentMethod(str, Enum):
    BANK = "bank"
    SWISH = "swish"
    OTHER = "annat"

class SecurityType(str, Enum):
    DEPOSIT = "deposition"
    PREPAYMENT = "forskott"
    NONE = "ingen"

# Models
class PersonInfo(BaseModel):
    name: Optional[str] = ""
    personnummer: Optional[str] = ""
    address: Optional[str] = ""
    postal_code: Optional[str] = ""
    city: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""

class TenantInfo(BaseModel):
    email: str
    name: Optional[str] = ""
    personnummer: Optional[str] = ""
    address: Optional[str] = ""
    postal_code: Optional[str] = ""
    city: Optional[str] = ""
    phone: Optional[str] = ""

class PropertyInfo(BaseModel):
    address: str
    postal_code: Optional[str] = ""
    city: Optional[str] = ""
    property_type: Optional[str] = ""
    other_info: Optional[str] = ""

class RentalPeriod(BaseModel):
    from_date: str
    to_date: str
    person_count: Optional[int] = 1

class PaymentInfo(BaseModel):
    rent_amount: int
    payment_method: str
    security_type: Optional[str] = ""
    security_amount: Optional[str] = ""

class OtherInfo(BaseModel):
    cleaning: Optional[str] = ""
    special_terms: Optional[str] = ""
    comments: Optional[str] = ""

class AgreementCreate(BaseModel):
    landlord: PersonInfo
    tenant: TenantInfo  # Only email initially
    property: PropertyInfo
    rental_period: RentalPeriod
    payment: PaymentInfo
    other: Optional[OtherInfo] = None

class TenantUpdateRequest(BaseModel):
    name: str
    personnummer: str
    address: str
    postal_code: Optional[str] = ""
    city: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""

class Agreement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    landlord: PersonInfo
    tenant: dict  # Flexible to support partial data
    property: PropertyInfo
    rental_period: RentalPeriod
    payment: PaymentInfo
    other: Optional[OtherInfo] = None
    status: AgreementStatus = AgreementStatus.DRAFT
    tenant_signed_at: Optional[str] = None
    landlord_signed_at: Optional[str] = None
    payment_completed_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BankIDSignRequest(BaseModel):
    personnummer: str
    signer_type: str  # "tenant" or "landlord"

class BankIDStatusResponse(BaseModel):
    status: str  # "pending", "complete", "failed"
    message: str
    order_ref: Optional[str] = None

class SwishPaymentRequest(BaseModel):
    phone_number: str
    amount: int

class SwishPaymentResponse(BaseModel):
    status: str  # "pending", "complete", "failed"
    message: str
    payment_ref: Optional[str] = None

# Helper functions
def generate_pdf(agreement: dict) -> io.BytesIO:
    """Generate a PDF for the agreement"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=20*mm, leftMargin=20*mm, topMargin=20*mm, bottomMargin=20*mm)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, spaceAfter=20, textColor=colors.HexColor('#1A3C34'))
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=14, spaceAfter=10, textColor=colors.HexColor('#1A3C34'))
    normal_style = ParagraphStyle('Normal', parent=styles['Normal'], fontSize=10, spaceAfter=5)
    
    story = []
    
    # Title
    story.append(Paragraph("HYRESAVTAL", title_style))
    story.append(Paragraph(f"Avtal ID: {agreement['id'][:8]}", normal_style))
    story.append(Paragraph(f"Skapat: {agreement['created_at'][:10]}", normal_style))
    story.append(Spacer(1, 20))
    
    # Landlord
    story.append(Paragraph("HYRESVÄRD", heading_style))
    landlord = agreement['landlord']
    story.append(Paragraph(f"Namn: {landlord['name']}", normal_style))
    story.append(Paragraph(f"Personnummer: {landlord['personnummer']}", normal_style))
    story.append(Paragraph(f"Adress: {landlord['address']}, {landlord.get('postal_code', '')} {landlord.get('city', '')}", normal_style))
    story.append(Paragraph(f"E-post: {landlord.get('email', '-')}", normal_style))
    story.append(Paragraph(f"Telefon: {landlord.get('phone', '-')}", normal_style))
    story.append(Spacer(1, 15))
    
    # Tenant
    story.append(Paragraph("HYRESGÄST", heading_style))
    tenant = agreement['tenant']
    story.append(Paragraph(f"Namn: {tenant['name']}", normal_style))
    story.append(Paragraph(f"Personnummer: {tenant['personnummer']}", normal_style))
    story.append(Paragraph(f"Adress: {tenant['address']}, {tenant.get('postal_code', '')} {tenant.get('city', '')}", normal_style))
    story.append(Paragraph(f"E-post: {tenant.get('email', '-')}", normal_style))
    story.append(Paragraph(f"Telefon: {tenant.get('phone', '-')}", normal_style))
    story.append(Spacer(1, 15))
    
    # Property
    story.append(Paragraph("HYRESOBJEKT", heading_style))
    prop = agreement['property']
    story.append(Paragraph(f"Adress: {prop['address']}, {prop.get('postal_code', '')} {prop.get('city', '')}", normal_style))
    story.append(Paragraph(f"Typ: {prop.get('property_type', '-')}", normal_style))
    story.append(Spacer(1, 15))
    
    # Period
    story.append(Paragraph("HYRESPERIOD", heading_style))
    period = agreement['rental_period']
    story.append(Paragraph(f"Från: {period['from_date']}", normal_style))
    story.append(Paragraph(f"Till: {period['to_date']}", normal_style))
    story.append(Paragraph(f"Antal personer: {period.get('person_count', 1)}", normal_style))
    story.append(Spacer(1, 15))
    
    # Payment
    story.append(Paragraph("HYRA & BETALNING", heading_style))
    payment = agreement['payment']
    payment_methods = {"bank": "Banköverföring", "swish": "Swish", "annat": "Annat"}
    story.append(Paragraph(f"Hyresbelopp: {payment['rent_amount']} SEK", normal_style))
    story.append(Paragraph(f"Betalningssätt: {payment_methods.get(payment['payment_method'], payment['payment_method'])}", normal_style))
    if payment.get('security_type'):
        security_types = {"deposition": "Deposition", "forskott": "Förskottsbetalning", "ingen": "Ingen säkerhet"}
        story.append(Paragraph(f"Säkerhet: {security_types.get(payment['security_type'], payment['security_type'])}", normal_style))
    story.append(Spacer(1, 15))
    
    # Signatures
    story.append(Paragraph("SIGNATURER", heading_style))
    if agreement.get('tenant_signed_at'):
        story.append(Paragraph(f"✓ Hyresgäst signerad med BankID: {agreement['tenant_signed_at'][:19].replace('T', ' ')}", normal_style))
    if agreement.get('landlord_signed_at'):
        story.append(Paragraph(f"✓ Hyresvärd signerad med BankID: {agreement['landlord_signed_at'][:19].replace('T', ' ')}", normal_style))
    if agreement.get('payment_completed_at'):
        story.append(Paragraph(f"✓ Betalning genomförd: {agreement['payment_completed_at'][:19].replace('T', ' ')}", normal_style))
    story.append(Spacer(1, 20))
    
    # Terms
    story.append(Paragraph("AVTALSVILLKOR", heading_style))
    terms = [
        "1. Säkerhet (deposition): Hyresgästen ska erlägga säkerhet som garanti för avtalets fullgörande.",
        "2. Andrahandsuthyrning: Ej tillåten utan hyresvärdens skriftliga godkännande.",
        "3. Avbokning: Ska ske skriftligen efter överenskommelse mellan parterna.",
        "4. Kontraktsbrott: Vid väsentligt brott kan hyresvärden säga upp avtalet.",
        "5. Städning: Hyresgästen ansvarar för att bostaden är välstädad vid avflyttning.",
        "6. Skador: Hyresgästen ansvarar för skador genom oaktsamhet.",
        "7. Tillämplig lag: Detta avtal regleras enligt svensk lag."
    ]
    for term in terms:
        story.append(Paragraph(term, ParagraphStyle('Term', parent=normal_style, fontSize=9)))
    
    story.append(Spacer(1, 30))
    story.append(Paragraph("Detta avtal är digitalt signerat med BankID och är juridiskt bindande.", 
                          ParagraphStyle('Footer', parent=normal_style, fontSize=8, textColor=colors.gray)))
    
    doc.build(story)
    buffer.seek(0)
    return buffer


# API Routes

@api_router.get("/")
async def root():
    return {"message": "Securebooking API", "version": "1.0.0"}

# Create Agreement
@api_router.post("/agreements", response_model=dict)
async def create_agreement(data: AgreementCreate):
    agreement = Agreement(
        landlord=data.landlord,
        tenant=data.tenant,
        property=data.property,
        rental_period=data.rental_period,
        payment=data.payment,
        other=data.other,
        status=AgreementStatus.PENDING_TENANT_SIGNATURE
    )
    
    doc = agreement.model_dump()
    await db.agreements.insert_one(doc)
    
    return {"id": agreement.id, "status": agreement.status, "message": "Avtal skapat framgångsrikt"}

# Get Agreement
@api_router.get("/agreements/{agreement_id}")
async def get_agreement(agreement_id: str):
    agreement = await db.agreements.find_one({"id": agreement_id}, {"_id": 0})
    if not agreement:
        raise HTTPException(status_code=404, detail="Avtal hittades inte")
    return agreement

# List Agreements
@api_router.get("/agreements")
async def list_agreements():
    agreements = await db.agreements.find({}, {"_id": 0}).to_list(100)
    return agreements

# Mock BankID - Start Signing
@api_router.post("/agreements/{agreement_id}/bankid/start")
async def start_bankid_signing(agreement_id: str, data: BankIDSignRequest):
    agreement = await db.agreements.find_one({"id": agreement_id}, {"_id": 0})
    if not agreement:
        raise HTTPException(status_code=404, detail="Avtal hittades inte")
    
    # Generate mock order reference
    order_ref = f"bankid-{uuid.uuid4().hex[:12]}"
    
    # Store the pending signature
    await db.bankid_sessions.insert_one({
        "order_ref": order_ref,
        "agreement_id": agreement_id,
        "personnummer": data.personnummer,
        "signer_type": data.signer_type,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "order_ref": order_ref,
        "status": "pending",
        "message": "Öppna BankID-appen och skriv in din säkerhetskod"
    }

# Mock BankID - Check Status
@api_router.get("/agreements/{agreement_id}/bankid/status/{order_ref}")
async def check_bankid_status(agreement_id: str, order_ref: str):
    session = await db.bankid_sessions.find_one({"order_ref": order_ref})
    if not session:
        raise HTTPException(status_code=404, detail="BankID-session hittades inte")
    
    # Simulate BankID completion after a few checks (mock behavior)
    # In real implementation, this would check with BankID API
    check_count = await db.bankid_checks.count_documents({"order_ref": order_ref})
    await db.bankid_checks.insert_one({"order_ref": order_ref, "checked_at": datetime.now(timezone.utc).isoformat()})
    
    if check_count >= 2:  # Complete after 2 checks (simulating user signing)
        # Update agreement with signature
        now = datetime.now(timezone.utc).isoformat()
        
        if session['signer_type'] == 'tenant':
            await db.agreements.update_one(
                {"id": agreement_id},
                {"$set": {
                    "tenant_signed_at": now,
                    "status": AgreementStatus.PENDING_LANDLORD_SIGNATURE,
                    "updated_at": now
                }}
            )
        else:  # landlord
            await db.agreements.update_one(
                {"id": agreement_id},
                {"$set": {
                    "landlord_signed_at": now,
                    "status": AgreementStatus.PENDING_PAYMENT,
                    "updated_at": now
                }}
            )
        
        await db.bankid_sessions.update_one({"order_ref": order_ref}, {"$set": {"status": "complete"}})
        
        return {
            "status": "complete",
            "message": "Signering genomförd!",
            "signed_at": now
        }
    
    return {
        "status": "pending",
        "message": "Väntar på signering i BankID-appen..."
    }

# Mock Swish - Start Payment
@api_router.post("/agreements/{agreement_id}/swish/start")
async def start_swish_payment(agreement_id: str, data: SwishPaymentRequest):
    agreement = await db.agreements.find_one({"id": agreement_id}, {"_id": 0})
    if not agreement:
        raise HTTPException(status_code=404, detail="Avtal hittades inte")
    
    # Generate mock payment reference
    payment_ref = f"swish-{uuid.uuid4().hex[:12]}"
    
    await db.swish_sessions.insert_one({
        "payment_ref": payment_ref,
        "agreement_id": agreement_id,
        "phone_number": data.phone_number,
        "amount": data.amount,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "payment_ref": payment_ref,
        "status": "pending",
        "message": f"Öppna Swish-appen och godkänn betalningen på {data.amount} SEK"
    }

# Mock Swish - Check Status
@api_router.get("/agreements/{agreement_id}/swish/status/{payment_ref}")
async def check_swish_status(agreement_id: str, payment_ref: str):
    session = await db.swish_sessions.find_one({"payment_ref": payment_ref})
    if not session:
        raise HTTPException(status_code=404, detail="Swish-betalning hittades inte")
    
    # Simulate Swish completion after a few checks
    check_count = await db.swish_checks.count_documents({"payment_ref": payment_ref})
    await db.swish_checks.insert_one({"payment_ref": payment_ref, "checked_at": datetime.now(timezone.utc).isoformat()})
    
    if check_count >= 2:  # Complete after 2 checks
        now = datetime.now(timezone.utc).isoformat()
        
        await db.agreements.update_one(
            {"id": agreement_id},
            {"$set": {
                "payment_completed_at": now,
                "status": AgreementStatus.COMPLETED,
                "updated_at": now
            }}
        )
        
        await db.swish_sessions.update_one({"payment_ref": payment_ref}, {"$set": {"status": "complete"}})
        
        return {
            "status": "complete",
            "message": "Betalning genomförd!",
            "paid_at": now
        }
    
    return {
        "status": "pending",
        "message": "Väntar på betalning i Swish-appen..."
    }

# Generate PDF
@api_router.get("/agreements/{agreement_id}/pdf")
async def get_agreement_pdf(agreement_id: str):
    agreement = await db.agreements.find_one({"id": agreement_id}, {"_id": 0})
    if not agreement:
        raise HTTPException(status_code=404, detail="Avtal hittades inte")
    
    pdf_buffer = generate_pdf(agreement)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=hyresavtal-{agreement_id[:8]}.pdf"
        }
    )

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
