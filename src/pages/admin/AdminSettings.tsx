import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Eye, EyeOff, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";

export default function AdminSettings() {
    const { toast } = useToast();

    // Credentials state
    const [credEmail, setCredEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [credLoading, setCredLoading] = useState(false);

    // Footer social links state
    const [facebookUrl, setFacebookUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [socialLoading, setSocialLoading] = useState(false);

    // Footer contact info state
    const [contactEmail, setContactEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [contactLoading, setContactLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/settings`);
            if (res.ok) {
                const data = await res.json();
                setCredEmail(data.email || "");
                setFacebookUrl(data.facebookUrl === "#" ? "" : data.facebookUrl || "");
                setInstagramUrl(data.instagramUrl === "#" ? "" : data.instagramUrl || "");
                setLinkedinUrl(data.linkedinUrl === "#" ? "" : data.linkedinUrl || "");
                setContactEmail(data.contactEmail || "");
                setPhone(data.phone || "");
                setAddress(data.address || "");
            }
        } catch (error) {
            console.error("Error fetching admin settings:", error);
        }
    };

    const handleUpdateCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
            return;
        }
        setCredLoading(true);
        try {
            const body: any = { currentPassword };
            if (credEmail) body.email = credEmail;
            if (newPassword) body.newPassword = newPassword;

            const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            toast({ title: "Credentials Updated", description: "Your email/password has been updated successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        } finally {
            setCredLoading(false);
        }
    };

    const handleUpdateSocials = async (e: React.FormEvent) => {
        e.preventDefault();
        setSocialLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`
                },
                body: JSON.stringify({
                    facebookUrl: facebookUrl || "#",
                    instagramUrl: instagramUrl || "#",
                    linkedinUrl: linkedinUrl || "#",
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            toast({ title: "Social Links Updated", description: "Footer social links updated successfully." });
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        } finally {
            setSocialLoading(false);
        }
    };

    const handleUpdateContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`
                },
                body: JSON.stringify({ contactEmail, phone, address }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            toast({ title: "Contact Info Updated", description: "Footer contact information updated successfully." });
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-bold">Admin Settings</h1>
                        <p className="text-muted-foreground text-sm">Manage your credentials and PrismZone footer information.</p>
                    </div>
                </div>

                {/* Section 1: Admin Credentials */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
                    <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        Admin Credentials
                    </h2>
                    <p className="text-sm text-muted-foreground">Update your admin login email and password. Current password is required.</p>
                    <form onSubmit={handleUpdateCredentials} className="space-y-4">
                        <div>
                            <Label className="font-semibold text-sm">Admin Email</Label>
                            <Input
                                type="email"
                                className="mt-1.5 h-11 rounded-lg"
                                value={credEmail}
                                onChange={(e) => setCredEmail(e.target.value)}
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <Label className="font-semibold text-sm">Current Password <span className="text-destructive">*</span></Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showCurrent ? "text" : "password"}
                                    className="h-11 rounded-lg pr-10"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    required
                                />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="font-semibold text-sm">New Password</Label>
                                <div className="relative mt-1.5">
                                    <Input
                                        type={showNew ? "text" : "password"}
                                        className="h-11 rounded-lg pr-10"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-sm">Confirm New Password</Label>
                                <Input
                                    type="password"
                                    className="mt-1.5 h-11 rounded-lg"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={credLoading} className="gradient-bg border-0 text-primary-foreground font-bold">
                                <Save className="w-4 h-4 mr-2" />
                                {credLoading ? "Saving..." : "Update Credentials"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Section 2: Footer Social Links */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
                    <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-primary" />
                        Footer Social Links
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Update the social media links shown in the PrismZone main website footer. <span className="font-semibold text-foreground">Individual store footers are not affected.</span>
                    </p>
                    <form onSubmit={handleUpdateSocials} className="space-y-4">
                        <div>
                            <Label className="font-semibold text-sm flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" />Facebook URL</Label>
                            <Input
                                type="url"
                                className="mt-1.5 h-11 rounded-lg"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                        <div>
                            <Label className="font-semibold text-sm flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" />Instagram URL</Label>
                            <Input
                                type="url"
                                className="mt-1.5 h-11 rounded-lg"
                                value={instagramUrl}
                                onChange={(e) => setInstagramUrl(e.target.value)}
                                placeholder="https://instagram.com/yourpage"
                            />
                        </div>
                        <div>
                            <Label className="font-semibold text-sm flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-700" />LinkedIn URL</Label>
                            <Input
                                type="url"
                                className="mt-1.5 h-11 rounded-lg"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                placeholder="https://linkedin.com/company/yourpage"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={socialLoading} className="gradient-bg border-0 text-primary-foreground font-bold">
                                <Save className="w-4 h-4 mr-2" />
                                {socialLoading ? "Saving..." : "Update Social Links"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Section 3: Footer Contact Info */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
                    <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Footer Contact Information
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Update the contact info shown in the PrismZone main website footer. <span className="font-semibold text-foreground">Individual store footers are not affected.</span>
                    </p>
                    <form onSubmit={handleUpdateContact} className="space-y-4">
                        <div>
                            <Label className="font-semibold text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-yellow-500" />Contact Email</Label>
                            <Input
                                type="email"
                                className="mt-1.5 h-11 rounded-lg"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="info@example.com"
                            />
                        </div>
                        <div>
                            <Label className="font-semibold text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-yellow-500" />Phone Number</Label>
                            <Input
                                type="text"
                                className="mt-1.5 h-11 rounded-lg"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(042) 99232040"
                            />
                        </div>
                        <div>
                            <Label className="font-semibold text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-yellow-500" />Address</Label>
                            <Input
                                type="text"
                                className="mt-1.5 h-11 rounded-lg"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="50 Babar Block Garden Town, Lahore"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={contactLoading} className="gradient-bg border-0 text-primary-foreground font-bold">
                                <Save className="w-4 h-4 mr-2" />
                                {contactLoading ? "Saving..." : "Update Contact Info"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
