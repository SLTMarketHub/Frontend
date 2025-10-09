import React, { useState } from "react";
import { useCart } from '../../context/CartContext.jsx';

export default function Product(props) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [show, setShow] = useState(false);
    const [alart, setAlart] = useState();

    const increaseQuantity = () => setQuantity((q) => q + 1);
    const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const customerId = "12345";

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_GROUP = import.meta.env.VITE_API_GROUP_TMF622;
    const RESOURCE = import.meta.env.VITE_RESOURCE_TMF622;

    const handleAddToCart = async () => {
        try {
            const res = await fetch(`${BASE_URL}/${API_GROUP}/${RESOURCE}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId,
                    productId: props.productId,
                    quantity,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setAlart("success");
                setShow(true);
                setTimeout(() => setShow(false), 3000);
            } else {
                setAlart("failed");
                setShow(true);
                setTimeout(() => setShow(false), 3000);
            }
            console.log(`Adding to cart: customerId=${customerId}, productId=${props.productId}, quantity=${quantity}`);
            console.log(`${BASE_URL}/${API_GROUP}/${RESOURCE}`)

            setAlart("success");
            addToCart(quantity);
            setShow(true);
            setTimeout(() => setShow(false), 3000);
        } catch (err) {
            console.error(err);
            setAlart("failed");
            setShow(true);
            setTimeout(() => setShow(false), 3000);
        }
    };

    const handleBuyNow = async () => {
        try {
            const res = await fetch(`${BASE_URL}/${API_GROUP}/${RESOURCE}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId,
                    productId: props.productId,
                    quantity,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                // navigate("/checkout", { state: { product: props, quantity } });
            } else {
                setAlart("failed");
                setShow(true);
                setTimeout(() => setShow(false), 3000);
            }
            console.log(`Buy Now: customerId=${customerId}, productId=${props.productId}, quantity=${quantity}`);
        } catch (err) {
            console.error(err);
            setAlart("failed");
            setShow(true);
            setTimeout(() => setShow(false), 3000);
        }
    };

    return (
        <div className="block m-6">
            <div className="flex mb-2">
                <img
                    src={
                        props.productImage ||
                        "/assets/images/placeholderImg.jpg"
                    }
                    alt={props.productName || "Product"}
                    className="w-[24rem] h-[24rem] object-cover rounded-lg mr-4"
                />
                <div className="flex-col mx-4 w-full">
                    {/* Product Name */}
                    <h2 className="text-3xl font-bold text-left mb-2">
                        {props.productName || "No Information"}
                    </h2>

                    {/* Product Category */}
                    <p className="wrap-anywhere mb-4 text-justify">
                        Category: {props.productCategory || "No Information"}
                    </p>

                    <div className="h-[1px] bg-gray-300 my-4"></div>

                    {/* Product Price */}
                    <p className="text-blue-900 font-bold text-3xl mb-4">
                        {props.productPrice
                            ? `Rs. ${props.productPrice}`
                            : "No Information"}
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
                            <span className="text-lg font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={increaseQuantity}
                                className="text-xl font-bold text-gray-600 hover:text-[#0F55A7]"
                            >
                                +
                            </button>
                        </div>
                        <p className="ml-6 self-center-safe content-center ">
                            {props.availableStock !== undefined
                                ? `Available Stock: ${props.availableStock}`
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
                                className={`fixed top-24 right-2 px-6 py-3 rounded-lg shadow-lg text-white transition-opacity duration-300 ${alart === "success" ? "bg-green-500" : "bg-red-600"
                                    }`}
                            >
                                {alart === "success"
                                    ? `${props.productName} added to cart!`
                                    : "Error occurred. Please try again."}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
