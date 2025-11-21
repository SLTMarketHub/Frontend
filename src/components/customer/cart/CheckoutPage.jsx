import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/customer/Header";
import Footer from "../../../components/customer/Footer";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, total, customerId } = location.state || {};

  const [shipping, setShipping] = useState("Standard");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [shippingCost, setShippingCost] = useState(300);

  const [customerAddress, setCustomerAddress] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });

  useEffect(() => {
    console.log(location.state)
  }, [])

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id) {
          const res = await axios.get(
            `${import.meta.env.VITE_ENDPOINT_TMF629_BY_ENGAGED_PARTY}/${user.id}`
          );
          setCustomerData(res.data);
          setCustomerAddress(res.data.address);
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

  // Update shipping cost dynamically
  useEffect(() => {
    if (shipping === "Standard") setShippingCost(300);
    else if (shipping === "Express") setShippingCost(600);
  }, [shipping]);

  const hasValidAddress =
    customerAddress &&
    Object.values(customerAddress).some((val) => val && val.trim() !== "");

  const finalAddress = useNewAddress
    ? manualAddress
    : hasValidAddress
      ? `${customerAddress.street1 || ""}${customerAddress.street2 ? ", " + customerAddress.street2 : ""
      }, ${customerAddress.city || ""}, ${customerAddress.state || ""}, ${customerAddress.postalCode || ""
      }, ${customerAddress.country || ""}`
      : manualAddress;

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = async () => {
    if (!addressForm.street1 || !addressForm.city || !addressForm.country) {
      alert("⚠️ Please fill in Street, City, and Country");
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
      alert(`❌ Error saving address`);
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!finalAddress || finalAddress.trim() === "") {
      alert("⚠️ Please enter a delivery address before placing your order.");
      return;
    }

    if (!customerId) {
      alert("⚠️ Customer ID missing. Please log in again.");
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
          href: `${import.meta.env.VITE_ENDPOINT_TMF620_OFFERING}${item.id || item.productId}`,
          price: parseFloat(item.price)
        },
        quantity: item.quantity || 1,
        state: "acknowledged",
      }));

      const payload = {
        externalId: `ORDER-${Date.now()}`,
        description: `Order placed by ${customerData?.name || "Customer"}`,
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
            text: `Shipping: ${shipping}, Payment: ${payment}`,
            date: new Date(),
            author: customerData?.name || customerId
          }
        ],
        total: grandTotal
      };
      console.log(payload)
      const res = await axios.post(
        import.meta.env.VITE_ENDPOINT_TMF622_ORDER,
        payload
      );
      console.log("Order placed")
      

      alert(`✅ Order placed successfully!\nOrder ID: ${res.data.id}`);
      localStorage.removeItem("cart");
      navigate("/", { state: { orderSuccess: true, orderId: res.data.id } });
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("❌ Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex flex-col min-h-[80vh] items-center justify-center">
          <ThreeDots variant="pulsate" color="#4DB848" size="medium" text="" textColor="" ariaLabel="loading" />
        </div>
        <Footer />
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

  const grandTotal = (total || 0) + shippingCost;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Checkout Page
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>

          <ul className="space-y-1">
            {cartItems.map((item) => (
              <li key={item.id || item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span>
                  Rs.{(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {/* Shipping Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Method
            </label>
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="Standard">Standard (Rs.300)</option>
              <option value="Express">Express (Rs.600)</option>
            </select>
          </div>

          {/* Payment Selection */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Card Payment">Card Payment</option>
            </select>
          </div>

          {/* Address Section */}
          <div className="border-t pt-3 text-sm mt-4">
            <label className="block font-medium text-gray-700 mb-2">
              Delivery Address:
            </label>

            {hasValidAddress && !useNewAddress && (
              <div className="bg-gray-100 p-3 rounded-md text-gray-700 mb-2">
                <p>{finalAddress}</p>
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
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter delivery address..."
                />
                <button
                  onClick={() => setUseNewAddress(false)}
                  className="text-red-500 text-xs mt-1 hover:underline"
                >
                  ❌ Use saved address
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1 text-sm border-t pt-3 mt-3">
            <p>
              <strong>Shipping:</strong> {shipping} (Rs.{shippingCost})
            </p>
            <p>
              <strong>Payment:</strong> {payment}
            </p>
            <p className="font-bold text-base">
              Total: Rs.{grandTotal.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-md text-sm"
            >
              ⬅ Back to Cart
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md text-sm flex items-center justify-center"
            >
              {placingOrder ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Address Modal (unchanged) */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Update Address
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {["street1", "street2", "city", "state", "postalCode", "country"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={addressForm[field]}
                      onChange={handleAddressFormChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm"
                  >
                    Save Address
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
