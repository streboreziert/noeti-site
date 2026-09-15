import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { CalendarDays, Cpu, ArrowRight, ArrowLeft, CheckCircle, User, Mail, Clock } from "lucide-react";
import { models } from "@/data/models";
import { easeOutExpo } from "@/lib/motion";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 48 : -48,
    opacity: 0,
  }),
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dayLabel(dateIso: string) {
  const [y, mo, da] = dateIso.split("-").map(Number);
  const d = new Date(Date.UTC(y, mo - 1, da));
  return `${DAY_LABELS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

function timeFromKey(key: string) {
  return key.split(" ")[1] || "";
}

const Booking = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [location, setLocation] = useState(searchParams.get("plan") || "");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [tz, setTz] = useState("EET");
  const [slotsError, setSlotsError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [whenLabel, setWhenLabel] = useState("");

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan && models.some((m) => m.id === plan)) setLocation(plan);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/slots", { cache: "no-store" });
        if (!res.ok) throw new Error("slots");
        const data = await res.json();
        if (cancelled) return;
        setSlots(Array.isArray(data.slots) ? data.slots : []);
        if (data.tz) setTz(data.tz);
      } catch {
        if (!cancelled) setSlotsError("Could not load times. Refresh and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const slotsByDay = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const key of slots) {
      const dateIso = key.slice(0, 10);
      if (!map[dateIso]) map[dateIso] = [];
      map[dateIso].push(key);
    }
    return map;
  }, [slots]);

  const days = useMemo(() => Object.keys(slotsByDay).sort(), [slotsByDay]);
  const times = day ? slotsByDay[day] || [] : [];

  const handleStep1Continue = () => {
    if (!location || !slot) {
      toast.error("Choose a plan and a meeting time");
      return;
    }
    setDirection(1);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      toast.error("Name and Gmail address are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email — Gmail works best for the invite");
      return;
    }

    const plan = models.find((l) => l.id === location);
    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "booking",
          name,
          email,
          when: slot,
          message: `Setup for ${plan?.name ?? location} (€${plan?.price ?? ""}/mo, ${plan?.usage ?? ""} usage, ${plan?.projects ?? ""} live project${plan?.projects === 1 ? "" : "s"}).`,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 409) {
        toast.error("That slot was just taken. Pick another.");
        setSlots((prev) => prev.filter((s) => s !== slot));
        setSlot("");
        setDirection(-1);
        setStep(1);
        return;
      }
      if (!res.ok) {
        toast.error(body.error || "Could not book the meeting");
        return;
      }
      setMeetLink(body.meet_link || "");
      setWhenLabel(body.when || slot);
      setDirection(1);
      setStep(3);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setDirection(-1);
    setStep(1);
    setSlot("");
    setDay("");
    setName("");
    setEmail("");
    setMeetLink("");
    setWhenLabel("");
  };

  const getLocationLabel = (value: string) => models.find((l) => l.id === value)?.name || value;

  return (
    <section id="booking" className="py-32 lg:py-40 bg-accent/20" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">Setup</span>
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground tracking-tight">Book a setup meeting</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
            Choose a plan and a 30-minute slot. A Gmail invite is created automatically
            and lands on both calendars — yours and ours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: easeOutExpo }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-8 lg:p-10 shadow-soft border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    s === step ? "w-8 bg-primary" : s < step ? "w-4 bg-primary/50" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: easeOutExpo }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="location" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                          <Cpu className="h-3 w-3" />
                          Plan
                        </Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger id="location" className="rounded-md text-sm font-light">
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name} — €{loc.price}/mo · {loc.projects} live project{loc.projects === 1 ? "" : "s"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {location && (
                        <div className="text-xs text-muted-foreground font-light leading-relaxed">
                          {models.find((m) => m.id === location)?.usage} usage / mo
                          {" · "}
                          {models.find((m) => m.id === location)?.projects} live project
                          {(models.find((m) => m.id === location)?.projects ?? 0) === 1 ? "" : "s"}
                        </div>
                      )}

                      <div className="pt-4">
                        <Button
                          size="default"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                          onClick={handleStep1Continue}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center gap-1.5 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <CalendarDays className="h-3 w-3" />
                        Meeting — 30 min · {tz}
                      </Label>
                      <Select
                        value={day}
                        onValueChange={(value) => {
                          setDay(value);
                          setSlot("");
                        }}
                        disabled={!days.length}
                      >
                        <SelectTrigger className="rounded-md text-sm font-light">
                          <SelectValue placeholder={days.length ? "Choose a day" : "Loading days…"} />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((d) => (
                            <SelectItem key={d} value={d}>
                              {dayLabel(d)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {day && (
                        <div className="grid grid-cols-3 gap-2">
                          {times.map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSlot(key)}
                              className={`rounded-md border px-2 py-2 text-xs font-light transition-colors duration-500 ${
                                slot === key
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-foreground hover:border-primary/50"
                              }`}
                            >
                              <Clock className="h-3 w-3 inline mr-1 opacity-70" />
                              {timeFromKey(key)}
                            </button>
                          ))}
                        </div>
                      )}

                      {slotsError && <p className="text-xs text-destructive font-light">{slotsError}</p>}
                      {slot && (
                        <p className="text-xs text-muted-foreground font-light">
                          {dayLabel(slot.slice(0, 10))} · {timeFromKey(slot)} {tz}. The invite lands on both Gmail calendars.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: easeOutExpo }}
                >
                  <div className="space-y-6 max-w-md mx-auto">
                    <p className="text-xs text-muted-foreground font-light text-center">
                      {getLocationLabel(location)} · {dayLabel(slot.slice(0, 10))} · {timeFromKey(slot)} {tz}
                    </p>
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <User className="h-3 w-3" />
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-md text-sm font-light"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <Mail className="h-3 w-3" />
                        Gmail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-md text-sm font-light"
                      />
                      <p className="mt-2 text-[11px] text-muted-foreground font-light">
                        The invite is sent over Gmail and lands on this calendar and ours.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="default"
                        className="flex-1 rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                        onClick={() => {
                          setDirection(-1);
                          setStep(1);
                        }}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        size="default"
                        disabled={submitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                        onClick={handleSubmit}
                      >
                        {submitting ? "Sending invite…" : "Confirm meeting"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: easeOutExpo }}
                >
                  <div className="text-center py-8 space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25, duration: 0.7, ease: easeOutExpo }}
                    >
                      <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-light text-foreground">It's on both calendars</h3>
                      <p className="text-sm text-muted-foreground font-light">
                        {name}, a Gmail invite is on your calendar and on ours.
                      </p>
                    </div>

                    <div className="bg-accent/30 rounded-md p-4 max-w-sm mx-auto text-left space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Setup</p>
                      <div className="text-sm font-light text-foreground space-y-1">
                        <p>
                          <span className="text-muted-foreground">Plan:</span> {getLocationLabel(location)}
                        </p>
                        <p>
                          <span className="text-muted-foreground">When:</span> {whenLabel}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Gmail:</span> {email}
                        </p>
                        {meetLink && (
                          <p className="break-all">
                            <span className="text-muted-foreground">Join:</span>{" "}
                            <a href={meetLink} className="text-primary underline-offset-2 hover:underline">
                              {meetLink}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="default"
                      className="rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal mt-4"
                      onClick={handleReset}
                    >
                      Book another
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;
