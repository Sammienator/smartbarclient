import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/ThemeContext";

// NavBar now follows the app-wide theme (light/dark) instead of being
// forced into a fixed "dark" look on certain pages - colors only change
// when the person toggles dark mode, from the same toggle everywhere.
export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b-3 bg-paper/95 dark:bg-ink/95 backdrop-blur border-ink dark:border-ink-line transition-colors">
      <Link
        to="/"
        className="flex items-center gap-2.5 text-sm font-medium group text-ink/60 hover:text-ink dark:text-paper/70 dark:hover:text-paper transition-colors"
      >
        <motion.span whileHover={{ x: -2 }} transition={{ duration: 0.15 }} aria-hidden="true">
          ←
        </motion.span>
        <span className="w-2.5 h-2.5 rounded-full urban-gradient" aria-hidden="true" />
        Home
      </Link>

      <span className="font-tag text-[11px] uppercase tracking-widest text-ink/70 dark:text-paper/60">
        Smart Bar <span className="text-copper">·</span> Nairobi
      </span>

      <button
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="w-8 h-8 rounded-lg border-2 border-ink dark:border-ink-line flex items-center justify-center text-ink dark:text-paper hover:bg-amber hover:text-ink hover:border-ink transition-colors"
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
}
