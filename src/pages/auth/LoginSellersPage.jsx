import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginSellersPage = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Password visibility state
    const [showPassword, setShowPassword] = useState(false);

    const backend_url = "https://markethub-api-gateway.onrender.com/tmf-api/authService/auth";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`${backend_url}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);

                const mappedRole = (data?.user?.role || "customer").toLowerCase();
                setAuthUser({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: mappedRole,
                    authProvider: "email",
                    token: data.token,
                });

                if (mappedRole === "partner") navigate("/dashboard");
                else if (mappedRole === "customer") navigate("/home");
                else if (mappedRole === "admin") navigate("/admin/dashboard");
                else navigate("/");
            } else {
                setMessage(data.message || "Invalid credentials");
            }
        } catch (err) {
            setMessage("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50 animated-gradient-bg">
            <div className="relative w-[95%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fadeIn">
                <button
                    onClick={() => navigate("/home")}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                >
                    ✕
                </button>
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <img src="./logo.png" alt="MarketHub Logo" className="h-10 mr-2" />
                        <h1 className="text-4xl font-bold text-center text-blue-700">
                            MarketHub
                        </h1>
                    </div>
                    <h1 className="text-xl font-bold text-center text-black mb-2">
                        Sign in to your Seller Account
                    </h1>
                </div>

                {message && (
                    <div className="mb-3 text-sm text-red-600 text-center">{message}</div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black-700 dark:text-black-200 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-black-700 dark:text-black-200 mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pr-10 p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[58%] transform -translate-y-1/2 text-gray-600"
                        >
                            {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-center mt-5 text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/registerSellers"
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Animated gradient background */}
            <style jsx="true">{`
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animated-gradient-bg {
                    background: linear-gradient(-45deg, #4db849, #0f55a6, #4db849, #0f55a6);
                    background-size: 300% 300%;
                    animation: gradientFlow 10s ease infinite;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default LoginSellersPage;
