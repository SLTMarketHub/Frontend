import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const GoogleSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [googleUser, setGoogleUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const backendUrl =
        "https://markethub-api-gateway.onrender.com/tmf-api/authService/auth";

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const role = params.get("role");
        const email = params.get("email");
        const name = params.get("name");

        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const user = {
                _id: payload.id,
                email: payload.email,
                username: payload.username || "",
                role: "Customer",
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setAuthUser(user);

            navigate("/dashboard");
        } else if (email) {
            setGoogleUser({ email, name });
        } else {
            navigate("/login");
        }
    }, [location, navigate, setAuthUser]);

    const completeGoogleSignup = async () => {
        if (!googleUser) return;
        try {
            setLoading(true);
            await axios.post(`${backendUrl}/google/complete-signup`, {
                email: googleUser.email,
                name: googleUser.name,
                role: "Customer",
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Google signup failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {googleUser ? (
                <div className="bg-white p-6 rounded-2xl shadow-md text-center w-96">
                    <h2 className="text-xl font-semibold mb-4">
                        Welcome, {googleUser.name} !!!
                    </h2>
                    <p className="mb-4">Completing your signup as a Customer...</p>
                    <button
                        onClick={completeGoogleSignup}
                        disabled={loading}
                        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Continue"}
                    </button>
                </div>
            ) : (
                <p className="text-gray-600">Processing Google login...</p>
            )}
        </div>
    );
};

export default GoogleSuccess;
