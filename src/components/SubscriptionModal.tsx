import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Crown, Loader2, CalendarHeart } from "lucide-react";
import { initiatePayment } from "@/lib/razorpay";
import { auth } from "@/lib/firebase";
import { useProgress } from "@/lib/progress";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const progress = useProgress();
  const isPremium = progress.isPremium;
  
  // Format the date nicely if it exists
  const expiryDate = progress.subscriptionExpiryDate 
    ? new Date(progress.subscriptionExpiryDate).toLocaleDateString("en-US", { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const handlePurchase = () => {
    if (!auth.currentUser) {
      toast.error("Please log in to subscribe to Premium");
      return;
    }

    setIsProcessingPayment(true);
    const amount = 49; // 1 month premium
    const userDetails = {
      id: auth.currentUser?.uid,
      name: auth.currentUser?.displayName || "Kinder Kids User",
      email: auth.currentUser?.email || "hello@kinderkidsspace.in",
    };

    initiatePayment(
      amount,
      userDetails,
      (data) => {
        setIsProcessingPayment(false);
        toast.success("Payment successful! Premium features unlocked.", {
          description: `Order ID: ${data.order_id || 'Verified'}`,
        });
        // The check-subscription API or local snapshot will automatically update UI
        onClose();
      },
      (error) => {
        setIsProcessingPayment(false);
        const errorMessage = error?.message || "Something went wrong during payment";
        if (errorMessage.toLowerCase().includes("cancelled") || errorMessage.toLowerCase().includes("failed")) {
            toast.error("Payment incomplete", { description: "The payment process was not finished." });
        } else {
            toast.error("Payment failed", { description: errorMessage });
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-md overflow-hidden z-10"
          >
            {/* Header background styling */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 pt-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>

              {isPremium ? (
                <div className="text-center">
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                    Premium Active
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    You have full access to all premium features!
                  </p>
                  
                  <div className="bg-muted rounded-2xl p-6 mb-8 text-left border border-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">Status</h4>
                        <p className="text-emerald-500 font-medium">Active Subscription</p>
                      </div>
                    </div>
                    {expiryDate && (
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/20 rounded-full text-amber-500">
                          <CalendarHeart className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Valid Until</h4>
                          <p className="text-muted-foreground">{expiryDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-full transition-colors"
                  >
                    Continue Learning
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                      Upgrade to Premium
                    </h2>
                    <p className="text-muted-foreground">
                      Unlock the full learning universe and accelerate your child's growth.
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      "Unlimited access to Solar System",
                      "Ad-free uninterrupted learning",
                      "Exclusive premium quizzes",
                      "Detailed progress tracking"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted p-4 rounded-2xl border border-border flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-bold text-foreground">Monthly Plan</h4>
                      <p className="text-sm text-muted-foreground">Cancel anytime</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">₹49</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                  </div>

                  {auth.currentUser ? (
                    <button
                      onClick={handlePurchase}
                      disabled={isProcessingPayment}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-white font-bold py-4 rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                      {isProcessingPayment ? "Processing..." : "Get Premium"}
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    </button>
                  ) : (
                    <Link to="/login" onClick={onClose} className="block w-full text-center py-4 bg-kid-blue text-white font-bold rounded-full hover:bg-kid-blue/90 transition-colors">
                      Log In to Subscribe
                    </Link>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
