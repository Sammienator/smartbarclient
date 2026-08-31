import { motion } from "framer-motion";

const ACCENT_BG = {
  amber: "bg-amber/20",
  copper: "bg-copper/15",
  moss: "bg-moss/20",
  electric: "bg-electric/15",
  ink: "bg-ink/10 dark:bg-paper/10",
};

// Full-screen overlay shown for a beat while we hand off to another view.
// Purely cosmetic - it gives the transition some weight and a bit of
// personality instead of an instant, jarring route swap.
export default function LoadingOverlay({ message, subtitle, accent = "amber" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper dark:bg-ink"
    >
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.05] text-ink dark:text-paper" aria-hidden="true" />
      <div className="h-1.5 urban-gradient absolute top-0 left-0 w-full" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="relative text-center px-8 max-w-sm"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className={`mx-auto mb-5 w-14 h-14 rounded-2xl border-3 border-ink dark:border-ink-line flex items-center justify-center ${ACCENT_BG[accent] || ACCENT_BG.amber}`}
        >
          <span className="w-3 h-3 rounded-full urban-gradient" aria-hidden="true" />
        </motion.div>
        <p className="font-display font-bold text-xl text-ink dark:text-paper leading-snug mb-2">
          {message}
        </p>
        {subtitle && <p className="text-sm text-ink/50 dark:text-paper/50">{subtitle}</p>}
      </motion.div>
    </motion.div>
  );
}
