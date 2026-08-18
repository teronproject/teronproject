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
      from: `"Teron" <${process.env.EMAIL_USER}>`,
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

// ── Email UI Templates ──

const getEmailHeader = (subtitle = "") => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; background: #050403; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="https://teron.io/maillogo.png" alt="Teron" height="28" style="margin-bottom: 16px; display: inline-block;" />
        ${subtitle ? `<p style="color: #eab308; font-size: 11px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">${subtitle}</p>` : ''}
      </div>
      <div style="background: #0a0a0a; border: 1px solid #1f1f22; border-radius: 20px; padding: 32px; margin-bottom: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
`;

const getEmailFooter = () => `
      </div>
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #1f1f22;">
        <p style="color: #71717a; font-size: 13px; margin: 0 0 16px 0; font-weight: 500;">
          <a href="https://teron.io" style="color: #a1a1aa; text-decoration: none; margin: 0 12px;">Website</a>
          <a href="https://x.com/teronapp" style="color: #a1a1aa; text-decoration: none; margin: 0 12px;">X (Twitter)</a>
          <a href="https://t.me/teron_io" style="color: #a1a1aa; text-decoration: none; margin: 0 12px;">Telegram</a>
        </p>
        <p style="color: #52525b; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} Teron. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>
`;

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
    ${getEmailHeader("Token Deployment")}
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #fafafa; font-size: 20px; margin: 0; font-weight: 600;">Deployment Successful!</h2>
          <p style="color: #a1a1aa; font-size: 14px; margin: 8px 0 0; line-height: 1.5;">
            Your token <strong style="color: #eab308;">${tokenName} (${symbol})</strong> has been successfully deployed to the BNB Smart Chain.
          </p>
        </div>

        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Token</td>
              <td style="color: #fafafa; font-size: 13px; font-weight: 500; text-align: right; padding: 10px 0;">${tokenName} (${symbol})</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0; border-top: 1px solid #1f1f22;">Supply</td>
              <td style="color: #fafafa; font-size: 13px; font-weight: 500; text-align: right; padding: 10px 0; border-top: 1px solid #1f1f22;">${Number(totalSupply).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0; border-top: 1px solid #1f1f22;">Contract</td>
              <td style="color: #eab308; font-size: 12px; font-family: ui-monospace, monospace; text-align: right; padding: 10px 0; border-top: 1px solid #1f1f22; word-break: break-all;">
                <a href="${bscscanUrl}" style="color: #eab308; text-decoration: none;">${contractAddress}</a>
              </td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0; border-top: 1px solid #1f1f22;">Verified</td>
              <td style="color: ${verified ? '#22c55e' : '#f59e0b'}; font-size: 13px; font-weight: 500; text-align: right; padding: 10px 0; border-top: 1px solid #1f1f22;">${verified ? '✓ Verified' : '⏳ Pending'}</td>
            </tr>
            ${metadataSubmitted ? `
            <tr>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0; border-top: 1px solid #1f1f22;">Metadata</td>
              <td style="color: #22c55e; font-size: 13px; font-weight: 500; text-align: right; padding: 10px 0; border-top: 1px solid #1f1f22;">✓ Submitted</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${bscscanUrl}" style="display: inline-block; background: #eab308; color: #050403; font-weight: 600; font-size: 14px; padding: 12px 32px; border-radius: 100px; text-decoration: none;">
            View on BscScan
          </a>
        </div>
        
        <div style="text-align: center;">
          <a href="${txUrl}" style="color: #71717a; font-size: 11px; text-decoration: none; border-bottom: 1px solid #27272a; padding-bottom: 2px;">
            Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}
          </a>
        </div>
    ${getEmailFooter()}
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
      <td style="color: #fafafa; font-size: 13px; padding: 12px 0; border-top: 1px solid #1f1f22;">${s.name}</td>
      <td style="color: #fafafa; font-size: 13px; font-weight: 500; text-align: right; padding: 12px 0; border-top: 1px solid #1f1f22;">${Number(s.amountBnb).toFixed(4)} BNB</td>
    </tr>
  `).join("");

  const html = `
    ${getEmailHeader("Payment Receipt")}
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #fafafa; font-size: 20px; margin: 0; font-weight: 600;">Payment Confirmed</h2>
          <p style="color: #a1a1aa; font-size: 14px; margin: 8px 0 0; line-height: 1.5;">
            Premium services for <strong style="color: #eab308;">${tokenName} (${symbol})</strong>
          </p>
        </div>

        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 0 0 12px 0;">Service</td>
              <td style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: right; padding: 0 0 12px 0;">Amount</td>
            </tr>
            ${serviceRows}
            <tr>
              <td style="color: #fafafa; font-size: 14px; font-weight: 600; padding: 16px 0 4px 0; border-top: 1px dashed #333;">Total Paid</td>
              <td style="color: #eab308; font-size: 14px; font-weight: 600; text-align: right; padding: 16px 0 4px 0; border-top: 1px dashed #333;">${Number(totalBnb).toFixed(4)} BNB</td>
            </tr>
          </table>
        </div>

        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">Transaction Hash</p>
          <a href="${txUrl}" style="color: #eab308; font-size: 12px; font-family: ui-monospace, monospace; text-decoration: none; word-break: break-all;">${paymentTxHash}</a>
        </div>

        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 16px;">
          <p style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">Paid From Wallet</p>
          <p style="color: #fafafa; font-size: 12px; font-family: ui-monospace, monospace; margin: 0; word-break: break-all;">${walletAddress}</p>
        </div>
    ${getEmailFooter()}
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
    ${getEmailHeader("Contact Form")}
        <h2 style="color: #fafafa; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; padding-bottom: 16px; border-bottom: 1px solid #1f1f22;">Contact Details</h2>
        
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; width: 100px;">Name:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Email:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${email}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Telegram:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${telegram || "N/A"}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Subject:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${subject}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0;">Message</h3>
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; color: #d4d4d8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
    ${getEmailFooter()}
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
    ${getEmailHeader()}
        <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">Message Received</h2>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello ${name},
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for reaching out to Teron. We have received your message and our team will review it shortly. We typically respond within 24-48 hours.
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0;">
          Best regards,<br/>
          <strong style="color: #fafafa; font-weight: 500;">The Teron Team</strong>
        </p>
    ${getEmailFooter()}
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
    ${getEmailHeader("Investment Inquiry")}
        <h2 style="color: #fafafa; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; padding-bottom: 16px; border-bottom: 1px solid #1f1f22;">Inquiry Details</h2>
        
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; width: 120px;">Name:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Email:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${email}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Role:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${role || "N/A"}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Company/Fund:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${company || "N/A"}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Telegram:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${telegram || "N/A"}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">LinkedIn:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${linkedin || "N/A"}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Amount:</td>
              <td style="color: #eab308; font-size: 14px; font-weight: 600; padding: 8px 0; border-top: 1px solid #1f1f22;">${amount}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Timeline:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${timeline || "N/A"}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0;">Background & Message</h3>
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; color: #d4d4d8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
    ${getEmailFooter()}
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
    ${getEmailHeader()}
        <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">Inquiry Received</h2>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello ${name},
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for your interest in partnering with Teron. We have received your inquiry and our team will review it shortly. We typically respond within 24-48 hours.
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0;">
          Best regards,<br/>
          <strong style="color: #fafafa; font-weight: 500;">The Teron Team</strong>
        </p>
    ${getEmailFooter()}
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
    ${getEmailHeader()}
        <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">Assistance Request Received</h2>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello,
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          We received your request for BNB gas assistance to deploy your token. Our team will review your project and get back to you${telegram ? ` via Telegram (@${telegram})` : ` via this email`} soon.
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0;">
          Best regards,<br/>
          <strong style="color: #fafafa; font-weight: 500;">The Teron Team</strong>
        </p>
    ${getEmailFooter()}
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
    ${getEmailHeader("Assistance Request")}
        <h2 style="color: #fafafa; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; padding-bottom: 16px; border-bottom: 1px solid #1f1f22;">Request Details</h2>
        
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; width: 120px;">Email:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Telegram:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22;">${telegram || "N/A"}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Wallet:</td>
              <td style="color: #fafafa; font-size: 14px; font-weight: 500; padding: 8px 0; border-top: 1px solid #1f1f22; word-break: break-all;">${walletAddress}</td>
            </tr>
            <tr>
              <td style="color: #71717a; font-size: 12px; padding: 8px 0; border-top: 1px solid #1f1f22;">Required BNB:</td>
              <td style="color: #eab308; font-size: 14px; font-weight: 600; padding: 8px 0; border-top: 1px solid #1f1f22;">${totalBnbCost} BNB</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0;">Project Description</h3>
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 20px; color: #d4d4d8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${description || "No description provided."}</div>
    ${getEmailFooter()}
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
    ${getEmailHeader()}
        <h2 style="color: #fafafa; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">Request Status Update</h2>
        
        <div style="margin-bottom: 24px;">
          <span style="display: inline-block; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; background-color: ${statusColor}15; color: ${statusColor}; border: 1px solid ${statusColor}30; text-transform: uppercase; letter-spacing: 1px;">
            ${status}
          </span>
        </div>
        
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello,
        </p>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          ${statusMessage}
        </p>

        ${adminNotes ? `
        <div style="background: #111; border: 1px solid #1f1f22; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Message from Admin</p>
          <p style="color: #fafafa; font-size: 14px; line-height: 1.5; margin: 0;">${adminNotes}</p>
        </div>
        ` : ''}

        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0;">
          Best regards,<br/>
          <strong style="color: #fafafa; font-weight: 500;">The Teron Team</strong>
        </p>
    ${getEmailFooter()}
  `;

  return sendEmail({
    to: email,
    subject: `Your BNB Assistance Request is ${status}`,
    html,
  });
}
