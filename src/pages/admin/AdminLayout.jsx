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
    <div className="min-h-screen bg-paper-dim">
      <NavBar />
      <div className="p-6 max-w-5xl mx-auto">
        <header className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
            {isIndex ? "Smart Bar" : <Link to="/admin" className="hover:underline">Smart Bar admin</Link>}
          </p>
          <h1 className="font-display font-bold text-3xl text-ink mt-1">{title}</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
