import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { registerUser } from "../lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../lib/auth-client";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Firebase Auth User
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const { auth, db } = await import("../lib/firebase");
      const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
      
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, { displayName: formData.username });

      // 3. Create Firestore Document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        coins: 0,
        stars: 0,
        level: 1,
        achievements: [],
        completedLessons: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      toast.success("Welcome! Your account has been created.");
      login(user.uid, formData.username); // Keep for compatibility
      window.location.href = "/profile";
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
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
        
        <h1 className="text-4xl font-display font-bold text-center text-primary mb-2">Join the Fun!</h1>
        <p className="text-center text-muted-foreground mb-8 font-body">
          Create an account to track your progress and unlock rewards.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1 ml-1" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="CoolKid123"
                className="block w-full pl-10 pr-3 py-3 border-2 border-transparent bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

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
                type="email"
                required
                placeholder="parent@example.com"
                className="block w-full pl-10 pr-3 py-3 border-2 border-transparent bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1 ml-1" htmlFor="phone_number">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                placeholder="(555) 123-4567"
                className="block w-full pl-10 pr-3 py-3 border-2 border-transparent bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1 ml-1" htmlFor="password">
              Secret Password
            </label>
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
            className="w-full flex justify-center items-center py-4 px-4 mt-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-kid-pink hover:bg-kid-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kid-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Start Playing <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
