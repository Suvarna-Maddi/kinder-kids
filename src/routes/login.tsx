import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginUser } from "../lib/auth";
import { useAuth } from "../lib/auth-client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first to reset your password.");
      return;
    }
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { auth } = await import("../lib/firebase");
      await sendPasswordResetEmail(auth, formData.email);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email. Make sure the email is valid.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin backdoor
    if (formData.email.trim() === 'admin' && formData.password === 'admin') {
      toast.success("Welcome back, Admin!");
      login("admin_id", "Admin");
      window.location.href = "/profile";
      return;
    }

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth, db } = await import("../lib/firebase");
      const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update lastLogin
      try {
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp()
        });
      } catch (err) {
        console.error("Could not update lastLogin:", err);
      }

      toast.success(`Welcome back!`);
      login(user.uid, user.displayName || "Champion");
      window.location.href = "/profile";
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid email or password.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-center text-primary mb-2">Welcome Back!</h1>
        <p className="text-center text-muted-foreground mb-8 font-body">
          Ready for some more fun learning?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1 ml-1" htmlFor="email">
              Parent's Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                required
                placeholder="parent@example.com or admin"
                className="block w-full pl-10 pr-3 py-3 border-2 border-transparent bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 ml-1 pr-1">
              <label className="block text-sm font-bold text-foreground" htmlFor="password">
                Secret Password
              </label>
              <button 
                type="button" 
                onClick={handleResetPassword}
                className="text-xs text-primary hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-3 border-2 border-transparent bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-4 px-4 mt-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-kid-blue hover:bg-kid-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kid-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Let's Go! <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground font-body">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-bold">
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
