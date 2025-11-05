import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterOthersPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Partner",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");

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
            const role = formData.role || "Partner";
            navigate(
                `/complete-signup?email=${encodeURIComponent(
                    formData.email
                )}&username=${encodeURIComponent(
                    formData.username
                )}&password=${encodeURIComponent(
                    formData.password
                )}&role=${encodeURIComponent(role)}&from=manual`
            );
        } catch (err) {
            setMessage("Server error while sending OTP");
        } finally {
            setLoading(false);
        }
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
                    Create Your Account
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Register as a Partner to manage your MarketHub operations.
                </p>

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

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    {/* Password Strength Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded mb-2">
                        <div
                            className={`h-2 rounded ${
                                passwordStrength <= 1
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
                            className={`text-sm mb-3 ${
                                passwordStrength <= 1
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

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg mb-1 ${
                            passwordError ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                    />

                    {passwordError && (
                        <p className="text-red-500 text-sm mb-3">{passwordError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || isSubmitDisabled}
                        className={`w-full mt-2.5 md:mt-4 text-white py-3 rounded-lg font-semibold shadow-md transition duration-200 ${
                            loading || isSubmitDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                        }`}
                    >
                        {loading ? "Requesting OTP..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-center mt-5 text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/loginOthers"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterOthersPage;
