import { Activity, Cpu, Layers, Shield } from "lucide-react";
import spotForest from "@/assets/spot-forest.jpg";
import spotLake from "@/assets/spot-lake.jpg";
import spotMeadow from "@/assets/spot-meadow.jpg";
import detailForest1 from "@/assets/detail-forest-1.jpg";
import detailForest2 from "@/assets/detail-forest-2.jpg";
import detailLake1 from "@/assets/detail-lake-1.jpg";
import detailLake2 from "@/assets/detail-lake-2.jpg";
import detailMeadow1 from "@/assets/detail-meadow-1.jpg";
import detailMeadow2 from "@/assets/detail-meadow-2.jpg";

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
  description: string;
  rating: number;
  price: number;
  usage: string;
  scale: string;
  projects: number;
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

export const models: Model[] = [
  {
    id: "solo",
    name: "Solo",
    location: "1× — your bench",
    description:
      "One live project. Compare what you measured — V(t), I(t) — to what .tran / .ac / operating point said should be there. Same physical model we trained in-house.",
    rating: 4.9,
    price: 20,
    usage: "2M",
    scale: "1×",
    projects: 1,
    image: spotForest,
    images: [detailForest1, detailForest2, detailLake1],
    features: ["2M usage", "1 live project"],
    featured: true,
    amenities: [
      { icon: Activity, label: "2M usage / mo", description: "Observed minus predicted, in volts and amps" },
      { icon: Layers, label: "1 live project", description: "One realized netlist after fabrication" },
      { icon: Cpu, label: "Physical model", description: "Closed weights. Topology, potential, current, constraint." },
    ],
    details: [
      "2M usage / month",
      "1 live project",
      "V(t), I(t) versus .tran / .ac / operating point",
      "First-pass fault: net, part, next probe",
      "1× base usage",
    ],
    reviews: [
      { author: "Marta K.", rating: 5, date: "August 2026", comment: "Put the Vgs capture against the .tran expected. It named the net I would have spent the afternoon probing." },
      { author: "Jonas P.", rating: 5, date: "July 2026", comment: "Residual in volts. First pass after fab named the part." },
      { author: "Elena V.", rating: 4, date: "June 2026", comment: "The object is ΔV on the schematic, not a paragraph about the circuit." },
      { author: "Rihards L.", rating: 5, date: "May 2026", comment: "1× usage. One live project. Enough for a bench." },
    ],
  },
  {
    id: "lab",
    name: "Lab",
    location: "5× Solo",
    description:
      "Five times Solo. 10M residual evaluations a month, three live projects. Analog and legacy netlists: expected edges from .tran / .ac versus what the instrument wrote. Same closed weights.",
    rating: 5.0,
    price: 60,
    usage: "10M",
    scale: "5×",
    projects: 3,
    image: spotLake,
    images: [detailLake1, detailLake2, detailMeadow1],
    features: ["10M usage", "3 live projects"],
    featured: true,
    amenities: [
      { icon: Activity, label: "10M usage / mo", description: "5× Solo. Residual evaluations per month" },
      { icon: Layers, label: "3 live projects", description: "Three realized netlists after fabrication" },
      { icon: Cpu, label: "Closed weights", description: "Trained on trajectories. Residual stays SI." },
    ],
    details: [
      "10M usage / month — 5× Solo",
      "3 live projects",
      "Analog and legacy netlists",
      "Fault named with nets and parts",
      "Same physical model as Solo",
    ],
    reviews: [
      { author: "Anna B.", rating: 5, date: "August 2026", comment: "Expected edge from .tran, captured edge from the scope. The disagreement is the object." },
      { author: "Tomas D.", rating: 5, date: "July 2026", comment: "5× usage. The lab actually spends it on analog bring-up." },
      { author: "Inese R.", rating: 5, date: "June 2026", comment: "Analog time dropped ≈40%. We still own the probe." },
      { author: "Markus H.", rating: 5, date: "May 2026", comment: "Lab is the 5× plan. Same residual, three live projects." },
    ],
  },
  {
    id: "company",
    name: "Company",
    location: "20× Solo",
    description:
      "Twenty times Solo. 40M residual evaluations a month, ten live projects. Priority inference after fabrication across a hardware line. Architecture and training run are ours.",
    rating: 4.8,
    price: 200,
    usage: "40M",
    scale: "20×",
    projects: 10,
    image: spotMeadow,
    images: [detailMeadow1, detailMeadow2, detailForest1],
    features: ["40M usage", "10 live projects"],
    featured: true,
    amenities: [
      { icon: Shield, label: "Priority inference", description: "First in line after fabrication" },
      { icon: Activity, label: "40M usage / mo", description: "20× Solo. Residual evaluations per month" },
      { icon: Layers, label: "10 live projects", description: "Ten realized netlists after fabrication" },
    ],
    details: [
      "40M usage / month — 20× Solo",
      "10 live projects",
      "Priority inference after fabrication",
      "Observed minus predicted in SI units",
      "Same physical model as Solo",
    ],
    reviews: [
      { author: "Kristine A.", rating: 5, date: "August 2026", comment: "20× usage. The model is topology and state, not language about the line." },
      { author: "Pēteris N.", rating: 4, date: "July 2026", comment: "After fabrication is where the time lives. That is what we bought." },
      { author: "Sofia M.", rating: 5, date: "June 2026", comment: "First-pass fault named often enough that bring-up procedure changed." },
      { author: "Andris J.", rating: 5, date: "May 2026", comment: "Company matches a hardware line. Ten live projects, same residual." },
    ],
  },
];

export const getFeaturedModels = () => models.filter((model) => model.featured);

export const getModelById = (id: string) => {
  if (id === "desk") return models.find((model) => model.id === "lab");
  if (id === "studio") return models.find((model) => model.id === "company");
  return models.find((model) => model.id === id);
};

export const locations = models;
export const getFeaturedLocations = getFeaturedModels;
export const getLocationById = getModelById;
