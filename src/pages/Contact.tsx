import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ParallaxBanner } from "@/components/motion/ParallaxBanner";
import { PageTransition } from "@/components/motion/PageTransition";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, MessageSquare, FileText } from "lucide-react";
import bannerImage from "@/assets/detail-particles.jpg";
import { mailTo } from "@/lib/contact";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    mailTo(
      formData.subject || "Noeti contact",
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    );

    toast({
      title: "Opening your mail client",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <PageTransition className="min-h-screen overflow-x-hidden">
      <Navigation />

      <ParallaxBanner image={bannerImage} alt="Contact Noeti" eyebrow="Contact" title="Talk to the person who trained it." />

      <main className="py-24 lg:py-32 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
              Contact
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-normal tracking-[-0.02em] text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-sm text-muted-foreground font-light">
              A board on the bench, a netlist nobody remembers, a plan question — write to Riga.
            </p>
          </div>

          <Card className="p-8 lg:p-10 shadow-soft border border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                  <User className="h-3 w-3" />
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="rounded-md text-sm font-light"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                  <Mail className="h-3 w-3" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="rounded-md text-sm font-light"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                  <MessageSquare className="h-3 w-3" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="rounded-md text-sm font-light"
                />
              </div>

              <div>
                <Label htmlFor="message" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                  <FileText className="h-3 w-3" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={1000}
                  rows={5}
                  className="rounded-md resize-none text-sm font-light"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] uppercase tracking-wider font-normal"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Contact;
