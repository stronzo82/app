import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  ShieldCheck,
  Smartphone,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  Lock,
  Users,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ArrowRight,
  Star,
  BadgeCheck,
} from "lucide-react";
import FormPage from "@/pages/FormPage";
import SigningPage from "@/pages/SigningPage";
import TenantPage from "@/pages/TenantPage";
import AdminPage from "@/pages/AdminPage";

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2" data-testid="nav-logo">
            <div className="w-10 h-10 bg-[#1A3C34] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
              Securebooking
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hur-det-fungerar" className="link-hover font-medium" data-testid="nav-how-it-works">
              Så fungerar det
            </a>
            <a href="#fordelar" className="link-hover font-medium" data-testid="nav-benefits">
              Fördelar
            </a>
            <a href="#faq" className="link-hover font-medium" data-testid="nav-faq">
              FAQ
            </a>
            <Link to="/form" className="btn-primary flex items-center gap-2" data-testid="nav-cta-button">
              Skapa avtal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#1A3C34]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E2E2E0]" data-testid="mobile-menu">
            <div className="flex flex-col gap-4">
              <a href="#hur-det-fungerar" className="font-medium text-[#1A3C34] py-2">
                Så fungerar det
              </a>
              <a href="#fordelar" className="font-medium text-[#1A3C34] py-2">
                Fördelar
              </a>
              <a href="#faq" className="font-medium text-[#1A3C34] py-2">
                FAQ
              </a>
              <Link to="/form" className="btn-primary w-full flex items-center justify-center gap-2">
                Skapa avtal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="trust-badge" data-testid="trust-badge-bankid">
                <ShieldCheck className="w-4 h-4 text-[#1A3C34]" strokeWidth={1.5} />
                BankID
              </span>
              <span className="trust-badge" data-testid="trust-badge-swish">
                <Smartphone className="w-4 h-4 text-[#1A3C34]" strokeWidth={1.5} />
                Swish
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" data-testid="hero-title">
              Skapa hyresavtal{" "}
              <span className="accent-underline">säkert</span> med BankID
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-lg" data-testid="hero-subtitle">
              Juridiskt bindande avtal på några minuter. Säkert, enkelt och helt digitalt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/form" className="btn-primary flex items-center justify-center gap-2" data-testid="hero-cta-primary">
                Skapa hyresavtal
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#hur-det-fungerar" className="btn-secondary flex items-center justify-center gap-2" data-testid="hero-cta-secondary">
                Se hur det fungerar
              </a>
            </div>

            {/* Trust Stats */}
            <div className="flex items-center gap-8 mt-10 pt-10 border-t border-[#E2E2E0]">
              <div data-testid="stat-agreements">
                <p className="text-3xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>10,000+</p>
                <p className="text-sm text-[#5A5A5A]">Skapade avtal</p>
              </div>
              <div data-testid="stat-rating">
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>4.9</p>
                  <Star className="w-5 h-5 text-[#C66D5D] fill-[#C66D5D]" />
                </div>
                <p className="text-sm text-[#5A5A5A]">Användaromdöme</p>
              </div>
              <div className="hidden sm:block" data-testid="stat-time">
                <p className="text-3xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>3 min</p>
                <p className="text-sm text-[#5A5A5A]">Genomsnittlig tid</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="relative">
              <img
                src="/hero.jpg"
                alt="Nycklar till ny lägenhet"
                className="hero-image w-full aspect-[4/3] object-cover"
                data-testid="hero-image"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-[#E2E2E0] hidden md:flex items-center gap-3" data-testid="floating-card">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A3C34]">Avtal signerat</p>
                  <p className="text-sm text-[#5A5A5A]">Just nu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Skapa avtal",
      description: "Fyll i avtalsuppgifter och dela med hyresgästen via e-post eller SMS.",
    },
    {
      number: 2,
      icon: ShieldCheck,
      title: "Signera med BankID",
      description: "Hyresgästen läser igenom avtalet och godkänner med sitt BankID.",
    },
    {
      number: 3,
      icon: Smartphone,
      title: "Betala med Swish",
      description: "Hyresvärden godkänner avtalet och betalar enkelt med Swish.",
    },
    {
      number: 4,
      icon: Send,
      title: "Klart!",
      description: "En kopia av det signerade avtalet skickas som PDF till båda parter.",
    },
  ];

  return (
    <section id="hur-det-fungerar" className="py-20 md:py-32 bg-white" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4" data-testid="how-it-works-title">
            Så här fungerar det
          </h2>
          <p className="text-lg max-w-2xl mx-auto" data-testid="how-it-works-subtitle">
            Skapa ett juridiskt bindande hyresavtal på bara några minuter
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#1A3C34] via-[#1A3C34] to-[#C66D5D]"></div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-elevated relative z-10 text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`step-${step.number}`}
            >
              <div className="step-number mx-auto mb-6">{step.number}</div>
              <div className="icon-container mx-auto mb-4">
                <step.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl mb-3">{step.title}</h3>
              <p className="text-[#5A5A5A]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefits Section
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Lock,
      title: "Säker signering",
      description: "Alla avtal signeras med BankID för maximal säkerhet och juridisk giltighet.",
    },
    {
      icon: Clock,
      title: "Spara tid",
      description: "Slipp pappersarbete. Skapa och signera avtal digitalt på bara några minuter.",
    },
    {
      icon: Users,
      title: "Enkelt för alla",
      description: "Intuitiv process för både hyresvärdar och hyresgäster, oavsett teknisk kunskap.",
    },
    {
      icon: BadgeCheck,
      title: "Juridiskt bindande",
      description: "Våra avtal är juridiskt bindande och uppfyller alla lagkrav.",
    },
  ];

  return (
    <section id="fordelar" className="py-20 md:py-32" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1757262798620-c2cc40cfb440?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2FuZGluYXZpYW4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3IlMjBicmlnaHR8ZW58MHx8fHwxNzcwMzA4MDcwfDA&ixlib=rb-4.1.0&q=85"
              alt="Modernt skandinaviskt vardagsrum"
              className="hero-image w-full aspect-[4/3] object-cover"
              data-testid="benefits-image"
            />
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6" data-testid="benefits-title">
              Varför välja Securebooking?
            </h2>
            <p className="text-lg mb-10" data-testid="benefits-subtitle">
              Vi förenklar processen att skapa hyresavtal med fokus på säkerhet och användarvänlighet.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`benefit-${index + 1}`}
                >
                  <div className="icon-container flex-shrink-0">
                    <benefit.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">{benefit.title}</h3>
                    <p className="text-sm text-[#5A5A5A]">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Är avtalen juridiskt bindande?",
      answer:
        "Ja, alla avtal som signeras via Securebooking är juridiskt bindande. Vi använder BankID för verifiering vilket ger samma juridiska giltighet som en handskriven signatur.",
    },
    {
      question: "Vad kostar det att använda tjänsten?",
      answer:
        "Att skapa och skicka ett avtal är helt gratis. Du betalar endast när avtalet är signerat av båda parter. Kostnaden är 99 kr per avtal.",
    },
    {
      question: "Hur lång tid tar det att skapa ett avtal?",
      answer:
        "Det tar i genomsnitt endast 3 minuter att fylla i avtalsuppgifterna. Sedan kan hyresgästen signera direkt via sin mobil eller dator.",
    },
    {
      question: "Vilka uppgifter behövs för att skapa ett avtal?",
      answer:
        "Du behöver grundläggande information om fastigheten, hyresperioden, hyresbeloppet samt kontaktuppgifter till båda parter.",
    },
    {
      question: "Kan jag redigera ett avtal efter att det skickats?",
      answer:
        "Ja, så länge avtalet inte är signerat kan du redigera eller ta bort det. Efter signering är avtalet låst för att säkerställa dess juridiska giltighet.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-white" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4" data-testid="faq-title">
            Vanliga frågor
          </h2>
          <p className="text-lg" data-testid="faq-subtitle">
            Har du funderingar? Här hittar du svar på de vanligaste frågorna.
          </p>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item" data-testid={`faq-item-${index + 1}`}>
              <button
                className="w-full flex items-center justify-between text-left py-2"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                data-testid={`faq-toggle-${index + 1}`}
              >
                <h3 className="text-lg pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#1A3C34] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#1A3C34] flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="pb-4 animate-fade-in-up">
                  <p className="text-[#5A5A5A]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 md:py-32" data-testid="cta-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#1A3C34] rounded-3xl p-10 md:p-16 text-center">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white mb-4"
            style={{ fontFamily: 'Playfair Display' }}
            data-testid="cta-title"
          >
            Redo att skapa ditt hyresavtal?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto" data-testid="cta-subtitle">
            Kom igång på bara några minuter. Säkert, enkelt och juridiskt bindande.
          </p>
          <Link
            to="/form"
            className="bg-white text-[#1A3C34] px-8 py-4 rounded-full font-medium text-lg inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            style={{ transition: 'box-shadow 0.2s ease' }}
            data-testid="cta-button"
          >
            Skapa hyresavtal nu
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8">
            <span className="text-white/60 text-sm flex items-center gap-2" data-testid="cta-trust-1">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              BankID-verifierat
            </span>
            <span className="text-white/60 text-sm flex items-center gap-2" data-testid="cta-trust-2">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              Krypterad data
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E2E2E0] py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4" data-testid="footer-logo">
              <div className="w-10 h-10 bg-[#1A3C34] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
                Securebooking
              </span>
            </a>
            <p className="text-[#5A5A5A] max-w-sm">
              Skapa juridiskt bindande hyresavtal säkert och enkelt med BankID och Swish.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-[#1A3C34] mb-4">Tjänster</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/form" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors" data-testid="footer-link-create">
                  Skapa avtal
                </Link>
              </li>
              <li>
                <a href="#hur-det-fungerar" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors" data-testid="footer-link-how">
                  Så fungerar det
                </a>
              </li>
              <li>
                <a href="#faq" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors" data-testid="footer-link-faq">
                  Vanliga frågor
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[#1A3C34] mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@securebooking.se" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors" data-testid="footer-email">
                  info@securebooking.se
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors" data-testid="footer-privacy">
                  Integritetspolicy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors" data-testid="footer-terms">
                  Användarvillkor
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E2E2E0] mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#5A5A5A]" data-testid="footer-copyright">
            © 2025 Securebooking. Alla rättigheter förbehållna.
          </p>
          <div className="flex items-center gap-4">
            <span className="trust-badge" data-testid="footer-badge-bankid">
              <ShieldCheck className="w-4 h-4 text-[#1A3C34]" strokeWidth={1.5} />
              BankID
            </span>
            <span className="trust-badge" data-testid="footer-badge-swish">
              <Smartphone className="w-4 h-4 text-[#1A3C34]" strokeWidth={1.5} />
              Swish
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Home Page
const Home = () => {
  return (
    <div data-testid="home-page">
      <Navigation />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/sign/:agreementId" element={<SigningPage />} />
          <Route path="/tenant/:agreementId" element={<TenantPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
