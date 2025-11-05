import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuthUser } = useAuth();

    const BASE_URL = "http://localhost:3050/tmf-api/authService";

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const needRole = params.get("needRole");
        const email = params.get("email");
        const name = params.get("name");

        console.log("Google callback params:", { token, needRole, email, name });

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const user = {
                    _id: payload.id,
                    email: payload.email,
                    username: payload.username || name || "",
                    role: payload.role || "Customer",
                };

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setAuthUser(user);

                console.log("Existing Google user logged in:", user);
                navigate("/dashboard");
            } catch (err) {
                console.error("Invalid token:", err);
                navigate("/login");
            }
            return;
        }

        if ((needRole === "true" || needRole === true || needRole === "1") && email && name) {
            const createUser = async () => {
                try {
                    console.log("Creating Google Customer user...");
                    const res = await axios.post(`${BASE_URL}/auth/google/complete-signup`, {
                        email,
                        name,
                        role: "Customer",
                    });

                    if (res.data && res.data.token) {
                        const payload = JSON.parse(atob(res.data.token.split(".")[1]));
                        const user = {
                            _id: payload.id,
                            email: payload.email,
                            username: payload.username || name,
                            role: payload.role || "Customer",
                        };

                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("user", JSON.stringify(user));
                        setAuthUser(user);

                        console.log("New Google Customer created:", user);
                        navigate("/dashboard");
                    } else {
                        console.error("No token returned from backend:", res.data);
                        navigate("/login");
                    }
                } catch (err) {
                    console.error("Google Customer signup failed:", err.response?.data || err.message);
                    navigate("/login");
                }
            };

            createUser();
            return;
        }

        console.warn("Google callback missing expected params:", { needRole, email, name });
        navigate("/login");
    }, [location, navigate, setAuthUser]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <p className="text-gray-700 text-lg animate-pulse">
                Processing your Google account...
            </p>
        </div>
    );
};

export default GoogleSuccess;


