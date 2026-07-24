import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, X, Star, Crown, Loader2 } from "lucide-react";
import { useProgress, dismissPremiumPopup } from "@/lib/progress";
import confetti from "canvas-confetti"; // We will try to use it if installed, otherwise we can ignore.
import { auth } from "@/lib/firebase";
import { initiatePayment } from "@/lib/razorpay";
import { toast } from "sonner";

export const PremiumPopup = () => {
  const progress = useProgress();
  const [show, setShow] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Admin bypass
    if (auth.currentUser?.email?.toLowerCase() === "kinderkidsspace@gmail.com") return;

    if (progress.isPremium && !progress.premiumPopupShown) {
      setShow(true);
      // Trigger a confetti explosion for the celebration
      setTimeout(() => {
        try {
          if (typeof confetti === "function") {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#facc15", "#f472b6", "#38bdf8", "#4ade80"],
            });
          }
        } catch (e) {
          /* ignore */
        }
      }, 500);
    }
  }, [progress.isPremium, progress.premiumPopupShown]);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => {
      dismissPremiumPopup();
    }, 300);
  };

  const handlePurchase = () => {
    setIsProcessingPayment(true);
    
    // Amount in INR (e.g. ₹99)
    const amount = 99; 
    
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
        handleDismiss();
        // Here we can also update user's premium status in Firestore when ready
      },
      (error) => {
        setIsProcessingPayment(false);
        const errorMessage = error?.message || "Something went wrong during payment";
        // User cancelling is typically a specific error code or just a generic error from Razorpay
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
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="relative bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-[0_0_50px_rgba(168,85,247,0.4)] border border-purple-500/30 overflow-hidden text-center"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#c084fc_100%)] opacity-20 mix-blend-screen"
              />
            </div>

            {/* Floating Icons */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-[30px] opacity-40 rounded-full" />
                <Crown className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
              </div>
            </motion.div>

            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 mb-4 drop-shadow-sm">
                Premium Unlocked!
              </h2>

              <p className="text-xl text-purple-100 font-light mb-8 leading-relaxed">
                Wow! You've maintained an incredible{" "}
                <span className="font-bold text-yellow-400">11-Day Streak!</span>
                <br />
                <br />
                As a reward for your dedication, you now have access to our most{" "}
                <span className="font-bold text-white">advanced and engaging topics</span>! Keep up
                the amazing work!
              </p>

              <button
                onClick={handlePurchase}
                disabled={isProcessingPayment}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-indigo-950 font-bold text-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(250,204,21,0.5)] w-full sm:w-auto disabled:opacity-70 disabled:hover:scale-100"
              >
                {isProcessingPayment ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                )}
                {isProcessingPayment ? "Processing..." : "Claim Premium"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
