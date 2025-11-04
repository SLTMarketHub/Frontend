import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

// ✅ Auth pages
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import RegisterOthersPage from "./pages/auth/RegisterOthersPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import LoginOthersPage from "./pages/auth/LoginOthersPage.jsx";
import CompleteSignupPage from "./pages/auth/CompleteSignUpPage.jsx";
import GoogleSuccess from "./pages/auth/GoogleSuccessPage.jsx";
import GoogleCallback from "./pages/auth/GoogleCallbackPage.jsx";
import NotFoundPage from "./pages/auth/NotFoundPage.jsx";

// ✅ Customer pages
import HomePage from "./pages/customer/HomePage.jsx";
import ProductCategory from "./pages/customer/ProductCategory.jsx";
import ProductPage from "./pages/customer/ProductPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import CheckoutPage from "./components/customer/cart/CheckoutPage.jsx";
import UserPage from "./pages/customer/UserPage.jsx";
import OrdersPage from "./pages/customer/OrdersPage.jsx";

// ✅ Seller pages
import Orders from "./pages/seller/Orders.jsx";
import OrderDetails from "./pages/seller/OrderDetails.jsx";
import Inventory from "./pages/seller/Inventory.jsx";
import Promotions from "./pages/seller/Promotions.jsx";
import Messages from "./pages/seller/Messages.jsx";
import SellerSupport from "./pages/seller/Support.jsx";
import SellerDashboard from './pages/seller/Dashboard.jsx';
import StoreManagement from './pages/seller/StoreManagement.jsx';
import Products from './pages/seller/Products.jsx';
import AddProduct from './pages/seller/AddProduct.jsx';
import EditProduct from './pages/seller/EditProduct.jsx';
import SellerAnalytics from './pages/seller/Analytics.jsx';
import Payouts from './pages/seller/Payouts.jsx';

// ✅ Admin pages
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Support from './pages/admin/Support';
import SellerApproval from './pages/SellerApproval';
import ProductModeration from './pages/ProductModeration';

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Routes>
            {/* 🔹 Default route */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* 🔹 Auth routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/registerOthers" element={<RegisterOthersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loginOthers" element={<LoginOthersPage />} />
            <Route path="/complete-signup" element={<CompleteSignupPage />} />
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            
            {/* 🔹 Customer routes (public) */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/category/:categoryId" element={<ProductCategory />} />
            <Route path="/product/:id" element={<ProductPage />} />
            
            {/* 🔹 Protected Customer routes */}
            <Route
                path="/cart"
                element={
                    <ProtectedRoute>
                        <CartPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/checkout"
                element={
                    <ProtectedRoute>
                        <CheckoutPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user/profile/:id"
                element={
                    <ProtectedRoute>
                        <UserPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user/:id/orders"
                element={
                    <ProtectedRoute>
                        <OrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 Protected Seller routes */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory"
                element={
                    <ProtectedRoute>
                        <Inventory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/promotions"
                element={
                    <ProtectedRoute>
                        <Promotions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <Messages />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/support"
                element={
                    <ProtectedRoute>
                        <SellerSupport />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <SellerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/store"
                element={
                    <ProtectedRoute>
                        <StoreManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <Products />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products/add"
                element={
                    <ProtectedRoute>
                        <AddProduct />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditProduct />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <SellerAnalytics />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payouts"
                element={
                    <ProtectedRoute>
                        <Payouts />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="sellers" element={<SellerApproval />} />
                <Route path="products" element={<ProductModeration />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
            </Route>
              
            {/* 🔹 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;