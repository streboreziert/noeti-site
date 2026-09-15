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
  cases: Case[];
}

/** Three plans, one model. Usage at 1×, 5×, 20×. Live projects at 1, 3, 10. */
export const models: Model[] = [
  {
    id: "solo",
    name: "Solo",
    location: "1× — your bench",
    tagline: "One bench. One board at a time.",
    description:
      "The same model as Lab and Company, metered for one bench. Upload a capture or connect a scope, get a fault hypothesis back, probe again.",
    price: 20,
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
    details: [
      "2M usage per month",
      "1 live project",
      "Live scope, logger or uploaded capture",
      "Residual ΔV, ΔI against .tran / .ac / OP",
      "Fault hypothesis with evidence",
      "Same model as Lab and Company",
    ],
    cases: [
      { net: "CLK_A → U3.7", symptom: "Clock edge rounded, never reaches 3.3 V", cause: "C7 fitted as 10 nF instead of 100 pF" },
      { net: "AOUT ← U2.6", symptom: "Sine flat-topped on the negative half", cause: "VEE open at U2.4" },
      { net: "3V3 rail", symptom: "100 Hz sawtooth, 280 mV", cause: "Bulk cap C1 cold joint" },
    ],
  },
  {
    id: "lab",
    name: "Lab",
    location: "5× Solo",
    tagline: "Several boards in bring-up at once.",
    description:
      "Five times the usage, three live projects. For a lab with more than one board on the bench and one engineer chasing all of them.",
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
    cases: [
      { net: "SPI_SCK → J2", symptom: "Overshoot and ringing on every edge", cause: "No series termination at R12" },
      { net: "PWM_OUT → Q1.G", symptom: "Sine where the square should be", cause: "R5 and R6 swapped" },
      { net: "ADC_IN", symptom: "Reading 40 mV low, drifts with temperature", cause: "Open via under R31, leakage path" },
    ],
  },
  {
    id: "company",
    name: "Company",
    location: "20× Solo",
    tagline: "Bring-up, field, and returns for the whole floor.",
    description:
      "Twenty times the usage, ten live projects, invoice billing. For the company whose unsolved work is on boards that already exist.",
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
    cases: [
      { net: "CAN_H / CAN_L", symptom: "Bus errors after 20 minutes in the field", cause: "Cracked termination resistor, 60 Ω → open" },
      { net: "VBAT sense", symptom: "Returned units read 0.3 V high", cause: "Divider R44 wrong reel, 47k fitted as 4k7" },
      { net: "LDO_EN", symptom: "Board brown-outs on cold start", cause: "Pull-down R9 missing, enable floats" },
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
