import Link from "next/link";
import CanvasBackground from "@/components/landing/CanvasBackground";

export const metadata = {
  title: "Token Swap - Teron",
  description: "Learn how to access the Teron token swap, convert your rewards, and connect your wallet.",
};

export default function SwapInfoPage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <CanvasBackground />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Swap & Convert Info
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            Everything you need to know about swapping tokens within the Teron ecosystem. Convert your earned rewards easily securely from your dashboard.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-legal">
            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. Getting Started</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              To utilize the Teron swap functionality, you must first connect your Web3 wallet securely to the platform. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Once connected, you can access your personal portal at <Link href="/dashboard" className="text-accent hover:underline font-medium">/dashboard</Link>. This is your command center for all ecosystem features, including swapping.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. Accessing the Swap Interface</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The active swap interface can be found exclusively inside your dashboard at <Link href="/dashboard/swap" className="text-accent hover:underline font-medium">/dashboard/swap</Link>. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              The swap interface is deeply integrated with your connected wallet, meaning you can only view and interact with your own balances and swap allocations. No other user can see your swap history or balances.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. The Teron Token Ecosystem</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The Teron ecosystem operates on a dual-token model designed to reward active participants while maintaining a sustainable mainnet economy:
            </p>
            <ul className="list-none space-y-3 mb-10 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">
                <span className="text-white font-medium">TER Token:</span> The primary utility and governance token of the Teron platform. It is used to pay for premium services, unlock advanced analytics, and vote on platform upgrades.
              </li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">
                <span className="text-white font-medium">TERR (Reward Token):</span> A non-transferable internal accounting token that you earn by completing tasks and contributing to the ecosystem.
              </li>
            </ul>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Earning Plan & Token Growth</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron’s earning plan is designed to directly align user rewards with the growth of the platform. By participating in community tasks, deploying smart contracts, and actively testing new features, you help expand Teron’s reach and reliability. In return, you are compensated with TERR.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              As the platform generates revenue from premium token deployments and on-chain services, a portion of these fees is dedicated to supporting the TER ecosystem. This sustainable revenue model ensures that the reward pool has tangible backing, allowing the token ecosystem to grow organically alongside platform adoption.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Converting Rewards</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The swap interface allows you to seamlessly convert your earned reward tokens (TERR) into mainnet TER tokens or other supported assets once they become available.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Please note that certain swaps may only be available during specific conversion windows or after the official token launch. You will always see the real-time conversion rates and availability directly within the dashboard swap interface.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Transaction Security</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              All swap operations require a cryptographic signature from your connected Web3 wallet. Teron does not have access to your private keys and cannot initiate swaps on your behalf. Always double-check the transaction details in your wallet before approving any swap or token approval prompt.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Need Help?</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you have any questions about swap rates, token contracts, or encounter an issue while interacting with the swap interface, please reach out to our support team.
            </p>
            <p className="text-text-secondary leading-relaxed">
              <span className="text-white">Email:</span> teronproject@gmail.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
