import { motion } from "framer-motion";

const ACCENTS = {
  amber: "bg-amber",
  copper: "bg-copper",
  electric: "bg-electric",
  moss: "bg-moss",
  ink: "bg-ink",
};

export default function Section({ title, children, className = "", accent = "amber" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-2xl border-3 border-ink shadow-pop p-5 overflow-hidden ${className}`}
    >
      <div className={`absolute top-0 left-0 h-1.5 w-full ${ACCENTS[accent] || ACCENTS.amber}`} aria-hidden="true" />
      {title && (
        <h2 className="font-display font-bold text-ink text-lg mb-4 mt-1">{title}</h2>
      )}
      {children}
    </motion.section>
  );
}
