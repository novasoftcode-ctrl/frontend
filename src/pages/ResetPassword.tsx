import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { token } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      try {
        const response = await axios.post(`${API_URL}/auth/validate-reset-token`, { token });
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        toast({
          title: "Error",
          description: "Invalid or expired reset link",
          variant: "destructive",
        });
      }
    };

    if (token) {
      validateToken();
    } else {
      setTokenValid(false);
    }
  }, [token, API_URL, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        token, 
        newPassword: password 
      });
      
      toast({
        title: "Success",
        description: response.data.message,
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to reset password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            PrismZone
          </Link>
          <div className="bg-card rounded-xl border border-border p-8">
            <h1 className="text-2xl font-heading font-bold mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground text-sm mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
            <div className="space-y-4">
              <Link to="/forgot-password">
                <Button className="w-full gradient-bg border-0 text-primary-foreground">Request New Link</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full">Back to Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          PrismZone
        </Link>
        <div className="bg-card rounded-xl border border-border p-8">
          <h1 className="text-2xl font-heading font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground text-sm mb-6">Enter your new password below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>New Password</Label>
              <div className="relative mt-1.5">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password" 
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <div className="relative mt-1.5">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm new password" 
                  className="pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-bg border-0 text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}