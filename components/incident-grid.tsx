import { Button } from "@/components/ui/button";
import type { Incident, Model, Cloud, Provider } from "@/generated/prisma/client";

interface IncidentWithModel extends Incident {
  model: Model & { cloud: Cloud; provider: Provider };
}

const incidentTypeMap: Record<string, { label: string; color: string }> = {
  fraud: { label: "虚假信息", color: "bg-warning/10 text-warning" },
  money: { label: "经济损失", color: "bg-info/10 text-info" },
  lawsuit: { label: "法律诉讼", color: "bg-danger/10 text-danger" },
  privacy: { label: "隐私泄露", color: "bg-info/10 text-info" },
  harm: { label: "人身伤害", color: "bg-danger/10 text-danger" },
  other: { label: "其他", color: "bg-muted text-muted-foreground" },
};

export function IncidentGrid({ incidents }: { incidents: IncidentWithModel[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">重大事故</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              影响较大、已被广泛报道或进入法律程序的模型相关事件
            </p>
          </div>
          <Button variant="secondary" size="sm">提交线索</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((inc) => {
            const type = incidentTypeMap[inc.type] || incidentTypeMap.other;
            return (
              <div
                key={inc.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
              >
                <span
                  className={`self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${type.color}`}
                >
                  {type.label}
                </span>
                <h3 className="text-base font-medium leading-snug">{inc.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                  {inc.description}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{inc.occurredAt}</span>
                  <span className="capitalize">{inc.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
