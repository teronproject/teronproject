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
    { 
      name: "Featured on Orynth", 
      url: "https://orynth.dev/projects/teron", 
      icon: (
        <img 
          src="https://www.orynth.dev/logo-text-white.svg" 
          alt="Featured on Orynth" 
          className="h-[24px] sm:h-[28px] w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity scale-110"
        />
      ),
      isCustom: true
    },
    { 
      name: "Alchemy Dapps", 
      url: "https://dapps.alchemy.com/dapps/teron", 
      icon: (
        <img 
          src="https://media.alchemy.com/1701819587-logo.svg" 
          alt="Featured on Alchemy Dapps" 
          className="h-[24px] sm:h-[28px] w-auto object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
        />
      ),
      isCustom: true
    },
    { 
      name: "TAIKAI Garden", 
      url: "https://garden.taikai.network/sandbox?search=%27teron%27", 
      icon: (
        <div className="flex items-center gap-2.5 h-fit opacity-90 group-hover:opacity-100 transition-opacity text-white">
          <svg fill="currentColor" height="24" viewBox="0 0 143 24" width="143" className="h-[20px] sm:h-[24px] w-auto object-contain" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.93 23.562v-4.097l.45.316a4.9 4.9 0 0 1-1.196 2.192q-.89.959-2.225 1.506A7.5 7.5 0 0 1 9.15 24q-2.754 0-4.84-1.315-2.056-1.343-3.198-3.644Q0 16.71 0 13.863q0-2.877 1.112-5.206 1.14-2.329 3.254-3.644Q6.48 3.671 9.29 3.671q3.226 0 5.368 1.726 2.14 1.726 2.837 4.657l-3.644.192q-.444-1.644-1.64-2.575-1.17-.96-2.949-.96-1.89 0-3.17.932-1.252.932-1.864 2.576-.611 1.616-.611 3.644t.611 3.616q.612 1.59 1.864 2.548 1.28.932 3.17.932 1.419 0 2.448-.576a4.3 4.3 0 0 0 1.613-1.643q.612-1.069.75-2.411H9.235v-2.795h8.343v10.028zM19.235 13.452q.445-2.247 2.141-3.48 1.697-1.26 4.367-1.26 3.17 0 4.811 1.589 1.641 1.59 1.641 4.63V20q0 .574.223.822.25.219.695.219h.556v2.52l-.862.028h-.111a7.3 7.3 0 0 1-1.53-.11 2.8 2.8 0 0 1-1.335-.63q-.585-.492-.667-1.507-.557 1.124-1.808 1.836-1.252.712-3.06.712-2.28 0-3.81-1.123-1.5-1.15-1.501-3.014 0-1.37.64-2.219.666-.85 1.835-1.342 1.195-.494 3.115-.85l4.144-.822q-.029-1.671-.751-2.466-.723-.821-2.225-.822-1.168 0-1.947.63-.75.603-1.029 1.781zm3.31 6.192q0 .795.667 1.315.695.493 1.975.493 1.029 0 1.835-.493.834-.493 1.28-1.48.472-1.013.472-2.438v-.137l-2.837.493-.5.082q-1.03.192-1.613.384-.556.192-.918.63-.361.412-.361 1.15M38.556 9.04l.112 4.056-.25-.165q.277-2 1.168-2.931.917-.96 2.558-.96h1.39v2.658h-1.39q-1.168 0-1.919.411-.75.384-1.112 1.178-.334.768-.334 1.946v8.329H35.33V9.04zM54.328 4.109h3.448v19.453h-3.254l-.083-2.055a4.43 4.43 0 0 1-1.808 1.78q-1.14.603-2.725.603-2.03 0-3.45-1.013-1.389-1.014-2.085-2.74t-.695-3.836q0-2.11.695-3.836.696-1.726 2.086-2.74 1.419-1.013 3.449-1.013 1.53 0 2.642.575a4.4 4.4 0 0 1 1.78 1.699zm-.167 14.576q.39-1.095.39-2.384 0-1.37-.39-2.466-.39-1.095-1.224-1.753-.834-.685-2.058-.685-1.836 0-2.753 1.397-.918 1.397-.918 3.507 0 2.027.918 3.425.945 1.37 2.753 1.37 1.251 0 2.058-.658.834-.657 1.224-1.753M59.864 16.301q0-2.3.89-4 .89-1.726 2.531-2.658 1.641-.93 3.81-.931 1.92 0 3.449.85 1.53.848 2.447 2.575.918 1.699.974 4.191v.905H63.48q.11 1.863 1.057 2.904.945 1.014 2.558 1.014 1.029 0 1.864-.521a3.2 3.2 0 0 0 1.266-1.48h3.545c-.445 1.388-1.28 2.713-2.503 3.535q-1.808 1.205-4.172 1.205-2.169 0-3.81-.931t-2.53-2.658q-.89-1.725-.89-4m10.54-1.397q-.222-1.78-1.14-2.63-.89-.85-2.169-.85-1.502 0-2.42.932-.917.904-1.167 2.548zM79.053 9.04l.166 4.028-.445-.246q.334-2.11 1.613-3.096 1.308-1.014 3.199-1.014 2.42 0 3.727 1.507 1.307 1.48 1.307 4v9.343H85.17v-8.275q0-1.287-.25-2.11-.25-.82-.835-1.26-.555-.438-1.501-.438-1.503 0-2.364.986-.835.96-.835 2.822v8.275h-3.448V9.04zM135.879 7.03C140.438 11.53 143 17.634 143 24h-14.043l-1.552-7.8h3.709l-.927-2.457h-3.272l-.49-2.465a30 30 0 0 0 3.066-.998l-.695-2.458-1.124.452a24.4 24.4 0 0 1-19.216-.452l-.637 2.458q1.458.563 2.956.969l-.496 2.494h-3.271l-.928 2.458h3.71L108.237 24H94.374c0-6.365 2.562-12.47 7.121-16.97C106.055 2.528 112.239 0 118.687 0s12.632 2.529 17.192 7.03"></path><path d="M112.268 24h12.658l-.766-6.068 1.524-1.731H111.51l1.524 1.731zM123.389 11.923a30.2 30.2 0 0 1-9.583-.018l-.144 1.838h9.87z"></path>
          </svg>
        </div>
      ),
      isCustom: true
    },
    { 
      name: "Peerlist", 
      url: "https://peerlist.io/souravhere/project/teron", 
      icon: (
        <img 
          src="https://dqy38fnwh4fqs.cloudfront.net/website/peerlist-logo-full-dark.svg" 
          alt="Peerlist" 
          className="h-[20px] sm:h-[24px] w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
        />
      ),
      isCustom: true
    },
    { name: "Soon...", url: null, isSoon: true, icon: "soon" },
    { name: "Soon...", url: null, isSoon: true, icon: "soon" },
  ];

  return (
    <div className="w-full border-b border-border-primary pt-8">
      <h3 className="text-center text-2xl sm:text-3xl font-medium text-text-primary tracking-tight leading-[1.15] mb-6">Find us on...</h3>
      <div className="mx-auto border-t border-border-primary">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {links.map((link, idx) => {
            const borderClasses = "border-border-primary " +
              (idx % 2 === 0 ? "border-r " : "") +
              (idx < links.length - 2 ? "border-b " : "") +
              (idx % 4 !== 3 ? "md:border-r " : "md:border-r-0 ") +
              (idx < links.length - 4 ? "md:border-b " : "md:border-b-0 ");

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
