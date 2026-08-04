/**
 * Deployment Confirmed Email Template
 * Sent to users after their token is successfully deployed.
 */
export default function DeploymentConfirmed({
  tokenName = "Token",
  tokenSymbol = "TKN",
  contractAddress = "",
  txHash = "",
  terrReward = "0",
}) {
  return (
    <div>
      <h1>Deployment Confirmed! 🎉</h1>
      <p>
        Your token <strong>{tokenName} ({tokenSymbol})</strong> has been
        successfully deployed on BNB Chain.
      </p>
      <div>
        <p><strong>Contract Address:</strong> {contractAddress}</p>
        <p><strong>Transaction Hash:</strong> {txHash}</p>
        <p><strong>TERR Reward:</strong> +{terrReward} TERR</p>
      </div>
      <p>
        View your token profile and manage your project from the{" "}
        <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>Teron Dashboard</a>.
      </p>
      <hr />
      <p style={{ fontSize: "12px", color: "#888" }}>
        Teron — Premium Web3 Token Launch Platform
      </p>
    </div>
  );
}
