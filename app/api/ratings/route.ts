import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const VALID_TAGS = [
  "幻觉",
  "引用造假",
  "回答准确",
  "创意好",
  "收费争议",
  "不安全内容",
  "速度慢",
  "客服/退款",
  "其他",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { modelSlug, score, tags = [], comment } = body;

    if (!modelSlug || typeof modelSlug !== "string") {
      return NextResponse.json(
        { ok: false, error: "modelSlug 必填" },
        { status: 400 }
      );
    }

    if (typeof score !== "number" || score < 1 || score > 5) {
      return NextResponse.json(
        { ok: false, error: "score 必须是 1-5 的整数" },
        { status: 400 }
      );
    }

    const normalizedTags = Array.isArray(tags)
      ? tags.filter((t) => VALID_TAGS.includes(t))
      : [];

    const model = await prisma.model.findUnique({
      where: { slug: modelSlug },
    });

    if (!model) {
      return NextResponse.json(
        { ok: false, error: `未找到模型: ${modelSlug}` },
        { status: 404 }
      );
    }

    const [rating] = await prisma.$transaction([
      prisma.rating.create({
        data: {
          score,
          tags: normalizedTags.length > 0 ? normalizedTags.join(",") : null,
          modelId: model.id,
        },
      }),
      ...(comment && typeof comment === "string" && comment.trim()
        ? [
            prisma.review.create({
              data: {
                content: comment.trim().slice(0, 1000),
                rating: score,
                modelId: model.id,
              },
            }),
          ]
        : []),
    ]);

    revalidatePath("/");
    revalidatePath(`/model/${modelSlug}`);

    return NextResponse.json({
      ok: true,
      ratingId: rating.id,
      message: "评分已提交，感谢贡献",
    });
  } catch (err) {
    console.error("[api/ratings] error:", err);
    return NextResponse.json(
      { ok: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}
