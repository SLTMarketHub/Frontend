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

  // ✅ Schema-based Edit Form state
  const [editForm, setEditForm] = useState({
    name: "",
    emailAddress: "",
    phoneNumber: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserDetails(JSON.parse(storedUser));
  }, []);

  // ✅ Fetch customer data by engagedParty ID
  useEffect(() => {
    if (!userDetails) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_TMF629_BY_ENGAGED_PARTY}/${userDetails.id}`
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setUserData(data);

        // Pre-fill edit form using Customer schema
        setEditForm({
          name: data.name || "",
          emailAddress: data?.contactMedium?.[0]?.emailAddress || "",
          phoneNumber: data?.contactMedium?.[0]?.phoneNumber || "",
          street1: data?.address?.street1 || "",
          street2: data?.address?.street2 || "",
          city: data?.address?.city || "",
          state: data?.address?.state || "",
          postalCode: data?.address?.postalCode || "",
          country: data?.address?.country || "",
        });

        console.log("✅ User Data Fetched:", data);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  // ✅ Fetch orders by user (customer) ID
  useEffect(() => {
    if (!userData?._id) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_TMF622_ORDER_BY_CUSTOMER}/${userData._id}`
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        console.log("✅ Orders fetched:", data);
        setOrders(data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [userData]);

  // ✅ Handle password input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...passwords, [name]: value };
    setPasswords(updated);
    setPasswordMatch(updated.new === updated.repeat);
  };

  // ✅ Handle edit form input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit profile changes (PATCH)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: editForm.name,
        contactMedium: [
          {
            "@type": "EmailContact",
            contactType: "personal",
            preferred: true,
            emailAddress: editForm.emailAddress,
            phoneNumber: editForm.phoneNumber,
          },
        ],
        address: {
          street1: editForm.street1,
          street2: editForm.street2,
          city: editForm.city,
          state: editForm.state,
          postalCode: editForm.postalCode,
          country: editForm.country,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_TMF629}/${userData._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setShowEditProfile(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
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
                Hi, {userData?.name || "User"} 👋
              </h1>

              <p className="text-gray-600 mt-1">
                Email: {userData?.contactMedium?.[0]?.emailAddress || "N/A"}
              </p>
              <p className="text-gray-600">
                Phone: {userData?.contactMedium?.[0]?.phoneNumber || "N/A"}
              </p>
              <p className="text-gray-600">
                Address: {userData?.address?.street1 || "N/A"},{" "}
                {userData?.address?.city || ""}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                Member since{" "}
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
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
                        Date:{" "}
                        {new Date(order.orderDate).toISOString().split("T")[0]} |
                        Status: {order.status}
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

      {/* ✅ Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Profile
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={editForm.emailAddress}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <hr className="my-3" />
              <h3 className="text-gray-700 font-medium">Address</h3>

              <div>
                <label className="block text-gray-700">Street 1</label>
                <input
                  type="text"
                  name="street1"
                  value={editForm.street1}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Street 2</label>
                <input
                  type="text"
                  name="street2"
                  value={editForm.street2}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={editForm.state}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={editForm.postalCode}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Country</label>
                <input
                  type="text"
                  name="country"
                  value={editForm.country}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
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
    </div>
  );
};

export default UserPage;
