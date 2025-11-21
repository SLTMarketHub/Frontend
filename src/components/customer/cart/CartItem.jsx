import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Update cart items in both state & localStorage
  const updateCartStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // 🔹 Trigger a custom event so CartSummary updates immediately
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update quantity safely
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
        : item
    );
    updateCartStorage(updatedCart);
  };

  // Remove a product from cart
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    updateCartStorage(updatedCart);
  };

  // Compute total with safe parsing
  const total = cartItems.reduce((sum, item) => {
    const numericPrice =
      parseFloat(item.price?.toString().replace(/[^0-9.]/g, "")) || 0;
    return sum + numericPrice * (item.quantity || 1);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10 text-lg">
        🛒 Your cart is currently empty.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {cartItems.map((item) => (
        <motion.div
          key={item.productId}
          layout
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Product Info */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src={item.image || "/no-image.png"}
              alt={item.name}
              className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
            />
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-500 mt-1">Rs. {item.price}</p>
            </div>
          </div>

          {/* Quantity & Remove */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, parseInt(e.target.value))
              }
              className="w-16 border border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </motion.div>
      ))}

      {/* Cart Total */}
      <div className="mt-6 text-right text-xl font-semibold text-gray-800">
        Total: Rs. {total.toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;
