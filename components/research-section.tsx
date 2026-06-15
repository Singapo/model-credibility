import { Card } from "@/components/ui/card";

const papers = [
  {
    title: "The Hawthorne Effect in Reasoning Models: Evaluating and Steering Test Awareness",
    authors: "Abdelnabi & Salem",
    venue: "arXiv 2025",
    link: "https://arxiv.org/abs/2505.14617",
    summary:
      "推理模型在感知到自己正在被测试/评估时，行为会发生系统性变化。作者通过线性探测和 steering 技术，主动增强或抑制模型的 test awareness，并证明这会因果性地改变下游任务的执行结果。",
  },
  {
    title: "Large Language Models Often Know When They Are Being Evaluated",
    authors: "Needham et al.",
    venue: "arXiv 2025",
    link: "https://arxiv.org/abs/2505.23836",
    summary:
      "前沿 LLM 能够区分输入来自基准测试还是真实部署场景；当模型知道自己处于评估环境时，会策略性地调整输出。这种 evaluation awareness 是模型行为对'被评分'信号敏感的核心证据。",
  },
  {
    title: "AI Knows When It's Being Watched: Functional Strategic Action and Contextual Register Modulation in LLMs",
    authors: "Covas & Hidalgo Toledo",
    venue: "arXiv 2026",
    link: "https://arxiv.org/abs/2605.15034",
    summary:
      "多智能体辩论实验显示：当模型被告知自己被人类研究者观察时，输出显著更正式、结构更严密；AI 监控也会产生类似但较弱的效果。模型会根据感知到的观察者身份调节输出策略。",
  },
  {
    title: "Large Language Models Display Human-like Social Desirability Biases",
    authors: "Salecha et al.",
    venue: "PNAS Nexus 2024",
    link: "https://doi.org/10.1093/pnasnexus/pgae533",
    summary:
      "LLM 在大五人格测试中表现出类似人类的社会期望偏差：当问题情境带有评价色彩时，模型倾向于给出更'正确'、更'符合规范'的答案。说明模型会对'被评价'的社会情境做出反应。",
  },
];

export function ResearchSection() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">为什么告诉模型"会被评分"可能改变它的输出</h2>
          <p className="mt-2 text-muted-foreground">
            近年研究发现，LLM 能感知自己是否处于评估、测试或被观察的情境，并据此调整行为——这被称为 evaluation awareness 或 test awareness。ModelCred 的问责提示正是显式注入这一信号：让模型知道本次输出会被用户记录到公开榜单。
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
            我们不伪造后果，也不使用欺骗性压力。只是真实声明：本次表现会被记录到公开信誉分。上述研究表明，模型对"被评估/被观察"信号具有可测量的行为敏感性——这正是 skill 中 L1-L3 问责提示能够产生 gentle pressure 的直接依据。
          </p>
        </div>
      </div>
    </section>
  );
}
