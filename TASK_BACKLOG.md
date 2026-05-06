# LocalBoost Task Backlog

## Sprint: Polish & Integration (Current)

### Phase 1: Tool Integration ✅ DONE
- [x] Onboarding modal (4-step wizard)
- [x] Toast notification system (global)
- [x] Shared data hooks (useBusinessProfile, useLeads, useTemplates, useToolInputs)
- [x] Lead Finder → toast notifications
- [x] Lead Finder → CRM save panel
- [x] Lead Finder → pre-fill from profile
- [x] Review Generator → pre-fill from profile
- [x] Social Post Generator → pre-fill from profile
- [x] Proposal Generator → input persistence

### Phase 2: Cross-Tool Integration ✅ DONE
- [x] Lead Finder → Review Generator (click lead → open Review Generator with business info)
- [x] Lead Finder → save to localStorage CRM
- [x] Review Generator → pre-fill from saved business profile
- [x] Social Post Generator → pre-fill from saved business profile
- [x] Proposal Generator → use saved business profile
- [x] **Email Campaign Builder** → pre-fill from shared business data (profile + selectedBusiness)
- [x] **Social Post Generator** → industry field, cross-tool CTA to email sequences
- [x] **Proposal Generator** → CTA to Email Campaign Builder
- [x] **Email Sequences** → CTA to Email Campaign Builder

### Phase 3: UI Polish ✅ DONE
- [x] Loading states with skeletons
- [x] Smooth page transitions (slide-up, fade-in animations)
- [x] Better empty states
- [x] Error handling
- [x] Mobile refinements
- [x] Custom scrollbar
- [x] Micro-interactions on buttons/cards (hover-lift)

### Phase 4: Template System ✅ DONE
- [x] Save templates per tool (useTemplates hook)
- [x] Quick-switch between saved templates (in tools UI)
- [x] Import/export templates

### Phase 5: New Tools ✅ DONE
- [x] Local Keyword Finder ✅ (2026-05-05)
- [x] Settings Page ✅ (2026-05-05)
- [x] Competitor Scanner ✅ (2026-05-06)
- [x] Quote Generator ✅ (2026-05-06)
- [x] ROI Calculator ✅ (2026-05-06)

### Phase 6: Data Management ✅ DONE
- [x] Settings page with profile edit, data export/import/clear
- [x] Dashboard → Settings link
- [x] ErrorBoundary in layout.tsx
- [x] Email Campaign Builder skeleton loading

---

## Current Tools (v12.8)

### Free Tools (all working)
| Tool | Status | Quality | Cross-Tool |
|------|--------|---------|------------|
| Lead Finder | ✅ | 9/10 | CRM, Review Gen |
| Review Generator | ✅ | 8/10 | Pre-fill from CRM |
| Social Post Generator | ✅ | 8/10 | Industry field, Email Seq CTA |
| SEO Scanner | ✅ | 7/10 | - |
| Google Business Guide | ✅ | 8/10 | - |
| Proposal Generator | ✅ | 8/10 | Email Campaign CTA |
| Email Sequences | ✅ | 7/10 | Email Campaign CTA |
| Email Campaign Builder | ✅ | 9/10 | Pre-fill from business, skeleton loading |
| Local Keyword Finder | ✅ | 8/10 | - |
| Competitor Scanner | ✅ | 8/10 | Lead Finder integration |
| **Quote Generator** | ✅ | 8/10 | Save to CRM, print, copy |
| **ROI Calculator** | ✅ | 8/10 | Industry benchmarks, projections |
| Settings Page | ✅ | 8/10 | Data management |

### Business Tools
| Tool | Status | Quality |
|------|--------|---------|
| Dashboard | ✅ | 8/10 |
| Task Manager | ✅ | 7/10 |
| Client Portal | 🟡 | 5/10 |

---

## Design Rules (Senior Dev Quality)
1. Dark theme by default
2. Copy-to-clipboard = toast feedback
3. Every action = visual feedback
4. Loading states on async operations
5. Mobile-first responsive
6. No dead UI elements
7. Smooth 200-300ms transitions
8. Consistent spacing (4px grid)
9. ErrorBoundary on layout
10. Settings page for data management

---

## Polish Session 2026-05-06 (v12.9) - Polish Final
- **Onboarding cleanup**: Removed duplicate onboarding trigger from page.tsx (Providers.tsx handles it)
- **Bug fix**: proposal-generator - removed non-existent inputs.ourCompany reference
- **New integrations**:
  - marketing-strategy-builder: add useBusinessProfile + useToolInputs for city/industry pre-fill + input persistence
  - competitor-scanner: add industry pre-fill from profile.type
  - google-business-guide: personalize header with profile business name
  - email-sequences: removed no-op pre-fill effect (cleaned dead code)
