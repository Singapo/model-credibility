import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/score-badge";
import type { Model, Cloud, Provider, Rating } from "@/generated/prisma/client";

interface ModelWithScore extends Model {
  ratings: Rating[];
  score: number | null;
  trend: number;
}

interface CloudWithModels extends Cloud {
  provider: Provider;
  models: ModelWithScore[];
  avgScore: number | null;
}

export function ModelBoard({ clouds }: { clouds: CloudWithModels[] }) {
  return (
    <section className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">模型榜</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              按 Cloud（模型系列）分组，每个模型独立计分
            </p>
          </div>
          <Button variant="secondary" size="sm">全部模型</Button>
        </div>
        <div className="flex flex-col gap-5">
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">Cloud: {cloud.name}</h3>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
                    {cloud.provider.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  系列均分{" "}
                  <strong className="text-foreground tabular-nums">
                    {cloud.avgScore?.toFixed(1) ?? "—"}
                  </strong>
                </span>
              </div>
              {cloud.models.map((m) => (
                <Link
                  key={m.id}
                  href={`/model/${m.slug}`}
                  className="grid grid-cols-[1.8fr_120px_120px_140px_100px] gap-4 items-center border-b border-border px-5 py-3.5 transition-colors hover:bg-accent last:border-b-0"
                >
                  <div className="flex items-center gap-3 pl-7">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold">
                      {m.name.charAt(0)}
                    </span>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">
                        发布于 {m.releasedAt}
                      </div>
                    </div>
                  </div>
                  <ScoreBadge score={m.score} />
                  <span className={`text-xs tabular-nums ${m.trend > 0 ? "text-success" : m.trend < 0 ? "text-danger" : "text-muted-foreground"}`}>
                    {m.trend > 0 ? "↗" : m.trend < 0 ? "↘" : "→"} {m.trend > 0 ? "+" : ""}{m.trend}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {m.ratings.length}
                  </span>
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-2">
                    评分
                  </Button>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
