import { Resend } from "resend";

/**
 * Email Service
 *
 * Sends transactional emails via Resend.
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Teron <noreply@teron.io>";

/**
 * Send a deployment success email.
 *
 * @param {object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.tokenName
 * @param {string} params.symbol
 * @param {string} params.contractAddress
 * @param {string} params.txHash
 * @param {string} params.totalSupply
 * @param {boolean} params.verified - Whether contract was verified on BscScan
 * @param {boolean} params.metadataSubmitted - Whether metadata was submitted
 */
export async function sendDeploymentSuccessEmail({
  to,
  tokenName,
  symbol,
  contractAddress,
  txHash,
  totalSupply,
  verified = false,
  metadataSubmitted = false,
}) {
  if (!to) return { success: false, message: "No recipient email" };
  if (!process.env.RESEND_API_KEY) return { success: false, message: "RESEND_API_KEY not set" };

  const bscscanUrl = `https://bscscan.com/token/${contractAddress}`;
  const txUrl = `https://bscscan.com/tx/${txHash}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #eab308; font-size: 24px; margin: 0;">🚀 Teron</h1>
          <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">Token Deployment Platform</p>
        </div>

        <!-- Main Card -->
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
            <h2 style="color: #fafafa; font-size: 20px; margin: 0;">Deployment Successful!</h2>
            <p style="color: #a1a1aa; font-size: 13px; margin: 8px 0 0;">
              Your token <strong style="color: #eab308;">${tokenName} (${symbol})</strong> has been deployed to BNB Smart Chain.
            </p>
          </div>

          <!-- Token Details -->
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0;">Token</td>
                <td style="color: #fafafa; font-size: 13px; text-align: right; padding: 8px 0;">${tokenName} (${symbol})</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0; border-top: 1px solid #27272a;">Supply</td>
                <td style="color: #fafafa; font-size: 13px; text-align: right; padding: 8px 0; border-top: 1px solid #27272a;">${Number(totalSupply).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0; border-top: 1px solid #27272a;">Contract</td>
                <td style="color: #fafafa; font-size: 11px; font-family: monospace; text-align: right; padding: 8px 0; border-top: 1px solid #27272a; word-break: break-all;">
                  <a href="${bscscanUrl}" style="color: #eab308; text-decoration: none;">${contractAddress}</a>
                </td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0; border-top: 1px solid #27272a;">Verified</td>
                <td style="color: ${verified ? '#22c55e' : '#f59e0b'}; font-size: 13px; text-align: right; padding: 8px 0; border-top: 1px solid #27272a;">${verified ? '✓ Verified' : '⏳ Pending'}</td>
              </tr>
              ${metadataSubmitted ? `
              <tr>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0; border-top: 1px solid #27272a;">Metadata</td>
                <td style="color: #22c55e; font-size: 13px; text-align: right; padding: 8px 0; border-top: 1px solid #27272a;">✓ Submitted</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align: center;">
            <a href="${bscscanUrl}" style="display: inline-block; background: #eab308; color: #0a0a0f; font-weight: 700; font-size: 13px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
              View on BscScan →
            </a>
          </div>
        </div>

        <!-- TX Link -->
        <div style="text-align: center;">
          <a href="${txUrl}" style="color: #71717a; font-size: 11px; text-decoration: none;">
            Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #27272a;">
          <p style="color: #52525b; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Teron Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `✅ ${tokenName} (${symbol}) — Deployed Successfully!`,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, message: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, message: err.message };
  }
}
