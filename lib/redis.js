import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Upstash Redis client singleton.
 */

const globalForRedis = globalThis;

export const redis =
  globalForRedis.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

/**
 * Rate limiter factory.
 * Creates a rate limiter for a specific route/purpose.
 *
 * @param {object} options
 * @param {string} options.prefix - Unique prefix for this limiter (e.g., "api_deploy")
 * @param {number} [options.requests=10] - Max requests per window
 * @param {string} [options.window="60s"] - Time window (e.g., "10s", "60s", "1h")
 * @returns {Ratelimit}
 */
export function createRateLimiter({
  prefix,
  requests = 10,
  window = "60s",
}) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `teron:ratelimit:${prefix}`,
    analytics: true,
  });
}

export default redis;
