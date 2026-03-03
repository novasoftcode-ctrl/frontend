import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";

export default function Favorites() {
    const { slug } = useParams();
    const [products, setProducts] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const savedFavs = localStorage.getItem("user_favorites");
        if (savedFavs) {
            const favIds = JSON.parse(savedFavs);
            setFavorites(favIds);
            fetchFavoriteProducts(favIds);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchFavoriteProducts = async (ids: string[]) => {
        if (ids.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        try {
            // We'll fetch all products from the store and filter them locally to stay simple
            const response = await fetch(`${API_BASE_URL}/api/products/store/${slug}`);
            const allProducts = await response.json();
            if (response.ok) {
                setProducts(allProducts.filter((p: any) => ids.includes(p._id)));
            }
        } catch (error) {
            console.error("Error fetching favorite products:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = (productId: string) => {
        const newFavs = favorites.filter(id => id !== productId);
        setFavorites(newFavs);
        setProducts(products.filter(p => p._id !== productId));
        localStorage.setItem("user_favorites", JSON.stringify(newFavs));
        toast({ title: "Removed", description: "Product removed from favorites." });
    };

    return (
        <StoreLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-heading font-black mb-2">My Favorites ❤️</h1>
                    <p className="text-muted-foreground font-medium">Your curated list of must-have items.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-border px-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                            <Heart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-4">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Explore our collection and save items you love to find them later easily.</p>
                        <Button size="lg" className="rounded-full font-bold px-10" asChild>
                            <Link to={`/store/${slug}/products`}>Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((p) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-card rounded-3xl border border-border overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className="aspect-square bg-muted relative overflow-hidden">
                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <button
                                        onClick={() => removeFavorite(p._id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive shadow-lg hover:bg-destructive hover:text-white transition-all z-10"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-heading font-bold text-lg mb-1 truncate">{p.name}</h3>
                                    <p className="text-primary font-black text-xl mb-4">Rs. {p.price}</p>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 rounded-full font-bold gradient-bg border-0" asChild>
                                            <Link to={`/store/${slug}/products`}>Order Now</Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
