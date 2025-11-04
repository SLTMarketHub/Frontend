import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const username = params.get("username");

        if (token && username) {
            const decoded = jwtDecode(token);

            setAuthUser({
                id: decoded.id,
                name: decoded.username || "",
                email: decoded.email || "",
                role: "customer",
                authProvider: "google",
                token,
            });

            localStorage.setItem("token", token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email,
                    role: "Customer",
                })
            );

            navigate("/home");
        }
    }, [setAuthUser, navigate]);

    return <div>Logging you in with Google...</div>;
};

export default GoogleCallback;
