import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Teron",
  description: "Read the Teron Terms of Service. Understand your rights and responsibilities when using our BNB Chain token creation platform, smart contract deployment, and BscScan verification services.",
  keywords: "Teron terms of service, BNB Chain terms, token creator agreement, BEP-20 platform terms, smart contract terms, crypto platform terms",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/legal" className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-4 font-medium inline-block hover:text-accent transition-colors">← Legal</Link>
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Terms of Service
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
              Welcome to Teron. By accessing or using our platform at teron.io, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron is a self-service token creation platform built on BNB Smart Chain. We provide tools for creating BEP-20 tokens, deploying smart contracts, and managing token profiles. These terms govern your access to and use of those tools.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. Eligibility</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              You must be at least 18 years old to use Teron. By connecting your wallet and using our services, you confirm that you meet this requirement and that you have the legal capacity to enter into a binding agreement.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              You are responsible for ensuring that your use of Teron complies with the laws and regulations of your jurisdiction. Teron does not offer services in jurisdictions where token creation or cryptocurrency activities are prohibited.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. Account and Wallet</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron uses Web3 wallet authentication. We do not create accounts with usernames and passwords. Your blockchain wallet address serves as your identity on the platform.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              You are solely responsible for keeping your wallet credentials, private keys, and seed phrases secure. Teron does not have access to your private keys and cannot recover them if lost.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Any transaction signed with your wallet is considered authorized by you. We are not liable for any loss resulting from unauthorized access to your wallet.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Services</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron provides the following services on BNB Smart Chain:
            </p>
            <ul className="list-none space-y-3 mb-10 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">BEP-20 token creation with customizable name, symbol, decimals, and supply</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Smart contract compilation and deployment to BNB Chain</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">BscScan contract verification as a premium add-on</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Token profile pages with public project information</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">A project leaderboard and community task system</li>
            </ul>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Fees and Payments</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Token deployment requires paying gas fees directly to the BNB Smart Chain network. Teron does not collect these fees.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Premium services such as contract verification and on-chain metadata have fixed BNB fees displayed before purchase. These fees are sent to our designated cold wallet. All fees are clearly shown before you sign any transaction.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              All payments on the blockchain are final and non-refundable. Once a transaction is confirmed on BNB Chain, it cannot be reversed by Teron or any third party.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Your Responsibilities</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              You agree not to use Teron to create tokens that infringe on intellectual property, impersonate existing projects, promote illegal activities, or mislead investors. You are fully responsible for the tokens you create and any representations you make about them.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron is a tool. We do not endorse, audit, or guarantee the quality, legitimacy, or value of any token created through our platform. The creator of a token holds full responsibility for how it is used and marketed.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Intellectual Property</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The Teron platform, including its code, design, branding, and documentation, is the intellectual property of Teron. You may not copy, modify, distribute, or reverse-engineer any part of the platform without our written consent.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              You retain ownership of any content you upload to the platform, including token logos, descriptions, and social media links. By uploading this content, you grant Teron a non-exclusive license to display it on your public token profile page.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Smart Contract Ownership</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              When you deploy a token through Teron, the smart contract is deployed from your wallet. You are the owner of that contract on the blockchain. Teron does not retain any admin access, ownership keys, or backdoor functions in the deployed contracts.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Once deployed, your smart contract is immutable and operates independently on BNB Chain. Teron cannot modify, pause, or delete your deployed contract.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">8. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted access, error-free operation, or specific outcomes from using our services.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of funds, failed transactions, smart contract bugs, or regulatory actions.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Our total liability to you for any claim related to the platform shall not exceed the amount you paid in fees to Teron in the twelve months preceding the claim.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">9. Termination</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              We reserve the right to suspend or terminate your access to Teron at any time if you violate these terms, engage in fraudulent activity, or if we are required to do so by law. Termination does not affect any tokens or contracts already deployed to the blockchain, as those exist independently on BNB Chain.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">10. Changes to These Terms</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              We may update these terms from time to time. When we make significant changes, we will update the "Last updated" date at the top of this page. Your continued use of Teron after changes are posted constitutes your acceptance of the updated terms.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">11. Contact</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you have questions about these Terms of Service, you can reach us at:
            </p>
            <p className="text-text-secondary leading-relaxed">
              <span className="text-white">Email:</span> legal@teron.io
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
