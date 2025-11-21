import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [payment, setPayment] = useState(null);

  // Sync selected items with cart whenever cart changes
  useEffect(() => {
    setSelectedItems(cart);
  }, [cart]);

  // Toggle selection of a cart item
  const toggleSelectItem = (item) => {
    if (selectedItems.some((i) => i.productId === item.productId)) {
      setSelectedItems(selectedItems.filter((i) => i.productId !== item.productId));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQty) => {
    updateCartItemQuantity(productId, newQty);
  };

  // Handle item removal
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  // Calculate totals
  const subtotal = selectedItems.reduce((sum, item) => {
    const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
    return sum + numericPrice * (item.quantity || 1);
  }, 0);

  const total = subtotal;

  // Proceed to checkout
  const handleCheckout = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    navigate("/checkout", {
      state: {
        cartItems: selectedItems,
        // shipping,
        // payment,
        total,
        customerId: user?.id,
      },
    });

    // clearCart();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h2>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg"
            >
              ← Go Back
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => {
              const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.some((i) => i.productId === item.productId)}
                      onChange={() => toggleSelectItem(item)}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-600 text-sm">Rs.{numericPrice.toFixed(2)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, (item.quantity || 1) - 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity || 1}
                          min="1"
                          onChange={(e) =>
                            handleQuantityChange(item.productId, parseInt(e.target.value) || 1)
                          }
                          className="w-12 text-center border border-gray-300 rounded"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, (item.quantity || 1) + 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <p className="font-medium text-gray-800 mb-2">
                      Rs.{(numericPrice * (item.quantity || 1)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Shipping Options */}
          {/* <div className="mt-6">
            <h3 className="font-semibold mb-2">Shipping Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shipping === "standard"}
                  onChange={(e) => setShipping(e.target.value)}
                />
                Standard (Rs.300)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shipping === "express"}
                  onChange={(e) => setShipping(e.target.value)}
                />
                Express (Rs.600)
              </label>
            </div>
          </div> */}

          {/* Payment Options */}
          {/* <div className="mt-6">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={payment === "Cash on Delivery"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="Card Payment"
                  checked={payment === "Card Payment"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Card Payment
              </label>
            </div>
          </div> */}
        </div>

        {/* Summary */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg sticky top-8 h-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Summary</h3>
          <p className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </p>
          <hr className="my-2 border-gray-300" />
          <p className="flex justify-between font-bold text-lg text-gray-800">
            <span>Total:</span>
            <span>Rs.{total.toFixed(2)}</span>
          </p>

          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-[#0F55A7] hover:bg-[#0d4991] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Proceed to Checkout
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
