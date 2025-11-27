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
    const roleFromUrl = params.get("role");

    if (token && username) {
      const decoded = jwtDecode(token);

      // Role detection (prefer decoded token → then URL param → default customer)
      const userRole =
        decoded.role?.toLowerCase() ||
        roleFromUrl?.toLowerCase() ||
        "customer";

      // Save user in context
      setAuthUser({
        id: decoded.id,
        name: decoded.username || username || "",
        email: decoded.email || "",
        role: userRole,
        authProvider: "google",
        token,
      });

      // Persist in local storage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: decoded.id,
          username: decoded.username || username,
          email: decoded.email,
          role: userRole,
        })
      );

      navigate("/home");
    }
  }, [setAuthUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">
      Logging you in with Google...
    </div>
  );
};

export default GoogleCallback;
