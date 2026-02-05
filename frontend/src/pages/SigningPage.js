import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Download,
  Home,
  FileText,
  User,
  Calendar,
  CreditCard,
  Clock,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const SERVICE_FEE = 100; // SEK

// Navigation Header
const SigningNavigation = () => {
  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50" data-testid="signing-navigation">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2" data-testid="signing-nav-logo">
            <div className="w-10 h-10 bg-[#1A3C34] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
              Securebooking
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: "Utkast", color: "bg-gray-100 text-gray-600" },
    pending_tenant_signature: { label: "Väntar på hyresgäst", color: "bg-yellow-100 text-yellow-700" },
    pending_landlord_signature: { label: "Redo för din signering", color: "bg-blue-100 text-blue-700" },
    pending_payment: { label: "Väntar på betalning", color: "bg-orange-100 text-orange-700" },
    completed: { label: "Klart", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Avbrutet", color: "bg-red-100 text-red-700" },
  };
  
  const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`} data-testid="status-badge">
      {config.label}
    </span>
  );
};

// Waiting for Tenant View
const WaitingForTenant = ({ agreement }) => {
  const [copied, setCopied] = useState(false);
  const tenantLink = `${window.location.origin}/tenant/${agreement.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(tenantLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center" data-testid="waiting-for-tenant">
      <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Clock className="w-10 h-10 text-yellow-600" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
        Väntar på hyresgästen
      </h2>
      <p className="text-[#5A5A5A] mb-6 max-w-md mx-auto">
        Avtalet har skickats till <strong>{agreement.tenant?.email}</strong>. 
        Du får ett meddelande när hyresgästen har fyllt i sina uppgifter och signerat.
      </p>

      <div className="card-elevated max-w-md mx-auto mb-6">
        <p className="text-sm text-[#5A5A5A] mb-3">Länk till hyresgästen:</p>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={tenantLink} 
            readOnly 
            className="flex-1 h-10 px-3 bg-[#F9F9F7] border border-[#E2E2E0] rounded-lg text-sm"
          />
          <button 
            onClick={copyLink}
            className="h-10 px-4 bg-[#1A3C34] text-white rounded-lg flex items-center gap-2 hover:bg-[#142F29] transition-colors"
            data-testid="copy-tenant-link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="bg-[#F9F9F7] p-4 rounded-lg max-w-md mx-auto text-left">
        <h4 className="font-semibold text-[#1A3C34] mb-2">Nästa steg</h4>
        <ol className="text-sm text-[#5A5A5A] space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
            Hyresgästen fyller i sina uppgifter och signerar med BankID
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-[#E8E8E6] text-[#5A5A5A] rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
            Du granskar och signerar med BankID
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-[#E8E8E6] text-[#5A5A5A] rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
            Betala {SERVICE_FEE} SEK via Swish
          </li>
        </ol>
      </div>
    </div>
  );
};

// Agreement Review (for Landlord)
const AgreementReview = ({ agreement, onProceed }) => {
  const [accepted, setAccepted] = useState(false);

  const propertyTypes = {
    lagenhet: "Lägenhet",
    hus: "Hus",
    rum: "Rum",
    stuga: "Stuga",
    annat: "Annat"
  };

  return (
    <div data-testid="agreement-review">
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
          Hyresgästen har signerat!
        </h2>
        <p className="text-[#5A5A5A]">
          Granska avtalet och signera för att slutföra
        </p>
      </div>

      <div className="space-y-6">
        {/* Tenant Info */}
        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-[#1A3C34]">Hyresgäst (signerad med BankID)</h3>
            <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#5A5A5A]">Namn</p>
              <p className="font-medium text-[#1A3C34]">{agreement.tenant?.name}</p>
            </div>
            <div>
              <p className="text-[#5A5A5A]">Personnummer</p>
              <p className="font-medium text-[#1A3C34]">{agreement.tenant?.personnummer}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[#5A5A5A]">Adress</p>
              <p className="font-medium text-[#1A3C34]">
                {agreement.tenant?.address}, {agreement.tenant?.postal_code} {agreement.tenant?.city}
              </p>
            </div>
            <div>
              <p className="text-[#5A5A5A]">E-post</p>
              <p className="font-medium text-[#1A3C34]">{agreement.tenant?.email}</p>
            </div>
            <div>
              <p className="text-[#5A5A5A]">Telefon</p>
              <p className="font-medium text-[#1A3C34]">{agreement.tenant?.phone || "-"}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E2E2E0]">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Signerat med BankID: {agreement.tenant_signed_at?.slice(0, 16).replace('T', ' ')}
            </p>
          </div>
        </div>

        {/* Property */}
        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container">
              <Home className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-[#1A3C34]">Hyresobjekt</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="md:col-span-2">
              <p className="text-[#5A5A5A]">Adress</p>
              <p className="font-medium text-[#1A3C34]">{agreement.property?.address}</p>
              <p className="text-[#5A5A5A]">{agreement.property?.postal_code} {agreement.property?.city}</p>
            </div>
            <div>
              <p className="text-[#5A5A5A]">Typ</p>
              <p className="font-medium text-[#1A3C34]">
                {propertyTypes[agreement.property?.property_type] || agreement.property?.property_type || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Period & Payment */}
        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container">
              <CreditCard className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-[#1A3C34]">Hyresvillkor</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#5A5A5A]">Hyresperiod</p>
              <p className="font-medium text-[#1A3C34]">
                {agreement.rental_period?.from_date} — {agreement.rental_period?.to_date}
              </p>
            </div>
            <div>
              <p className="text-[#5A5A5A]">Hyresbelopp</p>
              <p className="font-medium text-[#1A3C34]">{agreement.payment?.rent_amount} SEK</p>
            </div>
          </div>
        </div>

        {/* Accept and Proceed */}
        <div className="card-elevated bg-[#1A3C34]/5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-[#E2E2E0] text-[#1A3C34] focus:ring-[#1A3C34]"
              data-testid="accept-review-checkbox"
            />
            <span className="text-[#1A3C34]">
              Jag har granskat avtalet och hyresgästens uppgifter och godkänner innehållet
            </span>
          </label>
          
          <button
            onClick={onProceed}
            disabled={!accepted}
            className={`mt-6 w-full btn-primary flex items-center justify-center gap-2 ${!accepted ? 'opacity-50 cursor-not-allowed' : ''}`}
            data-testid="proceed-to-sign-btn"
          >
            Fortsätt till signering
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Mock BankID Component (for Landlord)
const BankIDSigning = ({ agreement, onComplete }) => {
  const [status, setStatus] = useState("idle");
  const [orderRef, setOrderRef] = useState(null);
  const [message, setMessage] = useState("");

  const startSigning = async () => {
    setStatus("starting");
    try {
      const response = await axios.post(`${API}/agreements/${agreement.id}/bankid/start`, {
        personnummer: agreement.landlord?.personnummer,
        signer_type: "landlord"
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
        {agreement.landlord?.name} ({agreement.landlord?.personnummer})
      </p>

      {status === "idle" && (
        <button
          onClick={startSigning}
          className="btn-primary inline-flex items-center gap-2"
          data-testid="start-bankid-btn"
        >
          Starta BankID
          <ArrowRight className="w-4 h-4" />
        </button>
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

// Mock Swish Payment Component (100 SEK service fee)
const SwishPayment = ({ agreement, onComplete }) => {
  const [status, setStatus] = useState("idle");
  const [paymentRef, setPaymentRef] = useState(null);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(agreement.landlord?.phone || "");

  const startPayment = async () => {
    setStatus("starting");
    try {
      const response = await axios.post(`${API}/agreements/${agreement.id}/swish/start`, {
        phone_number: phone || "0701234567",
        amount: SERVICE_FEE
      });
      setPaymentRef(response.data.payment_ref);
      setMessage(response.data.message);
      setStatus("pending");
    } catch (error) {
      setStatus("error");
      setMessage("Kunde inte starta Swish-betalning");
    }
  };

  const checkStatus = useCallback(async () => {
    if (!paymentRef) return;
    
    try {
      const response = await axios.get(`${API}/agreements/${agreement.id}/swish/status/${paymentRef}`);
      setMessage(response.data.message);
      
      if (response.data.status === "complete") {
        setStatus("complete");
        setTimeout(() => onComplete(), 1500);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  }, [paymentRef, agreement.id, onComplete]);

  useEffect(() => {
    if (status === "pending" && paymentRef) {
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [status, paymentRef, checkStatus]);

  return (
    <div className="card-elevated text-center" data-testid="swish-payment">
      <div className="w-20 h-20 bg-[#C66D5D] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Smartphone className="w-10 h-10 text-white" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
        Betala med Swish
      </h2>
      <p className="text-[#5A5A5A] mb-2">Tjänsteavgift för avtalet</p>
      <p className="text-4xl font-bold text-[#1A3C34] mb-6" style={{ fontFamily: 'Playfair Display' }}>
        {SERVICE_FEE} SEK
      </p>

      {status === "idle" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A3C34] mb-2">
              Ditt telefonnummer
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07X XXX XX XX"
              className="w-full max-w-xs mx-auto h-12 px-4 bg-white border border-[#E2E2E0] rounded-lg text-center"
              data-testid="phone-input"
            />
          </div>
          <button
            onClick={startPayment}
            className="bg-[#C66D5D] text-white px-8 py-4 rounded-full font-medium inline-flex items-center gap-2 hover:bg-[#B55D4D] transition-colors"
            data-testid="start-swish-btn"
          >
            Betala {SERVICE_FEE} SEK
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {status === "starting" && (
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#C66D5D]" />
          <span>Startar Swish...</span>
        </div>
      )}

      {status === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C66D5D]" />
            <span>{message}</span>
          </div>
          <div className="bg-[#F9F9F7] p-4 rounded-lg max-w-sm mx-auto">
            <p className="text-sm text-[#5A5A5A]">
              <strong>Demo-läge:</strong> Betalningen slutförs automatiskt...
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

// Completion Component
const CompletionView = ({ agreement }) => {
  const downloadPdf = () => {
    window.open(`${API}/agreements/${agreement.id}/pdf`, '_blank');
  };

  return (
    <div className="text-center" data-testid="completion-view">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-3xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
        Avtalet är klart!
      </h2>
      <p className="text-[#5A5A5A] mb-8 max-w-md mx-auto">
        Hyresavtalet har signerats av båda parter. 
        Ladda ner det färdiga avtalet som PDF nedan.
      </p>

      <div className="card-elevated max-w-md mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <FileText className="w-8 h-8 text-[#1A3C34]" />
          <div className="text-left">
            <p className="font-medium text-[#1A3C34]">Hyresavtal</p>
            <p className="text-sm text-[#5A5A5A]">{agreement.property?.address}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="bg-[#F9F9F7] p-3 rounded-lg">
            <p className="text-[#5A5A5A]">Hyresvärd</p>
            <p className="font-medium text-[#1A3C34]">{agreement.landlord?.name}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Signerad
            </p>
          </div>
          <div className="bg-[#F9F9F7] p-3 rounded-lg">
            <p className="text-[#5A5A5A]">Hyresgäst</p>
            <p className="font-medium text-[#1A3C34]">{agreement.tenant?.name}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Signerad
            </p>
          </div>
        </div>
        <div className="text-sm border-t border-[#E2E2E0] pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#5A5A5A]">Hyresbelopp</span>
            <span className="font-semibold text-[#1A3C34]">{agreement.payment?.rent_amount} SEK</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5A5A5A]">Period</span>
            <span className="font-medium text-[#1A3C34]">
              {agreement.rental_period?.from_date} — {agreement.rental_period?.to_date}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadPdf}
          className="btn-primary inline-flex items-center justify-center gap-2"
          data-testid="download-pdf-btn"
        >
          <Download className="w-5 h-5" />
          Ladda ner PDF
        </button>
        <Link to="/" className="btn-secondary inline-flex items-center justify-center gap-2" data-testid="back-home-btn">
          <Home className="w-5 h-5" />
          Till startsidan
        </Link>
      </div>
    </div>
  );
};

// Main Signing Page
const SigningPage = () => {
  const { agreementId } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("loading"); // loading, waiting, review, sign, payment, complete
  const [manualStep, setManualStep] = useState(null); // Track manual step changes

  const fetchAgreement = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/agreements/${agreementId}`);
      const data = response.data;
      setAgreement(data);
      
      // Only update step if not manually overridden
      if (!manualStep) {
        switch (data.status) {
          case "pending_tenant_signature":
            setStep("waiting");
            break;
          case "pending_landlord_signature":
            setStep("review");
            break;
          case "pending_payment":
            setStep("payment");
            break;
          case "completed":
            setStep("complete");
            break;
          default:
            setStep("waiting");
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError("Kunde inte hämta avtalet");
      setLoading(false);
    }
  }, [agreementId, manualStep]);

  useEffect(() => {
    fetchAgreement();
    
    // Poll for updates when waiting for tenant
    const interval = setInterval(() => {
      if (step === "waiting") {
        fetchAgreement();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchAgreement, step]);

  const handleReviewComplete = () => {
    setManualStep("sign");
    setStep("sign");
  };

  const handleSigningComplete = () => {
    setManualStep(null); // Clear manual override
    fetchAgreement();
  };

  const handlePaymentComplete = () => {
    setManualStep(null);
    fetchAgreement();
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
        <SigningNavigation />
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

  // Progress indicator
  const steps = [
    { key: "tenant", label: "Hyresgäst signerar", done: !!agreement.tenant_signed_at },
    { key: "landlord", label: "Du signerar", done: !!agreement.landlord_signed_at },
    { key: "payment", label: "Betalning", done: !!agreement.payment_completed_at },
    { key: "complete", label: "Klart", done: agreement.status === "completed" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7]" data-testid="signing-page">
      <SigningNavigation />
      
      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <StatusBadge status={agreement.status} />
            <h1 className="text-3xl md:text-4xl mt-4 mb-2" style={{ fontFamily: 'Playfair Display' }}>
              Hyresavtal
            </h1>
            <p className="text-[#5A5A5A]">{agreement.property?.address}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12" data-testid="signing-progress">
            {steps.map((s, index) => (
              <div key={s.key} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${s.done ? 'bg-green-500 text-white' : 'bg-[#E8E8E6] text-[#5A5A5A]'}`}>
                  {s.done ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-1 ${s.done ? 'bg-green-500' : 'bg-[#E8E8E6]'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          {step === "waiting" && <WaitingForTenant agreement={agreement} />}
          {step === "review" && <AgreementReview agreement={agreement} onProceed={handleReviewComplete} />}
          {step === "sign" && <BankIDSigning agreement={agreement} onComplete={handleSigningComplete} />}
          {step === "payment" && <SwishPayment agreement={agreement} onComplete={handlePaymentComplete} />}
          {step === "complete" && <CompletionView agreement={agreement} />}
        </div>
      </main>
    </div>
  );
};

export default SigningPage;
