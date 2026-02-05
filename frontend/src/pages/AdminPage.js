import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
  RefreshCw,
  Home,
  CreditCard,
  Calendar,
  Mail,
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Header
const AdminNavigation = () => {
  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50" data-testid="admin-navigation">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2" data-testid="admin-nav-logo">
            <div className="w-10 h-10 bg-[#1A3C34] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
              Securebooking
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#1A3C34] text-white rounded-full text-sm font-medium">
              Admin
            </span>
            <Link to="/" className="text-[#5A5A5A] hover:text-[#1A3C34] transition-colors">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: "Utkast", color: "bg-gray-100 text-gray-600", icon: FileText },
    pending_tenant_signature: { label: "Väntar på hyresgäst", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    pending_landlord_signature: { label: "Väntar på hyresvärd", color: "bg-blue-100 text-blue-700", icon: Clock },
    pending_payment: { label: "Väntar på betalning", color: "bg-orange-100 text-orange-700", icon: CreditCard },
    completed: { label: "Klart", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    cancelled: { label: "Avbrutet", color: "bg-red-100 text-red-700", icon: AlertCircle },
  };
  
  const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-600", icon: FileText };
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// Stats Card
const StatsCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="card-elevated">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#1A3C34]" style={{ fontFamily: 'Playfair Display' }}>
            {value}
          </p>
          <p className="text-sm text-[#5A5A5A]">{label}</p>
        </div>
      </div>
    </div>
  );
};

