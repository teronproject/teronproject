export const metadata = {
  title: "Swap",
  description: "Swap TERR for TER tokens on Teron.",
};

export default function SwapPage() {
  // Feature-flagged — will check FeatureFlag before rendering
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Swap</h1>
      <p className="text-text-secondary">TERR → TER swap will be available after TER launch.</p>
    </div>
  );
}
