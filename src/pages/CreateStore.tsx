import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Store, Upload, Check, Copy, QrCode, ArrowRight, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

const categories = ["Fashion", "Electronics", "Food & Beverages", "Home & Garden", "Health & Beauty", "Sports", "Arts & Crafts", "Other"];
const colorPresets = [
  { name: "Ocean", primary: "#2563eb", secondary: "#0ea5e9" },
  { name: "Sunset", primary: "#f59e0b", secondary: "#ef4444" },
  { name: "Forest", primary: "#10b981", secondary: "#059669" },
  { name: "Royal", primary: "#7c3aed", secondary: "#6366f1" },
];

export default function CreateStore() {
  const [step, setStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    logo: null as string | null,
    cover: null as string | null,
    address: "",
    phone: "",
    email: "",
    daysFrom: "Monday",
    daysTo: "Saturday",
    timeFrom: "09:00",
    timeTo: "18:00",
    instagram: "",
    facebook: "",
  });

  const [loading, setLoading] = useState(false);
  const logoFileRef = useRef<File | null>(null);
  const coverFileRef = useRef<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'logo') logoFileRef.current = file;
      else coverFileRef.current = file;

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result as string }));
        toast({
          title: "Image Selected",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} selected.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.name) return "Store Name is required";
      if (!formData.category) return "Please select a Category";
      if (!formData.description) return "Description is required";
    }
    if (currentStep === 2) {
      if (!formData.logo) return "Store Logo is required";
      if (!formData.cover) return "Cover Photo is required";
    }
    if (currentStep === 3) {
      if (!formData.address) return "Address is required";
      if (!formData.phone) return "Phone Number is required";
      if (!formData.email) return "Email is required";
      if (!formData.daysFrom || !formData.daysTo || !formData.timeFrom || !formData.timeTo) return "Office Hours are required";
    }
    return null;
  };

  const handleNext = async () => {
    const error = validateStep(step);
    if (error) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: error,
      });
      return;
    }

    if (step === 3) {
      setLoading(true);
      try {
        const token = localStorage.getItem("prismzone_token");
        const storeFormData = new FormData();
        storeFormData.append("name", formData.name);
        storeFormData.append("category", formData.category);
        storeFormData.append("description", formData.description);
        storeFormData.append("address", formData.address);
        storeFormData.append("phone", formData.phone);
        storeFormData.append("email", formData.email);
        storeFormData.append("officeHours", JSON.stringify({
          daysFrom: formData.daysFrom,
          daysTo: formData.daysTo,
          timeFrom: formData.timeFrom,
          timeTo: formData.timeTo,
        }));
        storeFormData.append("socialMedia", JSON.stringify({
          instagram: formData.instagram,
          facebook: formData.facebook,
        }));

        if (logoFileRef.current) storeFormData.append("logo", logoFileRef.current);
        if (coverFileRef.current) storeFormData.append("cover", coverFileRef.current);

        const response = await fetch("https://backend-production-de8ef.up.railway.app/api/store/create", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: storeFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create store");
        }

        toast({
          title: "Success",
          description: "Your store has been created!",
        });

        setStep(4);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-8">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Store className="w-5 h-5 text-primary-foreground" />
        </div>
        PrismZone
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={`w-8 h-0.5 ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card border border-border rounded-2xl p-8 w-full max-w-lg shadow-lg"
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-heading font-bold mb-1">Basic Information</h2>
              <p className="text-muted-foreground text-sm mb-6">Tell us about your store.</p>
              <div className="space-y-4">
                <div>
                  <Label>Store Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="My Awesome Store"
                    className="mt-1.5"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formData.name && <p className="text-xs text-success mt-1">✓ Store name is available</p>}
                </div>
                <div>
                  <Label>Category <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFormData({ ...formData, category: c })}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors text-left ${formData.category === c ? "border-primary bg-primary/5 text-primary font-bold" : "border-border hover:border-primary hover:text-primary"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Description <span className="text-destructive">*</span></Label>
                  <textarea
                    className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-ring outline-none"
                    placeholder="Tell customers about your store..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-heading font-bold mb-1">Branding</h2>
              <p className="text-muted-foreground text-sm mb-6">Make your store stand out.</p>
              <div className="space-y-6">
                <div>
                  <Label>Store Logo <span className="text-destructive">*</span></Label>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`mt-2 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${formData.logo ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
                  >
                    {formData.logo ? (
                      <div className="flex flex-col items-center">
                        <img src={formData.logo} alt="Logo" className="w-16 h-16 rounded-lg object-cover mb-2" />
                        <p className="text-xs text-primary font-bold">Logo Selected</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Drag & drop or click to upload</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Cover Photo <span className="text-destructive">*</span></Label>
                  <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${formData.cover ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
                  >
                    {formData.cover ? (
                      <div className="flex flex-col items-center">
                        <img src={formData.cover} alt="Cover" className="w-full h-20 rounded-lg object-cover mb-2" />
                        <p className="text-xs text-primary font-bold">Cover Photo Selected</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Upload cover image</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Color Theme</Label>
                  <div className="flex gap-3 mt-2">
                    {colorPresets.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(i)}
                        className={`w-12 h-12 rounded-xl border-2 transition-all ${i === selectedColor ? "border-primary scale-110 shadow-lg" : "border-transparent"}`}
                        style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-heading font-bold mb-1">Contact Details</h2>
              <p className="text-muted-foreground text-sm mb-6">How customers can reach you.</p>
              <div className="space-y-4">
                <div>
                  <Label>Address <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="123 Main St, City, Country"
                    className="mt-1.5"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone Number <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="+92 300 0000000"
                    className="mt-1.5"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email <span className="text-destructive">*</span></Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="mt-1.5"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="pt-4 border-t border-border mt-6">
                  <h3 className="font-heading font-bold mb-4">Office Hours <span className="text-destructive">*</span></h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Days From</Label>
                      <select
                        className="mt-1.5 w-full rounded-lg border border-border bg-background p-2.5 text-sm focus:ring-2 focus:ring-ring outline-none"
                        value={formData.daysFrom}
                        onChange={(e) => setFormData({ ...formData, daysFrom: e.target.value })}
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Days To</Label>
                      <select
                        className="mt-1.5 w-full rounded-lg border border-border bg-background p-2.5 text-sm focus:ring-2 focus:ring-ring outline-none"
                        value={formData.daysTo}
                        onChange={(e) => setFormData({ ...formData, daysTo: e.target.value })}
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Time From</Label>
                      <Input
                        type="time"
                        className="mt-1.5"
                        value={formData.timeFrom}
                        onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Time To</Label>
                      <Input
                        type="time"
                        className="mt-1.5"
                        value={formData.timeTo}
                        onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-6">
                  <h3 className="font-heading font-bold mb-4">Social Media</h3>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      placeholder="@yourstore"
                      className="mt-1.5"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      placeholder="facebook.com/yourstore"
                      className="mt-1.5"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-success" />
              </motion.div>
              <h2 className="text-2xl font-heading font-bold mb-2 text-foreground">🎉 Your Store is Live!</h2>
              <p className="text-muted-foreground text-sm mb-6">Congratulations! Your store <span className="text-primary font-bold">"{formData.name}"</span> has been created successfully.</p>
              <div className="bg-muted rounded-xl p-4 flex items-center justify-between mb-6 shadow-inner">
                <span className="text-xs font-mono font-bold text-muted-foreground tracking-tight">prismzone.com/store/{formData.name.toLowerCase().replace(/\s+/g, '-') || 'my-store'}</span>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-32 h-32 bg-white border-2 border-muted rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <QrCode className="w-20 h-20 text-muted-foreground" />
              </div>
              <Button className="w-full h-12 gradient-bg border-0 text-primary-foreground font-black text-lg shadow-xl hover:shadow-primary/20 transition-all" asChild>
                <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>
          )}

          {step < 4 && (
            <div className="flex gap-4 mt-10">
              {step > 1 && (
                <Button variant="outline" className="flex-1 font-bold border-2" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
              )}
              <Button
                className="flex-[2] gradient-bg border-0 text-primary-foreground font-black text-lg shadow-lg hover:shadow-primary/20 transition-all"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Creating..." : step === 3 ? "Create Store" : "Continue"} <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
