import { Cpu, Monitor, Shield, Users, Workflow, HardDrive, Map, Lock } from "lucide-react";
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
    location: "For you",
    description:
      "Your machine first. Chat and Canvas on hardware you control — one seat, a handful of projects, and a quiet path onto the mesh when you ask for it.",
    rating: 4.9,
    price: 20,
    image: spotForest,
    images: [detailForest1, detailForest2, detailLake1],
    features: ["1 user", "3 projects", "2 devices"],
    featured: true,
    amenities: [
      { icon: Cpu, label: "Local models", description: "Run on the desk that owns the job" },
      { icon: HardDrive, label: "2 GB brain", description: "Private storage on your hardware" },
      { icon: Monitor, label: "2 devices", description: "Pair a PC and a phone" },
      { icon: Users, label: "1 seat", description: "Built for a single operator" },
    ],
    details: [
      "1 user seat",
      "3 saved projects",
      "2 paired devices",
      "2M cloud tokens when you escalate",
      "2 GB brain storage",
      "Chat and Canvas included",
    ],
    reviews: [
      { author: "Marta K.", rating: 5, date: "August 2026", comment: "Finally a workspace that stays on my laptop unless I send it out. The Where map is the whole product." },
      { author: "Jonas P.", rating: 5, date: "July 2026", comment: "Installed in an afternoon. Solo is enough to draft, run, and keep the binder local." },
      { author: "Elena V.", rating: 4, date: "June 2026", comment: "Quiet, simple, and it does not push me into someone else's cloud." },
      { author: "Rihards L.", rating: 5, date: "May 2026", comment: "The right size if you want control before you want a team." },
    ],
  },
  {
    id: "desk",
    name: "Desk",
    location: "For a small team",
    description:
      "A shared Where map for a small floor. Five people, one approved local model, and a board that shows which machine is doing the work.",
    rating: 5.0,
    price: 60,
    image: spotLake,
    images: [detailLake1, detailLake2, detailMeadow1],
    features: ["5 users", "15 projects", "8 devices"],
    featured: true,
    amenities: [
      { icon: Map, label: "Shared Where map", description: "See PC, phone, and private rack" },
      { icon: Users, label: "5 seats", description: "One model, many chats" },
      { icon: Workflow, label: "Canvas boards", description: "Workflows with local parts and scripts" },
      { icon: HardDrive, label: "15 GB brain", description: "Shared storage the team can count" },
    ],
    details: [
      "5 user seats",
      "15 saved projects",
      "8 paired devices",
      "8M cloud tokens when you escalate",
      "15 GB brain storage",
      "Roles for who can run where",
    ],
    reviews: [
      { author: "Anna B.", rating: 5, date: "August 2026", comment: "Our five-person office finally has ChatGPT-style help without pouring files into a vendor cloud." },
      { author: "Tomas D.", rating: 5, date: "July 2026", comment: "The board makes routing visible. People stop asking 'where did that go?'" },
      { author: "Inese R.", rating: 5, date: "June 2026", comment: "Simple enough that nobody needed a training day." },
      { author: "Markus H.", rating: 5, date: "May 2026", comment: "Desk is the plan we actually use. Solo was the trial; this is the floor." },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    location: "For a larger floor",
    description:
      "Private-first routing for a larger team. Twenty seats, a fleet of devices, and a default that keeps sensitive drafts on hardware you choose.",
    rating: 4.8,
    price: 200,
    image: spotMeadow,
    images: [detailMeadow1, detailMeadow2, detailForest1],
    features: ["20 users", "60 projects", "25 devices"],
    featured: true,
    amenities: [
      { icon: Shield, label: "Private-first routing", description: "Local by default, cloud only on purpose" },
      { icon: Lock, label: "Custody", description: "A trail of what ran, and on which machine" },
      { icon: Users, label: "20 seats", description: "A whole floor on one approved LLM" },
      { icon: Workflow, label: "Canvas at scale", description: "Boards, scripts, and site models together" },
    ],
    details: [
      "20 user seats",
      "60 saved projects",
      "25 paired devices",
      "30M cloud tokens when you escalate",
      "80 GB brain storage",
      "Private-first routing and Seal export",
    ],
    reviews: [
      { author: "Kristine A.", rating: 5, date: "August 2026", comment: "We needed a floor-wide UI without standing up an ML team. Studio is that product." },
      { author: "Pēteris N.", rating: 4, date: "July 2026", comment: "Routing and seats are clear. Legal finally agreed to keep drafts on our rack." },
      { author: "Sofia M.", rating: 5, date: "June 2026", comment: "Canvas plus local models is the workflow we could not get from a chatbot." },
      { author: "Andris J.", rating: 5, date: "May 2026", comment: "The 200 euro plan is the one that matches a real office, not a demo." },
    ],
  },
];

export const getFeaturedModels = () => models.filter((model) => model.featured);

export const getModelById = (id: string) => models.find((model) => model.id === id);

/** @deprecated Use models / getFeaturedModels */
export const locations = models;
export const getFeaturedLocations = getFeaturedModels;
export const getLocationById = getModelById;
