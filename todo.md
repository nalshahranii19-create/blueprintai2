# Blueprint AI - Project TODO

## Phase 1: Database & Backend API
- [x] Add blueprints table to drizzle schema
- [x] Generate and apply DB migration
- [x] Add blueprint CRUD helpers in server/db.ts
- [x] Create blueprints router with list/get/delete procedures
- [x] Create generate procedure with LLM (full 25-section prompt)

## Phase 2: Theme & Landing Page
- [x] Configure dark theme with indigo/violet palette in index.css
- [x] Add Google Fonts (Inter + Tajawal for Arabic) in index.html
- [x] Build i18n context (Arabic/English) with localStorage persistence
- [x] Build Navbar with language toggle and auth state
- [x] Build Hero section with animated headline and CTA
- [x] Build Features section with icon cards
- [x] Build How It Works section (3-step process)
- [x] Build Blueprint preview section
- [x] Build CTA section
- [x] Build Footer
- [x] Configure RTL support for Arabic

## Phase 3: Input Form & Generation Page
- [x] Build multi-step form (4 steps: idea, type, audience, features)
- [x] Add step progress indicator
- [x] Build loading state UI while generating
- [x] Wire form to generate API
- [x] Handle auth redirect before generation

## Phase 4: Blueprint Result Page & Dashboard
- [x] Build blueprint result page with collapsible sections (25 sections)
- [x] Add copy-to-clipboard button per section
- [x] Add export-as-Markdown button
- [x] Add save-to-account button (for logged-in users)
- [x] Build Dashboard blueprints list page (cards with title, date, project type)
- [x] Build blueprint detail view from saved data
- [x] Add delete blueprint functionality with confirmation dialog

## Phase 5: Polish & Tests
- [x] Add responsive design for mobile
- [x] Add page transitions and micro-animations (framer-motion)
- [x] Ensure RTL works correctly for Arabic
- [x] Write vitest tests for key procedures (9 tests passing)
- [x] Final review and checkpoint

## Phase 6: SaaS Monetization (Stage 3)

### Database
- [x] Add plan limits to users table (plan field: free/pro/business)
- [x] Add usage tracking table (monthly blueprint count)
- [x] Apply DB migration

### Backend API
- [x] Create plans router (get current plan, upgrade plan)
- [x] Add usage check middleware in generate procedure
- [x] Add usage tracking on blueprint generation
- [x] Add plan limits enforcement (Free: 3/mo, Pro: 30/mo, Business: unlimited)

### Pricing Page
- [x] Build professional pricing page with 3 tiers
- [x] Add billing toggle (monthly/yearly) with discount
- [x] Add feature comparison table
- [x] Add FAQ section
- [x] Wire upgrade CTA buttons

### Subscription Management
- [x] Build subscription management page (/settings)
- [x] Show current plan, usage, and renewal info
- [x] Add upgrade/downgrade flow

### User Profile
- [x] Build profile settings page (/settings)
- [x] Show name, email, plan badge
- [x] Add settings navigation sidebar

### Dashboard Improvements
- [x] Add usage bar (X of Y blueprints used this month)
- [x] Add plan badge in dashboard header
- [x] Add upgrade prompt when near/at limit (UsageBanner)

### Upgrade Prompts & Feature Locks
- [x] Lock generate when limit reached (show upgrade modal)
- [x] Add upgrade prompt in generate page when limit hit
- [x] Add Pricing and Settings links to Navbar dropdown

### Tests
- [x] Write vitest tests for plan limits and usage tracking (22 tests passing)

## Phase 7: AI Business Consultant Upgrade (Stage 4)

### Database
- [x] Add section_regenerations table (blueprint_id, section_key, content, created_at)
- [x] Apply DB migration

### AI Engine
- [x] Build advanced prompt engineering system (shared/prompts.ts)
- [x] Create 25 deep, personalized section prompts
- [x] Add follow-up question detection logic
- [x] Add business model recommendations
- [x] Add competitor analysis section
- [x] Add risk assessment section
- [x] Add marketing strategy section
- [x] Add growth roadmap section

### Backend API
- [x] Add regenerateSection procedure (regenerate single section)
- [x] Add getRegenerationHistory procedure
- [x] Add AI retry logic with exponential backoff
- [x] Add graceful error handling for AI failures
- [x] Add token optimization (structured prompts)

### Frontend
- [x] Add regenerate button per section in BlueprintResult
- [x] Add section regeneration loading state
- [x] Add regeneration history viewer per section
- [x] Show follow-up questions before generation if inputs are weak

### Tests
- [x] Write vitest tests for prompt generation
- [x] Write vitest tests for section regeneration
