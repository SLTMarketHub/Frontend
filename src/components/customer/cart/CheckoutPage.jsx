import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/customer/Header";
import Footer from "../../../components/customer/Footer";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, address, shipping, payment, total } = location.state || {};

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Checkout</h2>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>
          <ul className="space-y-1">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.qty}</span>
                <span>Rs.{(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t pt-3 space-y-1 text-sm">
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Shipping:</strong> {shipping}</p>
            <p><strong>Payment:</strong> {payment}</p>
            <p className="font-bold text-base">Total: Rs.{total.toFixed(2)}</p>
          </div>

          {/* ✅ Back to Cart + Place Order buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-1/2 bg-gray-300 hover:bg-red-400 text-gray-800 font-medium py-2 rounded-md text-sm"
            >
              ⬅ Back to Cart
            </button>

            <button
              onClick={() => {
                alert("✅ Order Placed Successfully!");
                navigate("/");
              }}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md text-sm"
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
