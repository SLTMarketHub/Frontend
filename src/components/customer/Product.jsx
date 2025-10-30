import React, { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";

export default function Product({ productDetails }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState("");

    const VITE_ENDPOINT_TMF622_ORDER = import.meta.env.VITE_ENDPOINT_TMF622_ORDER;
    const customerId = sessionStorage.getItem("userId");

    const increaseQuantity = () => setQuantity((q) => q + 1);
    const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setShow(true);
        setTimeout(() => setShow(false), 3000);
    };

    const handleAddToCart = () => {
        try {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingIndex = cart.findIndex(
                (item) => item.productId === productDetails.id
            );

            if (existingIndex !== -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({
                    customerId,
                    productId: productDetails.id,
                    name: productDetails.name,
                    price: productDetails.resolvedPrice,
                    image:
                        productDetails.productImage?.[0]?.url ||
                        "/assets/images/placeholderImg.jpg",
                    quantity,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            addToCart(quantity);
            showAlert("success", `Product added to cart!`);
        } catch (err) {
            console.error("Add to cart error:", err);
            showAlert("error", "Failed to add to cart. Please try again.");
        }
    };

    const handleBuyNow = async () => {
        try {
            const orderPayload = {
                externalId: `ORDER-${Date.now()}`,
                priority: "Normal",
                description: `Order for ${productDetails.name}`,
                category: "Product Purchase",
                requestedStartDate: new Date().toISOString(),
                requestedCompletionDate: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ).toISOString(),
                orderItem: [
                    {
                        id: "1",
                        action: "add",
                        quantity: quantity,
                        product: {
                            id: productDetails.id,
                            name: productDetails.name,
                            productSpecification: {
                                id: `PS-${productDetails.id}`,
                                name: productDetails.name + " Specification"
                            }
                        },
                        productOffering: {
                            id: productDetails.id,
                            name: productDetails.name
                        },
                        billingAccount: {
                            id: `ACC-${customerId}`,
                            name: "Customer Account"
                        }
                    }
                ],
                relatedParty: [
                    {
                        id: customerId,
                        role: "Customer",
                        name: "Customer"
                    }
                ],
                state: "acknowledged"
            };

            const res = await fetch(VITE_ENDPOINT_TMF622_ORDER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(orderPayload)
            });

            if (res.ok) {
                showAlert("success", `${productDetails.name} purchased successfully!`);
            } else {
                const errorData = await res.json();
                console.error("Order API Error:", errorData);
                showAlert("error", "Failed to process your order.");
            }
        } catch (err) {
            console.error("Buy Now error:", err);
            showAlert("error", "Error occurred. Please try again.");
        }
    };

    if (!productDetails) {
        return (
            <div className="p-6 text-center text-gray-600">
                No product details available.
            </div>
        );
    }

    return (
        <div className="block m-6">
            <div className="flex mb-2">
                <img
                    src={
                        productDetails.productImage?.[0]?.url ||
                        "/assets/images/placeholderImg.jpg"
                    }
                    alt={productDetails.name || "Product"}
                    className="w-[24rem] h-[24rem] object-cover rounded-lg mr-4"
                />

                <div className="flex-col mx-4 w-full">
                    <h2 className="text-3xl font-bold text-left mb-2">
                        {productDetails.name || "No Information"}
                    </h2>

                    {/* Product Category */}
                    <p className="wrap-anywhere mb-4 text-justify">
                        Category:{" "}
                        {Array.isArray(productDetails.category)
                            ? productDetails.category.map((c) => c.name).join(", ")
                            : productDetails.category?.name || "No Information"}
                    </p>

                    <div className="h-[1px] bg-gray-300 my-4"></div>

                    <p className="text-blue-900 font-bold text-3xl mb-4">
                        {productDetails.resolvedPrice || "0.00"}
                    </p>

                    {/* Quantity + Stock */}
                    <div className="flex mb-4">
                        <div className="flex items-center border rounded-lg w-28 justify-between px-3 py-2">
                            <button
                                onClick={decreaseQuantity}
                                className="text-xl font-bold text-gray-600 hover:text-[#0F55A7]"
                            >
                                −
                            </button>
                            <span className="text-lg font-medium">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="text-xl font-bold text-gray-600 hover:text-[#0F55A7]"
                            >
                                +
                            </button>
                        </div>
                        <p className="ml-6 self-center-safe content-center">
                            {productDetails.availableStock !== undefined
                                ? `Available Stock: ${productDetails.availableStock}`
                                : "Available Stock: No Information"}
                        </p>
                    </div>

                    <div className="flex">
                        <button
                            onClick={handleBuyNow}
                            className="mt-2 bg-[#0F55A7]/80 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#0F55A7] transition-colors duration-300 w-36 mb-4"
                        >
                            Buy Now
                        </button>

                        <button
                            onClick={handleAddToCart}
                            className="mt-2 border-2 border-[#0F55A7] text-[#0F55A7] py-2 px-4 rounded-lg hover:bg-[#0F55A7]/10 transition-colors duration-300 cursor-pointer ml-2 w-36 mb-4"
                        >
                            Add to Cart
                        </button>

                        {/* Alert */}
                        {show && (
                            <div
                                className={`fixed top-24 right-2 px-6 py-3 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
                                    alert.type === "success" ? "bg-green-500" : "bg-red-600"
                                }`}
                            >
                                {alert.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-gray-300 my-4"></div>

            <div>
                <h3 className="text-2xl font-bold mb-4 text-center">
                    Product Details
                </h3>
                <p className="text-gray-600 text-center">
                    {productDetails.description || "No product description available."}
                </p>
            </div>
        </div>
    );
}
