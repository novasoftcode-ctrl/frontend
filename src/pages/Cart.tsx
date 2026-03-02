import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Heart, ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Favorites() {
  const { slug } = useParams();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favIds = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      if (favIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // We fetch all products and filter locally for simplicity, 
      // or we could add a bulk fetch endpoint. Given the scale, filtering is fine.
      const response = await fetch(`https://backend-production-de8ef.up.railway.app/api/products/store/${slug || 'my-store'}`);
      const data = await response.json();

      if (response.ok) {
        const filtered = data.filter((p: any) => favIds.includes(p._id));
        setFavorites(filtered);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id: string) => {
    const favIds = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    const newIds = favIds.filter((favId: string) => favId !== id);
    localStorage.setItem("user_favorites", JSON.stringify(newIds));
    setFavorites(favorites.filter(p => p._id !== id));
    toast({
      title: "Removed",
      description: "Product removed from your favorites.",
    });
  };

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-destructive fill-current" />
          <h1 className="text-4xl font-heading font-black">My Favorites</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground text-lg mb-6 font-medium">You haven't added any favorites yet.</p>
            <Button className="gradient-bg border-0 text-primary-foreground font-bold rounded-full px-8" asChild>
              <Link to={`/store/${slug}/products`}>Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item._id} className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all group">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <button
                    onClick={() => removeFavorite(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-destructive hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg mb-1 truncate">{item.name}</h3>
                  <div className="text-xl font-black text-primary mb-4">${item.price}</div>
                  <div className="flex gap-2">
                    <Button className="flex-1 gradient-bg border-0 text-primary-foreground font-bold rounded-full" asChild>
                      <Link to={`/store/${slug}/products`}>Order Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
