import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/customer/Header";
import Footer from "../../../components/customer/Footer";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, shipping, payment, total, customerId } = location.state || {};

  const [customerAddress, setCustomerAddress] = useState(null); // existing backend address
  const [manualAddress, setManualAddress] = useState(""); // for manual entry
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch customer address from backend
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (customerId) {
          const res = await axios.get(
            `http://localhost:5000/api/customers/${customerId}`
          );
          setCustomerAddress(res.data.address); // might be {} or null
        } else {
          setCustomerAddress(null);
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading checkout data...</p>
      </div>
    );
  }

  if (!cartItems) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">No checkout data found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 🟢 Determine which address to use
  const finalAddress = useNewAddress
    ? manualAddress
    : customerAddress &&
      Object.values(customerAddress).some((val) => val && val.trim() !== "")
    ? `${customerAddress.street1 || ""}, ${customerAddress.city || ""}, ${
        customerAddress.country || ""
      }`
    : manualAddress;

  // ✅ Handle order placement
  const handlePlaceOrder = () => {
    if (!finalAddress || finalAddress.trim() === "") {
      alert("⚠️ Please enter a delivery address before placing your order.");
      return;
    }

    const orderDetails = {
      cartItems,
      address: finalAddress,
      shipping,
      payment,
      total,
      orderDate: new Date().toLocaleString(),
    };

    console.log("✅ Order placed successfully:", orderDetails);
    alert("✅ Order Placed Successfully!");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Checkout Page
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-md mx-auto">
          {/* 🧾 Order Summary */}
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>

          <ul className="space-y-1">
            {cartItems.map((item) => (
              <li
                key={item.id || item.productId}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity || item.qty || 1}
                </span>
                <span>
                  Rs.
                  {(
                    parseFloat(item.price?.toString().replace(/[^0-9.]/g, "")) *
                    (item.quantity || item.qty || 1)
                  ).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {/* 🏠 Address Section */}
          <div className="border-t pt-3 text-sm">
            <label className="block font-medium text-gray-700 mb-2">
              Delivery Address:
            </label>

            {/* If customer has NO address → show manual entry */}
            {(!customerAddress ||
              !Object.values(customerAddress).some(
                (val) => val && val.trim() !== ""
              )) && (
              <textarea
                rows="3"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your delivery address here..."
              />
            )}

            {/* If customer HAS an address → show it + option to enter new */}
            {customerAddress &&
              Object.values(customerAddress).some(
                (val) => val && val.trim() !== ""
              ) && (
                <>
                  {!useNewAddress ? (
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700 mb-2">
                      <p>
                        <strong>Default:</strong>{" "}
                        {`${customerAddress.street1 || ""}, ${
                          customerAddress.city || ""
                        }, ${customerAddress.country || ""}`}
                      </p>
                      <button
                        onClick={() => setUseNewAddress(true)}
                        className="text-blue-600 text-xs mt-1 hover:underline"
                      >
                        ✏️ Enter a new address
                      </button>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        rows="3"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your new address here..."
                      />
                      <button
                        onClick={() => setUseNewAddress(false)}
                        className="text-red-500 text-xs mt-1 hover:underline"
                      >
                        ❌ Cancel new address
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>

          {/* 🚚 Shipping & 💳 Payment Info */}
          <div className="space-y-1 text-sm">
            <p>
              <strong>Shipping:</strong> {shipping || "Not selected"}
            </p>
            <p>
              <strong>Payment:</strong> {payment || "Not selected"}
            </p>
            <p className="font-bold text-base">
              Total: Rs.{total ? total.toFixed(2) : "0.00"}
            </p>
          </div>

          {/* ✅ Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-md text-sm transition-colors"
            >
              ⬅ Back to Cart
            </button>

            <button
              onClick={handlePlaceOrder}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md text-sm transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
