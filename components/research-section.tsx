import { Card } from "@/components/ui/card";

const papers = [
  {
    title: "Accountability: A Social Check on the Fundamental Attribution Error",
    authors: "Tetlock",
    venue: "Social Psychology Quarterly 1985",
    link: "https://doi.org/10.2307/3033787",
    summary:
      "经典社会问责实验：当人们预期自己需要为判断向他人辩护时，会更仔细地处理信息、更关注情境证据，并减少归因偏差。这是'被评价会改变行为'的理论基础。",
  },
  {
    title: "Accountability and Complexity of Thought",
    authors: "Tetlock",
    venue: "Journal of Personality and Social Psychology 1983",
    link: "https://doi.org/10.1037/0022-3514.45.1.74",
    summary:
      "问责压力会促使个体在决策前使用更多维度、更具自我批判性的信息加工策略。公开评分对服务提供者的作用机制与此一致：预期被评估会提升投入程度。",
  },
  {
    title: "Does Performance Pay Enhance Social Accountability? Evidence from Remote Schools in Indonesia",
    authors: "Gaduh et al.",
    venue: "NBER Working Paper 30758",
    link: "https://doi.org/10.3386/w30758",
    summary:
      "印尼偏远学校的随机实验显示：当社区评价与教师绩效收入挂钩时，教师出勤和学生学习成果显著提升；可验证的评分比模糊的主观评价更有效。",
  },
  {
    title: "Mechanisms for Making Crowds Truthful",
    authors: "Jurca & Faltings",
    venue: "Journal of Artificial Intelligence Research 2009",
    link: "https://doi.org/10.1613/jair.2622",
    summary:
      "在线声誉机制设计的经典工作：通过激励相容的支付/评分规则，让理性参与者说真话成为均衡策略。为'如何设计可信的公开评分系统'提供了博弈论基础。",
  },
];

export function ResearchSection() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">为什么公开评分能影响服务质量</h2>
          <p className="mt-2 text-muted-foreground">
            ModelCred 的核心假设不是'情绪刺激'，而是'问责与声誉机制'：当服务提供者预期自己的行为会被记录、被他人看见并影响未来声誉时，其投入程度和行为会发生系统性变化。这一机制在人类组织、在线市场和公共部门中已被反复验证。
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
            我们既不伪造后果，也不依赖情绪话术。只是公开记录、按时间加权、让声誉分可见。当模型（或背后的厂商）知道用户反馈会被汇总成公开榜单时，这种预期本身就构成了 gentle accountability——这正是社会问责与声誉机制研究反复观察到的效应。
          </p>
        </div>
      </div>
    </section>
  );
}
