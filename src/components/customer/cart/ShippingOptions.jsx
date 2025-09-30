import React from "react";

const ShippingOptions = ({ shipping, setShipping }) => {
  const options = [
    { id: "standard", label: "Standard (3-5 days)", cost: 300 },
    { id: "express", label: "Express (1-2 days)", cost: 600 },
  ];

  return (
    <div className="border rounded-lg p-4 mt-6 shadow-sm">
      <h3 className="font-semibold mb-2">Shipping Options</h3>
      {options.map((opt) => (
        <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="shipping"
            value={opt.id}
            checked={shipping === opt.id}
            onChange={() => setShipping(opt.id)}
          />
          {opt.label} - Rs.{opt.cost}
        </label>
      ))}
    </div>
  );
};

export default ShippingOptions;
