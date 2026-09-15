const faults = [
  "Wrong cap value",
  "Cold solder joint",
  "Missing termination",
  "Open via",
  "Swapped resistors",
  "Rail sag",
  "Ground loop",
  "Solder bridge",
  "Op-amp clipping",
  "Ringing edge",
  "Bulk cap open",
  "Weak gate drive",
  "Crosstalk",
  "Regulator dropout",
];

const Row = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
    <div className={`flex shrink-0 gap-3 pr-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {[...faults, ...faults].map((d, i) => (
        <span
          key={i}
          className="shrink-0 rounded-full border border-border bg-card px-5 py-2 font-mono text-[11px] tracking-wide text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          {d}
        </span>
      ))}
    </div>
  </div>
);

/** The faults the model has named on real boards. */
const Marquee = () => (
  <section className="py-16 border-b border-border bg-background overflow-hidden">
    <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-8">Faults it names on the bench</p>
    <div className="space-y-3">
      <Row />
      <Row reverse />
    </div>
  </section>
);

export default Marquee;
