import { Link } from "react-router-dom";
import { Store, Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0f2a4a] text-white pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand & Bio */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1 shadow-inner border-2 border-primary/20">
                <Store className="w-8 h-8 text-[#0f2a4a]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl leading-tight tracking-tight uppercase">PrismZone</h3>
                <p className="text-[10px] text-blue-100/70 font-medium leading-tight">Empowering Digital Storefronts Anywhere</p>
              </div>
            </div>
            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
              PrismZone is dedicated to promoting high-quality digital commerce by providing the tools and infrastructure for businesses to launch and scale their online presence through technical assistance and innovative storefront solutions.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#0f2a4a] transition-all transform hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-serif font-bold text-xl mb-8 border-b-2 border-yellow-500 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4">
              {[
                ["About PrismZone", "/about"],
                ["Services", "/#features"],
                ["How It Works", "/#how-it-works"],
                ["Contact Us", "/contact"]
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm font-medium text-blue-100/90 hover:text-yellow-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif font-bold text-xl mb-8 border-b-2 border-yellow-500 pb-2 inline-block">Useful Links</h4>
            <ul className="space-y-4">
              {[
                ["Pricing Plans", "/pricing"],
                ["Support Center", "/help"],
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"]
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm font-medium text-blue-100/90 hover:text-yellow-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="font-serif font-bold text-xl mb-2 border-b-2 border-yellow-500 pb-2 inline-block">Get In Touch</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
                <p className="text-sm font-medium text-blue-100/90">50 Babar Block Garden Town, Lahore</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-sm font-medium text-blue-100/90">(042) 99232040</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-sm font-medium text-blue-100/90">info@peima.punjab.gov.pk</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-sm font-bold text-blue-100/90">Subscribe for updates:</p>
              <div className="flex gap-0 group">
                <Input
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 h-11 text-white placeholder:text-blue-100/40 rounded-l-xl rounded-r-none focus-visible:ring-yellow-500/50"
                />
                <Button className="bg-[#fdb913] hover:bg-[#e2a611] text-[#0f2a4a] h-11 px-6 rounded-r-xl rounded-l-none font-bold border-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="absolute bottom-10 right-10 w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-[#0f2a4a] rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110 group z-20"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs font-medium text-blue-100/40">
            © 2026 <span className="text-yellow-500 font-bold">PrismZone</span>. All rights reserved. Empowering digital entrepreneurs globally.
          </p>
        </div>
      </div>
    </footer>
  );
}
