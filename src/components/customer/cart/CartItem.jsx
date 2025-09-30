import React from "react";

const CartItem = ({ item, removeItem, updateQuantity }) => {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-500">${item.price}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 border rounded p-1 text-center"
        />
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
