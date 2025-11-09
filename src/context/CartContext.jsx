import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const CartContext = createContext();

// Hook for using context easily
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // ✅ Load cart count from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    loadCart();

    // ✅ Listen for changes from other tabs/components
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // ✅ Add to cart
  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    // localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
  };

  // ✅ Remove an item from cart
  const removeFromCart = (itemId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
  };

  // ✅ Clear cart after checkout
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{ cartCount, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
