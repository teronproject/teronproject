export const metadata = {
  title: "Deployments",
  description: "Your token deployment history on Teron.",
};

export default function DeploymentsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Deployments</h1>
      <p className="text-text-secondary">Deployment history will be built here.</p>
    </div>
  );
}
