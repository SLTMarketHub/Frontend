import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/customer/Header";
import Footer from "../../../components/customer/Footer";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, shipping, payment, total, customerId } = location.state || {};

  const [customerAddress, setCustomerAddress] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });

  // Fetch customer data from backend
  useEffect(() => {
    console.log("details:", location.state)
    const fetchCustomerData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id) {
          const res = await axios.get(
            `${import.meta.env.VITE_ENDPOINT_TMF629_BY_ENGAGED_PARTY}/${user.id}`
          );

          setCustomerData(res.data);
          setCustomerAddress(res.data.address);
          console.log("✅ Fetched customer data:", res.data);
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

  // Check if customer has a valid address
  const hasValidAddress =
    customerAddress &&
    Object.values(customerAddress).some((val) => val && val.trim() !== "");

  // Determine which address to use
  const finalAddress = useNewAddress
    ? manualAddress
    : hasValidAddress
      ? `${customerAddress.street1 || ""}${customerAddress.street2 ? ", " + customerAddress.street2 : ""
      }, ${customerAddress.city || ""}, ${customerAddress.state || ""}, ${customerAddress.postalCode || ""
      }, ${customerAddress.country || ""}`
      : manualAddress;

  // Handle address form input changes
  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Save address to backend
  const handleSaveAddress = async () => {
    if (!addressForm.street1 || !addressForm.city || !addressForm.country) {
      alert("⚠️ Please fill in at least Street Address, City, and Country");
      return;
    }

    setSavingAddress(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_ENDPOINT_TMF629}/${customerId}`,
        {
          address: addressForm
        }
      );

      console.log("✅ Address saved successfully:", response.data);

      setCustomerAddress(addressForm);
      setShowAddressModal(false);
      alert("✅ Address saved successfully!");

      setAddressForm({
        street1: "",
        street2: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
      });
    } catch (error) {
      console.error("❌ Error saving address:", error);
      alert(`❌ Error saving address: ${error.response?.data?.error || error.message}`);
    } finally {
      setSavingAddress(false);
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!finalAddress || finalAddress.trim() === "") {
      alert("⚠️ Please enter a delivery address before placing your order.");
      return;
    }

    if (!customerId) {
      alert("⚠️ Customer ID is missing. Please log in again.");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderItems = cartItems.map((item, index) => ({
        id: `item-${index + 1}`,
        action: "add",
        product: {
          id: item.id || item.productId,
          name: item.name,
          href: `${import.meta.env.VITE_ENDPOINT_TMF620_OFFERING}${item.id || item.productId}`
        },
        quantity: item.quantity || item.qty || 1,
        state: "acknowledged"
      }));

      const productOrderPayload = {
        externalId: `ORDER-${Date.now()}`,
        description: `Order placed by customer ${customerData?.name || customerId}`,
        category: ["E-Commerce Order"],
        orderItem: orderItems,
        relatedParty: [
          {
            id: customerId,
            role: "customer",
            name: customerData?.name || "Customer",
            href: `${import.meta.env.VITE_ENDPOINT_TMF629}/${customerId}`
          }
        ],
        relatedPlace: [
          {
            id: "delivery-address-1",
            name: finalAddress,
            role: "deliveryAddress"
          }
        ],
        note: [
          {
            text: `Shipping: ${shipping || "Standard"}, Payment: ${payment || "COD"}`,
            date: new Date(),
            author: customerData?.name || customerId
          }
        ]
      };

      const response = await axios.post(
        import.meta.env.VITE_ENDPOINT_TMF622_ORDER,
        productOrderPayload
      );

      console.log("✅ Order created successfully:", response.data);

      // ✅ Remove ordered items from local storage after successful order
      localStorage.removeItem("cart");

      alert(`✅ Order Placed Successfully!\nOrder ID: ${response.data.id}`);

      // ✅ Redirect to home or order confirmation page
      navigate("/", {
        state: {
          orderSuccess: true,
          orderId: response.data.id
        }
      });
    } catch (error) {
      console.error("❌ Error placing order:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to place order";
      alert(`❌ Error placing order: ${errorMessage}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Checkout Page
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-md mx-auto">
          {/* Order Summary */}
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

          {/* Address Section */}
          <div className="border-t pt-3 text-sm">
            <label className="block font-medium text-gray-700 mb-2">
              Delivery Address:
            </label>

            {hasValidAddress && !useNewAddress && (
              <div className="bg-gray-100 p-3 rounded-md text-gray-700 mb-2">
                <p className="text-sm">
                  <strong>Current Address:</strong>
                </p>
                <p className="text-sm mt-1">
                  {customerAddress.street1}
                  {customerAddress.street2 && `, ${customerAddress.street2}`}
                  <br />
                  {customerAddress.city}, {customerAddress.state}{" "}
                  {customerAddress.postalCode}
                  <br />
                  {customerAddress.country}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setUseNewAddress(true)}
                    className="text-blue-600 text-xs hover:underline"
                  >
                    ✏️ Enter different address
                  </button>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-green-600 text-xs hover:underline"
                  >
                    📝 Update saved address
                  </button>
                </div>
              </div>
            )}

            {useNewAddress && (
              <div>
                <textarea
                  rows="3"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your delivery address here..."
                />
                <button
                  onClick={() => setUseNewAddress(false)}
                  className="text-red-500 text-xs mt-1 hover:underline"
                >
                  ❌ Use saved address
                </button>
              </div>
            )}

            {!hasValidAddress && !useNewAddress && (
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-3">No address found</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  📍 Select Another Address
                </button>
                <p className="text-gray-500 text-xs mt-2">or</p>
                <button
                  onClick={() => setUseNewAddress(true)}
                  className="text-blue-600 text-sm mt-1 hover:underline"
                >
                  Enter address for this order only
                </button>
              </div>
            )}
          </div>

          {/* Shipping & Payment Info */}
          <div className="space-y-1 text-sm border-t pt-3">
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/cart")}
              disabled={placingOrder}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⬅ Back to Cart
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {placingOrder ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {hasValidAddress ? "Update Address" : "Add New Address"}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street1"
                    value={addressForm.street1}
                    onChange={handleAddressFormChange}
                    placeholder="House number and street name"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address 2
                  </label>
                  <input
                    type="text"
                    name="street2"
                    value={addressForm.street2}
                    onChange={handleAddressFormChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressFormChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressFormChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    disabled={savingAddress}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {savingAddress ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                          5.291A7.962 7.962 0 014 12H0c0 
                          3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

