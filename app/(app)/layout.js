import Header from "@/components/Header";


export const metadata = {
  title: {
    template: "%s - Teron",
    default: "Teron App",
  },
  description: "Teron ecosystem tools, tasks, and token management.",
};

export default function AppLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header/>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
