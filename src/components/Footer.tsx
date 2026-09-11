import { Cpu, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "@/lib/contact";
const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:gap-12">
          {/* Brand Row */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-4 w-4" />
              <span className="text-sm font-normal tracking-wide">Noeti</span>
            </div>
            <p className="text-background/70 text-xs font-light leading-relaxed max-w-xs">
              Hardware-based workflow workspace. Plan, draft, and run work across machines you control.
            </p>
          </div>

          {/* Pages Row - Two Columns on Mobile */}
          <div>
            <h4 className="text-sm font-medium mb-4">Pages</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/models" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Models
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Contact
                </Link>
              </li>
              <li>
                <a href={`${import.meta.env.BASE_URL}#booking`} className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Get Started
                </a>
              </li>
              <li>
                <a href="https://noeticompute.com" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Live network
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Row */}
          <div>
            <h4 className="text-sm font-medium mb-4">Contact Us</h4>
            <div className="flex flex-col gap-2 mb-8">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-background/70 hover:text-background smooth-hover text-xs font-light flex items-center gap-2"
              >
                <Mail className="h-3 w-3" />
                {CONTACT_EMAIL}
              </a>
              <p className="text-background/70 text-xs font-light">Mon - Fri: 9am - 5pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 mt-12 text-center text-background/50 text-xs font-light">
          <p>&copy; 2026 Noeti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
