import React, { useEffect, useState } from "react";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // ✅ Load user details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserDetails(JSON.parse(storedUser));
  }, []);

  // ✅ Fetch orders by customer ID
  useEffect(() => {
    if (!userDetails?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_ENDPOINT_TMF622_ORDER_BY_CUSTOMER}/${userDetails.id}`
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        console.log("✅ Backend response:", data);

        // 🧠 Your backend returns a single order object, not { status, productOrder }
        // So we handle both possible cases here.
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && typeof data === "object" && data.id) {
          setOrders([data]); // wrap single order object in array
        } else {
          setError("No orders found");
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userDetails]);

  // ✅ Loader
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex justify-center items-center py-10">
          <ThreeDots color="#4DB848" height="60" width="60" />
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Error handler
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders found.</p>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const orderDate = order.orderDate
                ? new Date(order.orderDate).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : "N/A";

              return (
                <div
                  key={order.id}
                  className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
                >
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-3 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Order ID: {order.id}
                      </h2>
                      <p className="text-sm text-gray-600">Date: {orderDate}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium mt-3 md:mt-0 ${order.state === "acknowledged"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {order.state
                        ? order.state.charAt(0).toUpperCase() + order.state.slice(1)
                        : "N/A"}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Order Items:</h3>
                    <ul className="space-y-2">
                      {order.orderItems?.length > 0 ? (
                        order.orderItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between items-center border p-3 rounded-lg bg-gray-50"
                          >
                            <span className="text-gray-700">
                              {item.productName || "Unnamed Product"}
                            </span>
                            <span className="text-gray-600 text-sm">
                              Qty: {item.quantity}
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No items found.</p>
                      )}
                    </ul>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 flex flex-col md:flex-row gap-2">
                    <h3 className="font-semibold text-gray-800">Delivery Address:</h3>
                    <p className="text-gray-700">{order.address || "N/A"}</p>
                  </div>

                  {/* Order Type / Note */}
                  <div className="mt-2 flex flex-col md:flex-row gap-2">
                    <h3 className="font-semibold text-gray-800">Type:</h3>
                    <p className="text-gray-700">{order.type || "N/A"}</p>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
