# Teron — Persistent Session Log (MEMORY)

> If you are a new session picking this project up: read PRD.md, ARCHITECTURE.md, RULES.md,
> and DESIGN.md first, then read the most recent 3–5 entries below before writing any code.

**Convention:** New entries are appended at the bottom. Never delete or rewrite past entries.

---

## [2026-08-04 00:15 UTC] — Initial scaffold and documentation creation

**Status:** in-progress

**What was done:**
- Created all five governing documents: PRD.md, ARCHITECTURE.md, RULES.md, DESIGN.md, MEMORY.md
- Restructured project from `src/app/` to `app/` at root level to match ANTIGRAVITY_PROMPT.md Section 4
- Updated `jsconfig.json` path alias from `./src/*` to `./*`
- Began scaffolding folder structure per Section 4 of ANTIGRAVITY_PROMPT.md

**Decisions & rationale:**
- Moved from `src/app/` to `app/` because the ANTIGRAVITY_PROMPT.md specifies root-level `app/` directory with `services/`, `components/`, `lib/`, `hooks/`, `emails/` as siblings — the `src/` wrapper would break the expected import paths
- Using Inter font (not Geist) as the primary typeface — better alignment with the Clerk/Vercel/Linear benchmark referenced in the design direction
- Font loading via `next/font/google` as this is the standard Next.js approach
- Design tokens use Tailwind v4 `@theme inline` in globals.css (CSS-first, not JS config)

**Known issues / TODO next:**
- Complete folder scaffold (all pages, API routes, services, components, lib, hooks, emails)
- Set up Prisma schema with 14 models
- Install required dependencies (prisma, motion, @hugeicons/react)
- Set up globals.css with full design token system
- Update root layout.js with Inter font and dark theme
- Create .env.example

**Files touched:**
- `PRD.md` (created)
- `ARCHITECTURE.md` (created)
- `RULES.md` (created)
- `DESIGN.md` (created)
- `MEMORY.md` (created)
- `jsconfig.json` (modified — path alias updated)
- `src/` (deleted — moved to root-level `app/`)

---

## [2026-08-04 04:00 UTC] — Completed scaffold and Prisma schema

**Status:** completed

**What was done:**
- Scaffolded all page routes (`/`, `/(marketing)`, `/(app)`, `/t/[token_name]`, `/admin`)
- Scaffolded all API routes for tokens, payments, admin, auth, and webhooks
- Created service files (`auth`, `wallet`, `token-deployment`, etc.) to isolate business logic
- Created custom React hooks (`useWallet`, `useBalance`, `useDeployment`, `useFeatureFlag`)
- Created Reusable UI components (`Button`, `Card`, `Input`, `Select`, `Table`, `Modal`, `Toast`, `Tooltip`, etc.)
- Created Zod schemas for validation
- Initialized Prisma schema with all 14 models (User, Token, TokenProfile, Deployment, Payment, RewardGrant, Task, etc.)
- Set up Viem/Wagmi and Cloudinary singletons
- Updated `.gitignore` and `next.config.mjs`

**Decisions & rationale:**
- API routes are strictly thin wrappers calling service functions
- Zod schemas are shared between client and server
- Prices are not hardcoded; they will be driven by the `PricingConfig` table

**Next steps:**
- Proceed to Phase 2: Core Platform Logic
- Implement WalletConnect integration and authentication
- Build the token creation wizard UI
