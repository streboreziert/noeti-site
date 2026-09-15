import { Cpu, Mail, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/contact";
const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:gap-12">
          {/* Brand Row */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-4 w-4" />
              <span className="text-sm font-normal tracking-wide">Noeti</span>
            </div>
            <p className="text-white/70 text-xs font-light leading-relaxed max-w-sm">
              Physical AI we designed and trained for circuits.
              After fabrication it helps engineers debug faster. Live at three companies.
            </p>
          </div>

          {/* Pages Row - Two Columns on Mobile */}
          <div>
            <h4 className="text-sm font-medium mb-4">Pages</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link to="/" className="text-white/70 hover:text-white smooth-hover text-xs font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/models" className="text-white/70 hover:text-white smooth-hover text-xs font-light">
                  Models
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white smooth-hover text-xs font-light">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white smooth-hover text-xs font-light">
                  Contact
                </Link>
              </li>
              <li>
                <a href={`${import.meta.env.BASE_URL}#booking`} className="text-white/70 hover:text-white smooth-hover text-xs font-light">
                  Subscribe
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Row */}
          <div>
            <h4 className="text-sm font-medium mb-4">Contact</h4>
            <div className="flex flex-col gap-2 mb-8">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white/70 hover:text-white smooth-hover text-xs font-light flex items-center gap-2"
              >
                <Mail className="h-3 w-3" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/70 hover:text-white smooth-hover text-xs font-light flex items-center gap-2"
              >
                <Linkedin className="h-3 w-3" strokeWidth={1.5} />
                LinkedIn
              </a>
            <p className="text-white/70 text-xs font-light">Latvia · Mon–Fri 9:00–17:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 pt-8 mt-12 text-center text-white/40 text-xs font-light">
          <p>&copy; 2026 Noeti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
