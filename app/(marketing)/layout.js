import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function MarketingLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
