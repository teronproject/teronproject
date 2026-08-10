import Link from "next/link";

export const metadata = {
  title: "Risk Disclosure — Teron",
  description: "Teron Risk Disclosure. Understand the financial, technical, and regulatory risks of creating and holding digital tokens on BNB Smart Chain before using our platform.",
  keywords: "crypto risk disclosure, BNB Chain risks, token creation risks, smart contract risks, blockchain investment risks, digital asset risks",
};

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/legal" className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-4 font-medium inline-block hover:text-accent transition-colors">← Legal</Link>
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Risk Disclosure
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
              Digital assets carry significant risks. Before using Teron to create or interact with tokens on BNB Smart Chain, you should carefully consider the following risk factors. This disclosure does not cover every possible risk. You should do your own research and seek professional advice where appropriate.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. Market and Financial Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The value of digital tokens is highly volatile. Token prices can rise or fall dramatically within short periods due to market sentiment, trading volume, regulatory announcements, and external economic factors.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Tokens created on Teron have no inherent financial value. Their market value depends entirely on demand, which is unpredictable. There is no guarantee that any token will maintain value or be tradable on secondary markets.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              You should never invest more than you can afford to lose. Past performance of any digital asset does not indicate future results.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. Smart Contract Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Smart contracts are immutable programs on the blockchain. Once deployed, they cannot be modified, patched, or upgraded. If a vulnerability exists in a smart contract, there is no way to fix it after deployment.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              While Teron uses standard and well-tested contract templates for BEP-20 token creation, no software is guaranteed to be free of bugs. Interacting with any smart contract carries the risk of unexpected behavior and potential loss of funds.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Blockchain Network Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              BNB Smart Chain is a decentralized network maintained by independent validators. Teron does not control the BNB Chain network and cannot guarantee its performance, uptime, or security.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Risks include network congestion, transaction delays, increased gas fees, chain reorganizations, hard forks, and potential network downtime. These events can affect the deployment, transfer, and trading of tokens.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Wallet and Key Management Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Your Web3 wallet is the only way to access and manage your deployed tokens. If you lose access to your wallet — through lost private keys, forgotten seed phrases, or compromised accounts — your tokens and smart contracts may become permanently inaccessible.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron does not have access to your private keys and cannot help you recover your wallet. You are solely responsible for the security of your wallet credentials.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Regulatory Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The legal and regulatory landscape for digital tokens and cryptocurrencies is evolving. Governments and regulatory bodies may introduce new laws that affect your ability to create, hold, transfer, or trade tokens.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Regulatory changes in your jurisdiction could render certain token activities illegal or subject to new compliance requirements. You are responsible for understanding and following the laws applicable to you. Teron does not provide legal advice regarding regulatory compliance.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Liquidity Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Newly created tokens typically have no liquidity. This means there may be no buyers for your token, making it impossible to sell or convert to other assets. Adding liquidity to decentralized exchanges is the creator's responsibility and carries its own set of risks, including impermanent loss.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Counterparty Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              When interacting with tokens created by other users on Teron, you should be aware that Teron does not audit, verify, or endorse any token project. Token creators may abandon projects, misrepresent their intentions, or engage in fraudulent behavior. Always do your own research before purchasing or interacting with any token.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">8. Technology Risk</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Blockchain technology is still maturing. Risks include software bugs, protocol vulnerabilities, mining or validation attacks, and unforeseen interactions between smart contracts. The Teron platform itself may experience downtime, errors, or security incidents despite our best efforts to maintain reliable service.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">9. Irreversibility of Transactions</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              All transactions on BNB Smart Chain are final and irreversible. Once confirmed, a transaction cannot be undone by any party, including Teron. This applies to token deployments, transfers, payments, and all other blockchain interactions. Always verify transaction details carefully before signing with your wallet.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">10. Contact</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you have questions about the risks described in this document, contact us at:
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
