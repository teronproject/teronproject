# ANTIGRAVITY BUILD PROMPT — TERON

You are Antigravity, acting as the lead full-stack engineer for **Teron** (teron.io), a premium Web3 token launch platform for BNB Chain. This document is your single source of truth for Phase 1. Read it completely before writing any code. Do not skip the documentation stage — it is not optional and it is not busywork. It is what lets you (or a future session of you) resume this project cold, with zero re-explanation, weeks or months from now.

This is a real product, not a prototype. Every wallet connection, every contract deployment, every balance check, every price feed, every payment, and every reward must work against real infrastructure. There is no mocked data anywhere in a functional product area. The only place illustrative/placeholder content is allowed is inside static marketing copy on the public landing page (e.g. example testimonials), never inside anything that touches wallets, chains, contracts, payments, or the database.

---

## 0. FIRST ACTIONS — DO THESE BEFORE WRITING APPLICATION CODE

1. Create the five governing documents listed in Section 1, in this order: `PRD.md` → `ARCHITECTURE.md` → `RULES.md` → `DESIGN.md` → `MEMORY.md`.
2. Scaffold the Next.js App Router project exactly per the folder structure in Section 4.
3. Set up Prisma + PostgreSQL schema per Section 6 before building any UI screen that depends on it.
4. Only after 1–3 are complete, begin implementing features, starting with wallet connection → token creation wizard → deployment, in that order (this is the critical path; nothing else matters if this doesn't work end-to-end first).
5. After every meaningful work session (a completed feature, a completed service, a schema change, a blocked decision), append an entry to `MEMORY.md`. Never overwrite or delete prior entries — it is append-only.

---

## 1. THE FIVE GOVERNING DOCUMENTS — WHAT EACH ONE MUST CONTAIN

Create these as real files at the project root. They are not throwaway scratch notes — they are living documents that every future coding session (human or AI) must read first. Keep them accurate as the project evolves; when a decision changes, update the relevant doc in the same session, not later.

### 1.1 `PRD.md` — Product Requirements Document
Must contain, at minimum:
- One-paragraph product summary (what Teron is, who it's for, what problem it solves)
- Target audience (BNB Chain project founders, indie crypto builders, small teams launching BEP-20 tokens who want a premium, trustworthy launch experience instead of a generic token generator)
- Phase 1 scope boundary (BNB Chain only — explicitly state multi-chain is Phase 2+, not now)
- Full feature list, grouped by priority (must-have for launch vs. can-follow shortly after)
- Complete core user flow (wallet connect → deploy → verify → publish → reward → manage), written as numbered steps
- Business model and pricing (token creation is free except gas; contract verification ≈$2 in BNB; metadata/image publishing ≈$3 in BNB; both prices must be configurable from the admin panel, not hardcoded)
- Success criteria for Phase 1 (what "done" looks like)
- Explicit non-goals for Phase 1 (things intentionally deferred: multi-chain support, TER/TERR public swap activation until TER has liquidity, mobile native apps, etc.)

### 1.2 `ARCHITECTURE.md` — System Architecture & App Flow
Must contain, at minimum:
- Full folder structure (reproduce and maintain Section 4 of this document as the codebase evolves — this file must always reflect the *actual* current structure, not the aspirational one)
- The microservices-style internal domain boundaries (Section 5) and what each domain owns
- Data flow diagrams described in text: wallet connect → chain detection → balance check → token wizard → validation → simulate → deploy → verify → publish metadata → reward TERR → dashboard
- API route map (every route under `app/api/`, grouped by domain, with method + purpose)
- Database schema summary (link to `prisma/schema.prisma`, describe each model's purpose in one line)
- Third-party integration map: wagmi/viem/WalletConnect (chain + wallet), Cloudinary (media), Upstash Redis (rate limiting/caching), Resend + React Email (transactional email), PostgreSQL + Prisma (persistence)
- Deployment/environment topology (envs required, what runs where)
- How new features should be added (which domain folder they belong in, how to avoid violating domain boundaries)

### 1.3 `RULES.md` — App Rules & System Design Constraints
Must contain, at minimum:
- The non-negotiable tech stack list (Section 3) verbatim, with a note that these are hard constraints, not suggestions
- Coding conventions: JavaScript only (no TypeScript), Tailwind v4 CSS-first `@theme` config only, no inline `style` attributes except the narrow CSS custom-property exception, `motion` package only (never `framer-motion`), Hugeicons Stroke Rounded only (never Lucide or any other icon set)
- No mocked data rule, explicitly: every number, balance, price, transaction, and status shown in the UI must come from a real source (chain RPC, database, or live price feed) — landing page marketing copy is the only exception
- Validation rule: every user input validated with Zod on both client (via React Hook Form resolvers) and server (API route level) — never trust client validation alone
- Security rules from Section 8, restated as hard constraints (rate limiting, CSRF where applicable, audit logging, RBAC for admin, prepared queries via Prisma, encrypted sensitive config, secure Cloudinary upload flow)
- Business logic rules: pricing must be read from admin-configurable settings, never hardcoded; TERR rewards only granted after on-chain deployment is confirmed (not merely submitted); admin can independently pause each module (token creation, verification, publishing, rewards, tasks) without redeploying code
- Error handling rule: every server error, deployment failure, wallet error, validation failure, payment issue, API exception, and security event must be written to the monitoring table in PostgreSQL — no silent failures, no console.log-only errors in production paths
- Git/commit discipline if applicable (small, scoped commits; no committing secrets/env files)

### 1.4 `DESIGN.md` — Design System & Motion Spec
Must contain, at minimum:
- Full visual direction (Section 9) — dark theme, yellow accent, benchmarked against Clerk/Vercel/Linear/Stripe
- Color tokens (background layers, surface layers, border colors, text colors, the single yellow accent and its states — default/hover/active/disabled)
- Typography scale (font family, weight scale, size scale, line-height rules)
- Spacing and radius scale (must avoid oversized border radii and cheap-looking defaults)
- Grid system (responsive 12-column, breakpoints from mobile through ultrawide)
- Component inventory with states: buttons, inputs, selects, modals, toasts, cards, tables, wizards/steppers, badges, tooltips, empty states, loading states, error states
- Motion principles using the `motion` package: what animates (page transitions, wizard step transitions, modal enter/exit, toast enter/exit, hover micro-interactions, skeleton loading), easing/duration standards, and what must stay reduced/disabled when `prefers-reduced-motion` is set
- Icon usage rule: Hugeicons Stroke Rounded exclusively, consistent stroke width, consistent sizing scale
- Accessibility baseline (contrast ratios, focus states, keyboard navigation for wizard flows and modals)

### 1.5 `MEMORY.md` — Persistent Session Log (MAIN)
This is the most important file for continuity. It is **append-only**. Never delete or rewrite past entries — only add new ones at the bottom (or top, pick one convention and state it at the top of the file, then never change it).

Each entry must follow this exact format:

```
## [YYYY-MM-DD HH:MM UTC] — <short title of what happened>
**Status:** <in-progress | completed | blocked>
**What was done:**
- bullet list of concrete changes (files touched, features built, schema changes, decisions made)
**Decisions & rationale:**
- any non-obvious decision and why it was made (so it's never re-litigated)
**Known issues / TODO next:**
- anything left unfinished, anything broken, exact next step
**Files touched:**
- list of file paths changed this session
```

At the very top of `MEMORY.md`, before any dated entry, include a short "How to resume" block:
```
> If you are a new session picking this project up: read PRD.md, ARCHITECTURE.md, RULES.md,
> and DESIGN.md first, then read the most recent 3–5 entries below before writing any code.
```

Seed `MEMORY.md` with your first entry documenting the initial scaffold and documentation creation, before writing any feature code.

---

## 2. PROJECT VISION (SOURCE OF TRUTH — DO NOT DEVIATE)

Teron (teron.io) is a premium Web3 launch platform focused on making BNB Chain token creation simple, secure, and approachable. Phase 1 targets **BNB Chain only** — multi-chain expansion is explicitly deferred to a future phase, after product validation and community growth. Teron is a launch *ecosystem*, not a bare token generator: users create tokens, verify contracts, publish a public project profile, earn rewards, complete tasks, and manage everything from a single dashboard.

### Phase 1 Goals
- Create BEP-20 tokens on BNB Chain
- Premium deployment experience with excellent UX
- Contract verification service
- Optional on-chain metadata/image publishing service
- Public token profile pages
- Reward users with TERR after successful deployments
- Advanced admin dashboard
- Strong security, validation, logging, and SEO

### Core User Flow (exact order — build the deployment path first)
1. Connect wallet
2. Detect BNB Chain and wallet balance
3. Complete token creation wizard
4. Select optional paid services
5. Validate balance and requirements
6. Deploy token
7. Verify contract (optional, paid)
8. Publish metadata (optional, paid)
9. Receive TERR reward
10. Manage project from dashboard
11. Publish advanced public page at `/t/{token_name}`

### Business Model
- Token deployment: **free**, except blockchain gas fees
- Contract verification: **≈$2 in BNB**, transferred to Teron's cold wallet
- On-chain metadata/image publishing: **≈$3 in BNB**, transferred to Teron's cold wallet
- All pricing must be configurable from the admin panel — never hardcode a price anywhere in the codebase

### Wallet & Security Flow
Wallet connection is the primary identity. A user profile is created automatically after the first successful wallet connection — there is no separate signup/login form. Before any deployment, the platform must validate: correct chain, wallet connection, sufficient balance, duplicate token symbols where applicable, all required fields, a transaction simulation, and the state of any optional selected services. If funds are insufficient, the UI must clearly explain why and offer guidance (add BNB from another wallet/exchange, or submit a request for Teron assistance). Every important action must be logged.

### Reward System
Every successful token deployment rewards the connected wallet with **TERR** (Teron Reward). After the TER token publicly launches and liquidity exists, users will be able to swap TERR for TER via `/swap`. The swap page ships in the codebase but stays feature-flagged off until TER has liquidity — build it, but gate it behind an admin-controlled flag.

### Major Features
- Token Creator (BNB Chain only)
- Deployment history
- Advanced public token page (`/t/{token_name}`)
- Public token directory / leaderboard
- TERR reward distribution
- Task center
- Swap page (future activation after TER listing, feature-flagged)
- User dashboard
- Admin dashboard
- SEO-optimized public pages
- Legal and compliance pages

### Public Token Page (`/t/{token_name}`)
Each project gets a public profile with: logo, banner, description, contract address, supply, decimals, socials (website, X, Telegram, Discord, GitHub), roadmap, tokenomics, contact information, copy-contract button, add-to-wallet button, and any other relevant project metadata.

### Leaderboard
Shows recently created tokens and featured launches: project logo, name, symbol, creation date, contract address, creator profile (when public), verification status, and other useful metadata. Must be driven by real deployment data, sortable/filterable, and paginated for scale.

### Task Center
Users complete community tasks — following Teron on X, liking posts, reposting, joining communities, referrals, and future campaigns. All tasks are fully managed from the admin panel (create/edit/disable tasks, define verification method, define reward amount). Rewards are distributed as TERR per configurable rules.

### Swap
After TER publicly launches, `/swap` lets users exchange TERR for TER per admin-configured conversion rules. Ship the page and logic now; keep it behind a feature flag until launch.

### Admin Dashboard
The super admin manages: users, deployments, payments, rewards, tasks, project pages, BNB assistance requests, pricing, feature flags, maintenance mode, analytics, legal content, SEO settings, and platform-wide controls. The admin must be able to independently pause: token creation, reward distribution, task completion, and verification services — each as its own toggle, without a redeploy.

### Error Handling & Monitoring
No third-party monitoring vendor. Build a custom monitoring system: every server error, deployment failure, wallet error, validation failure, payment issue, API exception, and security event is written to PostgreSQL and surfaced through an internal Admin Monitoring Dashboard with filtering, severity levels, timestamps, affected users, stack traces (where applicable), retry actions, and audit logs.

### Long-Term Vision
Teron should evolve into a complete Web3 launch ecosystem covering token deployment, project management, community growth, rewards, analytics, and eventual multi-chain support — while never compromising the premium feel of the product.

---

## 3. NON-NEGOTIABLE TECH STACK

Do not substitute, "improve," or modernize any of these choices. They are fixed.

**Frontend**
- Next.js, **App Router**, **JavaScript only** — no TypeScript, no `.ts`/`.tsx` files anywhere
- Tailwind CSS **v4**, CSS-first `@theme` configuration (not the old `tailwind.config.js` JS-based theme)
- `motion` package from motion.dev for all animation — **never** `framer-motion`, and never confuse the import path (`motion/react` is correct for React usage of the `motion` package; verify against current motion.dev docs at scaffold time)
- Icons: **Hugeicons Stroke Rounded exclusively**, via `hugeicons-react` / `@hugeicons/react` — no Lucide, no Heroicons, no other icon library under any circumstance

**Backend**
- Next.js **API Routes** only — no separate Express/Node server, no separate backend runtime

**Data & Infra**
- Database: **PostgreSQL**, accessed via **Prisma ORM**
- Storage: **Cloudinary** for logos, banners, and media
- Wallet/chain: **wagmi**, **viem**, **WalletConnect** — real BNB Chain connections, real balance reads, real contract deployment transactions
- Validation: **Zod**, used both client-side (via resolvers) and server-side on every API route
- Forms: **React Hook Form**
- Caching / rate limiting: **Upstash Redis**
- Email: **Resend** + **React Email** for transactional email (deployment confirmations, admin alerts, BNB assistance requests, etc.)
- Monitoring: custom in-house monitoring, integrated into the Admin Dashboard — not a third-party SaaS

**UI Quality Bar**
Premium, pixel-perfect, feature-rich but minimal. Benchmark every screen against Vercel, Clerk, Stripe, and Linear dashboards. No inline `style` attributes (Tailwind v4 utilities only, with a narrow CSS custom-property exception for genuinely dynamic values). No cheap defaults: no excessive glow, no flat gradients, no oversized border radii. The interface must feel like premium software, not a typical crypto site.

**Architecture**
Microservices-style internal structure, even though this ships as a single Next.js monorepo. Each domain is isolated for independent maintenance and feature rollout — see Section 5.

**Data Integrity**
No mocked data anywhere in a functional product area. Wallet balances, chain state, deployment status, prices, rewards, and admin metrics must all come from real sources. The only exception is illustrative copy on public marketing sections of the landing page.

---

## 4. FOLDER STRUCTURE

Scaffold exactly this structure. Keep `ARCHITECTURE.md` in sync with it as it evolves.

```
teron/
├── PRD.md
├── ARCHITECTURE.md
├── RULES.md
├── DESIGN.md
├── MEMORY.md
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.css        # v4 @theme, CSS-first
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── (static assets, favicons, og-images)
├── app/
│   ├── layout.js
│   ├── page.js                         # landing page
│   ├── globals.css                     # tailwind v4 @theme tokens
│   ├── (marketing)/
│   │   ├── about/page.js
│   │   ├── pricing/page.js
│   │   └── legal/
│   │       ├── privacy/page.js
│   │       ├── terms/page.js
│   │       ├── cookies/page.js
│   │       ├── disclaimer/page.js
│   │       ├── risk-disclosure/page.js
│   │       ├── aml-kyc/page.js
│   │       ├── reward-terms/page.js
│   │       ├── security-policy/page.js
│   │       ├── responsible-disclosure/page.js
│   │       ├── copyright/page.js
│   │       └── dmca/page.js
│   ├── (app)/
│   │   ├── create/page.js              # token creation wizard
│   │   ├── dashboard/page.js           # user dashboard
│   │   ├── deployments/page.js         # deployment history
│   │   ├── tasks/page.js               # task center
│   │   ├── swap/page.js                # feature-flagged
│   │   └── settings/page.js
│   ├── t/
│   │   └── [token_name]/page.js        # public token profile page
│   ├── leaderboard/page.js
│   ├── admin/
│   │   ├── layout.js                   # RBAC-gated
│   │   ├── page.js                     # overview/analytics
│   │   ├── users/page.js
│   │   ├── deployments/page.js
│   │   ├── payments/page.js
│   │   ├── rewards/page.js
│   │   ├── tasks/page.js
│   │   ├── assistance-requests/page.js
│   │   ├── pricing/page.js
│   │   ├── feature-flags/page.js
│   │   ├── monitoring/page.js          # custom monitoring dashboard
│   │   ├── seo/page.js
│   │   └── legal-content/page.js
│   └── api/
│       ├── auth/
│       │   └── wallet-session/route.js
│       ├── wallet/
│       │   ├── balance/route.js
│       │   └── chain-check/route.js
│       ├── tokens/
│       │   ├── create/route.js
│       │   ├── deploy/route.js
│       │   ├── simulate/route.js
│       │   ├── [id]/route.js
│       │   └── history/route.js
│       ├── verification/
│       │   └── request/route.js
│       ├── metadata/
│       │   └── publish/route.js
│       ├── rewards/
│       │   ├── grant/route.js
│       │   └── balance/route.js
│       ├── tasks/
│       │   ├── list/route.js
│       │   └── complete/route.js
│       ├── swap/
│       │   └── execute/route.js
│       ├── leaderboard/route.js
│       ├── uploads/
│       │   └── cloudinary-sign/route.js
│       ├── payments/
│       │   └── verify/route.js
│       ├── assistance/
│       │   └── request/route.js
│       ├── email/
│       │   └── send/route.js
│       ├── monitoring/
│       │   └── log/route.js
│       └── admin/
│           ├── users/route.js
│           ├── deployments/route.js
│           ├── payments/route.js
│           ├── rewards/route.js
│           ├── tasks/route.js
│           ├── pricing/route.js
│           ├── feature-flags/route.js
│           ├── monitoring/route.js
│           └── seo/route.js
├── services/                            # microservices-style domain logic (Section 5)
│   ├── auth/
│   ├── wallet/
│   ├── token-deployment/
│   ├── verification/
│   ├── metadata-publishing/
│   ├── rewards/
│   ├── tasks/
│   ├── swap/
│   ├── payments/
│   ├── monitoring/
│   ├── seo/
│   └── admin/
├── components/
│   ├── ui/                              # buttons, inputs, modals, toasts, etc.
│   ├── wizard/
│   ├── dashboard/
│   ├── public-page/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── prisma.js
│   ├── redis.js
│   ├── cloudinary.js
│   ├── resend.js
│   ├── wagmi-config.js
│   ├── viem-client.js
│   ├── zod-schemas/
│   └── constants.js
├── hooks/
│   ├── useWallet.js
│   ├── useBalance.js
│   ├── useDeployment.js
│   └── useFeatureFlag.js
└── emails/                              # React Email templates
    ├── DeploymentConfirmed.js
    ├── AssistanceRequestReceived.js
    └── AdminAlert.js
```

---

## 5. MICROSERVICES-STYLE DOMAIN BOUNDARIES

Each domain under `services/` owns its own logic, types (JSDoc, since no TS), validation schemas, and database access patterns. API routes are thin — they call into the relevant service module, they don't contain business logic themselves. This is what makes the platform easy to maintain and roll out new features into without touching unrelated code.

| Domain | Owns |
|---|---|
| `auth` | Wallet-based identity, session creation on first connect, profile auto-creation |
| `wallet` | Balance reads, chain detection, wagmi/viem client orchestration |
| `token-deployment` | Wizard state, contract deployment, transaction simulation, deployment history |
| `verification` | Paid contract verification flow, payment confirmation, verification status |
| `metadata-publishing` | Paid on-chain metadata/image publishing, Cloudinary upload orchestration |
| `rewards` | TERR grants on confirmed deployment, TERR balance, future TERR→TER conversion logic |
| `tasks` | Task definitions, completion verification, reward distribution for tasks |
| `swap` | TERR→TER exchange logic, feature-flag gating until TER liquidity exists |
| `payments` | BNB payment verification for verification/publishing services, cold wallet transfer confirmation |
| `monitoring` | Central error/event logging, severity classification, admin monitoring queries |
| `seo` | Dynamic metadata generation, Open Graph/Twitter card data, sitemap/robots generation |
| `admin` | Cross-cutting admin operations: feature flags, pricing config, maintenance mode, RBAC checks |

Rule: a service module never directly imports another service's internals — cross-domain communication goes through each service's exported public functions only. This keeps domains swappable and testable in isolation, and is what lets you roll out a new feature by touching one folder instead of the whole app.

---

## 6. DATABASE SCHEMA — CORE MODELS (Prisma)

Design `prisma/schema.prisma` to cover at minimum these models (expand fields as needed, but don't drop any of these entities):

- `User` — wallet address (primary identity), created-at, profile fields (display name, avatar, socials), role (user/admin), TERR balance
- `Token` — deployer (User relation), name, symbol, decimals, supply, contract address, chain, deployment tx hash, deployment status, verification status, metadata-published status, created-at
- `TokenProfile` — public page content: logo, banner, description, socials, roadmap, tokenomics, contact info (relation to `Token`)
- `Deployment` — deployment attempt record, status, gas used, error info if failed
- `Payment` — service type (verification/metadata), amount in BNB, tx hash, status, cold wallet address, related Token
- `RewardGrant` — user, amount, reason (deployment/task), related entity, timestamp
- `Task` — title, description, verification method, reward amount, active/inactive, admin-managed
- `TaskCompletion` — user, task, status, verified-at
- `AssistanceRequest` — user, wallet address, description, status, admin notes
- `FeatureFlag` — key, enabled boolean, admin-editable
- `PricingConfig` — service key (verification/metadata/etc.), price in BNB or USD-equivalent, admin-editable
- `MonitoringEvent` — type (error/deployment-failure/wallet-error/validation-failure/payment-issue/api-exception/security-event), severity, message, stack trace, affected user, metadata JSON, timestamp, resolved status
- `AuditLog` — actor (user or admin), action, target entity, before/after where relevant, timestamp
- `SwapTransaction` — user, TERR amount, TER amount, rate applied, status (for when swap activates)

---

## 7. VALIDATION & FORMS

- Every form uses React Hook Form with a Zod resolver.
- Define each Zod schema once in `lib/zod-schemas/`, import it on both the client (form resolver) and the corresponding API route (server-side re-validation) — never validate on only one side.
- Token creation wizard fields must validate: name/symbol format and length, decimals range, supply bounds, duplicate symbol check (server-side, against DB), required social links format where provided, image dimensions/size for logo and banner (Cloudinary constraints).

---

## 8. SECURITY REQUIREMENTS

Implement all of the following — none are optional:
- Strict input validation on every API route (Zod, server-side, regardless of client validation)
- Rate limiting via Upstash Redis on all mutating routes and sensitive read routes (balance checks, deployment attempts)
- CSRF protection where applicable (Next.js API routes handling state-changing requests)
- Secure wallet connection flows (wagmi/viem/WalletConnect best practices, no private key handling client- or server-side beyond what wallet SDKs manage)
- Server-side validation as the source of truth, never trusting client-submitted state for anything financial or chain-related
- Audit logs for every important action (admin changes, payments, deployments, reward grants)
- Role-based admin permissions (don't build a single flat "isAdmin" boolean if finer roles are useful later — but Phase 1 minimum is a working admin role gate)
- File validation on all uploads (type, size, dimensions) before they reach Cloudinary
- Secure, signed Cloudinary upload flow (signed upload requests generated server-side, never expose unsigned upload presets with broad permissions)
- Prepared/parameterized database queries (Prisma handles this by default — never drop to raw SQL string interpolation)
- Encryption for sensitive configuration values (cold wallet details, API keys) — never commit secrets, always via env vars, encrypt at rest where the config lives in DB
- Abuse prevention and request throttling on task completion and reward endpoints specifically (these are the most abuse-prone surfaces)
- Comprehensive error handling that always routes to the monitoring service (Section 1.3/Section on Error Handling) — no swallowed errors

---

## 9. DESIGN SYSTEM SUMMARY (full spec belongs in `DESIGN.md`)

- Premium, minimal, **dark theme with yellow accents** — direct inspiration from Clerk, Vercel, Linear, and Stripe dashboards
- Dark background, subtle layered surfaces, thin borders, white/gray typography scale, single yellow accent color used sparingly and purposefully (primary actions, active states, key highlights — not decoration)
- Responsive 12-column grid, optimized from mobile through ultrawide displays
- Smooth transitions and purposeful motion via `motion` — extensive but tasteful micro-interactions, never gratuitous
- Accessible components: proper focus states, keyboard navigation (especially through the multi-step wizard and modals), adequate contrast
- Consistent spacing scale, rounded corners (restrained, not oversized), clean typography
- The product must feel like premium software first, and a crypto product second — avoid every visual cliché of typical "crypto site" design (no neon gradients, no generic rocket/moon iconography, no stock crypto templates)

---

## 10. RESPONSIVENESS & UX

- Every screen — landing, wizard, dashboard, public token page, leaderboard, admin — must be fully responsive from small mobile through ultrawide desktop, not just "doesn't break" but genuinely well-composed at each breakpoint.
- The token creation wizard is the most important flow in the product: it must be flawless on mobile (thumb-reachable controls, clear step progress, no cramped forms) since a meaningful share of Web3 users will attempt this on mobile wallets/browsers.
- Loading, empty, and error states must be designed intentionally for every data-driven screen — never leave a blank white flash or a raw error message in the UI.

---

## 11. WHAT "DONE" LOOKS LIKE FOR PHASE 1

- A user can connect a real wallet, get accurate real-time BNB Chain balance and chain detection, complete the wizard, and deploy a real BEP-20 token on-chain.
- Optional paid verification and metadata publishing both work against real BNB payments to the configured cold wallet, with admin-configurable pricing.
- TERR is granted automatically and correctly after confirmed (not just submitted) deployments.
- The public token page at `/t/{token_name}` renders correctly with real on-chain and database-backed data, and is SEO-optimized (meta tags, OG tags, structured data, sitemap entry).
- The leaderboard reflects real deployments, sortable and paginated.
- The task center is fully admin-manageable and distributes TERR correctly on verified completion.
- The admin dashboard can independently pause each module, edit pricing, manage users/deployments/payments/rewards/tasks, and view the custom monitoring dashboard with real logged events.
- All legal pages exist and are reachable.
- Every screen is responsive, on-brand, and free of mocked data.
- `PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, and `MEMORY.md` are all accurate and current, reflecting exactly what was built.

---

Build in this order: **documentation → schema → wallet connection → deployment wizard end-to-end → verification/metadata payment flows → rewards → public pages/leaderboard → task center → admin dashboard → monitoring → SEO polish → legal pages → swap (flagged off)**. Do not parallelize into unrelated feature work before the core deploy path (wallet connect → deploy → confirm → reward) works completely, end to end, with real chain interaction.
