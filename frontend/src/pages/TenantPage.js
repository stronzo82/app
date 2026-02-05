import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Home,
  Calendar,
  CreditCard,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Header
const TenantNavigation = () => {
  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50" data-testid="tenant-navigation">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1A3C34] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
              Securebooking
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Input Field
const InputField = ({ label, required, type = "text", placeholder, value, onChange, name, testId }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1A3C34]">
        {label} {required && <span className="text-[#C66D5D]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-12 px-4 bg-white border border-[#E2E2E0] rounded-lg text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#1A3C34] focus:border-transparent transition-all"
        data-testid={testId}
      />
    </div>
  );
};

// Section Card
const SectionCard = ({ icon: Icon, title, children, testId }) => {
  return (
    <div className="card-elevated" data-testid={testId}>
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-container">
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl" style={{ fontFamily: 'Playfair Display' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Agreement Summary Card
const AgreementSummary = ({ agreement }) => {
  const propertyTypes = {
    lagenhet: "Lägenhet",
    hus: "Hus",
    rum: "Rum",
    stuga: "Stuga",
    annat: "Annat"
  };

  return (
    <div className="card-elevated bg-[#1A3C34]/5" data-testid="agreement-summary">
      <h3 className="text-xl mb-6" style={{ fontFamily: 'Playfair Display' }}>
        Avtalsdetaljer
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Home className="w-5 h-5 text-[#1A3C34] mt-0.5" />
          <div>
            <p className="text-sm text-[#5A5A5A]">Hyresobjekt</p>
            <p className="font-medium text-[#1A3C34]">{agreement.property?.address}</p>
            <p className="text-sm text-[#5A5A5A]">
              {agreement.property?.postal_code} {agreement.property?.city}
            </p>
            {agreement.property?.property_type && (
              <p className="text-sm text-[#5A5A5A]">
                {propertyTypes[agreement.property.property_type] || agreement.property.property_type}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#1A3C34] mt-0.5" />
          <div>
            <p className="text-sm text-[#5A5A5A]">Hyresperiod</p>
            <p className="font-medium text-[#1A3C34]">
              {agreement.rental_period?.from_date} — {agreement.rental_period?.to_date}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-[#1A3C34] mt-0.5" />
          <div>
            <p className="text-sm text-[#5A5A5A]">Hyresbelopp</p>
            <p className="font-medium text-[#1A3C34]">{agreement.payment?.rent_amount} SEK</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-[#1A3C34] mt-0.5" />
          <div>
            <p className="text-sm text-[#5A5A5A]">Hyresvärd</p>
            <p className="font-medium text-[#1A3C34]">{agreement.landlord?.name}</p>
            <p className="text-sm text-[#5A5A5A]">{agreement.landlord?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terms Section
const TermsSection = ({ accepted, setAccepted }) => {
  const [showTerms, setShowTerms] = useState(false);

  const terms = [
    {
      title: "1. Säkerhet (deposition)",
      content: "Hyresgästen ska till hyresvärden erlägga säkerhet i form av deposition som garanti för fullgörande av de förpliktelser som följer av detta hyresavtal."
    },
    {
      title: "2. Andrahandsuthyrning",
      content: "Uthyrning i andra hand är inte tillåten utan hyresvärdens skriftliga godkännande."
    },
    {
      title: "3. Avbokning",
      content: "Hyreskontraktet kan hävas innan uppsägningsfristen, om parterna har kommit överens om det."
    },
    {
      title: "4. Städning",
      content: "Hyresgästen ansvarar för att bostaden är väl städad vid avflyttning."
    },
    {
      title: "5. Skador",
      content: "Hyresgästen ansvarar för skador som uppkommer genom oaktsamhet under hyresperioden."
    },
  ];

  return (
    <div className="card-elevated" data-testid="terms-section">
      <button 
        className="w-full flex items-center justify-between"
        onClick={() => setShowTerms(!showTerms)}
      >
        <div className="flex items-center gap-3">
          <div className="icon-container">
            <FileText className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl" style={{ fontFamily: 'Playfair Display' }}>Avtalsvillkor</h3>
        </div>
        <ArrowRight className={`w-5 h-5 text-[#1A3C34] transition-transform ${showTerms ? 'rotate-90' : ''}`} />
      </button>
      
      {showTerms && (
        <div className="mt-6 space-y-4 max-h-60 overflow-y-auto pr-2">
          {terms.map((term, index) => (
            <div key={index} className="border-b border-[#E2E2E0] pb-3 last:border-0">
              <h4 className="font-semibold text-[#1A3C34] text-sm mb-1">{term.title}</h4>
              <p className="text-sm text-[#5A5A5A]">{term.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-[#E2E2E0]">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-[#E2E2E0] text-[#1A3C34] focus:ring-[#1A3C34]"
            data-testid="checkbox-accept-terms"
          />
          <span className="text-[#1A3C34] font-medium">
            Jag har läst och godkänner avtalsvillkoren
          </span>
        </label>
      </div>
    </div>
  );
};

// BankID Signing Component
const BankIDSigning = ({ agreement, onComplete }) => {
  const [status, setStatus] = useState("idle");
  const [orderRef, setOrderRef] = useState(null);
  const [message, setMessage] = useState("");
  const [personnummer, setPersonnummer] = useState("");

  const startSigning = async () => {
    if (!personnummer) {
      alert("Du måste ange ditt personnummer");
      return;
    }
    
    setStatus("starting");
    try {
      const response = await axios.post(`${API}/agreements/${agreement.id}/bankid/start`, {
        personnummer: personnummer,
        signer_type: "tenant"
      });
      setOrderRef(response.data.order_ref);
      setMessage(response.data.message);
      setStatus("pending");
    } catch (error) {
      setStatus("error");
      setMessage("Kunde inte starta BankID-signering");
    }
  };

  const checkStatus = useCallback(async () => {
    if (!orderRef) return;
    
    try {
      const response = await axios.get(`${API}/agreements/${agreement.id}/bankid/status/${orderRef}`);
      setMessage(response.data.message);
      
      if (response.data.status === "complete") {
        setStatus("complete");
        setTimeout(() => onComplete(), 1500);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  }, [orderRef, agreement.id, onComplete]);

  useEffect(() => {
    if (status === "pending" && orderRef) {
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [status, orderRef, checkStatus]);

  return (
    <div className="card-elevated text-center" data-testid="bankid-signing">
      <div className="w-20 h-20 bg-[#1A3C34] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-10 h-10 text-white" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
        Signera med BankID
      </h2>
      <p className="text-[#5A5A5A] mb-6">
        Slutför genom att signera avtalet med ditt BankID
      </p>

      {status === "idle" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A3C34] mb-2">
              Ditt personnummer
            </label>
            <input
              type="text"
              value={personnummer}
              onChange={(e) => setPersonnummer(e.target.value)}
              placeholder="ÅÅÅÅMMDD-XXXX"
              className="w-full max-w-xs mx-auto h-12 px-4 bg-white border border-[#E2E2E0] rounded-lg text-center"
              data-testid="personnummer-input"
            />
          </div>
          <button
            onClick={startSigning}
            className="btn-primary inline-flex items-center gap-2"
            data-testid="start-bankid-btn"
          >
            Signera med BankID
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {status === "starting" && (
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#1A3C34]" />
          <span>Startar BankID...</span>
        </div>
      )}

      {status === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#1A3C34]" />
            <span>{message}</span>
          </div>
          <div className="bg-[#F9F9F7] p-4 rounded-lg max-w-sm mx-auto">
            <p className="text-sm text-[#5A5A5A]">
              <strong>Demo-läge:</strong> Signeringen slutförs automatiskt...
            </p>
          </div>
        </div>
      )}

      {status === "complete" && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-600 font-medium">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600">{message}</p>
          <button onClick={() => setStatus("idle")} className="btn-secondary">
            Försök igen
          </button>
        </div>
      )}
    </div>
  );
};

// Success View
const SuccessView = ({ agreement }) => {
  return (
    <div className="text-center" data-testid="tenant-success">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-3xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
        Tack för din signering!
      </h2>
      <p className="text-[#5A5A5A] mb-8 max-w-md mx-auto">
        Dina uppgifter har sparats och avtalet har signerats. 
        Hyresvärden ({agreement.landlord?.name}) har fått ett meddelande och kommer att slutföra avtalet.
      </p>

      <div className="card-elevated max-w-md mx-auto text-left">
        <h4 className="font-semibold text-[#1A3C34] mb-4">Vad händer nu?</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-[#5A5A5A]">Du har fyllt i dina uppgifter och signerat</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#1A3C34] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-medium">2</div>
            <p className="text-sm text-[#5A5A5A]">Hyresvärden granskar och signerar avtalet</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#E8E8E6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[#5A5A5A] text-xs font-medium">3</div>
            <p className="text-sm text-[#5A5A5A]">Båda parter får det färdiga avtalet som PDF</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="btn-secondary">
          Till Securebooking
        </Link>
      </div>
    </div>
  );
};

// Main Tenant Page
const TenantPage = () => {
  const { agreementId } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("info"); // info, sign, complete
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [tenantData, setTenantData] = useState({
    name: "",
    personnummer: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
  });

  const fetchAgreement = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/agreements/${agreementId}`);
      setAgreement(response.data);
      
      // Check if already signed by tenant
      if (response.data.tenant_signed_at) {
        setStep("complete");
      }
      
      setLoading(false);
    } catch (err) {
      setError("Kunde inte hämta avtalet");
      setLoading(false);
    }
  }, [agreementId]);

  useEffect(() => {
    fetchAgreement();
  }, [fetchAgreement]);

  const handleTenantDataChange = (e) => {
    const { name, value } = e.target;
    setTenantData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateTenantData = () => {
    const errors = {};
    if (!tenantData.name.trim()) errors.name = "Namn är obligatoriskt";
    if (!tenantData.personnummer.trim()) errors.personnummer = "Personnummer är obligatoriskt";
    if (!tenantData.address.trim()) errors.address = "Adress är obligatoriskt";
    if (!tenantData.phone.trim()) errors.phone = "Telefon är obligatoriskt";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToSign = async () => {
    if (!validateTenantData()) {
      return;
    }
    
    if (!termsAccepted) {
      alert("Du måste godkänna avtalsvillkoren");
      return;
    }

    // Update agreement with tenant data
    try {
      await axios.put(`${API}/agreements/${agreementId}/tenant`, {
        name: tenantData.name,
        personnummer: tenantData.personnummer,
        address: tenantData.address,
        postal_code: tenantData.postalCode,
        city: tenantData.city,
        phone: tenantData.phone,
        email: agreement.tenant?.email,
      });
      
      setStep("sign");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error updating tenant data:", error);
      alert("Kunde inte spara uppgifterna. Försök igen.");
    }
  };

  const handleSigningComplete = () => {
    fetchAgreement();
    setStep("complete");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A3C34]" />
      </div>
    );
  }

  if (error || !agreement) {
    return (
      <div className="min-h-screen bg-[#F9F9F7]">
        <TenantNavigation />
        <main className="pt-32 pb-20">
          <div className="max-w-lg mx-auto px-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
              {error || "Avtalet hittades inte"}
            </h1>
            <Link to="/" className="btn-primary">Gå till startsidan</Link>
          </div>
        </main>
      </div>
    );
  }

  // If agreement is not waiting for tenant
  if (agreement.status !== "pending_tenant_signature" && step !== "complete") {
    return (
      <div className="min-h-screen bg-[#F9F9F7]">
        <TenantNavigation />
        <main className="pt-32 pb-20">
          <div className="max-w-lg mx-auto px-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Avtalet har redan signerats
            </h1>
            <p className="text-[#5A5A5A] mb-6">
              Detta avtal har redan behandlats.
            </p>
            <Link to="/" className="btn-primary">Gå till startsidan</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7]" data-testid="tenant-page">
      <TenantNavigation />
      
      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          {step === "info" && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
                  Väntar på dig
                </span>
                <h1 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'Playfair Display' }}>
                  Du har fått ett hyresavtal
                </h1>
                <p className="text-[#5A5A5A]">
                  {agreement.landlord?.name} har bjudit in dig att signera ett hyresavtal
                </p>
              </div>

              {/* Agreement Summary */}
              <AgreementSummary agreement={agreement} />

              {/* Tenant Form */}
              <div className="mt-8">
                <SectionCard icon={User} title="Dina uppgifter" testId="section-tenant-info">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField 
                      label="Namn" required name="name"
                      value={tenantData.name} onChange={handleTenantDataChange}
                      placeholder="För- och efternamn" testId="input-tenant-name"
                    />
                    <InputField 
                      label="Personnummer" required name="personnummer"
                      value={tenantData.personnummer} onChange={handleTenantDataChange}
                      placeholder="ÅÅÅÅMMDD-XXXX" testId="input-tenant-personnummer"
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        label="Adress" required name="address"
                        value={tenantData.address} onChange={handleTenantDataChange}
                        placeholder="Din nuvarande adress" testId="input-tenant-address"
                      />
                    </div>
                    <InputField 
                      label="Postnummer" name="postalCode"
                      value={tenantData.postalCode} onChange={handleTenantDataChange}
                      placeholder="XXX XX" testId="input-tenant-postal"
                    />
                    <InputField 
                      label="Ort" name="city"
                      value={tenantData.city} onChange={handleTenantDataChange}
                      placeholder="Stad" testId="input-tenant-city"
                    />
                    <InputField 
                      label="Telefon" type="tel" name="phone"
                      value={tenantData.phone} onChange={handleTenantDataChange}
                      placeholder="07X XXX XX XX" testId="input-tenant-phone"
                    />
                  </div>
                </SectionCard>
              </div>

              {/* Terms */}
              <div className="mt-8">
                <TermsSection accepted={termsAccepted} setAccepted={setTermsAccepted} />
              </div>

              {/* Continue Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleContinueToSign}
                  className={`btn-primary flex items-center gap-2 ${(!termsAccepted || !tenantData.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!termsAccepted || !tenantData.name}
                  data-testid="btn-continue-sign"
                >
                  Fortsätt till signering
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === "sign" && (
            <BankIDSigning 
              agreement={agreement}
              onComplete={handleSigningComplete}
            />
          )}

          {step === "complete" && (
            <SuccessView agreement={agreement} />
          )}
        </div>
      </main>
    </div>
  );
};

export default TenantPage;
