import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/db";
import { calculateScore, calculateTrend } from "@/lib/scoring";

const SNAPSHOT_DIR = join(process.cwd(), "data", "snapshots");

async function main() {
  mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const providers = await prisma.provider.findMany({
    include: { models: { include: { ratings: true } } },
  });

  const clouds = await prisma.cloud.findMany({
    include: {
      provider: true,
      models: { include: { ratings: true }, orderBy: { createdAt: "asc" } },
    },
  });

  const ratings = await prisma.rating.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { model: { include: { cloud: true, provider: true } } },
  });

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { model: { include: { cloud: true, provider: true } } },
  });

  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { model: { include: { cloud: true, provider: true } } },
  });

  const providerScores = providers
    .map((p) => {
      const allRatings = p.models.flatMap((m) => m.ratings);
      return {
        slug: p.slug,
        name: p.name,
        score: calculateScore(allRatings),
        trend: calculateTrend(allRatings),
        modelCount: p.models.length,
        ratingCount: allRatings.length,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const modelScores = clouds
    .flatMap((c) =>
      c.models.map((m) => ({
        slug: m.slug,
        name: m.name,
        providerSlug: c.provider.slug,
        providerName: c.provider.name,
        cloudSlug: c.slug,
        cloudName: c.name,
        score: calculateScore(m.ratings),
        trend: calculateTrend(m.ratings),
        ratingCount: m.ratings.length,
      }))
    )
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const snapshot = {
    generatedAt: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "local",
    summary: {
      providerCount: providers.length,
      modelCount: clouds.reduce((acc, c) => acc + c.models.length, 0),
      ratingCount: ratings.length,
      reviewCount: reviews.length,
      incidentCount: incidents.length,
    },
    providers: providerScores,
    models: modelScores,
    recentRatings: ratings.map((r) => ({
      score: r.score,
      tags: r.tags,
      createdAt: r.createdAt.toISOString(),
      modelSlug: r.model.slug,
      modelName: r.model.name,
      providerSlug: r.model.provider.slug,
    })),
    recentReviews: reviews.map((r) => ({
      author: r.author,
      content: r.content,
      rating: r.rating,
      createdAt: r.createdAt.toISOString(),
      modelSlug: r.model.slug,
      modelName: r.model.name,
    })),
    recentIncidents: incidents.map((i) => ({
      title: i.title,
      type: i.type,
      status: i.status,
      occurredAt: i.occurredAt,
      createdAt: i.createdAt.toISOString(),
      modelSlug: i.model.slug,
      modelName: i.model.name,
    })),
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const snapshotFile = join(SNAPSHOT_DIR, `${timestamp}.json`);
  const latestFile = join(SNAPSHOT_DIR, "latest.json");

  writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2) + "\n", "utf-8");
  writeFileSync(latestFile, JSON.stringify(snapshot, null, 2) + "\n", "utf-8");

  console.log(`Snapshot written to:`);
  console.log(`  ${snapshotFile}`);
  console.log(`  ${latestFile}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
