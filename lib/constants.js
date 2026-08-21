/**
 * Teron Constants
 *
 * Non-sensitive, non-price constants used across the app.
 * All prices are stored in PricingConfig (database) and are admin-configurable.
 * Never hardcode a price here.
 */

/** BNB Chain mainnet chain ID */
export const BNB_CHAIN_ID = 56;

/** BNB Chain testnet chain ID */
export const BNB_TESTNET_CHAIN_ID = 97;

/** BEP-20 token standard decimals range */
export const MIN_DECIMALS = 0;
export const MAX_DECIMALS = 18;

/** Token name constraints */
export const TOKEN_NAME_MIN_LENGTH = 1;
export const TOKEN_NAME_MAX_LENGTH = 50;

/** Token symbol constraints */
export const TOKEN_SYMBOL_MIN_LENGTH = 1;
export const TOKEN_SYMBOL_MAX_LENGTH = 11;

/** Maximum supply safe bound (to prevent overflow) */
export const MAX_SUPPLY = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

/** Cloudinary upload constraints */
export const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const MAX_BANNER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "svg"];
export const LOGO_DIMENSIONS = { minWidth: 200, minHeight: 200, maxWidth: 1000, maxHeight: 1000 };
export const BANNER_DIMENSIONS = { minWidth: 1200, minHeight: 300, maxWidth: 2400, maxHeight: 800 };

/** User roles */
export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

/** Deployment statuses */
export const DEPLOYMENT_STATUS = {
  PENDING: "PENDING",
  SIMULATING: "SIMULATING",
  DEPLOYING: "DEPLOYING",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
};

/** Payment statuses */
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
};

/** Payment service types */
export const SERVICE_TYPES = {
  VERIFICATION: "VERIFICATION",
  METADATA: "METADATA",
};

/** Monitoring event types */
export const EVENT_TYPES = {
  ERROR: "ERROR",
  DEPLOYMENT_FAILURE: "DEPLOYMENT_FAILURE",
  WALLET_ERROR: "WALLET_ERROR",
  VALIDATION_FAILURE: "VALIDATION_FAILURE",
  PAYMENT_ISSUE: "PAYMENT_ISSUE",
  API_EXCEPTION: "API_EXCEPTION",
  SECURITY_EVENT: "SECURITY_EVENT",
};

/** Monitoring severity levels */
export const SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

/** Default feature flags (initial seed values) */
export const DEFAULT_FEATURE_FLAGS = {
  token_creation_enabled: true,
  verification_enabled: true,
  metadata_publishing_enabled: true,
  rewards_enabled: true,
  tasks_enabled: true,
  swap_enabled: false, // Off until TER has liquidity
  maintenance_mode: false,
};

/** Reward reasons */
export const REWARD_REASONS = {
  DEPLOYMENT: "DEPLOYMENT",
  TASK: "TASK",
  REFERRAL: "REFERRAL",
};

/** TERR Token */
export const TERR_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TERR_CONTRACT_ADDRESS || "0xc5457424698643d8A643FeFE787488C9aA8FBBF0";
export const TERR_DECIMALS = 18;
export const TERR_SYMBOL = "TERR";
export const TERR_NAME = "Teron";
export const TERR_LOGO_URL = "https://www.teron.io/token.png";
export const MIN_WITHDRAWAL_AMOUNT = 10;
export const WITHDRAWAL_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
