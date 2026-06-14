import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/score-badge";

interface ProviderWithScore {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  foundedAt: string | null;
  score: number | null;
  trend: number;
  modelCount: number;
}

export function ProviderBoard({ providers }: { providers: ProviderWithScore[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">厂商榜</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              按厂商综合可信度排名，与模型榜分数独立计算
            </p>
          </div>
          <Button variant="secondary" size="sm">全部厂商</Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[60px_2fr_120px_120px_140px] gap-4 border-b border-border bg-muted px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>排名</span>
            <span>厂商</span>
            <span>信誉分</span>
            <span>趋势</span>
            <span>旗下模型</span>
          </div>
          {providers.map((p, idx) => (
            <Link
              key={p.id}
              href={`/provider/${p.slug}`}
              className="grid grid-cols-[60px_2fr_120px_120px_140px] gap-4 items-center border-b border-border px-5 py-4 transition-colors hover:bg-accent last:border-b-0"
            >
              <span className="text-sm text-muted-foreground tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-sm font-semibold">
                  {p.name.charAt(0)}
                </span>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.country} · 成立于 {p.foundedAt}
                  </div>
                </div>
              </div>
              <ScoreBadge score={p.score} />
              <span className={`text-xs tabular-nums ${p.trend > 0 ? "text-success" : p.trend < 0 ? "text-danger" : "text-muted-foreground"}`}>
                {p.trend > 0 ? "↗" : p.trend < 0 ? "↘" : "→"} {p.trend > 0 ? "+" : ""}{p.trend}
              </span>
              <span className="text-sm text-muted-foreground tabular-nums">{p.modelCount} 款</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
