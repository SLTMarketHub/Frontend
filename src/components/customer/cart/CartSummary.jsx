import React from "react";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ cartItems, promoCode, setPromoCode, address, shipping, payment }) => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promoCode === "SAVE10" ? subtotal * 0.1 : 0;

  // Dynamic shipping cost
  const shippingCost =
    shipping === "standard" ? 300 :
    shipping === "express" ? 600 : 0;

  const total = subtotal - discount + shippingCost;

  const handleCheckout = () => {
    if (!address) {
      alert("⚠️ Please select a delivery address.");
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

    // ✅ Navigate to checkout page with order details
    navigate("/checkout", { state: { cartItems, address, shipping, payment, total } });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>

      <div className="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span>Rs.{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-green-600">
        <span>Discount</span>
        <span>-Rs.{discount.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Shipping</span>
        <span>{shippingCost === 0 ? "—" : `Rs.${shippingCost.toFixed(2)}`}</span>
      </div>

      <hr className="border-gray-300" />

      <div className="flex justify-between font-bold text-lg text-gray-800">
        <span>Total</span>
        <span>Rs.{total.toFixed(2)}</span>
      </div>

      <input
        type="text"
        placeholder="Promo code"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        className="w-full border p-2 rounded-lg mt-2"
      />

      <button
        onClick={handleCheckout}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
