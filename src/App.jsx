import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

// ✅ Customer pages
import HomePage from "./pages/customer/HomePage.jsx";
import ProductCategory from "./pages/customer/ProductCategory.jsx";
import ProductPage from "./pages/customer/ProductPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import CheckoutPage from "./components/customer/cart/CheckoutPage.jsx";
import UserPage from "./pages/customer/UserPage.jsx";
import OrdersPage from "./pages/customer/OrdersPage.jsx";
import NotFoundPage from "./pages/auth/NotFoundPage.jsx";


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


            {/* 🔹 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;