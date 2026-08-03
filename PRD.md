# Teron — Product Requirements Document (PRD)

> **Last updated:** 2026-08-04
> **Status:** Phase 1 — Active Development

---

## Product Summary

Teron (teron.io) is a premium Web3 launch platform focused on making BNB Chain token creation simple, secure, and approachable. It provides a complete launch ecosystem — not a bare token generator — where users can create BEP-20 tokens, verify contracts, publish public project profiles, earn rewards, complete tasks, and manage everything from a single dashboard. The platform targets an underserved niche of BNB Chain builders who want a trustworthy, premium-quality launch experience instead of generic, template-based token generators.

---

## Target Audience

- **BNB Chain project founders** launching new BEP-20 tokens
- **Indie crypto builders** who need a reliable, well-designed deployment tool
- **Small teams** launching tokens who want a premium, trustworthy launch experience instead of a generic token generator
- **Community leaders** creating tokens for DAOs, clubs, or experimental projects

---

## Phase 1 Scope Boundary

**Phase 1 is BNB Chain only.** Multi-chain expansion (Ethereum, Polygon, Arbitrum, etc.) is explicitly deferred to Phase 2+. This is a deliberate decision to validate the product and build community before expanding.

---

## Feature List

### Must-Have for Launch (Phase 1)

1. **Wallet Connection & Identity**
   - Connect via WalletConnect (MetaMask, Trust Wallet, etc.)
   - Automatic user profile creation on first connect
   - BNB Chain detection and enforcement
   - Real-time wallet balance display

2. **Token Creator (BNB Chain)**
   - Multi-step wizard for BEP-20 token creation
   - Token name, symbol, decimals, total supply configuration
   - Logo and banner upload (via Cloudinary)
   - Social links (website, X, Telegram, Discord, GitHub)
   - Transaction simulation before deployment
   - Real on-chain contract deployment

3. **Contract Verification Service**
   - Optional paid service (~$2 in BNB, admin-configurable)
   - BscScan-verified source code
   - Payment to configured cold wallet

4. **Metadata/Image Publishing Service**
   - Optional paid service (~$3 in BNB, admin-configurable)
   - On-chain metadata and image publishing
   - Payment to configured cold wallet

5. **TERR Reward System**
   - Automatic TERR reward after confirmed deployments
   - TERR balance tracking per user
   - Reward grants for task completion

6. **Public Token Pages** (`/t/{token_name}`)
   - Logo, banner, description, contract address
   - Supply, decimals, socials
   - Roadmap, tokenomics, contact info
   - Copy-contract and add-to-wallet buttons
   - SEO-optimized with meta/OG tags

7. **Leaderboard**
   - Recently created tokens
   - Featured launches
   - Sortable, filterable, paginated
   - Driven by real deployment data

8. **Task Center**
   - Admin-managed community tasks
   - Follow, like, repost, join, referral tasks
   - Verification methods per task
   - TERR rewards on completion

9. **User Dashboard**
   - Deployment history
   - TERR balance and reward history
   - Task completion status
   - Settings management

10. **Admin Dashboard**
    - User management
    - Deployment management
    - Payment tracking
    - Reward distribution management
    - Task CRUD (create/edit/disable)
    - Pricing configuration (all prices admin-editable)
    - Feature flags (independent module toggle)
    - Maintenance mode
    - Custom monitoring dashboard
    - SEO settings
    - Legal content management
    - BNB assistance request management

11. **Custom Monitoring System**
    - All errors logged to PostgreSQL
    - Severity levels, timestamps, affected users
    - Stack traces, retry actions, audit logs
    - Admin monitoring dashboard with filtering

12. **Security**
    - Zod validation on client + server
    - Rate limiting via Upstash Redis
    - CSRF protection
    - Audit logging
    - RBAC for admin
    - Secure Cloudinary upload (signed)
    - Encrypted sensitive config

13. **Legal & Compliance Pages**
    - Privacy Policy, Terms of Service, Cookie Policy
    - Disclaimer, Risk Disclosure, AML/KYC Policy
    - Reward Terms, Security Policy
    - Responsible Disclosure, Copyright, DMCA

14. **SEO**
    - Dynamic meta tags per page
    - Open Graph and Twitter Card support
    - Sitemap and robots.txt
    - Structured data for token pages

### Can Follow Shortly After

- **Swap Page** (`/swap`): TERR → TER exchange. Ships in codebase but feature-flagged off until TER has liquidity.
- **Advanced Analytics**: Deeper platform metrics in admin dashboard
- **Email Notifications**: Deployment confirmations, admin alerts (infrastructure ready in Phase 1)

---

## Core User Flow

1. **Connect wallet** — User connects via WalletConnect-supported wallet
2. **Detect BNB Chain and balance** — Platform verifies correct chain and reads BNB balance
3. **Complete token creation wizard** — Multi-step form: basic info → tokenomics → media → socials → review
4. **Select optional paid services** — Verification ($2 BNB) and/or metadata publishing ($3 BNB)
5. **Validate balance and requirements** — Check sufficient BNB for gas + selected services
6. **Deploy token** — Simulate transaction, then deploy BEP-20 contract on-chain
7. **Verify contract** (optional, paid) — Submit for BscScan verification
8. **Publish metadata** (optional, paid) — Publish on-chain metadata and images
9. **Receive TERR reward** — Automatic grant after confirmed (not just submitted) deployment
10. **Manage project from dashboard** — View history, edit profile, track rewards
11. **Public page live** — Token profile available at `/t/{token_name}`

---

## Business Model & Pricing

| Service | Price | Notes |
|---------|-------|-------|
| Token deployment | **Free** | User pays only blockchain gas fees |
| Contract verification | **≈$2 in BNB** | Transferred to Teron's cold wallet |
| Metadata/image publishing | **≈$3 in BNB** | Transferred to Teron's cold wallet |

> **Critical rule:** All prices are admin-configurable from the admin dashboard. No price is ever hardcoded in the codebase.

---

## Success Criteria for Phase 1

- [ ] A user can connect a real wallet, see accurate real-time BNB Chain balance and chain detection, complete the wizard, and deploy a real BEP-20 token on-chain
- [ ] Optional paid verification and metadata publishing work against real BNB payments to the configured cold wallet, with admin-configurable pricing
- [ ] TERR is granted automatically and correctly after confirmed (not just submitted) deployments
- [ ] Public token page at `/t/{token_name}` renders correctly with real on-chain and database-backed data, and is SEO-optimized
- [ ] Leaderboard reflects real deployments, sortable and paginated
- [ ] Task center is fully admin-manageable and distributes TERR correctly on verified completion
- [ ] Admin dashboard can independently pause each module, edit pricing, manage all entities, and view the custom monitoring dashboard
- [ ] All legal pages exist and are reachable
- [ ] Every screen is responsive, on-brand, and free of mocked data
- [ ] All five governing documents are accurate and current

---

## Explicit Non-Goals for Phase 1

- **Multi-chain support** — Phase 2+. No Ethereum, Polygon, Arbitrum, or any chain besides BNB Chain.
- **TER/TERR public swap activation** — The swap page ships but stays feature-flagged off until TER has liquidity.
- **Mobile native apps** — Web-only for Phase 1. Responsive mobile web is required.
- **Third-party monitoring vendor** — Custom in-house monitoring only.
- **Public API for external developers** — Internal API routes only.
- **Token trading/DEX features** — Teron is a launch platform, not an exchange (swap excepted when activated).
- **KYC/identity verification for users** — Wallet-based identity only in Phase 1.
