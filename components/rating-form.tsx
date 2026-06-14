"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RatingForm({
  modelId,
  modelName,
}: {
  modelId: string;
  modelName: string;
}) {
  const [score, setScore] = useState(3);
  const [content, setContent] = useState("");

  return (
    <form className="space-y-4">
      <input type="hidden" name="modelId" value={modelId} />
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
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="说说你的真实体验..."
        />
      </div>
      <Button type="submit" className="w-full">
        提交评分
      </Button>
    </form>
  );
}