// Agreement Row
const AgreementRow = ({ agreement, onView }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return dateStr.slice(0, 10);
  };

  return (
    <tr className="border-b border-[#E2E2E0] hover:bg-[#F9F9F7] transition-colors" data-testid={`agreement-row-${agreement.id.slice(0, 8)}`}>
      <td className="py-4 px-4">
        <div>
          <p className="font-medium text-[#1A3C34] text-sm">{agreement.id.slice(0, 8)}...</p>
          <p className="text-xs text-[#5A5A5A]">{formatDate(agreement.created_at)}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <p className="font-medium text-[#1A3C34] text-sm">{agreement.landlord?.name || "—"}</p>
          <p className="text-xs text-[#5A5A5A]">{agreement.landlord?.email || "—"}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <p className="font-medium text-[#1A3C34] text-sm">{agreement.tenant?.name || "—"}</p>
          <p className="text-xs text-[#5A5A5A]">{agreement.tenant?.email || "—"}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <p className="font-medium text-[#1A3C34] text-sm truncate max-w-[200px]">
            {agreement.property?.address || "—"}
          </p>
          <p className="text-xs text-[#5A5A5A]">{agreement.property?.city || ""}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="font-medium text-[#1A3C34] text-sm">
          {agreement.payment?.rent_amount ? `${agreement.payment.rent_amount} SEK` : "—"}
        </p>
      </td>
      <td className="py-4 px-4">
        <StatusBadge status={agreement.status} />
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/sign/${agreement.id}`}
            className="p-2 text-[#5A5A5A] hover:text-[#1A3C34] hover:bg-[#E8E8E6] rounded-lg transition-colors"
            title="Visa avtal"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {agreement.status === "completed" && (
            <a
              href={`${API}/agreements/${agreement.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#5A5A5A] hover:text-[#1A3C34] hover:bg-[#E8E8E6] rounded-lg transition-colors"
              title="Ladda ner PDF"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Admin Page
const AdminPage = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchAgreements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/agreements`);
      // Sort by created_at descending (newest first)
      const sorted = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setAgreements(sorted);
    } catch (error) {
      console.error("Error fetching agreements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  // Filter agreements
  const filteredAgreements = agreements.filter(agreement => {
    // Status filter
    if (statusFilter !== "all" && agreement.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesLandlord = agreement.landlord?.name?.toLowerCase().includes(search) ||
                              agreement.landlord?.email?.toLowerCase().includes(search);
      const matchesTenant = agreement.tenant?.name?.toLowerCase().includes(search) ||
                            agreement.tenant?.email?.toLowerCase().includes(search);
      const matchesProperty = agreement.property?.address?.toLowerCase().includes(search);
      const matchesId = agreement.id.toLowerCase().includes(search);
      
      if (!matchesLandlord && !matchesTenant && !matchesProperty && !matchesId) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate stats
  const stats = {
    total: agreements.length,
    pending: agreements.filter(a => 
      a.status === "pending_tenant_signature" || 
      a.status === "pending_landlord_signature" ||
      a.status === "pending_payment"
    ).length,
    completed: agreements.filter(a => a.status === "completed").length,
    totalRevenue: agreements.filter(a => a.status === "completed").length * 100,
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7]" data-testid="admin-page">
      <AdminNavigation />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'Playfair Display' }} data-testid="admin-title">
                Administratörspanel
              </h1>
              <p className="text-[#5A5A5A]">Översikt över alla hyresavtal</p>
            </div>
            <button
              onClick={fetchAgreements}
              className="mt-4 md:mt-0 btn-secondary inline-flex items-center gap-2"
              data-testid="refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Uppdatera
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              icon={FileText} 
              label="Totalt antal avtal" 
              value={stats.total}
              color="bg-[#1A3C34]"
            />
            <StatsCard 
              icon={Clock} 
              label="Pågående" 
              value={stats.pending}
              color="bg-yellow-500"
            />
            <StatsCard 
              icon={CheckCircle2} 
              label="Slutförda" 
              value={stats.completed}
              color="bg-green-500"
            />
            <StatsCard 
              icon={CreditCard} 
              label="Intäkter" 
              value={`${stats.totalRevenue} SEK`}
              color="bg-[#C66D5D]"
            />
          </div>

          {/* Filters */}
          <div className="card-elevated mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A5A]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Sök på namn, e-post, adress eller avtal-ID..."
                  className="w-full h-12 pl-10 pr-4 bg-[#F9F9F7] border border-[#E2E2E0] rounded-lg text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#1A3C34] focus:border-transparent"
                  data-testid="search-input"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-12 pl-4 pr-10 bg-[#F9F9F7] border border-[#E2E2E0] rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A3C34] focus:border-transparent appearance-none cursor-pointer"
                  style={{ minWidth: '200px' }}
                  data-testid="status-filter"
                >
                  <option value="all">Alla statusar</option>
                  <option value="pending_tenant_signature">Väntar på hyresgäst</option>
                  <option value="pending_landlord_signature">Väntar på hyresvärd</option>
                  <option value="pending_payment">Väntar på betalning</option>
                  <option value="completed">Slutförda</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A5A] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-[#5A5A5A]">
              Visar {filteredAgreements.length} av {agreements.length} avtal
            </p>
          </div>

          {/* Table */}
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="agreements-table">
                <thead>
                  <tr className="bg-[#F9F9F7] border-b border-[#E2E2E0]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Avtal-ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Hyresvärd</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Hyresgäst</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Hyresobjekt</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Hyra</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A3C34]">Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#1A3C34] mx-auto mb-2" />
                        <p className="text-[#5A5A5A]">Laddar avtal...</p>
                      </td>
                    </tr>
                  ) : filteredAgreements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <FileText className="w-12 h-12 text-[#E2E2E0] mx-auto mb-2" />
                        <p className="text-[#5A5A5A]">Inga avtal hittades</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAgreements.map((agreement) => (
                      <AgreementRow key={agreement.id} agreement={agreement} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Log Section */}
          <div className="mt-8">
            <h2 className="text-xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Senaste e-postnotifikationer
            </h2>
            <div className="card-elevated">
              <div className="flex items-center gap-3 text-[#5A5A5A]">
                <Mail className="w-5 h-5" />
                <p className="text-sm">
                  E-postloggar visas i webbläsarens konsol (öppna DevTools → Console)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
