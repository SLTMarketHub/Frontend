import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const CartContext = createContext();

// Hook for using context easily
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage and listen for changes
  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
      setCartCount(storedCart.reduce((sum, item) => sum + (item.quantity || 1), 0));
    };

    loadCart();

    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // Add item to cart
  const addToCart = (item) => {
    const existingCart = [...cart];
    const existingIndex = existingCart.findIndex((i) => i.productId === item.productId);

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += item.quantity;
    } else {
      existingCart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    setCartCount(existingCart.reduce((sum, i) => sum + (i.quantity || 1), 0));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, i) => sum + (i.quantity || 1), 0));
  };

  // Update quantity of a cart item
  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, i) => sum + (i.quantity || 1), 0));
  };

  // Clear cart completely
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
