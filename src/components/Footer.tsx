import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-foreground/10">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-heading text-2xl font-bold text-foreground">
                GlobalDish<span className="text-primary">Kits</span>
              </span>
            </Link>
            <p className="font-paragraph text-base text-foreground mb-6">
              Pre-measured spice kits for cooking international and Filipino dishes at home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#shipping" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#returns" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#faq" className="font-paragraph text-base text-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:hello@globaldishkits.com" 
                className="flex items-center gap-3 font-paragraph text-base text-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                hello@globaldishkits.com
              </a>
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-foreground/10">
          <p className="font-paragraph text-sm text-foreground text-center">
            © {currentYear} GlobalDish Kits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
