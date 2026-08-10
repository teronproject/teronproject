import Link from "next/link";

export const metadata = {
  title: "Disclaimer — Teron",
  description: "Teron Disclaimer. Important information about the nature of our BNB Chain token creation services, risk acknowledgments, and liability limitations.",
  keywords: "Teron disclaimer, crypto disclaimer, BNB Chain token disclaimer, smart contract risk, token creator liability, blockchain platform disclaimer",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/legal" className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-4 font-medium inline-block hover:text-accent transition-colors">← Legal</Link>
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Disclaimer
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
              Please read this disclaimer carefully before using the Teron platform. By accessing or using teron.io, you acknowledge that you have read, understood, and agree to this disclaimer.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. No Financial Advice</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron is a self-service technology platform for creating BEP-20 tokens on BNB Smart Chain. Nothing on this platform constitutes financial advice, investment advice, trading advice, or any other form of professional advice.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              We do not recommend, endorse, or suggest the creation of any specific token. Token creation, buying, selling, and trading carry inherent financial risks. You should consult qualified financial advisors before making any financial decisions related to digital assets.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. No Guarantees</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron does not guarantee that any token created through our platform will gain value, be listed on any exchange, attract investors, or generate any financial returns. Token value is determined entirely by market forces outside of our control.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              We do not guarantee the performance, uptime, or availability of the platform. While we work to maintain reliable service, blockchain interactions depend on external infrastructure including BNB Chain validators, RPC providers, and block explorers.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Smart Contract Risks</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Smart contracts are programs deployed on a public blockchain. Once deployed, they cannot be modified by Teron or any party. While we use standard, well-tested contract templates, no software is free from potential vulnerabilities.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              You are responsible for understanding the smart contract code that is deployed on your behalf. The source code is publicly available and verified on BscScan when you purchase the verification service. Teron does not provide formal security audits for individual token deployments.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Third-Party Services</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron integrates with third-party services including BNB Smart Chain, BscScan, WalletConnect, and various wallet providers. We are not responsible for the availability, accuracy, or security of these third-party services. Their use is subject to their own terms and privacy policies.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Regulatory Compliance</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Cryptocurrency regulations vary by jurisdiction and are evolving rapidly. You are solely responsible for ensuring that your use of Teron and any tokens you create comply with the laws and regulations applicable to you.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron does not provide legal advice regarding the regulatory status of tokens created through our platform. If you are unsure whether token creation is legal in your jurisdiction, consult a qualified legal professional before using our services.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Token Creator Responsibility</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              As a token creator, you bear full responsibility for how your token is marketed, distributed, and used. This includes any claims you make about your token's utility, value, or purpose.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron provides the technical tools for token creation. We do not review, approve, or endorse any tokens or projects built using our platform. The presence of a token on Teron's leaderboard or profile pages does not imply any endorsement or verification of the project's legitimacy.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              To the maximum extent permitted by law, Teron and its team shall not be liable for any loss of funds, data, revenue, profits, or any indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              This limitation applies regardless of whether the damages arise from contract, negligence, strict liability, or any other legal theory, even if we have been advised of the possibility of such damages.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">8. External Links</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron may contain links to external websites or resources. We do not control and are not responsible for the content, privacy practices, or availability of external sites. Links do not imply endorsement.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">9. Contact</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you have questions about this disclaimer, contact us at:
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
