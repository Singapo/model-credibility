"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RatingForm({
  modelSlug,
  modelName,
}: {
  modelSlug: string;
  modelName: string;
}) {
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelSlug, score, comment }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage(data.message || "评分已提交，感谢贡献");
        setComment("");
      } else {
        setStatus("error");
        setMessage(data.error || "提交失败");
      }
    } catch {
      setStatus("error");
      setMessage("网络错误，请重试");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium">为 {modelName} 打分</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScore(s)}
              className={`text-2xl transition-colors ${
                s <= score ? "text-warning" : "text-muted"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" name="score" value={score} />
      </div>
      <div>
        <label htmlFor="review" className="mb-2 block text-sm font-medium">
          吐槽 / 评价
        </label>
        <textarea
          id="review"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="说说你的真实体验..."
        />
      </div>
      <Button type="submit" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "提交中..." : "提交评分"}
      </Button>
      {status === "ok" && message && (
        <p className="text-sm text-success">{message}</p>
      )}
      {status === "error" && message && (
        <p className="text-sm text-danger">{message}</p>
      )}
    </form>
  );
}
