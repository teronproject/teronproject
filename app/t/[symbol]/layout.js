export default function TokenProfileLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col relative bg-[#0a0a0a]">
      {/* Premium Dotted Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-accent/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
