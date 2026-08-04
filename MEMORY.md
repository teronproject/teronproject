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

---

## [2026-08-04 06:00 UTC] — Implemented Auth & Token Wizard (Phases 2 & 3)

**Status:** completed

**What was done:**
- Initialized Wagmi, Viem, and React Query via `Providers` wrapper.
- Implemented `/api/auth/wallet-session` API route for seamless wallet authentication.
- Auth service now creates/resumes sessions in Postgres based on the connected wallet address.
- Configured admin fallback via `ADMIN_WALLET_ADDRESSES` environment variable.
- Built the heavy-context multi-step Token Wizard (`app/(app)/create/page.js`).
- Wizard captures standard info (Name, Symbol), social links, and media URLs with Zod validation.
- Implemented `/api/tokens/create` that securely saves the Token, TokenProfile, and PENDING Deployment records in a single Prisma transaction.

**Decisions & rationale:**
- Included heavy inline instructions in the wizard components (as requested by user) to educate users on smart contract immutability and best practices for leaderboard ranking.
- Used a basic header check (`x-wallet-address`) for this phase to pass identity from the client to the API. In a strict production setting, this should be a cryptographic signature (SIWE).
- Media step currently asks for direct URLs as placeholders for Cloudinary uploads to keep the flow moving.

**Next steps:**
- Proceed to Phase 4: Smart Contract Deployment.
- Build the `/deployments/[id]` page to handle the transaction signing via Wagmi and broadcast to BNB Chain.
- Implement transaction monitoring and confirmation webhooks.

---

## [2026-08-04 06:15 UTC] — Implemented Smart Contract Deployment & Execution (Phase 4)

**Status:** completed

**What was done:**
- Created standard OpenZeppelin-based BEP-20 / ERC-20 contract ABI and compiled bytecode in `lib/contracts/bep20.js`.
- Implemented `/api/deployments/[id]` GET and PATCH endpoints to retrieve and transactionally update deployment and token statuses in Postgres.
- Built the real-time deployment execution page at `app/(app)/deployments/[id]/page.js`.
- Integrated Wagmi's `useDeployContract` to trigger native Web3 wallet deployment signatures.
- Used `useWaitForTransactionReceipt` for automatic block inclusion monitoring and contract address detection.
- Configured dynamic BscScan Explorer link generators for both BNB Smart Chain Mainnet (56) and Testnet (97).

**Decisions & rationale:**
- Included verified standard OpenZeppelin bytecode directly so deployments work immediately on Testnet without needing external hardhat/truffle compile steps at runtime.
- Maintained zero mocked data policy — everything operates via real Viem BigInt unit parsing and authentic blockchain transactions.

- Proceed to Phase 5: Token Profiles & Community Leaderboard.
- Build dynamic public profiles at `/t/[symbol]` showing token specs and social channels.
- Create leaderboard views ranked by community engagement and profile completeness.

---

## [2026-08-04 08:50 UTC] — Implemented Public Token Profiles & Leaderboards (Phase 5)

**Status:** completed

**What was done:**
- Created `/api/tokens/list` API endpoint to return paginated deployed token directories with live search filtering and basic completeness scoring.
- Created `/api/tokens/[symbolOrAddress]` API endpoint to perform smart lookups by ticker symbol, EVM address, or DB CUID/UUID.
- Built the interactive Public Token Profile page (`app/(app)/t/[symbol]/page.js`) complete with banners, circular logos, verified contract specs, copy-to-clipboard actions, and official social channel links.
- Built the real-time Community Leaderboard explorer (`app/(app)/leaderboard/page.js`) featuring responsive token cards, debounced live search, and filter switches.

**Decisions & rationale:**
- Token lookup automatically decodes URI components and detects whether the search string is a hex contract address (`0x...`), UUID/CUID, or symbol string to make URLs flexible without sacrificing SEO cleanliness (`/t/teron`).
- Zero mocked data applied; token list only displays actual Postgres token records with optional filtering for on-chain `CONFIRMED` deployments.

**Next steps:**
- Proceed to Phase 6: User Dashboard & Creator Launch History.
- Build `/dashboard` where creators can review all their past deployed tokens, monitor status, and edit their non-immutable TokenProfile social links after deployment.

---

## [2026-08-04 10:00 UTC] — Wallet-First UX Overhaul, Profile System, & Cloudinary Integration (Phase 6)

**Status:** completed

**What was done:**
- Created global `ToastProvider` context component to enable toasts from any page without prop drilling.
- Wrapped entire app in `<ToastProvider>` via `Providers.js`.
- Enhanced `useWallet` hook with `switchChain`, `refreshProfile`, `isAdmin`, and proper loading states.
- Built premium `WalletButton` component with connector selection modal (MetaMask, WalletConnect, Browser Wallet), chain switching, connected profile pill with avatar + truncated address, and disconnect action.
- Built `Header` component with responsive navigation (Leaderboard, Create Token, Dashboard), settings gear icon, and WalletButton integration.
- Updated `(app)/layout.js` to include the Header on all authenticated pages.
- Created `/api/auth/profile` with GET (full profile with relational counts) and PATCH (update name, email, avatar, socials) endpoints.
- Created `/api/upload/signature` for Cloudinary signed upload generation (avatars, token logos, token banners).
- Built `useCloudinaryUpload` hook with XHR progress tracking for real-time upload feedback.
- Built full Settings/Profile page (`/settings`) with: avatar upload via Cloudinary, display name, email, and social links editing.
- Rewrote `StepMedia` wizard component to use real Cloudinary file uploads instead of raw URL text inputs.
- Built Dashboard page (`/dashboard`) showing deployed token stats, token list with status badges, and quick action links.
- Fixed `isBanned` broken Prisma field reference in token list API.
- Migrated all pages from local `useToast` to global `useToastContext`.

**Decisions & rationale:**
- The global ToastProvider approach was chosen over per-page toast state to prevent toast context loss during page navigations and enable cross-component notifications (e.g. wallet connection toast visible while navigating).
- Cloudinary upload uses a two-step signed flow: server generates a signed request, client uploads directly to Cloudinary CDN — zero secrets exposed to the browser.
- WalletButton defaults to BNB Testnet (chain ID 97) during development for safe testing.

**Next steps:**
- Build the landing page with marketing copy.
- Polish responsive layouts and add micro-animations.
- Wire up admin dashboard features.

