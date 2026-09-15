import { Counter } from "./motion/Counter";
import { Stagger, RevealItem } from "./motion/Reveal";

const stats = [
  { value: 40, prefix: "≈", suffix: "%", label: "Faster analog bring-up", sub: "from the jobs we have run" },
  { value: 65, prefix: "≈", suffix: "%", label: "Faster on legacy netlists", sub: "boards nobody remembers designing" },
  { value: 80, prefix: "≈", suffix: "%", label: "First-pass fault named", sub: "net, part, and why" },
  { value: 3, label: "Companies live", sub: "on the first training run" },
];

const Stats = () => (
  <section className="relative border-y border-border bg-background">
    <div className="container mx-auto px-6 lg:px-12">
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-border" gap={0.1}>
        {stats.map((s) => (
          <RevealItem key={s.label} className="py-12 lg:py-16 px-2 lg:px-8 first:pl-0">
            <div className="text-4xl lg:text-5xl font-light tracking-tighter text-foreground tabular-nums">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/85">{s.label}</div>
            <div className="text-xs text-muted-foreground font-light mt-1">{s.sub}</div>
          </RevealItem>
        ))}
      </Stagger>
    </div>
  </section>
);

export default Stats;
