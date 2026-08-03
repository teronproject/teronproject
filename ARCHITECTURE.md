# Teron — System Architecture & App Flow

> **Last updated:** 2026-08-04
> **Status:** Phase 1 — Active Development
> **Must be kept in sync with the actual codebase at all times.**

---

## Folder Structure

```
teron/
├── PRD.md
├── ARCHITECTURE.md
├── RULES.md
├── DESIGN.md
├── MEMORY.md
├── .env.example
├── next.config.mjs
├── jsconfig.json
├── package.json
├── postcss.config.mjs
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── (static assets, favicons, og-images)
├── app/
│   ├── layout.js                          # Root layout (Inter font, dark theme, providers)
│   ├── page.js                            # Landing page
│   ├── globals.css                        # Tailwind v4 @theme tokens
│   ├── (marketing)/
│   │   ├── layout.js                      # Marketing layout (shared nav/footer)
│   │   ├── about/page.js
│   │   ├── pricing/page.js
│   │   └── legal/
│   │       ├── layout.js                  # Legal pages layout
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
│   │   ├── layout.js                      # App layout (sidebar, wallet state, auth gate)
│   │   ├── create/page.js                 # Token creation wizard
│   │   ├── dashboard/page.js              # User dashboard
│   │   ├── deployments/page.js            # Deployment history
│   │   ├── tasks/page.js                  # Task center
│   │   ├── swap/page.js                   # Feature-flagged TERR→TER swap
│   │   └── settings/page.js              # User settings
│   ├── t/
│   │   └── [token_name]/page.js           # Public token profile page
│   ├── leaderboard/page.js
│   ├── admin/
│   │   ├── layout.js                      # Admin layout (RBAC-gated)
│   │   ├── page.js                        # Admin overview/analytics
│   │   ├── users/page.js
│   │   ├── deployments/page.js
│   │   ├── payments/page.js
│   │   ├── rewards/page.js
│   │   ├── tasks/page.js
│   │   ├── assistance-requests/page.js
│   │   ├── pricing/page.js
│   │   ├── feature-flags/page.js
│   │   ├── monitoring/page.js             # Custom monitoring dashboard
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
├── services/
│   ├── auth/
│   │   └── index.js
│   ├── wallet/
│   │   └── index.js
│   ├── token-deployment/
│   │   └── index.js
│   ├── verification/
│   │   └── index.js
│   ├── metadata-publishing/
│   │   └── index.js
│   ├── rewards/
│   │   └── index.js
│   ├── tasks/
│   │   └── index.js
│   ├── swap/
│   │   └── index.js
│   ├── payments/
│   │   └── index.js
│   ├── monitoring/
│   │   └── index.js
│   ├── seo/
│   │   └── index.js
│   └── admin/
│       └── index.js
├── components/
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Toast.js
│   │   ├── Card.js
│   │   ├── Badge.js
│   │   ├── Tooltip.js
│   │   ├── Select.js
│   │   ├── Table.js
│   │   ├── Skeleton.js
│   │   ├── EmptyState.js
│   │   └── ErrorState.js
│   ├── wizard/
│   │   └── (token creation wizard components)
│   ├── dashboard/
│   │   └── (dashboard-specific components)
│   ├── public-page/
│   │   └── (public token page components)
│   ├── admin/
│   │   └── (admin dashboard components)
│   └── shared/
│       ├── Header.js
│       ├── Footer.js
│       ├── Sidebar.js
│       ├── WalletButton.js
│       └── Logo.js
├── lib/
│   ├── prisma.js
│   ├── redis.js
│   ├── cloudinary.js
│   ├── resend.js
│   ├── wagmi-config.js
│   ├── viem-client.js
│   ├── constants.js
│   └── zod-schemas/
│       ├── token.js
│       ├── user.js
│       ├── payment.js
│       ├── task.js
│       └── common.js
├── hooks/
│   ├── useWallet.js
│   ├── useBalance.js
│   ├── useDeployment.js
│   └── useFeatureFlag.js
└── emails/
    ├── DeploymentConfirmed.js
    ├── AssistanceRequestReceived.js
    └── AdminAlert.js
```

---

## Microservices-Style Domain Boundaries

Each domain under `services/` owns its own business logic, validation, and database access patterns. API routes are thin wrappers — they call into the relevant service, never containing business logic themselves.

