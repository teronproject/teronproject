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
    subject: `${tokenName} (${symbol}) - Deployed Successfully!`,
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
          <h1 style="color: #eab308; font-size: 24px; margin: 0;">Teron</h1>
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
    subject: `Payment Receipt - ${tokenName} (${symbol})`,
    html,
  });
}

/**
 * Send contact form submission to admin
 */
export async function sendContactAdminEmail({ name, email, telegram, subject, message }) {
  const adminEmail = process.env.EMAIL_USER;
  if (!adminEmail) return { success: false, message: "Admin email not configured" };

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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
          <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">New Contact Submission</p>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #eab308; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid #27272a; padding-bottom: 16px;">Contact Details</h2>
          
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; width: 100px;">Name:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Email:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${email}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Telegram:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${telegram || "N/A"}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Subject:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${subject}</td>
              </tr>
            </table>
          </div>

          <h3 style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px 0;">Message</h3>
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Contact from ${name}: ${subject}`,
    html,
  });
}

/**
 * Send contact auto-reply to user
 */
export async function sendContactUserEmail({ name, email }) {
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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0;">Message Received</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello ${name},
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for reaching out to Teron. We have received your message and our team will review it shortly. We typically respond within 24-48 hours.
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
            Best regards,<br/>The Teron Team
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "We received your message - Teron",
    html,
  });
}

/**
 * Send investment form submission to admin
 */
export async function sendInvestmentAdminEmail({ name, email, telegram, role, company, linkedin, amount, timeline, message }) {
  const adminEmail = process.env.EMAIL_USER;
  if (!adminEmail) return { success: false, message: "Admin email not configured" };

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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
          <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">New Investment Inquiry</p>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #eab308; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid #27272a; padding-bottom: 16px;">Inquiry Details</h2>
          
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; width: 120px;">Name:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Email:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${email}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Role:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${role || "N/A"}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Company/Fund:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${company || "N/A"}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Telegram:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${telegram || "N/A"}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">LinkedIn:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${linkedin || "N/A"}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Amount:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a; font-weight: 600;">${amount}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Timeline:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${timeline || "N/A"}</td>
              </tr>
            </table>
          </div>

          <h3 style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px 0;">Background & Message</h3>
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Investment Inquiry from ${name} - ${amount}`,
    html,
  });
}

/**
 * Send investment auto-reply to user
 */
export async function sendInvestmentUserEmail({ name, email }) {
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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0;">Inquiry Received</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello ${name},
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for your interest in investing in Teron. We have received your inquiry and our team will review it shortly. We typically respond within 24-48 hours.
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
            Best regards,<br/>The Teron Team
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "We received your investment inquiry - Teron",
    html,
  });
}

/**
 * Send assistance request auto-reply to user
 */
export async function sendAssistanceUserEmail({ email, telegram }) {
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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0;">Assistance Request Received</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello,
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            We received your request for BNB assistance to deploy your token. Our team will review your project and get back to you${telegram ? ` via Telegram (@${telegram})` : ` via this email`} soon.
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
            Best regards,<br/>The Teron Team
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "BNB Assistance Request Received - Teron",
    html,
  });
}

/**
 * Send assistance request to admin
 */
export async function sendAssistanceAdminEmail({ email, telegram, walletAddress, description, totalBnbCost }) {
  const adminEmail = process.env.EMAIL_USER;
  if (!adminEmail) return { success: false, message: "Admin email not configured" };

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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
          <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">New BNB Assistance Request</p>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #eab308; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid #27272a; padding-bottom: 16px;">Request Details</h2>
          
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; width: 120px;">Email:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Telegram:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${telegram || "N/A"}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Wallet:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a;">${walletAddress}</td>
              </tr>
              <tr>
                <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #27272a;">Required BNB:</td>
                <td style="color: #fafafa; font-size: 14px; padding: 8px 0; border-top: 1px solid #27272a; font-weight: 600;">${totalBnbCost} BNB</td>
              </tr>
            </table>
          </div>

          <h3 style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px 0;">Project Description</h3>
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${description || "No description provided."}</div>
        </div>
      </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `BNB Assistance Request - ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`,
    html,
  });
}

/**
 * Send assistance request status update to user
 */
export async function sendAssistanceStatusUpdateEmail({ email, status, adminNotes }) {
  const isApproved = status === "APPROVED" || status === "COMPLETED";
  const statusColor = isApproved ? "#22c55e" : status === "REJECTED" ? "#ef4444" : "#eab308";
  
  const statusMessage = isApproved
    ? "Your request for BNB assistance has been approved! The BNB has been sent to your wallet, and you can now proceed with deploying your token."
    : status === "REJECTED"
    ? "Unfortunately, your request for BNB assistance could not be approved at this time."
    : "The status of your BNB assistance request has been updated.";

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
          <h1 style="color: #fafafa; font-size: 24px; margin: 0;">Teron</h1>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0;">Request Status Update</h2>
          <div style="margin-bottom: 24px;">
            <span style="display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; background-color: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor}40;">
              ${status}
            </span>
          </div>
          
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello,
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            ${statusMessage}
          </p>

          ${adminNotes ? `
          <div style="background: #0f0f14; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Message from Admin</p>
            <p style="color: #fafafa; font-size: 13px; line-height: 1.5; margin: 0;">${adminNotes}</p>
          </div>
          ` : ''}

          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
            Best regards,<br/>The Teron Team
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Your BNB Assistance Request is ${status}`,
    html,
  });
}
