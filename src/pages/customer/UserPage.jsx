import React, { useState, useEffect } from "react";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { ThreeDots } from "react-loader-spinner";

const UserPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    repeat: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserDetails(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!userDetails) return;

    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_ENDPOINT_TMF629}/${userDetails.id}`),
          fetch(`${import.meta.env.VITE_ENDPOINT_TMF622_ORDER}/byCustomer/${userDetails.id}`),
        ]);

        const userData = await userRes.json();
        const orderData = await orderRes.json();

        setUserData(userData);
        setOrders(orderData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...passwords, [name]: value };
    setPasswords(updated);
    setPasswordMatch(updated.new === updated.repeat);
  };

  const ViewOrdersBtnClick = () => {
    window.location.href = `/user/${userDetails.id}/orders`;
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 py-12 px-6 flex flex-col items-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-8 border-b pb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Hi, {userDetails?.username?.split(" ")[0] || "User"} 👋
              </h1>
              <p className="text-gray-600 mt-1">{userDetails?.email || "Email: N/A"}</p>
              <p className="text-gray-600">{userData?.phone || "Phone: N/A"}</p>
              <p className="text-gray-600">{userData?.address || "Address: N/A"}</p>
              <p className="text-gray-500 text-sm mt-1">
                Member since{" "}
                {userDetails?.createdAt
                  ? new Date(userDetails.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 border rounded-xl p-6 hover:shadow-md transition md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Orders
              </h2>
              <ul className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-gray-600">No orders found.</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <li key={order.id} className="border rounded-lg p-3 bg-white">
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.orderDate).toISOString().split("T")[0]} | Status:{" "}
                        {order.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {order.totalAmount.toFixed(2)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
              {orders.length > 0 && (
                <button
                  onClick={ViewOrdersBtnClick}
                  className="mt-4 text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  View All Orders →
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Profile
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  defaultValue={userDetails?.username || "Customer Name"}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={userDetails?.email || "customer@example.com"}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="tel"
                  defaultValue={userData?.phone || ""}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  defaultValue={userData?.address || ""}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Change Password
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Repeat New Password</label>
                <input
                  type="password"
                  name="repeat"
                  value={passwords.repeat}
                  onChange={handlePasswordChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${
                    passwordMatch
                      ? "focus:ring-blue-500"
                      : "focus:ring-red-500 border-red-400"
                  }`}
                />
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={!passwordMatch}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
