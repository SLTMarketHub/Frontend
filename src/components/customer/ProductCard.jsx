import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const productImage =
    props.productDetails.attachment?.[0]?.href
      ? props.productDetails.attachment[0].href.startsWith("http")
        ? props.productDetails.attachment[0].href
        : `${BASE_URL}${props.productDetails.attachment[0].href}`
      : "/assets/images/placeholderImg.jpg";

  return (
    <div
      className="bg-white w-[250px] h-[325px] rounded-lg shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
      id={props.id}
    >
      <img
        src={productImage}
          alt={props.productDetails.name || "Product image"}
          onError={(e) => (e.target.src = "/assets/images/placeholderImg.jpg")}
        className="w-full h-36 object-cover mb-4 rounded-t-lg"
      />

      <h6
        className="text-lg font-semibold mb-1 text-center px-2 truncate"
        title={props.productName || props.productDetails.name || "Product Name"}
      >
        {props.productName || props.productDetails.name || "Product Name"}
      </h6>

      <div className="px-4 pb-2">
        <p className="text-gray-600 mb-2 text-left line-clamp-2">
          {props.productDescription || props.productDetails.description ||
            "Brief description of the product that might be a bit too long to display fully."}
        </p>

        <p className="text-blue-900 font-bold text-center text-lg">
          {props.productPrice || props.productDetails.resolvedPrice ||"Rs. 999.90"}
        </p>
      </div>

      <button
        onClick={() => navigate(`/product/${props.productDetails.id}`)}
        className="w-full bg-[#0F55A7]/80 text-white py-2 rounded-b-lg cursor-pointer hover:bg-[#0F55A7] transition-colors duration-300 mb-auto"
      >
        View
      </button>
    </div>
  );
}
