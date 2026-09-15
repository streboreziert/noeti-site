import { motion } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";
import { EASE } from "@/lib/motion";

const cols = ["Flux, Quilter, DeepPCB", "SPICE / Ansys", "Chat models", "Noeti"];
const rows = [
  ["When", "Before fab", "Before the board exists", "Anytime", "After fab, on the bench"],
  ["Input", "Netlist, layout", "Schematic", "A prompt", "A measured waveform"],
  ["Does", "Place, route, copilot", "Predicts the trace", "Writes about electronics", "Names how this PCB made that trace"],
  ["Physics", "DRC, some constraints", "Forward sim", "None", "r = measured − simulated"],
  ["Job it does not do", "Live debug", "The broken board", "The bench", "Design the next PCB"],
];

/** The deck's comparison slide: none of them sit on the scope. */
const Compare = () => (
  <section className="py-28 lg:py-36 bg-background">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="max-w-2xl mb-12">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-5 block">Others</span>
        </Reveal>
        <TextReveal as="h2" text="Flux, Quilter, SPICE, chat — none of them sit on the scope." className="text-3xl md:text-4xl font-light tracking-tight" />
      </div>

      <Reveal>
        <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-mono text-[11px] uppercase tracking-[0.18em] font-normal text-muted-foreground py-3 pr-4" />
                {cols.map((c, i) => (
                  <th
                    key={c}
                    className={`text-left font-mono text-[11px] uppercase tracking-[0.18em] font-normal py-3 px-4 ${i === cols.length - 1 ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <motion.tr
                  key={r[0]}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ri * 0.08, duration: 0.5, ease: EASE }}
                  className="border-b border-border"
                >
                  <td className="py-4 pr-4 text-muted-foreground font-light whitespace-nowrap">{r[0]}</td>
                  {r.slice(1).map((cell, ci) => (
                    <td key={ci} className={`py-4 px-4 font-light ${ci === 3 ? "text-foreground bg-primary/[0.06] border-x border-primary/20" : "text-foreground/75"}`}>
                      {cell}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground font-light mt-5 max-w-2xl leading-relaxed">
          DeepPCB uses RL to route copper that is not made yet. We use RL on copper that is already on the table. Design review still
          sits before fab. Bring-up is the gap.
        </p>
      </Reveal>
    </div>
  </section>
);

export default Compare;
