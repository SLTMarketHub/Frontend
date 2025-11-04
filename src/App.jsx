import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Import Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Orders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Support from './pages/admin/Support';
import SellerApproval from './pages/SellerApproval';
import ProductModeration from './pages/ProductModeration';

// Authentication temporarily disabled - all routes are accessible

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (optional - authentication disabled) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes - Direct Access (No Auth) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="sellers" element={<SellerApproval />} />
          <Route path="products" element={<ProductModeration />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
        
        {/* Customer Routes - Direct Access (No Auth) */}
        <Route path="/customer/*" element={<CustomerLayout />} />
        
        {/* Seller Routes - Direct Access (No Auth) */}
        <Route path="/seller/*" element={<CustomerLayout />} />
        
        {/* Default redirect to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slt-primary">404</h1>
                <p className="text-xl text-gray-600 mt-4">Page not found</p>
                <a
                  href="/admin/dashboard"
                  className="inline-block mt-6 px-6 py-3 bg-slt-primary text-white rounded-lg hover:bg-slt-primary/90 transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;