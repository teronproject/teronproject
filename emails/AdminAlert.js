/**
 * Admin Alert Email Template
 * Sent to admins for critical events (payment issues, security events, etc.)
 */
export default function AdminAlert({
  alertType = "GENERAL",
  severity = "MEDIUM",
  message = "",
  affectedUser = "",
  timestamp = new Date().toISOString(),
}) {
  return (
    <div>
      <h1>⚠️ Admin Alert: {alertType}</h1>
      <div style={{
        padding: "12px",
        borderLeft: severity === "CRITICAL" ? "4px solid #ef4444" : "4px solid #f59e0b",
      }}>
        <p><strong>Severity:</strong> {severity}</p>
        <p><strong>Type:</strong> {alertType}</p>
        <p><strong>Message:</strong> {message}</p>
        {affectedUser && <p><strong>Affected User:</strong> {affectedUser}</p>}
        <p><strong>Timestamp:</strong> {timestamp}</p>
      </div>
      <p>
        Review in the{" "}
        <a href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/monitoring`}>
          Admin Monitoring Dashboard
        </a>.
      </p>
      <hr />
      <p style={{ fontSize: "12px", color: "#888" }}>
        Teron Admin — Do not reply to this email
      </p>
    </div>
  );
}
