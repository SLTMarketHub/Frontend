import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
    const { cartCount } = useCart();
    const { isAuthenticated, authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const goToLogin = () => navigate("/login");
    const goToSignUp = () => navigate("/register");
    const goToCart = () => navigate("/cart");
    const goToProfile = () => navigate("/profile");
    const goToOrders = () => navigate("/orders");

    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) setUserDetails(storedUser);
        }
    }, [isAuthenticated]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex items-center w-full p-4 bg-gradient-to-r from-[#0F55A7] to-[#4DB848] text-white font-bold justify-between relative">
            {/* Logo */}
            <div className="align-left pr-4 justify-center mt-auto mb-auto text-[26px]">
                <a href="/home">
                    <h1 className="ml-4">MarketHub</h1>
                </a>
            </div>

            {/* Search Bar */}
            {/* <div className="align-center justify-center mt-auto mb-auto flex">
                <input
                    type="text"
                    placeholder="Search"
                    className="rounded-l-[20px] h-auto px-4 py-2 text-black bg-[#fafafa] w-80 placeholder:text-[#b1b1b1] focus:outline-none font-semibold"
                />
                <button className="bg-white text-blue-900 rounded-r-[20px] p-4 cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div> */}

            {/* Right Section */}
            <div className="flex space-x-8 items-center relative mr-4">
                {/* Notifications */}
                <div className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path
                            fillRule="evenodd"
                            d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div> */}

                {/* User Section */}
                <div className="relative" ref={dropdownRef}>
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 font-semibold text-sm cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Hi, {userDetails?.username || authUser?.name || "User"}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.25 8.27a.75.75 0 0 1-.02-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg border border-gray-200 w-48 z-50">
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            goToProfile();
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            goToOrders();
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        My Orders
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            logout();
                                            localStorage.clear();
                                            navigate("/home");
                                        }}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center font-semibold text-sm cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                                    <path
                                        fillRule="evenodd"
                                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div className="text-left">
                                    <p>Welcome</p>
                                    <p>Sign In / Register</p>
                                </div>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 text-black rounded-lg shadow-lg z-50 bg-gray-100 p-4 w-44">
                                    <button
                                        onClick={goToLogin}
                                        className="block w-full px-4 py-2 hover:bg-gray-200 border-2 border-blue-600 rounded-lg text-blue-600 font-semibold"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={goToSignUp}
                                        className="block w-full px-4 py-2 hover:bg-gray-200 border-2 border-blue-600 rounded-lg bg-blue-600 text-white font-semibold mt-2"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Cart with count */}
                <div className="relative cursor-pointer" onClick={goToCart}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                            {cartCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
