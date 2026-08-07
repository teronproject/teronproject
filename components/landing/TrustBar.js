import { CheckmarkBadge01Icon, Coins01Icon, Rocket01Icon, Shield01Icon } from "hugeicons-react";

export default function TrustBar() {
  const features = [
    { name: "BNB Smart Chain", icon: CheckmarkBadge01Icon },
    { name: "BEP-20 Standard", icon: Coins01Icon },
    { name: "Ultra-Low Gas", icon: Rocket01Icon },
    { name: "Immutable Security", icon: Shield01Icon },
  ];

  return (
    <section className="w-full border-y border-white/5 relative z-10">
      <div className="max-w-[1500px] mx-auto">
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            
            const borderClasses = "border-white/5 " +
              (idx % 2 === 0 ? "border-r " : "") +
              (idx < 2 ? "border-b md:border-b-0 " : "") +
              (idx !== 3 ? "md:border-r " : "md:border-r-0 ");

            return (
              <div 
                key={idx} 
                className={`flex flex-col xl:flex-row items-center justify-center gap-3 py-10 px-4 group hover:bg-white/[0.02] transition-colors cursor-default ${borderClasses}`}
              >
                <Icon size={24} className="text-text-secondary group-hover:text-text-primary transition-colors" strokeWidth={1.5} />
                <span className="text-[15px] font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight whitespace-nowrap">
                  {feature.name}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Premium Tagline */}
        <div className="py-20 md:py-28 px-4 flex justify-center text-center">
          <h2 className="title text-3xl title md:text-[44px] font-medium text-text-primary tracking-tight max-w-3xl leading-[1.15]">
            Engineered for builders, <br className="sm:hidden" /><span className="text-text-secondary">trusted by the community</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
