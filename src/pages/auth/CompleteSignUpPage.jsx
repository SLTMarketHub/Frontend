import React, {useState, useEffect, useRef} from "react";
import {useSearchParams, useNavigate, Link} from "react-router-dom";

const CompleteSignupPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialEmail = searchParams.get("email") || "";
    const initialUsername = searchParams.get("username") || "";
    const initialpw = searchParams.get("password") || "";
    const initialRole = searchParams.get("role") || "";
    const googleToken = searchParams.get("token") || "";
    const fromGoogle = !!googleToken;

    const [countdown, setCountdown] = useState(0);
    const [step, setStep] = useState("FORM");
    const [formData, setFormData] = useState({
        username: initialUsername,
        email: initialEmail,
        password: initialpw,
        role: initialRole,
        otp: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const otpInputRef = useRef(null);

    // Focus on input when page loads
    useEffect(() => {
        otpInputRef.current?.focus();
    }, []);


    const backendUrl =
        "https://markethub-api-gateway.onrender.com/tmf-api/authService/auth";

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        if (!formData.email) {
            setMessage("Email is required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("OTP sent to your email");
                setStep("OTP");
                setCountdown(60);
            } else {
                setMessage(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setMessage("Server error while sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSignup = async () => {
        const { username, email, password, otp } = formData;
        if (!otp || !username || !email || !password) {
            setMessage("All fields and OTP are required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/complete-signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role:initialRole,
                    otp,
                    google: fromGoogle,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                const token = fromGoogle ? googleToken : data.token;
                if (token) localStorage.setItem("token", token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user || { username, email, role:initialRole })
                );

                if(initialRole === "Customer"){
                    navigate("/login");
                } else if (initialRole === "Partner" || "Admin") {
                    navigate("/loginSellers");
                }

            } else {
                setMessage(data.message || "Signup failed");
            }
        } catch (err) {
            setMessage("Server error during signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div
                className="relative w-[95%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fadeIn">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
                    {fromGoogle ? "Complete Google Signup" : "Create Your Account"}
                </h2>

                {message && (
                    <div
                        className="mb-3 text-sm text-red-600 text-center">
                        {message}
                    </div>
                )}

                {step === "FORM" && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Full Name"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70"
                        >
                            {loading ? "Sending OTP..." : "Request OTP"}
                        </button>
                    </div>
                )}

                {step === "OTP" && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            ref={otpInputRef}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />

                        <button
                            onClick={handleCompleteSignup}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-70"
                        >
                            {loading ? "Completing Signup..." : "Complete Signup"}
                        </button>

                        <button
                            onClick={sendOtp}
                            disabled={loading || countdown > 0}
                            className="w-full border py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-70"
                        >
                            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompleteSignupPage;
