import { prisma } from "@/lib/db";
import { calculateScore, calculateTrend } from "@/lib/scoring";
import { Navbar } from "@/components/navbar";
import { ProviderBoard } from "@/components/provider-board";
import { ModelBoard } from "@/components/model-board";
import { IncidentGrid } from "@/components/incident-grid";
import { ReviewList } from "@/components/review-list";
import { Hero } from "@/components/hero";
import { ResearchSection } from "@/components/research-section";
import { Footer } from "@/components/footer";

export default async function HomePage() {
  const providers = await prisma.provider.findMany({
    include: {
      models: {
        include: { ratings: true },
      },
    },
  });

  const clouds = await prisma.cloud.findMany({
    include: {
      provider: true,
      models: {
        include: { ratings: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const incidents = await prisma.incident.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { model: { include: { cloud: true, provider: true } } },
  });

  const reviews = await prisma.review.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { model: { include: { cloud: true, provider: true } } },
  });

  const providerData = providers
    .map((p) => {
      const allRatings = p.models.flatMap((m) => m.ratings);
      return {
        ...p,
        score: calculateScore(allRatings),
        trend: calculateTrend(allRatings),
        modelCount: p.models.length,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const cloudData = clouds.map((c) => {
    const models = c.models.map((m) => ({
      ...m,
      score: calculateScore(m.ratings),
      trend: calculateTrend(m.ratings),
    }));
    const allRatings = c.models.flatMap((m) => m.ratings);
    return {
      ...c,
      models: models.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
      avgScore: calculateScore(allRatings),
    };
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProviderBoard providers={providerData} />
        <ModelBoard clouds={cloudData} />
        <IncidentGrid incidents={incidents} />
        <ReviewList reviews={reviews} />
        <ResearchSection />
      </main>
      <Footer />
    </>
  );
}
