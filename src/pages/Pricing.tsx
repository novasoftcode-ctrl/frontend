import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for testing the waters and small personal projects.",
        features: ["Up to 50 products", "Basic analytics", "Standard support", "PrismZone subdomain"],
        buttonText: "Get Started",
        highlight: false
    },
    {
        name: "Professional",
        price: "$29",
        period: "/month",
        description: "Ideal for growing businesses that need more power and flexibility.",
        features: ["Unlimited products", "Advanced analytics", "Priority support", "Custom domain", "Abandoned cart recovery"],
        buttonText: "Go Pro",
        highlight: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Tailored solutions for large-scale operations and high-volume sales.",
        features: ["Dedicated manager", "24/7 Premium support", "White-label solution", "API Access", "Custom integrations"],
        buttonText: "Contact Sales",
        highlight: false
    }
];

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Choose the plan that's right for your business. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 max-w-6xl">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-8 border ${plan.highlight ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border bg-card'} flex flex-col`}
                        >
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                            </div>
                            <p className="text-muted-foreground mb-8">{plan.description}</p>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-primary" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.highlight ? "default" : "outline"}
                                className="w-full py-6 text-lg font-semibold"
                            >
                                {plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
