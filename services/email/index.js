import nodemailer from "nodemailer";

/**
 * Email Service — Gmail SMTP via Nodemailer
 *
 * Uses Google App Passwords for authentication.
 * Env vars: EMAIL_USER, EMAIL_APP_PASSWORD
 */

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send a generic HTML email.
 */
async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("Email credentials not set. Skipping email.");
    return { success: false, message: "Email credentials not configured" };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Teron Protocol" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Send a deployment success email with token info.
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
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #eab308; font-size: 24px; margin: 0;">🚀 Teron</h1>
          <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">Token Deployment Platform</p>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
            <h2 style="color: #fafafa; font-size: 20px; margin: 0;">Deployment Successful!</h2>
            <p style="color: #a1a1aa; font-size: 13px; margin: 8px 0 0;">
              Your token <strong style="color: #eab308;">${tokenName} (${symbol})</strong> has been deployed to BNB Smart Chain.
            </p>
          </div>

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

          <div style="text-align: center;">
            <a href="${bscscanUrl}" style="display: inline-block; background: #eab308; color: #0a0a0f; font-weight: 700; font-size: 13px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
              View on BscScan →
            </a>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${txUrl}" style="color: #71717a; font-size: 11px; text-decoration: none;">
            Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}
          </a>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #27272a;">
          <p style="color: #52525b; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Teron Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `✅ ${tokenName} (${symbol}) — Deployed Successfully!`,
    html,
  });
}

/**
 * Send a payment invoice/receipt email.
 */
export async function sendPaymentInvoiceEmail({
  to,
  tokenName,
  symbol,
  services = [],
  totalBnb,
  paymentTxHash,
  walletAddress,
}) {
  if (!to) return { success: false, message: "No recipient email" };

  const txUrl = `https://bscscan.com/tx/${paymentTxHash}`;

  const serviceRows = services.map(s => `
    <tr>
      <td style="color: #fafafa; font-size: 13px; padding: 10px 0; border-top: 1px solid #27272a;">${s.name}</td>
      <td style="color: #eab308; font-size: 13px; text-align: right; padding: 10px 0; border-top: 1px solid #27272a; font-weight: 600;">${Number(s.amountBnb).toFixed(4)} BNB</td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #eab308; font-size: 24px; margin: 0;">🚀 Teron</h1>
          <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">Payment Receipt</p>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 48px; margin-bottom: 12px;">🧾</div>
            <h2 style="color: #fafafa; font-size: 20px; margin: 0;">Payment Confirmed</h2>
            <p style="color: #a1a1aa; font-size: 13px; margin: 8px 0 0;">
              Premium services for <strong style="color: #eab308;">${tokenName} (${symbol})</strong>
            </p>
          </div>

          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0;">Service</td>
                <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: right; padding: 8px 0;">Amount</td>
              </tr>
              ${serviceRows}
              <tr>
                <td style="color: #fafafa; font-size: 14px; font-weight: 700; padding: 12px 0; border-top: 2px solid #3f3f46;">Total</td>
                <td style="color: #eab308; font-size: 14px; font-weight: 700; text-align: right; padding: 12px 0; border-top: 2px solid #3f3f46;">${Number(totalBnb).toFixed(4)} BNB</td>
              </tr>
            </table>
          </div>

          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <p style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">Transaction Hash</p>
            <a href="${txUrl}" style="color: #eab308; font-size: 11px; font-family: monospace; text-decoration: none; word-break: break-all;">${paymentTxHash}</a>
          </div>

          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 16px;">
            <p style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">Paid From</p>
            <p style="color: #fafafa; font-size: 11px; font-family: monospace; margin: 0; word-break: break-all;">${walletAddress}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #27272a;">
          <p style="color: #52525b; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Teron Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `🧾 Payment Receipt — ${tokenName} (${symbol})`,
    html,
  });
}
