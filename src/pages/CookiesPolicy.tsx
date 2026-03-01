import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiesPolicy() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-heading font-bold mb-8">Cookies Policy</h1>
                    <div className="prose prose-blue max-w-none space-y-6 text-muted-foreground">
                        <p className="text-lg">Last updated: February 28, 2026</p>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">1. What are Cookies?</h2>
                            <p>
                                Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                                They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">2. How We Use Cookies</h2>
                            <p>
                                We use cookies for several reasons. Some cookies are required for technical reasons for our
                                website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">3. Types of Cookies We Use</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Essential Cookies: Necessary for the website to function.</li>
                                <li>Performance Cookies: Help us understand how visitors use our site.</li>
                                <li>Functional Cookies: Allow the site to remember choices you make.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-3">4. Managing Cookies</h2>
                            <p>
                                Most web browsers allow some control of most cookies through the browser settings. To find
                                out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
