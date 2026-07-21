import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NavBar({ dark = false }) {
  return (
    <div
      className={
        "sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b-3 " +
        (dark ? "bg-ink border-ink-line" : "bg-paper/95 backdrop-blur border-ink")
      }
    >
      <Link
        to="/"
        className={
          "flex items-center gap-2.5 text-sm font-medium group " +
          (dark ? "text-paper/70 hover:text-paper" : "text-ink/60 hover:text-ink")
        }
      >
        <motion.span whileHover={{ x: -2 }} transition={{ duration: 0.15 }} aria-hidden="true">
          ←
        </motion.span>
        <span className="w-2.5 h-2.5 rounded-full urban-gradient" aria-hidden="true" />
        Home
      </Link>
      <span
        className={
          "font-tag text-[11px] uppercase tracking-widest " + (dark ? "text-paper/60" : "text-ink/70")
        }
      >
        Smart Bar <span className="text-copper">·</span> Nairobi
      </span>
    </div>
  );
}
