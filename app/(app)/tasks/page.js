import Link from "next/link";
import CanvasBackground from "@/components/landing/CanvasBackground";

export const metadata = {
  title: "Tasks & Rewards - Teron",
  description: "Learn how to participate in Teron tasks, connect your wallet, and earn rewards securely.",
};

export default function TasksInfoPage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <CanvasBackground />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Tasks & Rewards Info
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            Everything you need to know about participating in the Teron ecosystem. Learn how to complete tasks, earn tokens, and track your individual scores safely and privately.
          </p>
        </div>
      </section>
      <div className="h-12 w-full border-y border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-legal">
            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. Getting Started</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Participation in Teron's reward ecosystem is straightforward. To get started, you must first connect your Web3 wallet securely to the platform. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Once connected, you can access your personal portal at <Link href="/dashboard" className="text-accent hover:underline font-medium">/dashboard</Link>. This is where you manage your token deployments and track your ecosystem participation.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. Finding and Completing Tasks</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              All active and available tasks can be found inside your dashboard at <Link href="/dashboard/tasks" className="text-accent hover:underline font-medium">/dashboard/tasks</Link>. We regularly update this section with new opportunities to engage with the platform.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Tasks range from simple ecosystem interactions to social engagement and protocol testing. Simply follow the instructions provided on each specific task card, verify your completion, and submit it for validation.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Earning Rewards</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              When you successfully complete a task and it gets validated by our system, reward tokens will be automatically credited to your account. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              These rewards are permanently tied to your connected wallet address. Make sure to keep your wallet secure, as access to your rewards requires access to the exact wallet address used during task completion.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. Privacy and Scoring</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We value your privacy. Your task completion status and overall task score are strictly private. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">No Public Leaderboards:</span> There is no public leaderboard, ranking page, or directory where your task scores or earned rewards are visible to other users. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Your score is only visible to you when you are securely logged into your dashboard. This ensures you can participate in our ecosystem freely without your data being publicly gamified or exposed.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Need Help?</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you have any questions about specific tasks, reward distributions, or if you encounter issues verifying a task, please reach out to our support team.
            </p>
            <p className="text-text-secondary leading-relaxed">
              <span className="text-white">Email:</span> teronproject@gmail.com
            </p>
          </div>
        </div>
      </section>
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </div>
  );
}
