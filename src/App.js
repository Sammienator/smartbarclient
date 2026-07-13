import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GuestApp from "./pages/GuestApp";
import WaiterApp from "./pages/WaiterApp";
import StationApp from "./pages/StationApp";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import OrderPinsPage from "./pages/admin/OrderPinsPage";
import DeliveryTimesPage from "./pages/admin/DeliveryTimesPage";
import BestSellersPage from "./pages/admin/BestSellersPage";
import LowStockPage from "./pages/admin/LowStockPage";
import OrderHistoryPage from "./pages/admin/OrderHistoryPage";
import QuickAddPage from "./pages/admin/QuickAddPage";

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-xs">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">Smart Bar</p>
        <h1 className="font-display font-bold text-2xl text-ink mb-6">Choose a view</h1>
        <div className="space-y-2">
          <Link to="/order" className="block rounded-lg border border-ink/15 px-4 py-3 text-ink hover:border-ink/40">
            Guest app
          </Link>
          <Link to="/waiter" className="block rounded-lg border border-ink/15 px-4 py-3 text-ink hover:border-ink/40">
            Waiter app
          </Link>
          <Link to="/kitchen" className="block rounded-lg border border-ink/15 px-4 py-3 text-ink hover:border-ink/40">
            Kitchen view
          </Link>
          <Link to="/bar" className="block rounded-lg border border-ink/15 px-4 py-3 text-ink hover:border-ink/40">
            Drinks / bar view
          </Link>
          <Link to="/admin" className="block rounded-lg border border-ink/15 px-4 py-3 text-ink hover:border-ink/40">
            Admin dashboard
          </Link>
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
