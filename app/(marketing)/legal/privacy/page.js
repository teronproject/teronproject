import CanvasBackground from "@/components/landing/CanvasBackground";

export const metadata = {
  title: "Privacy Policy - Teron",
  description: "Teron Privacy Policy. Learn how we collect, use, and protect your data on our BNB Chain token launch platform. Covers wallet data, analytics, cookies, and your rights.",
  keywords: "Teron privacy policy, crypto privacy, BNB Chain data protection, Web3 privacy, token creator privacy, blockchain platform privacy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CanvasBackground/>
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-tertiary">
            Effective date: August 10, 2026 · Last updated: August 10, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-legal">
            <p className="text-text-secondary leading-relaxed mb-8">
              Your privacy is important to us. This policy explains what information Teron collects, how we use it, and what choices you have. We built Teron with privacy in mind. We collect only what we need to provide our services.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">Wallet Address.</span> When you connect your Web3 wallet, we store your public wallet address. This is your primary identifier on Teron. We never have access to your private keys or seed phrases.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">Profile Information.</span> You may optionally provide a display name, email address, avatar, and social media links. This data is stored in our database and displayed on your profile.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">Token Data.</span> When you create a token, we store the token name, symbol, supply, decimals, contract address, deployment transaction hash, and any profile information you add such as logo, description, website, and social links.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">Transaction Data.</span> We store records of service payments including transaction hashes, amounts, and service types. All blockchain transactions are publicly visible on BNB Chain regardless of our storage.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              <span className="text-white font-medium">Usage Data.</span> We collect basic analytics data including pages visited, referral sources, browser type, and device information. This helps us understand how people use Teron and improve the platform.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. How We Use Your Information</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-none space-y-3 mb-10 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Provide, maintain, and improve the Teron platform</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Display your token profile pages publicly on the leaderboard</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Process premium service payments and send transaction receipts</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Send deployment confirmations and service emails when you provide an email address</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Detect abuse, fraud, and violations of our Terms of Service</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Analyze usage patterns to improve our features and user experience</li>
            </ul>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Data Sharing</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We do not sell your personal data. We do not share your information with advertisers. We may share data with the following categories of third parties only as necessary to provide our services:
            </p>
            <ul className="list-none space-y-3 mb-10 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary"><span className="text-white">Infrastructure providers</span> — hosting, database, and content delivery services</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary"><span className="text-white">BscScan / Etherscan</span> — for contract verification and on-chain metadata submission</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary"><span className="text-white">Email service providers</span> — to send transactional emails such as deployment receipts</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary"><span className="text-white">Analytics providers</span> — to understand platform usage in aggregate</li>
            </ul>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Public Blockchain Data</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              BNB Chain is a public blockchain. Your wallet address, token contracts, transaction history, and token balances are all publicly visible on the blockchain and block explorers like BscScan. This is inherent to how blockchain technology works and is outside of Teron's control.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Data Storage and Security</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We store your data in secure, encrypted databases. We use HTTPS for all communications between your browser and our servers. We follow industry best practices for data protection.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              No system is perfectly secure. While we take reasonable measures to protect your information, we cannot guarantee absolute security. You are responsible for securing your own wallet and credentials.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Cookies</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              We use cookies and similar technologies for authentication, preferences, and analytics. For full details, see our <Link href="/legal/cookies" className="text-accent hover:underline">Cookie Policy</Link>.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the right to access, correct, or delete the personal data we hold about you. You may also have the right to object to or restrict certain processing activities.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              To exercise any of these rights, contact us at teronproject@gmail.com. We will respond to your request within 30 days. Note that data stored on the blockchain cannot be deleted by us or any party, as it is immutable by design.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">8. Data Retention</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              We retain your data for as long as your account is active or as needed to provide our services. If you request account deletion, we will remove your profile data from our database within 30 days. Transaction records and deployed contract information may be retained for legal compliance and audit purposes.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">9. Children</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">10. Changes to This Policy</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              We may update this Privacy Policy from time to time. When we make material changes, we will update the effective date at the top of this page. We encourage you to review this page periodically.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">11. Contact</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              For any privacy-related questions or requests, contact us at:
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
