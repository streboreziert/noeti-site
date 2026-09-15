import { Activity, Gauge, Layers, Users, FileInput, ShieldCheck, Receipt, Server, Headset, Building2 } from "lucide-react";
import modelSolo from "@/assets/model-solo.jpg";
import modelDesk from "@/assets/model-desk.jpg";
import modelStudio from "@/assets/model-studio.jpg";
import modelEnterprise from "@/assets/detail-rack.jpg";
import detailContours from "@/assets/detail-contours.jpg";
import detailTraces from "@/assets/detail-traces.jpg";
import detailHex from "@/assets/detail-hex.jpg";
import detailWave from "@/assets/detail-wave.jpg";
import detailParticles from "@/assets/detail-particles.jpg";
import detailRack from "@/assets/detail-rack.jpg";

/** A job the model has run on a real board: what came back, what it named. */
export interface Case {
  net: string;
  symptom: string;
  cause: string;
}

export interface Model {
  id: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  /** €/month; null = custom, talk to us */
  price: number | null;
  billing: string;
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
  cases: Case[];
}

/** Four plans, one model. Usage at 1×, 5×, 20×; Enterprise is sized per site. */
export const models: Model[] = [
  {
    id: "pro",
    name: "Pro",
    location: "1× — your bench",
    tagline: "One bench. One board at a time.",
    description:
      "The same model as every other plan, metered for one bench. Upload a capture or connect a scope, get a fault hypothesis back, probe again.",
    price: 20,
    billing: "Card, monthly",
    image: modelSolo,
    images: [detailTraces, detailContours, detailParticles],
    features: ["2M usage", "1 live project", "Scope, logger, or capture"],
    featured: true,
    amenities: [
      { icon: Gauge, label: "2M usage", description: "Meter for measure–compare–prove loops" },
      { icon: Layers, label: "1 live project", description: "One netlist and its captures at a time" },
      { icon: FileInput, label: "Any capture", description: "Waveform, screenshot or CSV in SI units" },
      { icon: Users, label: "1 seat", description: "Built for a single operator" },
    ],
    details: ["2M usage per month", "1 live project", "Live scope, logger or uploaded capture", "Residual ΔV, ΔI against .tran / .ac / OP", "Fault hypothesis with evidence", "Card, monthly, cancel any time"],
    cases: [
      { net: "CLK_A → U3.7", symptom: "Clock edge rounded, never reaches 3.3 V", cause: "C7 fitted as 10 nF instead of 100 pF" },
      { net: "AOUT ← U2.6", symptom: "Sine flat-topped on the negative half", cause: "VEE open at U2.4" },
      { net: "3V3 rail", symptom: "100 Hz sawtooth, 280 mV", cause: "Bulk cap C1 cold joint" },
    ],
  },
  {
    id: "pro-plus",
    name: "Pro+",
    location: "5× Pro",
    tagline: "Several boards in bring-up at once.",
    description: "Five times the usage, three live projects. For a lab with more than one board on the bench and one engineer chasing all of them.",
    price: 60,
    billing: "Card, monthly or yearly",
    image: modelDesk,
    images: [detailHex, detailWave, detailTraces],
    features: ["10M usage", "3 live projects", "Shared captures"],
    featured: true,
    amenities: [
      { icon: Gauge, label: "10M usage", description: "Five Pro meters on one account" },
      { icon: Layers, label: "3 live projects", description: "Three netlists in bring-up at once" },
      { icon: Activity, label: "Shared captures", description: "Everyone sees the same residuals" },
      { icon: Users, label: "Lab seats", description: "One account, the whole bench" },
    ],
    details: ["10M usage per month", "3 live projects", "Shared captures and hypotheses", "Legacy netlist support", "Priority on the inference box", "Card, monthly or yearly"],
    cases: [
      { net: "SPI_SCK → J2", symptom: "Overshoot and ringing on every edge", cause: "No series termination at R12" },
      { net: "PWM_OUT → Q1.G", symptom: "Sine where the square should be", cause: "R5 and R6 swapped" },
      { net: "ADC_IN", symptom: "Reading 40 mV low, drifts with temperature", cause: "Open via under R31, leakage path" },
    ],
  },
  {
    id: "max",
    name: "Max",
    location: "20× Pro",
    tagline: "Bring-up, field, and returns for the whole floor.",
    description: "Twenty times the usage, ten live projects, invoice billing. For the company whose unsolved work is on boards that already exist.",
    price: 200,
    billing: "Card or yearly invoice",
    image: modelStudio,
    images: [detailRack, detailContours, detailHex],
    features: ["40M usage", "10 live projects", "Invoice billing"],
    featured: true,
    amenities: [
      { icon: Gauge, label: "40M usage", description: "Twenty Pro meters on one account" },
      { icon: Layers, label: "10 live projects", description: "Bring-up, field and returns together" },
      { icon: Receipt, label: "Invoice", description: "Yearly invoice, €2,400, PO accepted" },
      { icon: ShieldCheck, label: "Closed weights", description: "Your captures never train a public model" },
    ],
    details: ["40M usage per month", "10 live projects", "Yearly invoice, €2,400, PO accepted", "Field and returns diagnosis", "Setup meeting and restart card", "Same model as Pro and Pro+"],
    cases: [
      { net: "CAN_H / CAN_L", symptom: "Bus errors after 20 minutes in the field", cause: "Cracked termination resistor, 60 Ω → open" },
      { net: "VBAT sense", symptom: "Returned units read 0.3 V high", cause: "Divider R44 wrong reel, 47k fitted as 4k7" },
      { net: "LDO_EN", symptom: "Board brown-outs on cold start", cause: "Pull-down R9 missing, enable floats" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    location: "Sized per site",
    tagline: "Your own inference box, on your floor.",
    description:
      "The model on hardware you own, behind your firewall. Unlimited live projects, a training queue for your board families, a person in Riga who answers the phone.",
    price: null,
    billing: "Yearly invoice, PO, custom terms",
    image: modelEnterprise,
    images: [detailRack, detailTraces, detailWave],
    features: ["On-prem inference box", "Unlimited live projects", "Priority training queue"],
    featured: true,
    amenities: [
      { icon: Server, label: "On-prem box", description: "Inference on your rack, nothing leaves the site" },
      { icon: Layers, label: "Unlimited projects", description: "Every board family, every returns bin" },
      { icon: Headset, label: "Named engineer", description: "Setup, restart card, and a direct line" },
      { icon: Building2, label: "Procurement-ready", description: "Yearly invoice, PO, DPA, custom terms" },
    ],
    details: ["Inference box installed on your floor", "Unlimited live projects and seats", "Priority queue for training on your board families", "Named engineer, direct line", "Yearly invoice, PO, DPA", "Same closed weights as every plan"],
    cases: [
      { net: "Fleet · 1,200 units", symptom: "3% field failures, no pattern in the returns bin", cause: "One reel of C22 below spec — traced to a date code" },
      { net: "Line test · station 4", symptom: "Intermittent boot fail at end-of-line", cause: "Pogo pin worn on the test fixture, not the board" },
      { net: "Legacy · rev B", symptom: "Board nobody has the schematic for", cause: "Netlist rebuilt from the layout, fault named on pass two" },
    ],
  },
];

export const getFeaturedModels = () => models.filter((model) => model.featured);

export const getModelById = (id: string) => models.find((model) => model.id === id);

/** Price label for cards and detail pages. */
export const priceLabel = (m: Model) => (m.price === null ? "Custom" : `€${m.price}`);

/** @deprecated Use models / getFeaturedModels */
export const locations = models;
export const getFeaturedLocations = getFeaturedModels;
export const getLocationById = getModelById;

// Old ids keep working.
export const legacyIds: Record<string, string> = { solo: "pro", lab: "pro-plus", company: "max", desk: "pro-plus", studio: "max" };
