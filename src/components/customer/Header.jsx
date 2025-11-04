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

  // Navigation handlers
  const goToLogin = () => navigate("/login");
  const goToSignUp = () => navigate("/register");
  const goToCart = () => navigate("/cart");
  const goToProfile = () =>
    navigate(`/user/profile/${userDetails?.username || authUser?.username || authUser?.name || "user"}`);
  const goToOrders = () => navigate("/orders");

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    localStorage.clear();
    navigate("/home");
  };

  return (
    <div className="flex items-center w-full p-4 bg-gradient-to-r from-[#0F55A7] to-[#4DB848] text-white font-bold justify-between relative">
      {/* Logo */}
      <div className="align-left pr-4 justify-center mt-auto mb-auto text-[26px] z-50 cursor-pointer">
        <a href="/home">
          <h1 className="ml-4 text-white">MarketHub</h1>
        </a>
      </div>

      {/* Right Section */}
      <div className="flex space-x-8 items-center relative mr-4">
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
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.25 8.27a.75.75 0 0 1-.02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg border border-gray-200 w-48 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={goToProfile}
                    className="block w-full text-center px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={goToOrders}
                    className="block w-full text-center px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 text-red-600 hover:bg-gray-100"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 mr-2"
                >
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
                <div
                  className="absolute right-0 mt-2 text-black rounded-lg shadow-lg z-50 bg-gray-100 p-4 w-44"
                  onClick={(e) => e.stopPropagation()}
                >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
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