| Domain | Owns |
|--------|------|
| `auth` | Wallet-based identity, session creation on first connect, profile auto-creation |
| `wallet` | Balance reads, chain detection, wagmi/viem client orchestration |
| `token-deployment` | Wizard state management, contract deployment, transaction simulation, deployment history |
| `verification` | Paid contract verification flow, payment confirmation, verification status tracking |
| `metadata-publishing` | Paid on-chain metadata/image publishing, Cloudinary upload orchestration |
| `rewards` | TERR grants on confirmed deployment, TERR balance queries, future TERR→TER conversion logic |
| `tasks` | Task definitions (admin CRUD), completion verification, reward distribution for tasks |
| `swap` | TERR→TER exchange logic, feature-flag gating until TER liquidity exists |
| `payments` | BNB payment verification for verification/publishing services, cold wallet transfer confirmation |
| `monitoring` | Central error/event logging, severity classification, admin monitoring queries |
| `seo` | Dynamic metadata generation, Open Graph/Twitter card data, sitemap/robots generation |
| `admin` | Cross-cutting admin operations: feature flags, pricing config, maintenance mode, RBAC checks |

**Rule:** A service module never directly imports another service's internals. Cross-domain communication goes through each service's exported public functions only.

---

## Data Flow Diagrams

### Core Deployment Flow
```
Wallet Connect
    → Chain Detection (must be BNB Chain)
    → Balance Check (real-time BNB balance via viem)
    → Token Wizard (multi-step form validated with Zod)
    → Server-side Validation (re-validate all fields + check duplicate symbols)
    → Transaction Simulation (estimate gas, verify feasibility)
    → Deploy Contract (send transaction via wagmi, wait for confirmation)
    → Verify Contract (optional, paid — send BNB to cold wallet)
    → Publish Metadata (optional, paid — upload to Cloudinary, publish on-chain)
    → Grant TERR Reward (only after tx confirmation, not submission)
    → Dashboard (view deployment, manage project)
```

### Payment Flow
```
User selects paid service (verification or metadata)
    → UI shows price in BNB (read from PricingConfig in DB)
    → User confirms payment
    → Transaction sent to cold wallet
    → Server verifies tx on-chain (viem)
    → Payment record created in DB
    → Service executed (verification or publishing)
    → Audit log entry created
```

### Authentication Flow
```
User clicks "Connect Wallet"
    → WalletConnect modal opens
    → User selects wallet and approves connection
    → wagmi provides wallet address
    → API call to /api/auth/wallet-session
    → Server: check if User exists by wallet address
        → If not: create User with role=USER, TERR balance=0
        → If yes: load existing User
    → Session cookie set
    → Redirect to dashboard
```

---

## API Route Map

### Auth Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/wallet-session` | POST | Create/resume session from wallet connection |

### Wallet Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/wallet/balance` | GET | Read real-time BNB balance for connected wallet |
| `/api/wallet/chain-check` | GET | Verify connected chain is BNB Chain |

### Token Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/tokens/create` | POST | Validate and save token creation form data |
| `/api/tokens/deploy` | POST | Initiate on-chain contract deployment |
| `/api/tokens/simulate` | POST | Simulate deployment transaction (gas estimate) |
| `/api/tokens/[id]` | GET/PATCH | Get or update a specific token |
| `/api/tokens/history` | GET | List deployment history for connected user |

### Verification Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/verification/request` | POST | Submit contract for verification (paid) |

### Metadata Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/metadata/publish` | POST | Publish on-chain metadata/image (paid) |

### Rewards Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/rewards/grant` | POST | Grant TERR reward (server-internal, after deployment confirm) |
| `/api/rewards/balance` | GET | Get TERR balance for connected user |

### Tasks Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/tasks/list` | GET | List available tasks for user |
| `/api/tasks/complete` | POST | Submit task completion for verification |

### Swap Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/swap/execute` | POST | Execute TERR→TER swap (feature-flagged) |

### Leaderboard
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/leaderboard` | GET | Get leaderboard data (recent tokens, featured) |

### Uploads Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/uploads/cloudinary-sign` | POST | Generate signed Cloudinary upload request |

### Payments Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/payments/verify` | POST | Verify BNB payment on-chain |

### Assistance Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/assistance/request` | POST | Submit BNB assistance request |

### Email Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/email/send` | POST | Send transactional email (internal) |

### Monitoring Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/monitoring/log` | POST | Log monitoring event |

