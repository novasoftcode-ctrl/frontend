import { Link, useParams } from "react-router-dom";
import { Store, Facebook, Instagram, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function StoreFooter() {
    const { slug } = useParams();
    const { storeData } = useStore();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const name = storeData?.name || "Our Store";
    const address = storeData?.address || "Address not available";
    const phone = storeData?.phone || "Phone not available";
    const email = storeData?.email || "Email not available";
    const instagram = storeData?.instagram || "#";
    const facebook = storeData?.facebook || "#";
    const logoUrl = storeData?.logoUrl;

    return (
        <footer className="bg-[#0f172a] text-white pt-16 pb-8 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    {/* Store Info */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                    <Store className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <h3 className="font-heading font-black text-2xl tracking-tight">{name}</h3>
                        </div>
                        <p className="text-slate-400 max-w-md leading-relaxed">
                            {storeData?.description || "Providing high-quality products and exceptional service to our valued customers."}
                        </p>
                        <div className="flex gap-4">
                            <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4 className="font-heading font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-4">
                            {[
                                ["Home", `/store/${slug}`],
                                ["Our Products", `/store/${slug}/products`],
                                ["About Us", `/store/${slug}/about`],
                                ["Contact", `/store/${slug}/contact`]
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <Link to={href} className="text-slate-400 hover:text-primary transition-colors font-medium">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className="md:col-span-4 space-y-6">
                        <h4 className="font-heading font-bold text-lg mb-6">Get In Touch</h4>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4 text-slate-400">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{address}</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <p className="text-sm font-medium">{phone}</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <p className="text-sm font-medium">{email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to top */}
                <button
                    onClick={scrollToTop}
                    className="absolute bottom-10 right-10 w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 group z-20"
                >
                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </button>

                <div className="pt-8 border-t border-white/5 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        © 2026 <span className="text-white">{name}</span>. Powered by <span className="text-primary font-bold">PrismZone</span>.
                    </p>
                </div>
            </div>
        </footer>
    );
}
