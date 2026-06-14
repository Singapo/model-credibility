import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        cloud: { select: { name: true, provider: { select: { name: true } } } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ok: true, models });
  } catch (err) {
    console.error("[api/models] error:", err);
    return NextResponse.json(
      { ok: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}
