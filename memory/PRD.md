# Securebooking - Komplett Demo PRD

## Original Problem Statement
1. Redesign Securebooking landing page
2. Create agreement form connected to index
3. Implement complete flow with MOCKED BankID, Swish, and PDF

## Corrected Flow (as per user request)
1. **Hyresvärd skapar avtal** (sina uppgifter + bostad + hyra + hyresgästens e-post)
2. **Avtal delas med hyresgäst** (länk genereras)
3. **Hyresgäst öppnar** → fyller i sina uppgifter → signerar med BankID
4. **Hyresvärd notifieras** → granskar → signerar med BankID → betalar **100 SEK** tjänsteavgift via Swish
5. **Klart!** → Båda får PDF

## What's Been Implemented (2025-02-05)

### Landing Page ✓
- Modern Scandinavian design
- Hero, How it works, Benefits, FAQ, Footer

### Landlord Form (/form) ✓
- 4 steps: Dina uppgifter → Bostad → Hyresvillkor → Skicka
- Only landlord fills their info + property + rental terms
- Tenant email input on last step
- Success modal with shareable tenant link
- Shows 100 SEK service fee in summary

### Tenant Page (/tenant/:id) ✓
- Shows agreement details (property, period, rent, landlord)
- Tenant fills in their details (name, personnummer, address, etc.)
- Terms acceptance with expandable legal text
- BankID signing

### Landlord Signing Page (/sign/:id) ✓
- Waiting view when tenant hasn't signed (with copy link)
- Review view showing tenant's signed info
- BankID signing for landlord
- **Swish payment: 100 SEK service fee**
- Completion view with PDF download

### Backend API ✓
- POST /api/agreements - Create with landlord + tenant email
- PUT /api/agreements/:id/tenant - Tenant updates their info
- BankID start/status endpoints (MOCKED)
- Swish start/status endpoints (MOCKED, 100 SEK)
- PDF generation with all details

## ⚠️ MOCKED Integrations
- **BankID**: Auto-completes after ~6 seconds (2 status checks)
- **Swish**: Auto-completes after ~6 seconds (100 SEK service fee)
- Perfect for demo/pitch presentations

## Tech Stack
- Frontend: React 19, Tailwind CSS, React Router
- Backend: FastAPI, MongoDB, ReportLab (PDF)

## Routes
- `/` - Landing page
- `/form` - Landlord creates agreement
- `/tenant/:id` - Tenant fills in details & signs
- `/sign/:id` - Landlord reviews, signs & pays
