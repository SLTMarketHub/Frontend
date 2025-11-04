import React from "react";

const OrderConfirmation = ({ orderId }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Order Confirmed 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase! Your order ID is:
        </p>
        <p className="font-mono text-lg">{orderId}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
