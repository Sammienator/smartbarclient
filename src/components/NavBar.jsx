import { Link } from "react-router-dom";

export default function NavBar({ dark = false }) {
  return (
    <div
      className={
        "sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b " +
        (dark ? "bg-ink border-ink-line" : "bg-paper/95 backdrop-blur border-ink/10")
      }
    >
      <Link
        to="/"
        className={
          "flex items-center gap-2 text-sm font-medium " +
          (dark ? "text-paper/70 hover:text-paper" : "text-ink/60 hover:text-ink")
        }
      >
        <span aria-hidden="true">←</span> Home
      </Link>
      <span className={"font-mono text-xs uppercase tracking-widest " + (dark ? "text-paper/30" : "text-ink/30")}>
        Smart Bar
      </span>
    </div>
  );
}
