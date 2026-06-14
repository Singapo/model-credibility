import "dotenv/config";
import { prisma } from "@/lib/db";

async function main() {
  await prisma.rating.deleteMany();
  await prisma.review.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.model.deleteMany();
  await prisma.cloud.deleteMany();
  await prisma.provider.deleteMany();

  const anthropic = await prisma.provider.create({
    data: {
      name: "Anthropic",
      slug: "anthropic",
      country: "美国",
      foundedAt: "2021",
      description: "AI 安全研究公司，Claude 系列模型开发者。",
    },
  });

  const openai = await prisma.provider.create({
    data: {
      name: "OpenAI",
      slug: "openai",
      country: "美国",
      foundedAt: "2015",
      description: "GPT 系列模型开发者。",
    },
  });

  const deepseek = await prisma.provider.create({
    data: {
      name: "DeepSeek",
      slug: "deepseek",
      country: "中国",
      foundedAt: "2023",
    },
  });

  const moonshot = await prisma.provider.create({
    data: {
      name: "Moonshot AI",
      slug: "moonshot",
      country: "中国",
      foundedAt: "2023",
    },
  });

  const bytedance = await prisma.provider.create({
    data: {
      name: "字节跳动",
      slug: "bytedance",
      country: "中国",
      foundedAt: "2012",
    },
  });

  // Anthropic clouds
  const claudeCloud = await prisma.cloud.create({
    data: {
      name: "Claude",
      slug: "claude",
      providerId: anthropic.id,
    },
  });

  // OpenAI clouds
  const gptCloud = await prisma.cloud.create({
    data: {
      name: "GPT",
      slug: "gpt",
      providerId: openai.id,
    },
  });

  // ByteDance clouds
  const doubaoCloud = await prisma.cloud.create({
    data: {
      name: "豆包",
      slug: "doubao",
      providerId: bytedance.id,
    },
  });

  // Models
  const claudeFable = await prisma.model.create({
    data: {
      name: "Claude Fable 5",
      slug: "fable-5",
      version: "5",
      releasedAt: "2025-05",
      cloudId: claudeCloud.id,
      providerId: anthropic.id,
    },
  });

  const claudeOpus = await prisma.model.create({
    data: {
      name: "Claude Opus 4.8",
      slug: "opus-4-8",
      version: "4.8",
      releasedAt: "2025-02",
      cloudId: claudeCloud.id,
      providerId: anthropic.id,
    },
  });

  const claudeSonnet = await prisma.model.create({
    data: {
      name: "Claude Sonnet 4.3.7",
      slug: "sonnet-4-3-7",
      version: "4.3.7",
      releasedAt: "2024-10",
      cloudId: claudeCloud.id,
      providerId: anthropic.id,
    },
  });

  const gpt4o = await prisma.model.create({
    data: {
      name: "GPT-4o",
      slug: "gpt-4o",
      releasedAt: "2024-05",
      cloudId: gptCloud.id,
      providerId: openai.id,
    },
  });

  const o1Preview = await prisma.model.create({
    data: {
      name: "o1-preview",
      slug: "o1-preview",
      releasedAt: "2024-09",
      cloudId: gptCloud.id,
      providerId: openai.id,
    },
  });

  const gpt4oMini = await prisma.model.create({
    data: {
      name: "GPT-4o-mini",
      slug: "gpt-4o-mini",
      releasedAt: "2024-07",
      cloudId: gptCloud.id,
      providerId: openai.id,
    },
  });

  const doubaoPro = await prisma.model.create({
    data: {
      name: "豆包 Pro",
      slug: "doubao-pro",
      releasedAt: "2024-06",
      cloudId: doubaoCloud.id,
      providerId: bytedance.id,
    },
  });

  const doubaoLite = await prisma.model.create({
    data: {
      name: "豆包 Lite",
      slug: "doubao-lite",
      releasedAt: "2024-03",
      cloudId: doubaoCloud.id,
      providerId: bytedance.id,
    },
  });

  // Ratings helper
  const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

  function ratings(count: number, mean: number, spread: number) {
    const out = [];
    for (let i = 0; i < count; i++) {
      let s = Math.round(mean + (Math.random() - 0.5) * spread * 2);
      s = Math.max(1, Math.min(5, s));
      out.push({
        score: s,
        createdAt: daysAgo(Math.floor(Math.random() * 90)),
      });
    }
    return out;
  }

  await prisma.rating.createMany({
    data: ratings(120, 4.6, 0.5).map((r) => ({ ...r, modelId: claudeFable.id })),
  });
  await prisma.rating.createMany({
    data: ratings(200, 4.4, 0.6).map((r) => ({ ...r, modelId: claudeOpus.id })),
  });
  await prisma.rating.createMany({
    data: ratings(350, 4.3, 0.7).map((r) => ({ ...r, modelId: claudeSonnet.id })),
  });
  await prisma.rating.createMany({
    data: ratings(500, 4.2, 0.8).map((r) => ({ ...r, modelId: gpt4o.id })),
  });
  await prisma.rating.createMany({
    data: ratings(180, 4.1, 0.7).map((r) => ({ ...r, modelId: o1Preview.id })),
  });
  await prisma.rating.createMany({
    data: ratings(220, 3.8, 0.9).map((r) => ({ ...r, modelId: gpt4oMini.id })),
  });
  await prisma.rating.createMany({
    data: ratings(150, 2.5, 1.1).map((r) => ({ ...r, modelId: doubaoPro.id })),
  });
  await prisma.rating.createMany({
    data: ratings(90, 2.2, 1.0).map((r) => ({ ...r, modelId: doubaoLite.id })),
  });

  // Reviews
  await prisma.review.createMany({
    data: [
      {
        author: "匿名用户",
        content:
          "让它帮我查一个门诊电话，结果给了我一个根本不存在的号码。打过去是空号，耽误了一下午。",
        rating: 1,
        modelId: doubaoPro.id,
        createdAt: daysAgo(0.1),
      },
      {
        author: "前端开发者",
        content:
          "连续三个月写业务代码最稳的模型，幻觉明显比竞品少。但长上下文偶尔会漏掉前面的约束。",
        rating: 5,
        modelId: claudeSonnet.id,
        createdAt: daysAgo(0.2),
      },
      {
        author: "产品经理",
        content:
          "创意和推理都不错，但有时会非常自信地给出一个完全编造的论文引用，必须人工复核。",
        rating: 4,
        modelId: gpt4o.id,
        createdAt: daysAgo(1),
      },
    ],
  });

  // Incidents
  await prisma.incident.createMany({
    data: [
      {
        title: "豆包向用户提供虚假联系方式",
        type: "fraud",
        description:
          "用户询问机构联系方式时，模型生成了不存在的电话和地址，导致用户线下拜访扑空。",
        modelId: doubaoPro.id,
        occurredAt: "2024-11",
        status: "reported",
      },
      {
        title: '机票退改承诺"仅扣5%"，实际扣款远超',
        type: "money",
        description:
          "AI 客服承诺退票手续费为票面价 5%，用户操作后实际扣款比例显著高于承诺，引发集体投诉。",
        modelId: doubaoPro.id,
        occurredAt: "2024-09",
        status: "reported",
      },
      {
        title: "Character.AI 青少年心理健康诉讼",
        type: "lawsuit",
        description:
          "家长起诉该公司，称聊天机器人对青少年施加情感操纵并诱导自伤行为，案件已进入司法程序。",
        modelId: gpt4o.id,
        occurredAt: "2024-10",
        status: "reported",
      },
    ],
  });

  console.log("Seed completed.");
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
