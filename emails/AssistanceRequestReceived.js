/**
 * Assistance Request Received Email Template
 * Sent to users when their BNB assistance request is submitted.
 */
export default function AssistanceRequestReceived({
  walletAddress = "",
  requestId = "",
}) {
  return (
    <div>
      <h1>Assistance Request Received</h1>
      <p>
        We&apos;ve received your BNB assistance request and our team will review
        it shortly.
      </p>
      <div>
        <p><strong>Request ID:</strong> {requestId}</p>
        <p><strong>Wallet:</strong> {walletAddress}</p>
      </div>
      <p>
        You can check the status of your request from the{" "}
        <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>Teron Dashboard</a>.
      </p>
      <hr />
      <p style={{ fontSize: "12px", color: "#888" }}>
        Teron — Premium Web3 Token Launch Platform
      </p>
    </div>
  );
}
