import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

const SECTION_TITLES = {
  "": "Admin dashboard",
  sales: "Sales",
  pins: "Order PINs",
  "delivery-times": "Delivery times",
  "best-sellers": "Best sellers",
  "low-stock": "Low stock",
  history: "Order history",
  "quick-add": "Quick add",
};

export default function AdminLayout() {
  const location = useLocation();
  const segment = location.pathname.replace(/^\/admin\/?/, "");
  const title = SECTION_TITLES[segment] || "Admin dashboard";
  const isIndex = segment === "";

  return (
    <div className="min-h-screen bg-paper-dim dark:bg-ink relative transition-colors">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.03] text-ink dark:text-paper" aria-hidden="true" />
      <NavBar />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />
      <div className="relative p-6 max-w-5xl mx-auto">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink/40 dark:text-paper/40">
              {isIndex ? (
                "Smart Bar"
              ) : (
                <Link to="/admin" className="hover:underline hover:text-ink dark:hover:text-paper">
                  Smart Bar admin
                </Link>
              )}
            </p>
            <h1 className="font-tag text-2xl sm:text-3xl text-ink dark:text-paper mt-1">{title}</h1>
          </div>
          {!isIndex && (
            <Link to="/admin">
              <Button variant="outline" className="px-3.5 py-2 text-sm inline-flex items-center gap-1.5 shrink-0">
                <ArrowLeft size={14} /> Back to dashboard
              </Button>
            </Link>
          )}
        </header>
        <Outlet />
      </div>
    </div>
  );
}
