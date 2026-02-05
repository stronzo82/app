import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Home,
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  Loader2,
  Mail,
  Copy,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Form Navigation Header
const FormNavigation = () => {
  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50" data-testid="form-navigation">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2" data-testid="form-nav-logo">
            <div className="w-10 h-10 bg-[#1A3C34] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
              Securebooking
            </span>
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-[#5A5A5A] hover:text-[#1A3C34] transition-colors font-medium"
            data-testid="form-nav-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Progress Steps
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { num: 1, label: "Dina uppgifter", icon: User },
    { num: 2, label: "Bostad", icon: Home },
    { num: 3, label: "Hyresvillkor", icon: FileText },
    { num: 4, label: "Skicka", icon: Mail },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-12" data-testid="progress-steps">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div className={`flex items-center gap-2 ${currentStep >= step.num ? 'text-[#1A3C34]' : 'text-[#B0B0B0]'}`}>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${currentStep >= step.num 
                  ? 'bg-[#1A3C34] text-white' 
                  : 'bg-[#E8E8E6] text-[#5A5A5A]'
                }
                ${currentStep === step.num ? 'ring-4 ring-[#1A3C34]/20' : ''}
              `}
              data-testid={`step-indicator-${step.num}`}
            >
              {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
            </div>
            <span className="hidden md:block font-medium text-sm">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 md:w-16 h-0.5 mx-2 ${currentStep > step.num ? 'bg-[#1A3C34]' : 'bg-[#E8E8E6]'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Input Field Component
const InputField = ({ label, required, type = "text", placeholder, value, onChange, name, testId, error }) => {
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
        className={`w-full h-12 px-4 bg-white border rounded-lg text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#1A3C34] focus:border-transparent transition-all ${error ? 'border-red-500' : 'border-[#E2E2E0]'}`}
        data-testid={testId}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Select Field Component
const SelectField = ({ label, required, options, value, onChange, name, testId }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1A3C34]">
        {label} {required && <span className="text-[#C66D5D]">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 bg-white border border-[#E2E2E0] rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A3C34] focus:border-transparent transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231A3C34' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
        data-testid={testId}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

// Textarea Field Component
const TextareaField = ({ label, required, placeholder, value, onChange, name, testId, rows = 4 }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1A3C34]">
        {label} {required && <span className="text-[#C66D5D]">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-white border border-[#E2E2E0] rounded-lg text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#1A3C34] focus:border-transparent transition-all resize-none"
        data-testid={testId}
      />
    </div>
  );
};

// Section Card Component
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

// Step 1: Landlord Info
const Step1LandlordInfo = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <SectionCard icon={User} title="Dina uppgifter (Hyresvärd)" testId="section-landlord">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField 
            label="Namn" required name="landlordName" 
            value={formData.landlordName} onChange={handleChange}
            placeholder="För- och efternamn" testId="input-landlord-name"
          />
          <InputField 
            label="Personnummer" required name="landlordPersonnummer"
            value={formData.landlordPersonnummer} onChange={handleChange}
            placeholder="ÅÅÅÅMMDD-XXXX" testId="input-landlord-personnummer"
          />
          <div className="md:col-span-2">
            <InputField 
              label="Adress" required name="landlordAddress"
              value={formData.landlordAddress} onChange={handleChange}
              placeholder="Gatuadress" testId="input-landlord-address"
            />
          </div>
          <InputField 
            label="Postnummer" name="landlordPostalCode"
            value={formData.landlordPostalCode} onChange={handleChange}
            placeholder="XXX XX" testId="input-landlord-postal"
          />
          <InputField 
            label="Ort" name="landlordCity"
            value={formData.landlordCity} onChange={handleChange}
            placeholder="Stad" testId="input-landlord-city"
          />
          <InputField 
            label="E-post" required type="email" name="landlordEmail"
            value={formData.landlordEmail} onChange={handleChange}
            placeholder="din@email.se" testId="input-landlord-email"
          />
          <InputField 
            label="Telefon" type="tel" name="landlordPhone"
            value={formData.landlordPhone} onChange={handleChange}
            placeholder="07X XXX XX XX" testId="input-landlord-phone"
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Step 2: Property Info
const Step2Property = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <SectionCard icon={Home} title="Hyresobjekt" testId="section-property">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField 
              label="Adress" required name="propertyAddress"
              value={formData.propertyAddress} onChange={handleChange}
              placeholder="Bostadens gatuadress" testId="input-property-address"
            />
          </div>
          <InputField 
            label="Postnummer" name="propertyPostalCode"
            value={formData.propertyPostalCode} onChange={handleChange}
            placeholder="XXX XX" testId="input-property-postal"
          />
          <InputField 
            label="Ort" name="propertyCity"
            value={formData.propertyCity} onChange={handleChange}
            placeholder="Stad" testId="input-property-city"
          />
          <SelectField 
            label="Typ av boende" name="propertyType"
            value={formData.propertyType} onChange={handleChange}
            testId="select-property-type"
            options={[
              { value: "", label: "Välj typ" },
              { value: "lagenhet", label: "Lägenhet" },
              { value: "hus", label: "Hus" },
              { value: "rum", label: "Rum" },
              { value: "stuga", label: "Stuga" },
              { value: "annat", label: "Annat" },
            ]}
          />
          <InputField 
            label="Övriga uppgifter" name="propertyOther"
            value={formData.propertyOther} onChange={handleChange}
            placeholder="T.ex. våning, lägenhetsnummer" testId="input-property-other"
          />
        </div>
      </SectionCard>

      <SectionCard icon={Calendar} title="Hyresperiod" testId="section-period">
        <div className="grid md:grid-cols-3 gap-6">
          <InputField 
            label="Från" required type="date" name="periodFrom"
            value={formData.periodFrom} onChange={handleChange}
            testId="input-period-from"
          />
          <InputField 
            label="Till" required type="date" name="periodTo"
            value={formData.periodTo} onChange={handleChange}
            testId="input-period-to"
          />
          <InputField 
            label="Max antal personer" type="number" name="personCount"
            value={formData.personCount} onChange={handleChange}
            placeholder="1" testId="input-person-count"
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Step 3: Terms
const Step3Terms = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <SectionCard icon={CreditCard} title="Hyra & betalning" testId="section-payment">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField 
            label="Hyresbelopp (SEK)" required type="number" name="rentAmount"
            value={formData.rentAmount} onChange={handleChange}
            placeholder="0" testId="input-rent-amount"
          />
          <SelectField 
            label="Betalningssätt" required name="paymentMethod"
            value={formData.paymentMethod} onChange={handleChange}
            testId="select-payment-method"
            options={[
              { value: "", label: "Välj betalningssätt" },
              { value: "bank", label: "Banköverföring" },
              { value: "swish", label: "Swish" },
              { value: "annat", label: "Annat" },
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard icon={ShieldCheck} title="Säkerhet" testId="section-security">
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField 
            label="Välj säkerhet" name="securityType"
            value={formData.securityType} onChange={handleChange}
            testId="select-security-type"
            options={[
              { value: "", label: "Välj alternativ" },
              { value: "deposition", label: "Deposition" },
              { value: "forskott", label: "Förskottsbetalning" },
              { value: "ingen", label: "Ingen säkerhet" },
            ]}
          />
          <InputField 
            label="Belopp/villkor" name="securityAmount"
            value={formData.securityAmount} onChange={handleChange}
            placeholder="T.ex. belopp, när det ska betalas" testId="input-security-amount"
          />
        </div>
      </SectionCard>

      <SectionCard icon={FileText} title="Övrigt" testId="section-other">
        <div className="space-y-6">
          <SelectField 
            label="Städning" name="cleaning"
            value={formData.cleaning} onChange={handleChange}
            testId="select-cleaning"
            options={[
              { value: "", label: "Välj alternativ" },
              { value: "hyresgast", label: "Hyresgästen städar" },
              { value: "bokad", label: "Avresestäd bokad" },
            ]}
          />
          <TextareaField 
            label="Särskilda villkor" name="specialTerms"
            value={formData.specialTerms} onChange={handleChange}
            placeholder="Ange eventuella särskilda villkor..." testId="textarea-special-terms"
            rows={3}
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Step 4: Send to Tenant
const Step4Send = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <SectionCard icon={Mail} title="Skicka till hyresgäst" testId="section-send">
        <div className="space-y-6">
          <div className="bg-[#F9F9F7] p-4 rounded-lg">
            <p className="text-sm text-[#5A5A5A] mb-2">
              Ange hyresgästens e-postadress. De kommer få en länk där de kan fylla i sina uppgifter och signera avtalet med BankID.
            </p>
          </div>
          
          <InputField 
            label="Hyresgästens e-post" required type="email" name="tenantEmail"
            value={formData.tenantEmail} onChange={handleChange}
            placeholder="hyresgast@email.se" testId="input-tenant-email"
          />

          <div className="bg-[#1A3C34]/5 p-6 rounded-xl">
            <h4 className="font-semibold text-[#1A3C34] mb-4">Sammanfattning</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#5A5A5A]">Hyresobjekt</p>
                <p className="font-medium text-[#1A3C34]">{formData.propertyAddress || "—"}</p>
              </div>
              <div>
                <p className="text-[#5A5A5A]">Period</p>
                <p className="font-medium text-[#1A3C34]">{formData.periodFrom || "—"} till {formData.periodTo || "—"}</p>
              </div>
              <div>
                <p className="text-[#5A5A5A]">Hyresbelopp</p>
                <p className="font-medium text-[#1A3C34]">{formData.rentAmount ? `${formData.rentAmount} SEK` : "—"}</p>
              </div>
              <div>
                <p className="text-[#5A5A5A]">Tjänsteavgift</p>
                <p className="font-medium text-[#1A3C34]">100 SEK (betalas vid signering)</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

// Success Modal
const SuccessModal = ({ agreementId, tenantEmail, onClose }) => {
  const [copied, setCopied] = useState(false);
  const agreementLink = `${window.location.origin}/tenant/${agreementId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(agreementLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="success-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 animate-fade-in-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Avtal skapat!
          </h2>
          <p className="text-[#5A5A5A] mb-6">
            En inbjudan har skickats till <strong>{tenantEmail}</strong>
          </p>

          <div className="bg-[#F9F9F7] p-4 rounded-lg mb-6">
            <p className="text-sm text-[#5A5A5A] mb-2">Länk till avtalet:</p>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={agreementLink} 
                readOnly 
                className="flex-1 h-10 px-3 bg-white border border-[#E2E2E0] rounded-lg text-sm"
              />
              <button 
                onClick={copyLink}
                className="h-10 px-4 bg-[#1A3C34] text-white rounded-lg flex items-center gap-2 hover:bg-[#142F29] transition-colors"
                data-testid="copy-link-btn"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Kopierad!" : "Kopiera"}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Nästa steg:</strong> Hyresgästen fyller i sina uppgifter och signerar med BankID. 
              Du får ett e-postmeddelande när det är din tur att granska och signera.
            </p>
          </div>

          <div className="flex gap-4">
            <Link 
              to="/" 
              className="flex-1 btn-secondary text-center"
              data-testid="back-home-btn"
            >
              Till startsidan
            </Link>
            <Link 
              to={`/sign/${agreementId}`}
              className="flex-1 btn-primary text-center"
              data-testid="view-agreement-btn"
            >
              Visa avtal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Form Page
const FormPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdAgreementId, setCreatedAgreementId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Landlord
    landlordName: "",
    landlordAddress: "",
    landlordPostalCode: "",
    landlordCity: "",
    landlordPersonnummer: "",
    landlordEmail: "",
    landlordPhone: "",
    // Property
    propertyAddress: "",
    propertyPostalCode: "",
    propertyCity: "",
    propertyType: "",
    propertyOther: "",
    // Period
    periodFrom: "",
    periodTo: "",
    personCount: "",
    // Payment
    rentAmount: "",
    paymentMethod: "",
    // Security
    securityType: "",
    securityAmount: "",
    // Other
    cleaning: "",
    specialTerms: "",
    // Tenant (only email for now)
    tenantEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.landlordName.trim()) newErrors.landlordName = "Namn är obligatoriskt";
    if (!formData.landlordPersonnummer.trim()) newErrors.landlordPersonnummer = "Personnummer är obligatoriskt";
    if (!formData.landlordAddress.trim()) newErrors.landlordAddress = "Adress är obligatoriskt";
    if (!formData.landlordEmail.trim()) newErrors.landlordEmail = "E-post är obligatoriskt";
    if (!formData.landlordPhone.trim()) newErrors.landlordPhone = "Telefon är obligatoriskt";
    
    // Email format validation
    if (formData.landlordEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.landlordEmail)) {
      newErrors.landlordEmail = "Ogiltig e-postadress";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = "Adress är obligatoriskt";
    if (!formData.periodFrom) newErrors.periodFrom = "Startdatum är obligatoriskt";
    if (!formData.periodTo) newErrors.periodTo = "Slutdatum är obligatoriskt";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.rentAmount) newErrors.rentAmount = "Hyresbelopp är obligatoriskt";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Betalningssätt är obligatoriskt";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.tenantEmail.trim()) newErrors.tenantEmail = "E-post är obligatoriskt";
    if (formData.tenantEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = "Ogiltig e-postadress";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const agreementData = {
        landlord: {
          name: formData.landlordName,
          personnummer: formData.landlordPersonnummer,
          address: formData.landlordAddress,
          postal_code: formData.landlordPostalCode,
          city: formData.landlordCity,
          email: formData.landlordEmail,
          phone: formData.landlordPhone,
        },
        tenant: {
          email: formData.tenantEmail,
        },
        property: {
          address: formData.propertyAddress,
          postal_code: formData.propertyPostalCode,
          city: formData.propertyCity,
          property_type: formData.propertyType,
          other_info: formData.propertyOther,
        },
        rental_period: {
          from_date: formData.periodFrom,
          to_date: formData.periodTo,
          person_count: parseInt(formData.personCount) || 1,
        },
        payment: {
          rent_amount: parseInt(formData.rentAmount) || 0,
          payment_method: formData.paymentMethod,
          security_type: formData.securityType,
          security_amount: formData.securityAmount,
        },
        other: {
          cleaning: formData.cleaning,
          special_terms: formData.specialTerms,
        }
      };
      
      const response = await axios.post(`${API}/agreements`, agreementData);
      setCreatedAgreementId(response.data.id);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating agreement:", error);
      alert("Kunde inte skapa avtalet. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1LandlordInfo formData={formData} handleChange={handleChange} />;
      case 2:
        return <Step2Property formData={formData} handleChange={handleChange} />;
      case 3:
        return <Step3Terms formData={formData} handleChange={handleChange} />;
      case 4:
        return <Step4Send formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7]" data-testid="form-page">
      <FormNavigation />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl mb-3" data-testid="form-title">
              Skapa hyresavtal
            </h1>
            <p className="text-[#5A5A5A]" data-testid="form-subtitle">
              Fyll i uppgifterna och skicka avtalet till hyresgästen för signering
            </p>
          </div>

          {/* Progress */}
          <ProgressSteps currentStep={currentStep} />

          {/* Form Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-[#E2E2E0]">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="btn-secondary flex items-center gap-2"
                data-testid="btn-prev"
              >
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
              </button>
            ) : (
              <Link
                to="/"
                className="btn-secondary flex items-center gap-2"
                data-testid="btn-cancel"
              >
                Avbryt
              </Link>
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center gap-2"
                data-testid="btn-next"
              >
                Nästa
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`btn-primary flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
                data-testid="btn-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Skapar avtal...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Skicka till hyresgäst
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal 
          agreementId={createdAgreementId}
          tenantEmail={formData.tenantEmail}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default FormPage;
