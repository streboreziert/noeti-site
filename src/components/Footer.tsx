import { Cpu, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/contact";
import { Reveal, Stagger, RevealItem } from "./motion/Reveal";

const pages = [
  { label: "Home", to: "/" },
  { label: "Plans", to: "/models" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => (
  <footer className="relative bg-ink text-white overflow-hidden grain">
    <div className="absolute inset-0 bg-dots-light opacity-25" />
    <div className="container mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-10 relative">
      <Stagger className="grid md:grid-cols-12 gap-12 lg:gap-8" gap={0.1}>
        <RevealItem className="md:col-span-5">
          <div className="flex items-center gap-2 mb-5">
            <Cpu className="h-4 w-4 text-glow" />
            <span className="text-sm tracking-wide">Noeti</span>
          </div>
          <p className="text-white/60 text-sm font-light leading-relaxed max-w-xs">
            Physical AI we designed and trained for circuits. After fabrication it helps engineers debug faster. Live at three companies.
          </p>
        </RevealItem>

        <RevealItem className="md:col-span-3">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-5">Pages</h4>
          <ul className="space-y-3">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="group inline-flex items-center gap-1 text-sm text-white/75 hover:text-white transition-colors">
                  <span className="relative">
                    {p.label}
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-glow transition-all duration-300 group-hover:w-full" style={{ backgroundColor: "hsl(var(--glow))" }} />
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <a href={`${import.meta.env.BASE_URL}#booking`} className="text-sm text-white/75 hover:text-white transition-colors">
                Subscribe
              </a>
            </li>
            <li>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-white/75 hover:text-white transition-colors">
                LinkedIn <ArrowUpRight className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </RevealItem>

        <RevealItem className="md:col-span-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-5">Contact</h4>
          <a href={`mailto:${CONTACT_EMAIL}`} className="glass inline-flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 text-sm hover:bg-white/15 transition-colors">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/25">
              <Mail className="h-3.5 w-3.5 text-glow" />
            </span>
            {CONTACT_EMAIL}
          </a>
          <p className="text-white/50 text-xs font-light mt-4">Latvia · Mon–Fri 9:00–17:00 EET</p>
        </RevealItem>
      </Stagger>

      <Reveal className="mt-20" amount={0.1}>
        <div className="text-[18vw] leading-none font-light tracking-tighter text-white/[0.04] select-none pointer-events-none -mb-[0.12em]" aria-hidden>
          Noeti
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/40 font-light">
          <p>&copy; 2026 Noeti. All rights reserved.</p>
          <p>SPICE asks: given this circuit, what voltage. We ask: given this voltage, what on the board.</p>
        </div>
      </Reveal>
    </div>
  </footer>
);

export default Footer;
