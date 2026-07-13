import { Link } from "react-router-dom";

const LINKS = [
  { to: "/admin/sales", label: "Sales", desc: "Revenue totals by day, week, and month" },
  { to: "/admin/pins", label: "Order PINs", desc: "Forgot-PIN lookup for any active order" },
  { to: "/admin/delivery-times", label: "Delivery times", desc: "Avg. time to close, per waiter" },
  { to: "/admin/best-sellers", label: "Best sellers", desc: "Most-ordered items in a date range" },
  { to: "/admin/low-stock", label: "Low stock", desc: "Items below the stock threshold" },
  { to: "/admin/history", label: "Order history", desc: "Every completed order, with prep and close timestamps" },
  { to: "/admin/quick-add", label: "Quick add", desc: "Add a menu item, waiter, or table" },
];

export default function AdminHome() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {LINKS.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className="bg-white rounded-2xl border border-ink/10 p-5 hover:border-amber-deep hover:shadow-sm transition-all"
        >
          <p className="font-display font-semibold text-ink text-lg">{l.label}</p>
          <p className="text-ink/50 text-sm mt-1">{l.desc}</p>
        </Link>
      ))}
    </div>
  );
}
