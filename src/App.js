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
    accent: "amber",
  },
  {
    to: "/waiter",
    label: "Waiter app",
    desc: "Live order queue, close out with a guest's PIN",
    icon: ClipboardList,
    accent: "moss",
  },
  {
    to: "/kitchen",
    label: "Kitchen",
    desc: "Food orders as they come in, one tap when ready",
    icon: ChefHat,
    accent: "copper",
  },
  {
    to: "/bar",
    label: "Drinks / bar",
    desc: "Same as kitchen, scoped to drinks",
    icon: Martini,
    accent: "electric",
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
  amber: {
    iconWrap: "bg-amber/20 text-amber-deep group-hover:bg-amber group-hover:text-ink",
    stripe: "bg-amber",
  },
  copper: {
    iconWrap: "bg-copper/15 text-copper group-hover:bg-copper group-hover:text-paper",
    stripe: "bg-copper",
  },
  moss: {
    iconWrap: "bg-moss/20 text-moss-deep group-hover:bg-moss group-hover:text-ink",
    stripe: "bg-moss",
  },
  electric: {
    iconWrap: "bg-electric/15 text-electric group-hover:bg-electric group-hover:text-paper",
    stripe: "bg-electric",
  },
  ink: {
    iconWrap: "bg-ink/5 text-ink group-hover:bg-ink group-hover:text-paper",
    stripe: "bg-ink",
  },
};

function Landing() {
  return (
    <div className="min-h-screen bg-paper relative overflow-hidden">
      {/* soft ambient backdrop + halftone texture, matatu-livery energy */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-amber/15 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-copper/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-electric/10 blur-3xl" />
        <div className="absolute inset-0 urban-dots opacity-[0.04] text-ink" />
      </div>
      <div className="h-2 hazard-strip w-full relative" aria-hidden="true" />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span className="tag-sticker inline-block bg-ink text-paper font-tag text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md border-2 border-ink shadow-pop-sm mb-4">
            Smart Bar · Nairobi
          </span>
          <h1 className="font-tag text-3xl sm:text-5xl text-ink mb-3 leading-tight">
            Choose your <span className="text-copper">view</span>
          </h1>
          <p className="text-ink/50 text-sm max-w-md mx-auto font-medium">
            One system, five screens — pick the one you need right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
          {VIEWS.map((v, i) => {
            const Icon = v.icon;
            const styles = ACCENT_STYLES[v.accent];
            return (
              <motion.div
                key={v.to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  to={v.to}
                  className="group relative flex flex-col h-full bg-white rounded-2xl border-3 border-ink p-6 shadow-pop hover:shadow-pop-lg transition-shadow duration-150"
                >
                  <div className={`absolute top-0 left-0 h-1.5 w-full ${styles.stripe}`} aria-hidden="true" />
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 border-2 border-ink ${styles.iconWrap}`}>
                    <Icon size={20} strokeWidth={2.25} />
                  </div>
                  <p className="font-display font-bold text-ink text-lg mb-1">{v.label}</p>
                  <p className="text-ink/50 text-sm leading-snug flex-1">{v.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-ink/40 mt-4 group-hover:text-ink transition-colors">
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
