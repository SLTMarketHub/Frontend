import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import CartItem from "../../components/customer/cart/CartItem";
import CartSummary from "../../components/customer/cart/CartSummary";
import AddressSelector from "../../components/customer/cart/AddressSelector";
import ShippingOptions from "../../components/customer/cart/ShippingOptions";
import PaymentMethods from "../../components/customer/cart/PaymentMethods";

const CartPage = () => {
  const navigate = useNavigate();
  const goBackHome = () => navigate("/");

  const [promoCode, setPromoCode] = useState("");
  const [address, setAddress] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [payment, setPayment] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="md:col-span-2 space-y-6">
          {/* Back to Home Button */}
          <div className="flex items-center mb-4">
            <button
              onClick={goBackHome}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7 7-7M3 12h18"
                />
              </svg>
              Back to Home
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Your Shopping Cart
          </h2>

          {/* Cart Items (Single unified component) */}
          <CartItem />

          {/* Checkout Options */}
          <AddressSelector address={address} setAddress={setAddress} />
          <ShippingOptions shipping={shipping} setShipping={setShipping} />
          <PaymentMethods payment={payment} setPayment={setPayment} />
        </div>

        {/* Right Side - Summary */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg sticky top-8 h-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CartSummary
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            address={address}
            shipping={shipping}
            payment={payment}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;
