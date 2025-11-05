import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ promoCode, setPromoCode, address, shipping, payment }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage initially
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Listen for real-time cart updates
  useEffect(() => {
    const handleCartChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(updatedCart);
    };

    window.addEventListener("storage", handleCartChange);
    window.addEventListener("cartUpdated", handleCartChange);

    return () => {
      window.removeEventListener("storage", handleCartChange);
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

  // Safely parse numeric price
  const parseNumericPrice = (raw) => {
    if (raw === null || raw === undefined) return 0;
    const cleaned = String(raw).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Get quantity safely
  const getQuantity = (item) => {
    const q = item.quantity ?? item.qty ?? 1;
    const n = Number(q);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  };

  // Calculate subtotal dynamically
  const subtotal = cartItems.reduce((sum, item) => {
    const numericPrice = parseNumericPrice(item.price);
    const qty = getQuantity(item);
    return sum + numericPrice * qty;
  }, 0);

  // ✅ Automatic Discount Logic
  let discount = 0;
  let discountLabel = "No discount applied";

  if (subtotal > 10000) {
    discount = subtotal * 0.05; // 5% off
    discountLabel = "5% discount for orders above Rs.10,000";
  } else if (subtotal > 5000) {
    discount = 300; // Flat Rs.300 off
    discountLabel = "Rs.300 discount for orders above Rs.5,000";
  }

  // Shipping cost logic
  const shippingCost =
    shipping === "standard" ? 300 : shipping === "express" ? 600 : 0;

  const total = subtotal - discount + shippingCost;

  // Checkout handler
  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      alert("⚠️ Your cart is empty.");
      return;
    }
    if (!shipping) {
      alert("⚠️ Please select a shipping option.");
      return;
    }
    if (!payment) {
      alert("⚠️ Please select a payment method.");
      return;
    }

    navigate("/checkout", {
      state: { cartItems, address, shipping, payment, total },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>

      <div className="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span>Rs.{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-green-700">
        <span>Discount</span>
        <span>-Rs.{discount.toFixed(2)}</span>
      </div>

      <p className="text-xs text-gray-500 italic">{discountLabel}</p>

      <div className="flex justify-between text-gray-700">
        <span>Shipping</span>
        <span>{shippingCost === 0 ? "—" : `Rs.${shippingCost.toFixed(2)}`}</span>
      </div>

      <hr className="border-gray-300" />

      <div className="flex justify-between font-bold text-lg text-gray-800">
        <span>Total</span>
        <span>Rs.{total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full mt-4 bg-[#0F55A7]/90 hover:bg-[#0F55A7] text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
