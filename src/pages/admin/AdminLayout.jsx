import { Link, Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";

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
    <div className="min-h-screen bg-paper-dim relative">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.03] text-ink" aria-hidden="true" />
      <NavBar />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />
      <div className="relative p-6 max-w-5xl mx-auto">
        <header className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
            {isIndex ? "Smart Bar" : <Link to="/admin" className="hover:underline hover:text-ink">Smart Bar admin</Link>}
          </p>
          <h1 className="font-tag text-2xl sm:text-3xl text-ink mt-1">{title}</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
