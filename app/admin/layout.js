export default function AdminLayout({ children }) {
  // RBAC gate will check admin role here
  return (
    <div className="min-h-dvh flex">
      {/* Admin sidebar will be built with full navigation */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
