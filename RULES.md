# Teron — App Rules & System Design Constraints

> **Last updated:** 2026-08-04
> **Status:** Phase 1 — Active Development
> These are hard constraints, not suggestions. Do not deviate.

---

## Non-Negotiable Tech Stack

### Frontend
- **Next.js, App Router, JavaScript only** — no TypeScript, no `.ts`/`.tsx` files anywhere
- **Tailwind CSS v4**, CSS-first `@theme` configuration (not the old `tailwind.config.js` JS-based theme)
- **`motion` package** from motion.dev for all animation — **never** `framer-motion`. Import path is `motion/react` for React usage.
- **Icons: Hugeicons Stroke Rounded exclusively**, via `@hugeicons/react` — no Lucide, no Heroicons, no other icon library

### Backend
- **Next.js API Routes only** — no separate Express/Node server

### Data & Infra
- **PostgreSQL** via **Prisma ORM**
- **Cloudinary** for media (logos, banners, images)
- **wagmi + viem + WalletConnect** for wallet/chain interaction
- **Zod** for validation (client + server)
- **React Hook Form** for forms
- **Upstash Redis** for rate limiting and caching
- **Resend + React Email** for transactional email
- **Custom in-house monitoring** — no third-party monitoring SaaS

---

## Coding Conventions

### JavaScript Only
- No TypeScript. No `.ts` or `.tsx` files anywhere in the codebase.
- Use JSDoc for type documentation where helpful.

### Tailwind v4 CSS-First
- Use `@theme inline` in `globals.css` for design tokens.
- No `tailwind.config.js` or `tailwind.config.ts`.
- No inline `style` attributes except the narrow CSS custom-property exception for genuinely dynamic values (e.g., `style={{ '--progress': percentage }}`).

### Motion Package
- Import from `motion/react`, never from `framer-motion`.
- Package name in `package.json` is `motion`, not `framer-motion`.

### Icons
- **Hugeicons Stroke Rounded exclusively** via `@hugeicons/react`.
- Consistent stroke width and sizing scale.
- Never use Lucide, Heroicons, or any other icon library.

### Component Architecture
- Server Components by default. Add `'use client'` only when needed (state, effects, browser APIs).
- Business logic lives in `services/`, not in components or API routes.
- API routes are thin wrappers that call service functions.

---

## No Mocked Data Rule

**Every number, balance, price, transaction, and status shown in the UI must come from a real source:**
- Wallet balances → chain RPC via viem
- Chain state → chain RPC via viem
- Deployment status → on-chain transaction receipt
- Prices → PricingConfig table in database (admin-configurable)
- Rewards → RewardGrant records in database
- Admin metrics → real aggregated queries against database

**The only exception** is illustrative marketing copy on the public landing page (e.g., example testimonials, feature descriptions). Never inside anything that touches wallets, chains, contracts, payments, or the database.

---

## Validation Rules

### Zod Everywhere
- Define each Zod schema **once** in `lib/zod-schemas/`.
- Import it on **both** the client (React Hook Form resolver) and the server (API route).
- **Never validate on only one side.** Server-side validation is the source of truth.

### Token Creation Validation
- Name: required, 1–50 characters, alphanumeric + spaces
- Symbol: required, 1–11 characters, uppercase alphanumeric
- Decimals: required, integer, 0–18
- Supply: required, positive integer, within safe bounds
- Duplicate symbol check: server-side against database
- Social links: valid URL format where provided
- Logo/banner: validated dimensions/size before Cloudinary upload

---

## Security Rules (Hard Constraints)

1. **Input validation**: Strict Zod validation on every API route, server-side, regardless of client validation
2. **Rate limiting**: Upstash Redis on all mutating routes and sensitive read routes (balance checks, deployment attempts)
3. **CSRF protection**: On all Next.js API routes handling state-changing requests
4. **Wallet security**: wagmi/viem/WalletConnect best practices. No private key handling client- or server-side beyond what wallet SDKs manage.
5. **Server-side truth**: Never trust client-submitted state for anything financial or chain-related
6. **Audit logging**: Every important action logged (admin changes, payments, deployments, reward grants)
7. **RBAC**: Admin role gate on all admin routes and admin UI. Phase 1 minimum: working admin role check. Structure supports finer roles later.
8. **File validation**: Type, size, dimensions validated on all uploads before reaching Cloudinary
9. **Signed uploads**: Cloudinary upload requests generated server-side. Never expose unsigned upload presets.
10. **Parameterized queries**: Prisma handles this. Never use raw SQL string interpolation.
11. **Encrypted config**: Cold wallet details, API keys — never committed, always via env vars. Encrypt at rest where config lives in DB.
12. **Abuse prevention**: Extra throttling on task completion and reward endpoints (most abuse-prone surfaces)
13. **No silent failures**: Every error routes to the monitoring service. No swallowed errors, no console.log-only errors in production paths.

---

## Business Logic Rules

1. **Pricing is admin-configurable**: All prices (verification, metadata, future services) read from `PricingConfig` in the database. No price is hardcoded anywhere.
2. **TERR rewards require on-chain confirmation**: TERR is granted only after the deployment transaction is confirmed on-chain (not merely submitted). Check transaction receipt.
3. **Independent module pausing**: Admin can independently pause each module without redeploying code:
   - Token creation
   - Reward distribution
   - Task completion
   - Verification services
   - Metadata publishing
   Each is a separate `FeatureFlag` entry.
4. **Cold wallet transfers**: All paid service fees are transferred to the configured cold wallet address. The address is stored in environment variables, not hardcoded.
5. **Swap feature flag**: The TERR→TER swap page and API exist in the codebase but are gated behind a `swap_enabled` feature flag. Default: off.

---

## Error Handling Rules

**Every error must be logged to the monitoring system:**
- Server errors
- Deployment failures
- Wallet errors
- Validation failures
- Payment issues
- API exceptions
- Security events

**Each log entry includes:**
- Type (categorized by the list above)
- Severity (LOW, MEDIUM, HIGH, CRITICAL)
- Message (human-readable description)
- Stack trace (where applicable)
- Affected user (wallet address)
- Metadata (JSON, any additional context)
- Timestamp
- Resolved status (default: false)

**No silent failures.** No `console.log`-only errors in production paths. Every catch block must route to the monitoring service.

---

## Git/Commit Discipline

- Small, scoped commits
- Never commit secrets or `.env` files
- `.env.example` is the documented template
- Meaningful commit messages describing what changed and why
