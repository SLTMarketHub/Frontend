import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const backend_url =
        "https://markethub-api-gateway.onrender.com/tmf-api/authService/auth";


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

                if (mappedRole === "partner") navigate("/partner");
                else if (mappedRole === "customer") navigate("/dashboard");
                else if (mappedRole === "admin") navigate("/admin");
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

    const handleGoogleLogin = () => {
        window.location.href = `${backend_url}/google`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="relative w-[95%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fadeIn">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
                    Sign In to MarketHub
                </h2>

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

                    <div>
                        <label className="block text-sm font-medium text-black-700 dark:text-black-200 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                    <FcGoogle size={22} />
                    <span className="font-medium text-gray-700">
            Sign in with Google
          </span>
                </button>

                <p className="text-sm text-center mt-5 text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
