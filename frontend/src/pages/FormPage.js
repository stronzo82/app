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
    { num: 1, label: "Parter", icon: User },
    { num: 2, label: "Objekt", icon: Home },
    { num: 3, label: "Villkor", icon: FileText },
    { num: 4, label: "Bekräfta", icon: Check },
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

// Step 1: Parter (Parties)
const Step1Parties = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hyresvärd (Landlord) */}
      <SectionCard icon={User} title="Hyresvärd" testId="section-landlord">
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
            label="E-post" type="email" name="landlordEmail"
            value={formData.landlordEmail} onChange={handleChange}
            placeholder="exempel@mail.se" testId="input-landlord-email"
          />
          <InputField 
            label="Telefon" type="tel" name="landlordPhone"
            value={formData.landlordPhone} onChange={handleChange}
            placeholder="07X XXX XX XX" testId="input-landlord-phone"
          />
        </div>
      </SectionCard>

      {/* Hyresgäst (Tenant) */}
      <SectionCard icon={User} title="Hyresgäst" testId="section-tenant">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField 
            label="Namn" required name="tenantName"
            value={formData.tenantName} onChange={handleChange}
            placeholder="För- och efternamn" testId="input-tenant-name"
          />
          <InputField 
            label="Personnummer" required name="tenantPersonnummer"
            value={formData.tenantPersonnummer} onChange={handleChange}
            placeholder="ÅÅÅÅMMDD-XXXX" testId="input-tenant-personnummer"
          />
          <div className="md:col-span-2">
            <InputField 
              label="Adress" required name="tenantAddress"
              value={formData.tenantAddress} onChange={handleChange}
              placeholder="Gatuadress" testId="input-tenant-address"
            />
          </div>
          <InputField 
            label="Postnummer" name="tenantPostalCode"
            value={formData.tenantPostalCode} onChange={handleChange}
            placeholder="XXX XX" testId="input-tenant-postal"
          />
          <InputField 
            label="Ort" name="tenantCity"
            value={formData.tenantCity} onChange={handleChange}
            placeholder="Stad" testId="input-tenant-city"
          />
          <InputField 
            label="E-post" type="email" name="tenantEmail"
            value={formData.tenantEmail} onChange={handleChange}
            placeholder="exempel@mail.se" testId="input-tenant-email"
          />
          <InputField 
            label="Telefon" type="tel" name="tenantPhone"
            value={formData.tenantPhone} onChange={handleChange}
            placeholder="07X XXX XX XX" testId="input-tenant-phone"
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Step 2: Hyresobjekt (Property)
const Step2Property = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hyresobjekt */}
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

      {/* Hyresperiod */}
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
            label="Antal personer" type="number" name="personCount"
            value={formData.personCount} onChange={handleChange}
            placeholder="1" testId="input-person-count"
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Step 3: Villkor (Terms)
const Step3Terms = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hyra & betalning */}
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

      {/* Säkerhet */}
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

      {/* Övrigt */}
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
          />
          <TextareaField 
            label="Kommentarer" name="comments"
            value={formData.comments} onChange={handleChange}
            placeholder="Övriga kommentarer..." testId="textarea-comments"
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Step 4: Bekräfta (Confirm)
const Step4Confirm = ({ formData, termsAccepted, setTermsAccepted }) => {
  const [showTerms, setShowTerms] = useState(false);

  const terms = [
    {
      title: "1. Säkerhet (deposition)",
      content: "Hyresgästen ska till hyresvärden erlägga säkerhet i form av deposition som garanti för fullgörande av de förpliktelser som följer av detta hyresavtal. Säkerheten omfattar bland annat men inte uteslutande: förfallen och obetald hyra, ersättning för skador på bostad eller tillhörande inventarier utöver normalt slitage, kostnader hänförliga till bristande städning vid avflyttning, samt övriga ekonomiska anspråk grundade på avtalsbrott."
    },
    {
      title: "2. Andrahandsuthyrning",
      content: "Uthyrning i andra hand är inte tillåten utan hyresvärdens skriftliga godkännande."
    },
    {
      title: "3. Avbokning",
      content: "Hyreskontraktet kan hävas innan uppsägningsfristen, om parterna har kommit överens om det. Avbokningen ska ske skriftligen."
    },
    {
      title: "4. Kontraktsbrott",
      content: "Om hyresgästen eller någon annan väsentligt bryter mot avtalet kan hyresvärden säga upp hyresgästen. Hyresgästen måste då flytta ut från bostaden omgående."
    },
    {
      title: "5. Städning",
      content: "Hyresgästen ansvarar för att bostaden är väl städad vid avflyttning. Om städning inte sker kan hyresvärden ta ut skälig ersättning för detta."
    },
    {
      title: "6. Skador",
      content: "Hyresgästen ansvarar för skador som uppkommer genom oaktsamhet eller vårdslöshet under hyresperioden."
    },
    {
      title: "7. Tillämplig lag",
      content: "Detta avtal regleras enligt svensk lag. Tvister som inte kan lösas genom överenskommelse mellan parterna kan prövas av svensk domstol."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Summary */}
      <SectionCard icon={FileText} title="Sammanfattning" testId="section-summary">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F9F9F7] p-4 rounded-lg">
              <p className="text-sm text-[#5A5A5A] mb-1">Hyresvärd</p>
              <p className="font-medium text-[#1A3C34]">{formData.landlordName || "Ej ifyllt"}</p>
              <p className="text-sm text-[#5A5A5A]">{formData.landlordEmail}</p>
            </div>
            <div className="bg-[#F9F9F7] p-4 rounded-lg">
              <p className="text-sm text-[#5A5A5A] mb-1">Hyresgäst</p>
              <p className="font-medium text-[#1A3C34]">{formData.tenantName || "Ej ifyllt"}</p>
              <p className="text-sm text-[#5A5A5A]">{formData.tenantEmail}</p>
            </div>
          </div>
          <div className="bg-[#F9F9F7] p-4 rounded-lg">
            <p className="text-sm text-[#5A5A5A] mb-1">Hyresobjekt</p>
            <p className="font-medium text-[#1A3C34]">{formData.propertyAddress || "Ej ifyllt"}</p>
            <p className="text-sm text-[#5A5A5A]">
              {formData.propertyPostalCode} {formData.propertyCity}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#F9F9F7] p-4 rounded-lg">
              <p className="text-sm text-[#5A5A5A] mb-1">Period</p>
              <p className="font-medium text-[#1A3C34]">
                {formData.periodFrom || "—"} till {formData.periodTo || "—"}
              </p>
            </div>
            <div className="bg-[#F9F9F7] p-4 rounded-lg">
              <p className="text-sm text-[#5A5A5A] mb-1">Hyresbelopp</p>
              <p className="font-medium text-[#1A3C34]">
                {formData.rentAmount ? `${formData.rentAmount} SEK` : "Ej ifyllt"}
              </p>
            </div>
            <div className="bg-[#F9F9F7] p-4 rounded-lg">
              <p className="text-sm text-[#5A5A5A] mb-1">Betalningssätt</p>
              <p className="font-medium text-[#1A3C34]">
                {formData.paymentMethod === 'bank' ? 'Banköverföring' : 
                 formData.paymentMethod === 'swish' ? 'Swish' : 
                 formData.paymentMethod === 'annat' ? 'Annat' : 'Ej valt'}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Terms */}
      <div className="card-elevated" data-testid="section-terms">
        <button 
          className="w-full flex items-center justify-between"
          onClick={() => setShowTerms(!showTerms)}
          data-testid="toggle-terms"
        >
          <div className="flex items-center gap-3">
            <div className="icon-container">
              <FileText className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl" style={{ fontFamily: 'Playfair Display' }}>Avtalsvillkor</h3>
          </div>
          {showTerms ? <ChevronUp className="w-5 h-5 text-[#1A3C34]" /> : <ChevronDown className="w-5 h-5 text-[#1A3C34]" />}
        </button>
        
        {showTerms && (
          <div className="mt-6 space-y-4 max-h-80 overflow-y-auto pr-2" data-testid="terms-content">
            {terms.map((term, index) => (
              <div key={index} className="border-b border-[#E2E2E0] pb-4 last:border-0">
                <h4 className="font-semibold text-[#1A3C34] mb-2">{term.title}</h4>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">{term.content}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-[#E2E2E0]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-[#E2E2E0] text-[#1A3C34] focus:ring-[#1A3C34]"
              data-testid="checkbox-accept-terms"
            />
            <span className="text-[#1A3C34] font-medium">
              Jag har läst och godkänner avtalsvillkoren
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Main Form Page
const FormPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    // Landlord
    landlordName: "",
    landlordAddress: "",
    landlordPostalCode: "",
    landlordCity: "",
    landlordPersonnummer: "",
    landlordEmail: "",
    landlordPhone: "",
    // Tenant
    tenantName: "",
    tenantAddress: "",
    tenantPostalCode: "",
    tenantCity: "",
    tenantPersonnummer: "",
    tenantEmail: "",
    tenantPhone: "",
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
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
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

  const handleSubmit = () => {
    if (!termsAccepted) {
      alert("Du måste godkänna avtalsvillkoren för att fortsätta.");
      return;
    }
    // Here you would typically send data to backend
    alert("Hyresavtal skapat! I en riktig implementation skulle nu BankID-signering påbörjas.");
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Parties formData={formData} handleChange={handleChange} />;
      case 2:
        return <Step2Property formData={formData} handleChange={handleChange} />;
      case 3:
        return <Step3Terms formData={formData} handleChange={handleChange} />;
      case 4:
        return <Step4Confirm formData={formData} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />;
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
              Hyresavtal formulär
            </h1>
            <p className="text-[#5A5A5A]" data-testid="form-subtitle">
              Fyll i uppgifterna nedan för att skapa ditt hyresavtal
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
                className={`btn-primary flex items-center gap-2 ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!termsAccepted}
                data-testid="btn-submit"
              >
                Skapa hyresavtal
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormPage;
