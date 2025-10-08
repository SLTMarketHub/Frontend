import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";

import SellerApproval from "../pages/SellerApproval.jsx";
import PerformanceMetrics from "../pages/PerformanceMetrics.jsx";
import Commissions from "../pages/Commissions.jsx";
import ProductModeration from "../pages/ProductModeration.jsx";
import BulkEditProducts from "../pages/BulkEditProducts.jsx";
import OrderOversight from "../pages/OrderOversight.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<SellerApproval />} />
          <Route path="/performance" element={<PerformanceMetrics />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/product-moderation" element={<ProductModeration />} />
          <Route path="/bulk-edit" element={<BulkEditProducts />} />
          <Route path="/orders" element={<OrderOversight />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
