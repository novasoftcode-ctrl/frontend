import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
                    <div className="prose prose-blue max-w-none space-y-6 text-muted-foreground">
                        <p className="text-lg">Last updated: February 28, 2026</p>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using PrismZone, you agree to be bound by these Terms of Service and our Privacy Policy.
                                If you do not agree to all these terms, do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">2. Use of Services</h2>
                            <p>
                                You are responsible for your use of the services and for any content you provide. You must use
                                the services in compliance with all applicable laws, rules, and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">3. User Accounts</h2>
                            <p>
                                When you create an account with us, you must provide information that is accurate, complete,
                                and current at all times. Failure to do so constitutes a breach of the Terms, which may result
                                in immediate termination of your account on our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">4. Termination</h2>
                            <p>
                                We may terminate or suspend your account and bar access to the service immediately, without
                                prior notice or liability, under our sole discretion, for any reason whatsoever and without
                                limitation.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
