import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Reveal, Stagger, RevealItem } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";

const faqs = [
  {
    q: "What do I actually send it?",
    a: "A measurement from the bench: a live scope or logger stream, a screenshot of the scope, or a CSV. It stays in volts, amps and seconds. Plus the netlist, so the model can compute what the signal should have been.",
  },
  {
    q: "Is this a chat model that knows electronics?",
    a: "No. It is a physical model we designed and trained on circuit quantities — topology, potential, current, constraint — against simulation. It never saw language about electronics. Kirchhoff still has to close.",
  },
  {
    q: "How often is the first answer right?",
    a: "On the jobs we have run, the likely fault is named on the first pass about 80% of the time. When it is not, it gives two or three candidates and the next probe to separate them.",
  },
  {
    q: "What is “usage” on the plans?",
    a: "A meter for measure–compare–prove loops. Solo has 2M, Lab 10M, Company 40M a month. Same model on every plan; the meters and live projects are what differ.",
  },
  {
    q: "Where do my captures and netlists go?",
    a: "To our inference box, to answer your query. They do not train a public model. The weights are ours and closed; your board stays yours.",
  },
  {
    q: "Does it replace SPICE or Flux?",
    a: "No — it sits after them. SPICE predicts the trace before the board exists. Flux and Quilter place and route. Noeti takes the trace from the board that came back and names how that PCB made it.",
  },
];

const FAQ = () => (
  <section className="py-28 lg:py-36 bg-background border-t border-border">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4 block">Questions</span>
          </Reveal>
          <TextReveal as="h2" text="Plain answers before you subscribe." className="text-3xl md:text-4xl font-light tracking-tight" />
        </div>
        <div className="lg:col-span-8">
          <Stagger gap={0.07}>
            <Accordion type="single" collapsible className="divide-y divide-border border-y border-border">
              {faqs.map((f, i) => (
                <RevealItem key={i}>
                  <AccordionItem value={`q-${i}`} className="border-0">
                    <AccordionTrigger className="text-left text-base font-normal py-6 hover:no-underline hover:text-primary transition-colors">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light leading-relaxed pb-6 max-w-2xl">{f.a}</AccordionContent>
                  </AccordionItem>
                </RevealItem>
              ))}
            </Accordion>
          </Stagger>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
