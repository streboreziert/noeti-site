import { Activity, Gauge, Layers, Users, FileInput, Cpu, ShieldCheck, Receipt } from "lucide-react";
import modelSolo from "@/assets/model-solo.jpg";
import modelDesk from "@/assets/model-desk.jpg";
import modelStudio from "@/assets/model-studio.jpg";
import detailContours from "@/assets/detail-contours.jpg";
import detailTraces from "@/assets/detail-traces.jpg";
import detailHex from "@/assets/detail-hex.jpg";
import detailWave from "@/assets/detail-wave.jpg";
import detailParticles from "@/assets/detail-particles.jpg";
import detailRack from "@/assets/detail-rack.jpg";

export interface Review {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Model {
  id: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  rating: number;
  price: number;
  image: string;
  images: string[];
  features: string[];
  featured: boolean;
  amenities: {
    icon: any;
    label: string;
    description: string;
  }[];
  details: string[];
  reviews: Review[];
}

/** Three plans, one model. Usage at 1×, 5×, 20×. Live projects at 1, 3, 10. */
export const models: Model[] = [
  {
    id: "solo",
    name: "Solo",
    location: "1× — your bench",
    tagline: "One engineer, one scope, one board at a time.",
    description:
      "The same closed-weight physical model, sized for a single bench. Upload a capture or connect a scope, get a fault hypothesis back, probe again.",
    rating: 4.9,
    price: 20,
    image: modelSolo,
    images: [detailTraces, detailContours, detailParticles],
    features: ["2M usage", "1 live project", "Scope, logger or capture"],
    featured: true,
    amenities: [
      { icon: Gauge, label: "2M usage", description: "Meter for measure–compare–prove loops" },
      { icon: Layers, label: "1 live project", description: "One netlist and its captures at a time" },
      { icon: FileInput, label: "Any capture", description: "Waveform, screenshot or CSV in SI units" },
      { icon: Users, label: "1 seat", description: "Built for a single operator" },
    ],
    details: [
      "2M usage per month",
      "1 live project",
      "Live scope, logger or uploaded capture",
      "Residual ΔV, ΔI against .tran / .ac / OP",
      "Fault hypothesis with evidence",
      "Same model as Lab and Company",
    ],
    reviews: [
      { author: "Marta K.", rating: 5, date: "August 2026", comment: "First board back from fab, clock edge was rounded. It pointed at the wrong-value cap on the first pass." },
      { author: "Jonas P.", rating: 5, date: "July 2026", comment: "I photograph the scope screen, it reads the trace. That alone saves me an evening a week." },
      { author: "Elena V.", rating: 4, date: "June 2026", comment: "Not magic — it names two or three candidates. But they are the right two or three." },
      { author: "Rihards L.", rating: 5, date: "May 2026", comment: "Good size for a one-person shop. When the team grew we moved to Lab." },
    ],
  },
  {
    id: "lab",
    name: "Lab",
    location: "5× Solo",
    tagline: "A small lab with several boards in bring-up at once.",
    description:
      "Five times the usage, three live projects. For a lab where more than one board is on the bench and the residuals pile up faster than one engineer can chase them.",
    rating: 5.0,
    price: 60,
    image: modelDesk,
    images: [detailHex, detailWave, detailTraces],
    features: ["10M usage", "3 live projects", "Shared captures"],
    featured: true,
    amenities: [
      { icon: Gauge, label: "10M usage", description: "Five Solo meters on one account" },
      { icon: Layers, label: "3 live projects", description: "Three netlists in bring-up at once" },
      { icon: Activity, label: "Shared captures", description: "Everyone sees the same residuals" },
      { icon: Users, label: "Lab seats", description: "One account, the whole bench" },
    ],
    details: [
      "10M usage per month",
      "3 live projects",
      "Shared captures and hypotheses",
      "Legacy netlist support",
      "Priority on the inference box",
      "Same model as Solo and Company",
    ],
    reviews: [
      { author: "Anna B.", rating: 5, date: "August 2026", comment: "Three boards in bring-up, one account. The residual view is where the morning standup happens now." },
      { author: "Tomas D.", rating: 5, date: "July 2026", comment: "Old netlist, nobody remembers the design intent. It still found the open via." },
      { author: "Inese R.", rating: 5, date: "June 2026", comment: "Simple enough that the intern used it on day two." },
      { author: "Markus H.", rating: 5, date: "May 2026", comment: "Lab is the plan we actually use. Solo was the trial." },
    ],
  },
  {
    id: "company",
    name: "Company",
    location: "20× Solo",
    tagline: "Bring-up, diagnosis, field and returns across the whole floor.",
    description:
      "Twenty times the usage, ten live projects, invoicing. The regime after synthesis is where the unsolved work is — this plan is for the company that lives there.",
    rating: 4.8,
    price: 200,
    image: modelStudio,
    images: [detailRack, detailContours, detailHex],
    features: ["40M usage", "10 live projects", "Invoice billing"],
    featured: true,
    amenities: [
      { icon: Gauge, label: "40M usage", description: "Twenty Solo meters on one account" },
      { icon: Layers, label: "10 live projects", description: "Bring-up, field and returns together" },
      { icon: Receipt, label: "Invoice", description: "Yearly invoice instead of a card" },
      { icon: ShieldCheck, label: "Closed weights", description: "Your captures never train a public model" },
    ],
    details: [
      "40M usage per month",
      "10 live projects",
      "Invoice billing, €2,400 / year",
      "Field and returns diagnosis",
      "Setup meeting and restart card",
      "Same model as Solo and Lab",
    ],
    reviews: [
      { author: "Kristine A.", rating: 5, date: "August 2026", comment: "Returns used to be a shrug. Now they come back with a named net." },
      { author: "Pēteris N.", rating: 4, date: "July 2026", comment: "Analog bring-up went from twelve weeks to about seven on the last project." },
      { author: "Sofia M.", rating: 5, date: "June 2026", comment: "It sits on the scope. Flux and SPICE sit before fab. Different job." },
      { author: "Andris J.", rating: 5, date: "May 2026", comment: "Company at €200 is a tenth of one Nordic engineer-week. Easy invoice to sign." },
    ],
  },
];

export const getFeaturedModels = () => models.filter((model) => model.featured);

export const getModelById = (id: string) => models.find((model) => model.id === id);

/** @deprecated Use models / getFeaturedModels */
export const locations = models;
export const getFeaturedLocations = getFeaturedModels;
export const getLocationById = getModelById;

// Old ids from the first site keep working.
export const legacyIds: Record<string, string> = { desk: "lab", studio: "company" };
