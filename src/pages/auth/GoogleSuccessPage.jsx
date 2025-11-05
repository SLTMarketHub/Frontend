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

    // ✅ Backend URL (change if needed)
    const backendUrl = import.meta.env.VITE_ENDPOINT_AUTH || "http://localhost:5000/api/auth";

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const email = params.get("email");
        const name = params.get("name");

        if (token) {
            // ✅ Existing Google user (already in DB)
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const user = {
                    _id: payload.id,
                    name: payload.name,
                    email: payload.email,
                    role: payload.role || "Customer",
                };

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setAuthUser(user);
                navigate("/home");
            } catch (err) {
                console.error("Invalid token", err);
                navigate("/login");
            }
        } else if (email && name) {
            // ✅ New Google user (not yet in DB)
            setGoogleUser({ email, name });
        } else {
            navigate("/login");
        }
    }, [location, navigate, setAuthUser]);

    useEffect(() => {
        if (googleUser) {
            completeGoogleSignup();
        }
    }, [googleUser]);

    const completeGoogleSignup = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/google/complete-signup`,
                {
                    email: googleUser.email,
                    name: googleUser.name,
                    role: "Customer",
                }
            );

            // Store user in global auth context + session
            setAuthUser(response.data.user);
            sessionStorage.setItem("authUser", JSON.stringify(response.data.user));

            // ✅ Redirect to /home automatically
            navigate("/home");
        } catch (error) {
            console.error("Google signup failed", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center w-96">
                {loading ? (
                    <p className="text-gray-600">Completing your signup...</p>
                ) : (
                    <h2 className="text-xl font-semibold mb-4">
                        Welcome, {googleUser?.name || "User"}!
                    </h2>
                )}
            </div>
        </div>
    );
};

export default GoogleSuccess;
