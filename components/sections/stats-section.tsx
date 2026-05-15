import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import type { StatisticItem } from "@/types/domain";

export function StatsSection({
  content,
}: {
  content: StatisticItem[];
}) {
  return (
    <SectionShell id="statistics" className="pt-0">
      <div className="surface-panel panel-outline rounded-[2rem] border border-border px-5 py-5 md:px-6 md:py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <Card interactive className="h-full border-white/6 bg-black/12 p-6 shadow-none">
                <p className="text-[2.4rem] font-semibold tracking-[-0.05em] text-accent">
                  {item.value}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.label}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
