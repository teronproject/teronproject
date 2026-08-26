import { getTaskById } from "@/services/tasks";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Coins01Icon,
  TelegramIcon,
  LinkSquare02Icon,
  Share08Icon,
  Task01Icon,
  UserMultiple02Icon,
  ArrowRight01Icon,
} from "hugeicons-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    return {
      title: "Quest Not Found | Teron",
      description: "This task could not be found on Teron.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.teron.io";
  const ogImage = task.imageUrl || `${baseUrl}/og.png`;
  const title = `Earn +${task.rewardAmount} TERR: ${task.title} | Teron Quests`;
  const description =
    task.description ||
    `Complete this community quest on Teron Protocol to earn ${task.rewardAmount} TERR tokens on BNB Smart Chain.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/tasks/${id}`,
      siteName: "Teron",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: task.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function TaskPublicPage({ params, searchParams }) {
  const { id } = await params;
  const sParams = await searchParams;
  const refCode = sParams?.ref || "";

  const task = await getTaskById(id);
  if (!task || !task.active) {
    notFound();
  }

  const isTg = task.verificationMethod === "MANUAL_TELEGRAM" || task.requiresTelegram;
  const dashboardLink = `/dashboard/tasks${refCode ? `?ref=${encodeURIComponent(refCode)}` : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          {/* Breadcrumb / Back Link */}
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/dashboard/tasks" className="hover:text-text-primary transition-colors">
              Quests
            </Link>
            <span>/</span>
            <span className="text-text-secondary truncate max-w-xs">{task.title}</span>
          </div>

          {/* Main Quest Showcase Card */}
          <Card className="overflow-hidden border border-border-secondary shadow-2xl bg-surface-primary">
            {/* Task OG Image Banner */}
            {task.imageUrl ? (
              <div className="w-full aspect-[1.91/1] bg-surface-tertiary relative overflow-hidden border-b border-border-primary">
                <img
                  src={task.imageUrl}
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-accent px-4 py-2 rounded-xl border border-accent/40 shadow-xl">
                    <Coins01Icon size={18} variant="solid" />
                    <span className="font-extrabold text-sm title">+{task.rewardAmount} TERR</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-surface-secondary to-surface-tertiary border-b border-border-primary flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    {isTg ? <TelegramIcon size={24} /> : <Coins01Icon size={24} variant="solid" />}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-accent">
                      Teron Community Quest
                    </span>
                    <h2 className="text-lg font-bold text-text-primary">{task.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-lg border border-accent/20">
                  <Coins01Icon size={16} variant="solid" />
                  <span className="font-bold text-sm">+{task.rewardAmount} TERR</span>
                </div>
              </div>
            )}

            <div className="card-body p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="accent" size="md">
                    {isTg ? "Telegram Quest" : task.verificationMethod.replace("_", " ")}
                  </Badge>
                  {task.category && (
                    <Badge variant="neutral" size="md">
                      {task.category}
                    </Badge>
                  )}
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    <UserMultiple02Icon size={14} /> {task.totalCompletions} participants completed
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary title mt-2">
                  {task.title}
                </h1>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary border border-border-primary space-y-2">
                <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                  Quest Description & Instructions
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              {isTg && (
                <div className="p-4 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20 flex items-start gap-3">
                  <TelegramIcon size={22} className="text-[#0088cc] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Telegram Requirement</h4>
                    <p className="text-xs text-text-secondary">
                      To claim this reward, you will be required to submit your Telegram username (
                      <code className="font-mono text-white">@username</code>) for verification.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Section */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-primary">
                <div>
                  <p className="text-xs text-text-tertiary">Reward for completion:</p>
                  <p className="text-lg font-bold text-accent">+{task.rewardAmount} TERR Tokens</p>
                </div>

                <Link
                  href={dashboardLink}
                  className="w-full sm:w-auto h-12 px-8 bg-accent hover:bg-accent-hover active:bg-accent-active text-accent-text font-bold rounded-xl text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all cta"
                >
                  <span>Start Quest & Earn TERR</span>
                  <ArrowRight01Icon size={18} />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
