import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Store, ShoppingBag, Palette, Globe, BarChart3, Shield, ArrowRight, Star, Users, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const features = [
  { icon: Store, title: "Create Your Store", desc: "Launch your branded store in minutes with our intuitive store builder." },
  { icon: Palette, title: "Custom Branding", desc: "Upload logos, pick colors and make your store uniquely yours." },
  { icon: Package, title: "Product Management", desc: "Add products with variants, images, and detailed descriptions." },
  { icon: ShoppingBag, title: "Easy Checkout", desc: "Smooth cart and checkout experience for your customers." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track sales, visitors and revenue with real-time charts." },
  { icon: Shield, title: "Secure Payments", desc: "Integrated payment gateways with SSL encryption." },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds." },
  { num: "02", title: "Build Your Store", desc: "Add products, set up branding and configure settings." },
  { num: "03", title: "Start Selling", desc: "Share your store link and start receiving orders." },
];

const testimonials = [
  { name: "Sarah Johnson", role: "Fashion Store Owner", text: "PrismZone transformed my small business. I went from zero to 500 orders in my first month!", rating: 5 },
  { name: "Mike Chen", role: "Electronics Seller", text: "The dashboard analytics helped me understand my customers and double my revenue.", rating: 5 },
  { name: "Amara Obi", role: "Artisan Crafts", text: "Setting up my store was incredibly easy. I love the customization options!", rating: 5 },
];

const stats = [
  { value: "12,000+", label: "Active Stores" },
  { value: "500K+", label: "Products Listed" },
  { value: "2M+", label: "Happy Customers" },
  { value: "$50M+", label: "Revenue Generated" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary-foreground border border-primary/30 mb-6">
              🚀 Trusted by 12,000+ vendors worldwide
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-primary-foreground max-w-4xl mx-auto leading-tight mb-2">
            Welcome to PrismZone
          </motion.h2>
          <motion.h1 variants={fadeUp} custom={1.5} initial="hidden" animate="visible" className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground/90 max-w-4xl mx-auto leading-tight">
            Create Your Digital Storefront{" "}
            <span className="text-accent">in Minutes</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Build, customize, and manage your online store with zero coding. Join thousands of vendors already selling on PrismZone.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
              <Link to="/stores">Explore Stores <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-primary-foreground border-primary-foreground/20 hover:bg-white/20 text-base px-8" asChild>
              <Link to="/signup">Create Store <Store className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Everything You Need to Sell Online</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Powerful tools to launch and grow your e-commerce business.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-card rounded-xl p-6 border border-border hover-lift">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-3">Get started in 3 simple steps.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="text-5xl font-heading font-bold gradient-text mb-4">{s.num}</div>
                <h3 className="font-heading font-semibold text-xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Loved by Vendors</h2>
            <p className="text-muted-foreground mt-3">See what our community has to say.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                <div className="font-heading font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-bg rounded-2xl p-12 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Ready to Start Selling?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">Join thousands of vendors and create your store today. No credit card required.</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8" asChild>
              <Link to="/signup">Create Your Store <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
