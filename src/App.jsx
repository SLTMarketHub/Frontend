import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import CompleteSignupPage from "./pages/auth/CompleteSignUpPage.jsx";
import GoogleSuccess from "./pages/auth/GoogleSuccessPage.jsx";
import GoogleCallback from "./pages/auth/GoogleCallbackPage.jsx";
import NotFoundPage from "./pages/auth/NotFoundPage.jsx";
import RegisterOthersPage from "./pages/auth/RegisterOthersPage.jsx";
import LoginOthersPage from "./pages/auth/LoginOthersPage.jsx";

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

import './App.css'


function App() {
    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/registerOthers" replace />} />

            {/* Auth routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/registerOthers" element={<RegisterOthersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loginOthers" element={<LoginOthersPage />} />
            <Route path="/complete-signup" element={<CompleteSignupPage />} />

            {/* Google OAuth routes */}
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/google-callback" element={<GoogleCallback />} />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
