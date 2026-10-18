/**
 * Environment variable management
 * Centralized configuration for the application
 */

/** Parse a boolean-ish env var: "1", "true", "yes", "on" are truthy. */
function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

/** Parse a positive integer env var, falling back when absent or invalid. */
function parseIntOr(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const nodeEnv = process.env.NODE_ENV || "development";

export const env = {
  // Server
  port: parseIntOr(process.env.PORT, 3001),
  nodeEnv,
  isProduction: nodeEnv === "production",
  isDevelopment: nodeEnv === "development",

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  /** Required in production when Stripe is configured — verifies webhook signatures. */
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  /**
   * Canonical storefront URL. Used to build Stripe redirect URLs and to
   * allow-list `successUrl` / `cancelUrl` submitted by the browser.
   * Accepts a comma-separated list of origins.
   */
  frontendUrl: process.env.FRONTEND_URL,

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  /**
   * Escape hatch that lets checkout trust the price sent by the client.
   *
   * This exists purely so the storefront can be demoed against an in-memory
   * fallback with no database attached. It is force-disabled in production and
   * must never be enabled there: it would let anyone check out at EGP 0.01.
   */
  allowUnverifiedPrices:
    parseBoolean(process.env.ALLOW_UNVERIFIED_PRICES) && nodeEnv !== "production",
};

/** True when a usable Stripe secret key is present. */
export function isStripeConfigured(): boolean {
  const key = env.stripeSecretKey;
  return !!key && key.startsWith("sk_");
}

export const isProduction = env.isProduction;
export const isDevelopment = env.isDevelopment;
