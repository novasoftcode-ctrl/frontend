import { motion } from "framer-motion";
import { Shield, Rocket, Users, Target, Heart, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 bg-white">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-heading font-black tracking-tighter mb-6 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent"
                        >
                            Empowering Digital Entrepreneurs
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground leading-relaxed font-medium"
                        >
                            PrismZone is more than just a marketplace. We're a comprehensive ecosystem
                            designed to simplify the complexities of e-commerce, allowing you to focus
                            on what you do best: creating and selling amazing products.
                        </motion.p>
                    </div>

                    {/* Mission/Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 shadow-sm"
                        >
                            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground mb-8 shadow-lg">
                                <Rocket className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl font-heading font-black mb-4 tracking-tight">Our Mission</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                                To democratize e-commerce by providing powerful, intuitive tools that
                                enable anyone, anywhere, to launch and scale a successful digital brand.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10 shadow-sm"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white mb-8 shadow-lg">
                                <Target className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl font-heading font-black mb-4 tracking-tight">Our Vision</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                                To be the world's most trusted partner for digital commerce, fostering
                                innovation and growth for millions of small businesses globally.
                            </p>
                        </motion.div>
                    </div>

                    {/* Values */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-center mb-16 tracking-tighter">Our Core Values</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {[
                                { icon: Shield, title: "Trust & Security", desc: "Your data and your customers' safety are our top priorities." },
                                { icon: Users, title: "Community First", desc: "We grow together with our vendors through constant feedback." },
                                { icon: Heart, title: "Passion for Detail", desc: "Every feature is crafted with care to ensure the best experience." },
                                { icon: Award, title: "Excellence", desc: "We strive for the highest standards in everything we build." }
                            ].map((value, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-white border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors shadow-sm">
                                        <value.icon className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
                                    </div>
                                    <h3 className="text-xl font-black mb-3 tracking-tight">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-center mb-16 tracking-tighter">Our Core Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                            {[
                                { name: "Zarkhman Rasheed", role: "CEO and Founder", img: "/image1.png" },
                                { name: "Saqib Ali", role: "Chief Financial Officer", img: "/image2.png" },
                                { name: "Jibran Ali", role: "Chief Operating Officer", img: "/image3.png" }
                            ].map((member, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="relative mb-6 inline-block">
                                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/10 group-hover:border-primary/30 transition-colors shadow-xl mx-auto">
                                            <img
                                                src={member.img}
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black mb-1 tracking-tight">{member.name}</h3>
                                    <p className="text-primary font-bold text-sm uppercase tracking-wider">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
