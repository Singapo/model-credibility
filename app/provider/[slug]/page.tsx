import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { calculateScore, calculateTrend } from "@/lib/scoring";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScoreBadge } from "@/components/score-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const provider = await prisma.provider.findUnique({
    where: { slug },
    include: {
      clouds: {
        include: {
          models: {
            include: { ratings: true },
          },
        },
      },
      models: {
        include: { ratings: true, cloud: true },
      },
    },
  });

  if (!provider) return notFound();

  const allRatings = provider.models.flatMap((m) => m.ratings);
  const score = calculateScore(allRatings);
  const trend = calculateTrend(allRatings);

  const modelsWithScore = provider.models
    .map((m) => ({
      ...m,
      score: calculateScore(m.ratings),
      trend: calculateTrend(m.ratings),
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mb-6 gap-1"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              返回榜单
            </Link>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {provider.country} · 成立于 {provider.foundedAt}
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {provider.name}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {provider.models.length} 款模型 · {allRatings.length} 条评分
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">综合信誉分</div>
                  <ScoreBadge score={score} />
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">30天趋势</div>
                  <span
                    className={`text-lg font-medium tabular-nums ${
                      trend > 0
                        ? "text-success"
                        : trend < 0
                        ? "text-danger"
                        : "text-muted-foreground"
                    }`}
                  >
                    {trend > 0 ? "+" : ""}
                    {trend}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold tracking-tight">旗下模型</h2>
            <div className="mt-4 space-y-3">
              {modelsWithScore.map((m) => (
                <Link
                  key={m.id}
                  href={`/model/${m.slug}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent"
                >
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Cloud: {m.cloud.name} · {m.ratings.length} 条评分
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <ScoreBadge score={m.score} />
                    <span
                      className={`text-sm tabular-nums ${
                        m.trend > 0
                          ? "text-success"
                          : m.trend < 0
                          ? "text-danger"
                          : "text-muted-foreground"
                      }`}
                    >
                      {m.trend > 0 ? "+" : ""}
                      {m.trend}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
