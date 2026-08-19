import Link from "next/link";
import Logo from "@/components/ui/Logo";

function LiveLinks() {
  const links = [
    { 
      name: "X (Twitter)", 
      url: "https://x.com/teronapp", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      name: "BNB CHAIN DappBay", 
      url: "https://dappbay.bnbchain.org/detail/teron", 
      icon: (
        <div className="flex items-center gap-2.5 h-fit">
          <img 
            src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png" 
            alt="BNB Chain" 
            width={32} 
            height={32} 
            className="object-contain"
          />
          <div className="flex flex-col text-left justify-center">
            <span className="text-[11px] leading-none font-bold text-[#F3BA2F] tracking-wide mb-0.5">BNB CHAIN</span>
            <span className="text-[16px] leading-none font-bold text-white tracking-tight">DappBay</span>
          </div>
        </div>
      ),
      isCustom: true
    },
    { name: "Soon...", url: null, isSoon: true, icon: "soon" },
    { name: "Soon...", url: null, isSoon: true, icon: "soon" },
  ];

  return (
    <div className="w-full border-b border-border-primary">
      <div className="mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {links.map((link, idx) => {
            const borderClasses = "border-border-primary " +
              (idx % 2 === 0 ? "border-r " : "") +
              (idx < 2 ? "border-b md:border-b-0 " : "") +
              (idx !== 3 ? "md:border-r " : "md:border-r-0 ");

            const content = (
              <div 
                className={`h-full flex flex-col xl:flex-row items-center justify-center gap-3 py-7 px-4 group ${link.url ? 'hover:bg-white/[0.02] cursor-pointer' : 'cursor-default opacity-50'} transition-colors ${borderClasses}`}
              >
                {link.isCustom ? (
                  link.icon
                ) : link.isSoon ? (
                  <span className="text-[15px] font-medium text-text-tertiary tracking-widest uppercase">
                    Soon...
                  </span>
                ) : (
                  <>
                    <div className="text-text-secondary group-hover:text-text-primary transition-colors">
                      {link.icon}
                    </div>
                    <span className="text-[15px] font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight whitespace-nowrap">
                      {link.name}
                    </span>
                  </>
                )}
              </div>
            );

            if (link.url) {
              return (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {content}
                </a>
              );
            }
            return <div key={idx} className="block h-full">{content}</div>;
          })}
        </div>
      </div>
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </div>
    
  );
}

/**
 * Shared footer for public-facing pages.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border-primary bg-bg-primary">
      {/* Live Links Section (like TrustBar) */}
      <LiveLinks />

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block group">
              <Logo className="h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="mt-1 text-xs text-balance max-w-50 text-text-tertiary">
              Built for simple and secure token launches on BNB Chain.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/create" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Launch Token
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tasks" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Tasks
                </Link>
              </li>
              <li>
                <a href="https://docs.teron.io/" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/investment" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Investment
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/security-policy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dashed border-border-primary flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} Teron. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
