import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          实时追踪 · 社区共治
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          模型可信度指数
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          大模型做错事，我们来记账。两个独立榜单：厂商榜看公司，模型榜看具体版本。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg">查看榜单</Button>
          <Button size="lg" variant="secondary">提交吐槽</Button>
        </div>
      </div>
    </section>
  );
}
