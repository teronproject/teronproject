export default function AppLayout({ children }) {
  return (
    <div className="min-h-dvh flex">
      {/* Sidebar will be added when wallet connection is built */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
