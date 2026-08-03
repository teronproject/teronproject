/**
 * Monitoring Service
 *
 * Owns: Central error/event logging, severity classification, admin monitoring queries.
 * Every catch block in the app must route errors here — no silent failures.
 */

/**
 * Log a monitoring event.
 * @param {object} event
 * @param {"ERROR"|"DEPLOYMENT_FAILURE"|"WALLET_ERROR"|"VALIDATION_FAILURE"|"PAYMENT_ISSUE"|"API_EXCEPTION"|"SECURITY_EVENT"} event.type
 * @param {"LOW"|"MEDIUM"|"HIGH"|"CRITICAL"} event.severity
 * @param {string} event.message
 * @param {string} [event.stackTrace]
 * @param {string} [event.affectedUserId]
 * @param {object} [event.metadata]
 */
export async function logEvent(event) {
  // TODO: Implement with Prisma — write to MonitoringEvent table
  console.error(`[MONITORING] [${event.severity}] ${event.type}: ${event.message}`);
}

export async function queryEvents(filters) {
  throw new Error("Not implemented");
}
