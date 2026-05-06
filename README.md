# LocalBoost

> All-in-one marketing toolkit for local Dutch businesses. Generate leads, create proposals, build email campaigns, and automate your marketing — all from one place.

**Version: v13.25** | Production Ready

## Features

### Free Tools (no account needed)
- **Lead Finder** - Find potential customers in your city
- **Review Generator** - Create review request messages (SMS/WhatsApp/Email)
- **Social Post Generator** - Generate content for Instagram, Facebook, LinkedIn
- **SEO Scanner** - Analyze your website's SEO health
- **Google Business Guide** - Step-by-step Google Maps optimization
- **Proposal Generator** - Create professional proposals/offers
- **Email Sequences** - Proven email templates for follow-up
- **Email Campaign Builder** - Build automated email campaigns
- **Local Keyword Finder** - Find local search keywords
- **Competitor Scanner** - Analyze local competition
- **Quote Generator** - Create professional quotes/offertas
- **ROI Calculator** - Calculate marketing ROI and projections

### Business Tools
- **Dashboard** - Manage leads and track pipeline
- **Task Manager** - Organize marketing tasks
- **Client Portal** - Share proposals with clients

## Quick Start

```bash
cd localboost
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: React hooks + localStorage

## Architecture

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # CRM dashboard
│   ├── tools/             # All 15+ tools
│   ├── settings/          # Settings & data management
│   └── portal/            # Client portal
├── components/
│   ├── polish/            # Shared UI components
│   │   ├── TemplateSwitcher.tsx
│   │   ├── ProfileBar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── DataManagement.tsx
│   ├── OnboardingModal.tsx
│   └── Providers.tsx
└── lib/
    ├── useSharedData.tsx  # Shared state hooks
    ├── toast.tsx          # Toast notification system
    ├── email-templates.ts
    └── db.ts             # In-memory database
```

## Data Storage

All data stored in localStorage:
- `localboost_business_profile` - User's business info
- `localboost_leads` - Saved leads/contacts
- `localboost_templates` - Saved templates per tool
- `localboost_tool_inputs` - Auto-saved form inputs
- `localboost_onboarding_done` - Onboarding completed flag

## Key Features

### Cross-Tool Integration
- Lead Finder saves to CRM → Review Generator auto-fills
- Business profile pre-fills all tools
- Templates shared across similar tools

### Onboarding
4-step wizard captures:
1. Business name & type
2. City/location
3. Contact info (phone, email, website)

### Template System
- Save frequently used inputs as templates
- Quick-switch between templates
- Import/export as JSON

### Toast Notifications
- Copy feedback ("Gekopieerd!")
- Save confirmations
- Error messages

## Development

```bash
npm run build     # Production build
npm run lint      # ESLint check
```

## Version History

- **v13.25** - Final verification: build clean, TypeScript OK, no TODOs
- **v13.9** - Senior dev polish (accessibility, UX, dead code cleanup)
- **v13.8** - Input persistence, SPA navigation
- **v13.7** - Onboarding flow, toast system
- **v12.x** - Template system, new tools (Quote Generator, ROI Calculator, Competitor Scanner)
- **v12.0** - Core launch with 10+ tools

## License

Private - All rights reserved