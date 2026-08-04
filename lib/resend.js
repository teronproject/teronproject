import { Resend } from "resend";

/**
 * Resend email client singleton.
 * Used for transactional email (deployment confirmations, admin alerts, etc.)
 */

const globalForResend = globalThis;

export const resend =
  globalForResend.resend ??
  new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend;
}

/**
 * Send an email using Resend.
 *
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {import("react").ReactElement} options.react - React Email component
 * @returns {Promise<object>}
 */
export async function sendEmail({ to, subject, react }) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@teron.io",
    to,
    subject,
    react,
  });
}

export default resend;
