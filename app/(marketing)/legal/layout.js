export default function LegalLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 w-full">
        {children}
      </main>
    </div>
  );
}
