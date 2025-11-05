import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);

  // Function to clean and load cart
  const cleanAndLoadCart = useCallback(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Remove ALL duplicates by productId and merge quantities
    const cartMap = new Map();
    
    storedCart.forEach(item => {
      // Convert productId to string for consistent comparison
      const key = String(item.productId);
      
      if (cartMap.has(key)) {
        // Duplicate found - add to existing quantity
        const existing = cartMap.get(key);
        existing.quantity = (parseInt(existing.quantity) || 1) + (parseInt(item.quantity) || 1);
      } else {
        // New unique item
        cartMap.set(key, {
          ...item,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0
        });
      }
    });

    // Convert Map back to array
    const uniqueCart = Array.from(cartMap.values());
    
    // Save cleaned cart immediately back to localStorage
    localStorage.setItem("cart", JSON.stringify(uniqueCart));
    
    // Update state
    setCartItems(uniqueCart);
    
    // Log cleaning activity
    if (storedCart.length !== uniqueCart.length) {
      console.log(`🧹 Removed ${storedCart.length - uniqueCart.length} duplicate items`);
    }
    
    return uniqueCart;
  }, []);

  // Initial load and continuous monitoring
  useEffect(() => {
    // Clean cart on mount
    cleanAndLoadCart();
    
    // Set up interval to continuously check and clean cart
    const cleanupInterval = setInterval(() => {
      cleanAndLoadCart();
    }, 500); // Check every 500ms for immediate cleanup
    
    // Also listen for storage events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        cleanAndLoadCart();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Cleanup
    return () => {
      clearInterval(cleanupInterval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [cleanAndLoadCart]);

  // Update cart with duplicate prevention
  const updateCartStorage = (updatedCart) => {
    // Double-check for duplicates before saving
    const cartMap = new Map();
    updatedCart.forEach(item => {
      const key = String(item.productId);
      if (!cartMap.has(key)) {
        cartMap.set(key, {
          ...item,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0
        });
      }
    });
    
    const cleanedCart = Array.from(cartMap.values());
    setCartItems(cleanedCart);
    localStorage.setItem("cart", JSON.stringify(cleanedCart));
  };

  // Update quantity of a specific product
  const updateQuantity = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      String(item.productId) === String(productId)
        ? { ...item, quantity }
        : item
    );
    updateCartStorage(updatedCart);
  };

  // Remove product from cart
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => String(item.productId) !== String(productId)
    );
    updateCartStorage(updatedCart);
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0)
      .toFixed(2);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-600 mt-10 text-lg">
          🛒 Your cart is currently empty.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <AnimatePresence mode="popLayout">
        {cartItems.map((item) => (
          <motion.div
            key={String(item.productId)}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={item.image || "/assets/images/placeholderImg.jpg"}
                alt={item.name || "Product"}
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/assets/images/placeholderImg.jpg";
                }}
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name || "Unknown Product"}
                </h3>
                <p className="text-gray-500 mt-1">
                  Rs. {parseFloat(item.price).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, e.target.value)
                  }
                  className="w-16 border rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-red-600 hover:text-red-800 font-medium transition-colors px-3 py-2 rounded hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Cart Summary */}
      <div className="mt-6 p-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-700">
            Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
          <span className="text-2xl font-bold text-gray-800">
            Total: Rs. {calculateTotal()}
          </span>
        </div>
        
        <button
          onClick={clearCart}
          className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartItem;