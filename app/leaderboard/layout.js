export const metadata = {
  title: "Leaderboard | Teron",
  description: "Discover and track top BEP-20 tokens deployed cleanly and immutably on the BNB Smart Chain through the Teron platform.",
};

export default function LeaderboardLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col relative bg-[#0a0a0a]">
      <div className="flex-1 flex flex-col relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
