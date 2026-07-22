import { motion } from "framer-motion";

const VARIANTS = {
  primary: "bg-ink text-paper border-ink dark:border-ink-line hover:bg-ink-soft",
  amber: "bg-amber text-ink border-ink dark:border-ink-line hover:bg-amber-deep hover:text-paper",
  copper: "bg-copper text-paper border-ink dark:border-ink-line hover:brightness-110",
  electric: "bg-electric text-paper border-ink dark:border-ink-line hover:brightness-110",
  moss: "bg-moss text-ink border-ink dark:border-ink-line hover:brightness-105",
  outline: "bg-paper dark:bg-ink-soft text-ink dark:text-paper border-ink dark:border-ink-line hover:bg-ink/5 dark:hover:bg-paper/5",
  ghost: "bg-transparent text-ink/60 dark:text-paper/60 border-transparent shadow-none hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5",
  danger: "bg-danger text-paper border-ink dark:border-ink-line hover:brightness-110",
};

// Thin wrapper around framer-motion's <button> that gives every button in
// the app the same tactile sticker/pop-card press feel — thick border,
// offset hard shadow that flattens on press — instead of hand-rolling the
// same transition classes everywhere. Keep using plain <button> anywhere
// this doesn't fit (e.g. inside <form> where native submit matters most).
export default function Button({
  variant = "primary",
  className = "",
  disabled = false,
  children,
  ...props
}) {
  const isGhost = variant === "ghost";
  return (
    <motion.button
      whileHover={disabled || isGhost ? {} : { y: -2 }}
      whileTap={disabled || isGhost ? {} : { y: 2, x: 2, boxShadow: "0 0 0 0 #111114" }}
      transition={{ duration: 0.12 }}
      disabled={disabled}
      className={`rounded-xl font-display font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isGhost ? "" : "border-3 shadow-pop"
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
