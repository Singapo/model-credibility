const HALF_LIFE_DAYS = 138;
const LAMBDA = Math.pow(0.5, 1 / HALF_LIFE_DAYS); // ≈ 0.995

interface RatingLike {
  score: number;
  createdAt: Date | string;
}

export function calculateScore(
  ratings: RatingLike[],
  referenceDate: Date = new Date()
): number | null {
  if (ratings.length === 0) return null;

  let weightedSum = 0;
  let weightSum = 0;

  for (const rating of ratings) {
    const daysAgo =
      (referenceDate.getTime() - new Date(rating.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    const decay = Math.pow(LAMBDA, Math.max(0, daysAgo));
    weightedSum += rating.score * decay;
    weightSum += decay;
  }

  if (weightSum === 0) return null;

  const weightedScore = weightedSum / weightSum;
  // Map 1-5 to 0-100
  const normalized = ((weightedScore - 1) / 4) * 100;
  return Math.max(0, Math.min(100, Number(normalized.toFixed(1))));
}

export function calculateTrend(
  ratings: RatingLike[],
  referenceDate: Date = new Date()
): number {
  if (ratings.length < 2) return 0;

  const midpoint =
    referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000; // 30 days ago

  const recent: RatingLike[] = [];
  const older: RatingLike[] = [];

  for (const r of ratings) {
    const t = new Date(r.createdAt).getTime();
    if (t >= midpoint) recent.push(r);
    else older.push(r);
  }

  const recentScore = calculateScore(recent, referenceDate);
  const olderScore = calculateScore(older, new Date(midpoint));

  if (recentScore === null || olderScore === null) return 0;

  return Number((recentScore - olderScore).toFixed(1));
}
