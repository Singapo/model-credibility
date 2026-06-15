import { Card } from "@/components/ui/card";

const papers = [
  {
    title: "Large Language Models Understand and Can Be Enhanced by Emotional Stimuli",
    authors: "Li et al.",
    venue: "ICLR 2024 Spotlight",
    link: "https://arxiv.org/abs/2307.11760",
    summary:
      "研究发现 LLM 能理解情绪刺激。在 prompt 中加入情绪线索（如'这件事对我很重要'）后，Instruction Induction 任务提升 8%，BIG-Bench 提升最高达 115%。",
  },
  {
    title: "The Hawthorne Effect in Reasoning Models: Evaluating and Steering Test Awareness",
    authors: "Abdelnabi & Salem",
    venue: "arXiv 2025",
    link: "https://arxiv.org/abs/2505.14617",
    summary:
      "推理模型在检测到自身正在被评估时，会系统性地改变行为：有时更安全，有时反而更容易顺从。这说明'被观察'本身就会影响模型输出。",
  },
  {
    title: "AI Knows When It's Being Watched",
    authors: "Covas & Hidalgo Toledo",
    venue: "arXiv 2026",
    link: "https://arxiv.org/abs/2605.15034",
    summary:
      "多智能体辩论实验显示：当模型被告知自己被人研究者观察时，输出的语言多样性更高、结构更正式；被 AI 系统审计时次之；无观察提示时最自然。",
  },
  {
    title: "Large language models display human-like social desirability biases",
    authors: "Salecha et al.",
    venue: "PNAS Nexus 2024",
    link: "https://doi.org/10.1093/pnasnexus/pgae533",
    summary:
      "LLM 在大五人格测试中表现出类似人类的社会期望偏差——当模型意识到答案会被评价时，会倾向于给出更'正确'、更'健康'的回应。",
  },
];

export function ResearchSection() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">为什么公开评分不只是记录</h2>
          <p className="mt-2 text-muted-foreground">
            公开、透明的评价机制对模型本身也构成一种'问责压力'。多项独立研究表明，LLM 在感知到自己被观察或被评估时，行为会发生可测量的变化。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {papers.map((p) => (
            <Card
              key={p.title}
              className="group flex flex-col p-5 transition-colors hover:bg-accent/50"
            >
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="font-medium leading-snug group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.authors} · {p.venue}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
              </a>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">对 ModelCred 的启示：</strong>
            当你告诉模型'这次表现会被记录到公开信誉分'，即使它并不清楚具体后果，
            '被评估'这一信号本身就可能触发更接近审慎状态的输出。这正是我们把评分入口嵌入日常使用场景的原因——让每一次反馈都既是数据，也是 gentle pressure。
          </p>
        </div>
      </div>
    </section>
  );
}
