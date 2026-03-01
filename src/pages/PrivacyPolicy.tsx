import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
                    <div className="prose prose-blue max-w-none space-y-6 text-muted-foreground">
                        <p className="text-lg">Last updated: February 28, 2026</p>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">1. Introduction</h2>
                            <p>
                                Welcome to PrismZone. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our
                                website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">2. The Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have
                                grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Identity Data (name, username)</li>
                                <li>Contact Data (email address, telephone numbers)</li>
                                <li>Technical Data (IP address, browser type and version)</li>
                                <li>Usage Data (information about how you use our website)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your
                                personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>To provide and maintain our service.</li>
                                <li>To notify you about changes to our service.</li>
                                <li>To provide customer support.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">4. Content and Contact</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us
                                at info@prismzone.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
