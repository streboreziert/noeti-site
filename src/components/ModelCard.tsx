import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import type { Model } from "@/data/models";
import { TiltCard } from "./motion/TiltCard";

interface ModelCardProps {
  model: Model;
  highlight?: boolean;
  tilt?: boolean;
}

/** Pricing card used on the home fan and the /models grid. */
const ModelCard = ({ model, highlight = false, tilt = true }: ModelCardProps) => {
  const inner = (
    <Link
      to={`/model/${model.id}`}
      className={`group relative block overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow duration-500 hover:shadow-hover ${
        highlight ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="relative h-52 overflow-hidden bg-ink">
        <img
          src={model.image}
          alt={model.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">{model.location}</div>
            <div className="text-2xl font-light tracking-tight">{model.name}</div>
          </div>
          {highlight && (
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground">Most used</span>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5 min-h-[40px]">{model.tagline}</p>
        <ul className="space-y-2 mb-6">
          {model.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-2.5 w-2.5" />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border pt-5">
          <div>
            <span className="text-3xl font-light tracking-tighter text-foreground">€{model.price}</span>
            <span className="text-muted-foreground text-xs font-light ml-1">/ month</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-primary group-hover:gap-3 transition-all">
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );

  if (!tilt) return inner;
  return <TiltCard className="group relative">{inner}</TiltCard>;
};

export default ModelCard;
