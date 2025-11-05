// ...existing code...
import React, { createContext, useContext, useEffect, useState } from "react";

const SellerContext = createContext(null);

export const useSeller = () => useContext(SellerContext);

export const SellerProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentShop, setCurrentShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock fetchers - replace with real API calls
  const fetchShop = async () => {
    setLoading(true);
    try {
      // TODO: replace with api call
      setCurrentShop({ id: "shop_1", name: "Demo Seller Shop" });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // TODO: replace with api call
      setProducts([
        { id: "1", name: "Sample product A", price: 100, stock: 10 },
        { id: "2", name: "Sample product B", price: 200, stock: 5 },
      ]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    setLoading(true);
    try {
      // TODO: call API to create product
      const newProduct = { id: Date.now().toString(), ...product };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, updates) => {
    setProducts((prev) => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    // TODO: call API to update product
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
    // TODO: call API to delete product
  };

  useEffect(() => {
    fetchShop();
    fetchProducts();
    // optionally fetchOrders/notifications here
  }, []);

  return (
    <SellerContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      currentShop,
      setCurrentShop,
      products,
      setProducts,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      setOrders,
      notifications,
      setNotifications,
      loading,
      error
    }}>
      {children}
    </SellerContext.Provider>
  );
};