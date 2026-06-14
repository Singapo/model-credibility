import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { calculateScore, calculateTrend } from "@/lib/scoring";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScoreBadge } from "@/components/score-badge";
import { RatingForm } from "@/components/rating-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = await prisma.model.findUnique({
    where: { slug },
    include: {
      provider: true,
      cloud: true,
      ratings: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 10 },
      incidents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!model) return notFound();

  const score = calculateScore(model.ratings);
  const trend = calculateTrend(model.ratings);

  const distribution = [1, 2, 3, 4, 5].map((s) => ({
    score: s,
    count: model.ratings.filter((r) => r.score === s).length,
  }));

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                返回榜单
              </Link>
            </Button>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{model.provider.name}</span>
                  <span>/</span>
                  <span>Cloud: {model.cloud.name}</span>
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {model.name}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  发布于 {model.releasedAt} · {model.ratings.length} 条评分
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">信誉分</div>
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
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">评分分布</h2>
                <div className="mt-4 space-y-2">
                  {distribution
                    .slice()
                    .reverse()
                    .map((d) => (
                      <div key={d.score} className="flex items-center gap-3">
                        <span className="w-8 text-sm font-medium">{d.score}★</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${(d.count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-sm text-muted-foreground tabular-nums">
                          {d.count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {model.incidents.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">相关事故</h2>
                  <div className="mt-4 space-y-3">
                    {model.incidents.map((inc) => (
                      <div
                        key={inc.id}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <h3 className="font-medium">{inc.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {inc.description}
                        </p>
                        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                          <span>{inc.occurredAt}</span>
                          <span className="capitalize">{inc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold tracking-tight">最新评价</h2>
                <div className="mt-4 space-y-3">
                  {model.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{r.author}</span>
                        <span className="text-warning">
                          {"★".repeat(r.rating)}
                          <span className="text-muted">
                            {"★".repeat(5 - r.rating)}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
                <h2 className="text-lg font-semibold tracking-tight">参与评分</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  你的评分会影响该模型的可信度分数。
                </p>
                <div className="mt-4">
                  <RatingForm modelId={model.id} modelName={model.name} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