### Admin Domain
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/users` | GET/PATCH | List/manage users |
| `/api/admin/deployments` | GET/PATCH | List/manage deployments |
| `/api/admin/payments` | GET | List/manage payments |
| `/api/admin/rewards` | GET/POST | List/manage/distribute rewards |
| `/api/admin/tasks` | GET/POST/PATCH/DELETE | CRUD tasks |
| `/api/admin/pricing` | GET/PATCH | Get/update pricing config |
| `/api/admin/feature-flags` | GET/PATCH | Get/toggle feature flags |
| `/api/admin/monitoring` | GET | Query monitoring events |
| `/api/admin/seo` | GET/PATCH | Manage SEO settings |

---

## Database Schema Summary

Full schema in `prisma/schema.prisma`. Model purposes:

| Model | Purpose |
|-------|---------|
| `User` | Wallet-based identity, profile, role (USER/ADMIN), TERR balance |
| `Token` | Deployed token record: name, symbol, decimals, supply, contract address, chain, status |
| `TokenProfile` | Public page content: logo, banner, description, socials, roadmap, tokenomics |
| `Deployment` | Deployment attempt record: status, gas used, error info, tx hash |
| `Payment` | Payment for verification/metadata services: amount, tx hash, status |
| `RewardGrant` | TERR reward grant: amount, reason (deployment/task), related entity |
| `Task` | Admin-managed task definition: title, verification method, reward amount |
| `TaskCompletion` | User's task completion record: status, verified timestamp |
| `AssistanceRequest` | BNB assistance request: description, status, admin notes |
| `FeatureFlag` | Feature toggle: key, enabled boolean (admin-editable) |
| `PricingConfig` | Service pricing: key, price in BNB, admin-editable |
| `MonitoringEvent` | Logged event: type, severity, message, stack trace, affected user |
| `AuditLog` | Audit trail: actor, action, target entity, before/after state |
| `SwapTransaction` | TERR→TER swap record: amounts, rate, status (for future activation) |

---

## Third-Party Integration Map

| Integration | Purpose | Package(s) |
|-------------|---------|------------|
| wagmi + viem | Wallet connection, chain interaction, balance reads, contract deployment | `wagmi`, `viem` |
| WalletConnect | Multi-wallet connection modal | `@walletconnect/modal`, `@web3modal/wagmi` |
| Cloudinary | Media storage for logos, banners, project images | `cloudinary` |
| Upstash Redis | Rate limiting and caching | `@upstash/redis`, `@upstash/ratelimit` |
| Resend + React Email | Transactional email (confirmations, alerts, assistance) | `resend`, `@react-email/components` |
| PostgreSQL + Prisma | Relational database access | `@prisma/client`, `prisma` |

---

## Deployment & Environment Topology

### Environment Variables Required
See `.env.example` for the full list. Key groups:
- **Database:** `DATABASE_URL`
- **Chain/Wallet:** `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `NEXT_PUBLIC_BNB_RPC_URL`, `COLD_WALLET_ADDRESS`
- **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Upstash:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **Resend:** `RESEND_API_KEY`
- **Admin:** `ADMIN_WALLET_ADDRESSES` (comma-separated)
- **App:** `NEXT_PUBLIC_APP_URL`, `SESSION_SECRET`

### What Runs Where
- **Next.js (App Router):** Single deployment — handles both frontend SSR/CSR and API routes
- **PostgreSQL:** Hosted database (Supabase, Railway, Neon, or self-hosted)
- **Upstash Redis:** Managed Redis (Upstash dashboard)
- **Cloudinary:** Managed media CDN
- **Resend:** Managed email service

---

## How to Add New Features

1. **Identify the domain** the feature belongs to (see domain boundaries table above)
2. **Add service logic** in `services/{domain}/index.js` — all business logic lives here
3. **Add API route** in `app/api/{domain}/` — thin wrapper that calls the service
4. **Add Zod schema** in `lib/zod-schemas/` — shared between client and server
5. **Add UI components** in `components/{area}/` — never put business logic in components
6. **Add page** in `app/{route-group}/` if a new route is needed
7. **Update Prisma schema** if new data models are required
8. **Update this document** to reflect the new structure
9. **Log the change** in `MEMORY.md`

**Never violate domain boundaries** — a service should not import another service's internals. Use exported public functions for cross-domain communication.
