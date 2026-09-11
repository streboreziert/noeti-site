import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, Heart, Compass, Shield, Users, Map } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import bannerImage from "@/assets/detail-lake-2.jpg";

const values = [
  {
    icon: Cpu,
    title: "Placement",
    description: "Models will keep changing. Control of the machine should not. Placement is the product.",
  },
  {
    icon: Heart,
    title: "Custody",
    description: "Sensitive drafts stay on hardware you choose. Cloud is an escalation, not a default.",
  },
  {
    icon: Compass,
    title: "Simplicity",
    description: "A simple office UI first. One approved local model. Canvas later, with templates.",
  },
  {
    icon: Shield,
    title: "Private-first",
    description: "Legal, research, compliance, finance — anyone who cannot pour a binder into someone else's cloud.",
  },
  {
    icon: Users,
    title: "Thin IT",
    description: "Built for offices without an ML team. We size the box, install, and leave a restart card.",
  },
  {
    icon: Map,
    title: "Visible Where",
    description: "A map of PC, phone, private rack, and cloud — so you can see the path the work took.",
  },
];

const About = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Image with Parallax */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <motion.img
          src={bannerImage}
          alt="Noeti — hardware you control"
          style={{ y }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <main>
        {/* Our Story Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">About Us</span>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-2 mb-8">Our Story</h1>

              <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                <p>
                  Noeti was born from a simple observation: today's AI products hide the machine. Work disappears
                  into one vendor cloud. You get speed, and lose custody. Privacy becomes a toggle. Routing is an
                  afterthought.
                </p>
                <p>
                  We set out to build the opposite — a hardware-based workflow workspace where you plan, draft, and
                  run work across your PC, phone, and private machines. It feels like a quiet board, but each step
                  can run where you choose.
                </p>
                <p>
                  We start with desks under pressure — legal, research, compliance, finance, NGOs — anyone who cannot
                  afford to pour a sensitive binder into someone else's default cloud. Models will keep changing.
                  Control of the machine should not.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Off-Grid Matters Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">The Why</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2 mb-8">Why Private Placement Matters</h2>

              <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                <p>
                  Most mid-market offices want private AI. They do not want to hire an ML team, fight with servers,
                  or figure out models. Noeti is the product that does that for them — install, simple chat, Canvas
                  when they are ready.
                </p>
                <p>
                  Local-first work is not an escape from useful models. It is a return to choosing the hardware.
                  When a draft is sensitive, it stays on the desk. When you need a smarter model, you escalate on
                  purpose — and you can see the path.
                </p>
                <p>
                  Three models keep the offer clear. Solo at €20 for one operator. Desk at €60 for a small floor.
                  Studio at €200 when the whole office needs private-first routing.
                </p>
                <p>
                  At Noeti, we believe reconnecting with the machine isn't an escape from modern AI — it's how you
                  keep it. And in that control, you find not just speed, but custody.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">What We Stand For</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2">Our Values</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 border border-border rounded-lg bg-card shadow-soft hover:shadow-md transition-shadow duration-300"
                >
                  <value.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="text-lg font-light tracking-tight mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
