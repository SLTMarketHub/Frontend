import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Customer",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");

    // ✅ Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const backendUrl = "https://markethub-api-gateway.onrender.com/tmf-api/authService/auth";

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);

        let errorMsg = "";
        if (name === "password") errorMsg = validatePassword(value);

        if (updatedForm.confirmPassword) {
            for (let i = 0; i < updatedForm.confirmPassword.length; i++) {
                if (updatedForm.password[i] !== updatedForm.confirmPassword[i]) {
                    errorMsg = "Passwords do not match";
                    break;
                } else errorMsg = "";
            }
        }

        setPasswordError(errorMsg);
        setIsSubmitDisabled(
            !(updatedForm.password && updatedForm.confirmPassword && errorMsg === "")
        );
    };

    const validatePassword = (password) => {
        let score = 0;
        if (/.{6,}/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        setPasswordStrength(score);

        if (score <= 1) {
            setPasswordStrengthLabel("Weak");
            return "Password is too weak";
        } else if (score === 2 || score === 3) {
            setPasswordStrengthLabel("Medium");
            return "";
        } else if (score === 4) {
            setPasswordStrengthLabel("Strong");
            return "";
        }
        return "";
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!formData.role) formData.role = "Customer";
            navigate(
                `/complete-signup?email=${encodeURIComponent(
                    formData.email
                )}&username=${encodeURIComponent(
                    formData.username
                )}&password=${encodeURIComponent(
                    formData.password
                )}&role=${formData.role}&from=manual`
            );
        } catch (err) {
            setMessage("Server error while sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        if (!formData.role) formData.role = "Customer";
        window.location.href = `${backendUrl}/google?role=${formData.role}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50 animated-gradient-bg">
            <div className="relative w-[95%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fadeIn">

                <button
                    onClick={() => navigate("/home")}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                >
                    ✕ </button>

                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <img src="./logo.png" alt="MarketHub Logo" className="h-10 mr-2" />
                        <h1 className="text-4xl font-bold text-center text-blue-700">
                            MarketHub
                        </h1>
                    </div>
                    <h1 className="text-xl font-bold text-center text-black mb-2">
                        Sign Up
                    </h1>
                </div>

                {message && (
                    <div className="mb-3 text-sm text-red-600 text-center">{message}</div>
                )}

                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Full Name"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                    {/* Password input with show/hide */}
                    <div className="relative mb-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </button>
                    </div>

                    {/* Password Strength Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded mb-2">
                        <div
                            className={`h-2 rounded ${passwordStrength <= 1
                                ? "bg-red-500 w-1/4"
                                : passwordStrength === 2
                                    ? "bg-yellow-500 w-2/4"
                                    : passwordStrength === 3
                                        ? "bg-blue-500 w-3/4"
                                        : "bg-green-500 w-full"
                            }`}
                        ></div>
                    </div>
                    {passwordStrengthLabel && (
                        <p
                            className={`text-sm mb-3 ${passwordStrength <= 1
                                ? "text-red-500"
                                : passwordStrength === 2
                                    ? "text-yellow-600"
                                    : passwordStrength === 3
                                        ? "text-blue-600"
                                        : "text-green-600"
                            }`}
                        >
                            Strength: {passwordStrengthLabel}
                        </p>
                    )}

                    {/* Confirm Password input with show/hide */}
                    <div className="relative mb-1">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pr-10 p-3 border rounded-lg ${passwordError ? "border-red-500" : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </button>
                    </div>

                    {passwordError && (
                        <p className="text-red-500 text-sm mb-3">{passwordError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || isSubmitDisabled}
                        className={`w-full mt-2.5 md:mt-4 text-white py-3 rounded-lg font-semibold shadow-md transition duration-200 ${loading || isSubmitDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                        }`}
                    >
                        {loading ? "Requesting OTP..." : "Sign Up"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                </div>

                <button
                    onClick={handleGoogleSignUp}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                    <FcGoogle size={22} />
                    <span className="font-medium text-gray-700">
                        Sign up with Google
                    </span>
                </button>

                <p className="text-sm text-center mt-5 text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Sign In
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

export default RegisterPage;
