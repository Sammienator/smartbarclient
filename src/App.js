import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UtensilsCrossed, ClipboardList, ChefHat, Martini, LayoutDashboard, ArrowRight } from "lucide-react";
import GuestApp from "./pages/GuestApp";
import WaiterApp from "./pages/WaiterApp";
import StationApp from "./pages/StationApp";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import SalesPage from "./pages/admin/SalesPage";
import OrderPinsPage from "./pages/admin/OrderPinsPage";
import DeliveryTimesPage from "./pages/admin/DeliveryTimesPage";
import BestSellersPage from "./pages/admin/BestSellersPage";
import LowStockPage from "./pages/admin/LowStockPage";
import OrderHistoryPage from "./pages/admin/OrderHistoryPage";
import QuickAddPage from "./pages/admin/QuickAddPage";

const VIEWS = [
  {
    to: "/order",
    label: "Guest app",
    desc: "Browse the menu, pick a table, place an order",
    icon: UtensilsCrossed,
    accent: "teal",
  },
  {
    to: "/waiter",
    label: "Waiter app",
    desc: "Live order queue, close out with a guest's PIN",
    icon: ClipboardList,
    accent: "teal",
  },
  {
    to: "/kitchen",
    label: "Kitchen",
    desc: "Food orders as they come in, one tap when ready",
    icon: ChefHat,
    accent: "amber",
  },
  {
    to: "/bar",
    label: "Drinks / bar",
    desc: "Same as kitchen, scoped to drinks",
    icon: Martini,
    accent: "amber",
  },
  {
    to: "/admin",
    label: "Admin dashboard",
    desc: "Sales, reports, stock, and setup",
    icon: LayoutDashboard,
    accent: "ink",
  },
];

const ACCENT_STYLES = {
  teal: {
    iconWrap: "bg-teal-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white",
    ring: "hover:border-emerald-700/40 hover:shadow-emerald-900/5",
  },
  amber: {
    iconWrap: "bg-amber/15 text-amber-deep group-hover:bg-amber-deep group-hover:text-white",
    ring: "hover:border-amber-deep/50 hover:shadow-amber-900/5",
  },
  ink: {
    iconWrap: "bg-ink/5 text-ink group-hover:bg-ink group-hover:text-paper",
    ring: "hover:border-ink/40 hover:shadow-ink/5",
  },
};

function Landing() {
  return (
    <div className="min-h-screen bg-paper relative overflow-hidden">
      {/* soft ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-moss/10 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40 mb-3">Smart Bar</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-3">Choose a view</h1>
          <p className="text-ink/50 text-sm max-w-md mx-auto">
            One system, five screens — pick the one you need right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
          {VIEWS.map((v, i) => {
            const Icon = v.icon;
            const styles = ACCENT_STYLES[v.accent];
            return (
              <motion.div
                key={v.to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  to={v.to}
                  className={`group relative flex flex-col h-full bg-white rounded-2xl border border-ink/10 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${styles.ring}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 ${styles.iconWrap}`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <p className="font-display font-semibold text-ink text-lg mb-1">{v.label}</p>
                  <p className="text-ink/50 text-sm leading-snug flex-1">{v.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-ink/30 mt-4 group-hover:text-ink/60 transition-colors">
                    Open
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/order" element={<GuestApp />} />
        <Route path="/waiter" element={<WaiterApp />} />
        <Route path="/kitchen" element={<StationApp station="kitchen" />} />
        <Route path="/bar" element={<StationApp station="bar" />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="pins" element={<OrderPinsPage />} />
          <Route path="delivery-times" element={<DeliveryTimesPage />} />
          <Route path="best-sellers" element={<BestSellersPage />} />
          <Route path="low-stock" element={<LowStockPage />} />
          <Route path="history" element={<OrderHistoryPage />} />
          <Route path="quick-add" element={<QuickAddPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
