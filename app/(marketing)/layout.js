export default function MarketingLayout({ children }) {
  return (
    <>
      {/* Marketing pages share nav/footer — will be built with full components */}
      {children}
    </>
  );
}
