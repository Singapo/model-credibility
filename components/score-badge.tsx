export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const color =
    score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-danger";

  return (
    <span className={`text-lg font-semibold tabular-nums ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}
