import { Button } from "@/components/ui/button";
import type { Review, Model, Cloud, Provider } from "@/generated/prisma/client";

interface ReviewWithModel extends Review {
  model: Model & { cloud: Cloud; provider: Provider };
}

function formatTime(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-warning">
      {"★".repeat(rating)}
      <span className="text-muted">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function ReviewList({ reviews }: { reviews: ReviewWithModel[] }) {
  return (
    <section className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">最新吐槽</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              来自真实用户的近期评价，按时间排序
            </p>
          </div>
          <Button variant="secondary" size="sm">写一条</Button>
        </div>
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium">
                    {r.author.charAt(0)}
                  </span>
                  <span className="text-sm font-medium">{r.author}</span>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                  {r.model.name} · <Stars rating={r.rating} />
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {r.content}
              </p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span>{formatTime(r.createdAt)}</span>
                <span>👍 0</span>
                <span>💬 0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
