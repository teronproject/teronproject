export async function generateMetadata({ params }) {
  const { token_name } = await params;
  return {
    title: `${token_name} — Token Profile`,
    description: `View the ${token_name} token profile on Teron — contract address, tokenomics, socials, and more.`,
  };
}

export default async function TokenProfilePage({ params }) {
  const { token_name } = await params;

  return (
    <main className="min-h-dvh">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-text-primary mb-2">{token_name}</h1>
        <p className="text-text-secondary">Public token profile will be built here.</p>
      </div>
    </main>
  );
}
