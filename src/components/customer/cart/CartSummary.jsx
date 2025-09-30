import React from "react";

const CartSummary = ({ cartItems, promoCode, setPromoCode }) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const discount = promoCode === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal - discount + shipping;

  return (
    <div className="border rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>

      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Discount</span>
        <span className="text-green-600">-${discount.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Promo Code */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
