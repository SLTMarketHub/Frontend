import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white w-[250px] rounded-lg shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
      id={props.id}
    >
      <img
        src="/assets/images/placeholderImg.jpg"
        alt={props.productName || "Product"}
        className="w-full h-36 object-cover mb-4 rounded-t-lg"
      />

      <h6
        className="text-lg font-semibold mb-1 text-center px-2 truncate"
        title={props.productName || "Product Name"}
      >
        {props.productName || "Product Name"}
      </h6>

      <div className="px-4 pb-2">
        <p className="text-gray-600 mb-2 text-justify line-clamp-2">
          {props.productDescription ||
            "Brief description of the product that might be a bit too long to display fully."}
        </p>

        <p className="text-blue-900 font-bold text-center text-lg">
          {`Rs. ${props.productPrice || "999.90"}`}
        </p>
      </div>

      <button
        onClick={() => navigate(`/product/${props.id}`)}
        className="w-full bg-[#0F55A7]/80 text-white py-2 rounded-b-lg cursor-pointer hover:bg-[#0F55A7] transition-colors duration-300"
      >
        View
      </button>
    </div>
  );
}