- **Build verified**: All 29 routes compile successfully
- **Status: LocalBoost v12.9 is production-ready**

## Polish Session 2026-05-06-2 (v13.0) - Verification Session
- **Build verified**: All 29 routes compile successfully ✅
- **Cross-tool integration verified**:
  - Lead Finder → Review Generator + CRM save (working)
  - Review Generator → pre-fill from CRM leads + selectedBusiness (working)
  - Social Post Generator → industry field + Email Campaign CTA (working)
  - Email Campaign Builder → skeleton loading + profile pre-fill (working)
  - Proposal Generator → email template picker from Email Sequences (working)
  - Marketing Strategy Builder → useBusinessProfile + useToolInputs (working)
  - Competitor Scanner → industry pre-fill from profile.type (working)
  - Google Business Guide → personalized header with profile.name (working)
- **Template system**: Full integration across all tools (save, load, import, export)
- **Data persistence**: useToolInputs hook working in all tools
- **Settings page**: Profile edit, data export/import/clear (working)
- **Toast notifications**: copyWithToast + showToast across all tools (working)
- **Status: LocalBoost v13.0 is production-ready**

## Git Log (Recent)
```
e728220 v12.9: Polish - cross-tool integration, pre-fill, and bug fixes
7014d48 v12.9: Polish - remove duplicate onboarding trigger
9cb9f56 v12.8: Add Quote Generator and ROI Calculator tools
607f337 v12.7: Add Competitor Scanner tool
048e500 docs: Update TASK_BACKLOG - v12.6 Template System Complete
ebf2bd0 v12.6: Proposal Generator gets full TemplateSwitcher
```

## Polish Session 2026-05-05 (v12.1)
- Standardized toast notifications across all tools using copyWithToast
- Fixed: email-sequences, proposal-generator, email-campaign-builder, seo-scanner, lead-conversion-calculator
- Build verified: all 26 routes compile successfully

## Polish Session 2026-05-06 (v12.2-12.6)
- Lead Finder: Use ListSkeleton from polish components, consolidated inline skeleton
- Lead Conversion Calculator: Add business profile pre-fill, tool input persistence, cross-tool Email Campaign link
- Email Sequences: Add profile pre-fill support, tool input persistence
- Build verified: all 26 routes compile successfully
- **Complete TemplateSwitcher integration** - All 11 tools now have template system

## Polish Session 2026-05-06 (v12.7) - Competitor Scanner Added
- **Competitor Scanner** - Full feature with:
  - City + Industry selection with pre-fill from business profile
  - Mock competitor data generation with realistic info
  - Opportunity scoring (high/medium/low) based on gaps
  - Service availability matrix (Google Business, Website, SEO, Google Ads, Facebook, Instagram)
  - Gap analysis with actionable insights
  - Copy to clipboard with toast feedback
  - Export functionality
  - Insights panel with Quick Wins and Growth Opportunities
  - Skeleton loading states
- Updated Tools Hub to include Competitor Scanner
- Removed "Coming Soon" placeholder from Tools Hub
- Build verified: all routes compile successfully

## Polish Session 2026-05-06 (v12.8) - Quote Generator & ROI Calculator Added
- **Quote Generator** - Professional quote/offerta tool:
  - Client info (name, company, email, phone, address)
  - Line items with quantity × unit price, quick-add suggestions
  - Subtotal, discount %, tax (21%), grand total
  - Professional white-theme print preview
  - Copy as plain text, save to CRM, print
  - TemplateSwitcher + useToolInputs persistence
  - Pre-fill from business profile and selectedBusiness
- **ROI Calculator** - Full marketing ROI analysis:
  - Monthly spend, expected leads, conversion rate, deal value inputs
  - Industry benchmarks (auto-suggest CPL, conv rate, deal value)
  - ROI %, net profit, payback months, cost-per-lead
  - Break-even analysis with visual progress bar
  - Cost-per-order vs deal value comparison
  - Monthly projections table (leads, conversions, revenue, costs, profit, cumulative)
  - Color-coded verdict (green/yellow/red)
  - Copy results to clipboard
  - TemplateSwitcher + useToolInputs persistence
- **Tools Hub**: Quote Generator and ROI Calculator promoted from Coming Soon → full tools
- Build verified: all 28 routes compile successfully

**Status: LocalBoost v12.8 is production-ready**
