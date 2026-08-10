import CanvasBackground from "@/components/landing/CanvasBackground";

export const metadata = {
  title: "Security Policy - Teron",
  description: "Teron Security Policy. Learn how we protect the platform, our smart contract security approach, infrastructure safeguards, and how to report security vulnerabilities.",
  keywords: "Teron security, blockchain security, smart contract security, crypto platform security, BNB Chain security, vulnerability disclosure",
};

export default function SecurityPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CanvasBackground/>
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Security Policy
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
              Security is a core priority at Teron. We take a straightforward approach to protecting our platform, your data, and the smart contracts deployed through our service. This document outlines our security practices and how you can help.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. Smart Contract Security</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Every token deployed through Teron uses a standard BEP-20 smart contract template. The source code is straightforward, does not include proxy patterns or upgradability, and follows established Solidity best practices.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              We compile contracts using a pinned compiler version (Solidity 0.8.20) with consistent optimization settings. When you purchase contract verification, the exact source code is published to BscScan so anyone can inspect it.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Our contracts do not include hidden mint functions, admin backdoors, pause mechanisms, or blacklist features unless explicitly chosen during token configuration. What you see in the verified source is exactly what runs on the blockchain.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. Platform Infrastructure</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The Teron web application is served over HTTPS with TLS encryption for all data in transit. We use secure, managed database services with encryption at rest. Access to production systems is restricted and protected by multi-factor authentication.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              We follow the principle of least privilege for all internal systems. Sensitive configuration values such as API keys and database credentials are stored as environment variables, not in source code.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Authentication</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron uses Web3 wallet-based authentication. There are no passwords stored on our servers. Authentication is handled through cryptographic signature verification using your wallet.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Session tokens are scoped and expire after inactivity. Admin access requires specific wallet addresses configured in our environment and verified against our database.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Data Protection</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We collect only the data necessary to provide our services. Personal information is stored in encrypted databases with access controls. We do not sell user data to third parties.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              For complete details on what data we collect and how we handle it, see our <Link href="/legal/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Key Management</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Teron never has access to your private keys. All blockchain transactions are signed locally in your Web3 wallet. Your private keys never leave your device.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Premium service payments are sent to a cold wallet address that is not connected to any online systems. This reduces the risk of fund compromise.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Vulnerability Reporting</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you discover a security vulnerability in the Teron platform, we encourage you to report it responsibly. We take all reports seriously and will investigate promptly.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              When reporting a vulnerability, please include:
            </p>
            <ul className="list-none space-y-3 mb-4 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">A clear description of the vulnerability and its potential impact</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Steps to reproduce the issue</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Any relevant screenshots, logs, or proof of concept</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mb-4">
              Please do not publicly disclose vulnerabilities before giving us reasonable time to investigate and patch the issue. We aim to acknowledge reports within 48 hours and provide updates on remediation progress.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Send vulnerability reports to: <span className="text-white">teronproject@gmail.com</span>
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Incident Response</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              In the event of a security incident, we will assess the scope and severity, contain the issue, notify affected users where appropriate, and publish a transparent post-incident report. We believe clear communication during security events builds trust.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">8. User Responsibilities</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Platform security is a shared responsibility. We recommend the following best practices:
            </p>
            <ul className="list-none space-y-3 mb-10 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Use a hardware wallet or a well-maintained software wallet</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Never share your private keys or seed phrases with anyone</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Verify you are on teron.io before connecting your wallet</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Review all transaction details in your wallet before signing</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary">Keep your browser and wallet software updated</li>
            </ul>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">9. Contact</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              For general security questions, contact us at:
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
