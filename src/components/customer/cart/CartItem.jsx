import React from "react";
import { motion } from "framer-motion";

const CartItem = ({ item, removeItem, updateQuantity }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Product Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-gray-500 mt-1">Rs.{item.price}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 border rounded-lg p-2 text-center"
        />
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
