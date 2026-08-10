import Link from "next/link";

export default function LegalLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
