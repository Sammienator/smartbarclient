import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  KeyRound,
  Clock,
  Award,
  PackageX,
  History,
  PlusCircle,
} from "lucide-react";

const LINKS = [
  { to: "/admin/sales", label: "Sales", desc: "Revenue totals by day, week, and month", icon: TrendingUp, accent: "amber" },
  { to: "/admin/pins", label: "Order PINs", desc: "Forgot-PIN lookup for any active order", icon: KeyRound, accent: "copper" },
  { to: "/admin/delivery-times", label: "Delivery times", desc: "Avg. time to close, per waiter", icon: Clock, accent: "electric" },
  { to: "/admin/best-sellers", label: "Best sellers", desc: "Most-ordered items in a date range", icon: Award, accent: "moss" },
  { to: "/admin/low-stock", label: "Low stock", desc: "Items below the stock threshold", icon: PackageX, accent: "danger" },
  { to: "/admin/history", label: "Order history", desc: "Every completed order, with prep and close timestamps", icon: History, accent: "ink" },
  { to: "/admin/quick-add", label: "Quick add", desc: "Add a menu item, waiter, or table — with photos", icon: PlusCircle, accent: "amber" },
];

const ACCENTS = {
  amber: { stripe: "bg-amber", wrap: "bg-amber/20 text-amber-deep group-hover:bg-amber group-hover:text-ink" },
  copper: { stripe: "bg-copper", wrap: "bg-copper/15 text-copper group-hover:bg-copper group-hover:text-paper" },
  electric: { stripe: "bg-electric", wrap: "bg-electric/15 text-electric group-hover:bg-electric group-hover:text-paper" },
  moss: { stripe: "bg-moss", wrap: "bg-moss/20 text-moss-deep group-hover:bg-moss group-hover:text-ink" },
  danger: { stripe: "bg-danger", wrap: "bg-danger/10 text-danger group-hover:bg-danger group-hover:text-paper" },
  ink: { stripe: "bg-ink", wrap: "bg-ink/5 text-ink group-hover:bg-ink group-hover:text-paper" },
};

export default function AdminHome() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {LINKS.map((l, i) => {
        const Icon = l.icon;
        const styles = ACCENTS[l.accent];
        return (
          <motion.div
            key={l.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            whileHover={{ y: -2 }}
          >
            <Link
              to={l.to}
              className="group relative flex items-start gap-4 bg-white rounded-2xl border-3 border-ink p-5 overflow-hidden shadow-pop hover:shadow-pop-lg transition-all duration-150"
            >
              <div className={`absolute top-0 left-0 h-1.5 w-full ${styles.stripe}`} />
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border-2 border-ink transition-colors duration-200 ${styles.wrap}`}>
                <Icon size={20} strokeWidth={2.25} />
              </div>
              <div>
                <p className="font-display font-bold text-ink text-lg">{l.label}</p>
                <p className="text-ink/50 text-sm mt-1">{l.desc}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
