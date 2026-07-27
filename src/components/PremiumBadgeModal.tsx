import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Check, CalendarHeart, CreditCard, Clock, Zap } from "lucide-react";
import { useProgress } from "@/lib/progress";

interface PremiumBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumBadgeModal: React.FC<PremiumBadgeModalProps> = ({ isOpen, onClose }) => {
  const progress = useProgress();

  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  const daysRemaining = progress.subscriptionExpiryDate
    ? Math.max(
        0,
        Math.ceil((new Date(progress.subscriptionExpiryDate).getTime() - Date.now()) / 86400000),
      )
    : 0;

  const plan = daysRemaining > 60 ? "Annual Plan" : "Monthly Plan";

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden z-10"
          >
            {/* Header gradient */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-transparent pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 pt-10">
              {/* Crown icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-foreground text-center mb-1">
                Premium Active
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                You have full access to all premium features!
              </p>

              <div className="space-y-3">
                <Row
                  icon={<Check className="w-4 h-4 text-emerald-500" />}
                  bg="bg-emerald-500/10"
                  label="Status"
                  value={
                    <span className="text-emerald-500 font-semibold">Active Subscription</span>
                  }
                />

                <Row
                  icon={<Zap className="w-4 h-4 text-amber-500" />}
                  bg="bg-amber-500/10"
                  label="Current Plan"
                  value={plan}
                />

                <Row
                  icon={<CreditCard className="w-4 h-4 text-blue-500" />}
                  bg="bg-blue-500/10"
                  label="Purchase Date"
                  value={fmt(progress.subscriptionStartDate)}
                />

                <Row
                  icon={<CalendarHeart className="w-4 h-4 text-rose-500" />}
                  bg="bg-rose-500/10"
                  label="Valid Until"
                  value={fmt(progress.subscriptionExpiryDate)}
                />

                <Row
                  icon={<Clock className="w-4 h-4 text-purple-500" />}
                  bg="bg-purple-500/10"
                  label="Days Remaining"
                  value={
                    <span className={daysRemaining < 7 ? "text-rose-500 font-semibold" : ""}>
                      {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                    </span>
                  }
                />

                {progress.paymentId && (
                  <Row
                    icon={<CreditCard className="w-4 h-4 text-slate-500" />}
                    bg="bg-slate-500/10"
                    label="Payment ID"
                    value={
                      <span className="font-mono text-xs break-all">{progress.paymentId}</span>
                    }
                  />
                )}
              </div>

              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-full transition-colors"
              >
                Continue Learning 🚀
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function Row({
  icon,
  bg,
  label,
  value,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 border border-border">
      <div className={`p-2 ${bg} rounded-lg flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
