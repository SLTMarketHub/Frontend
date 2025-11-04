import React from "react";

const AddressSelector = ({ address, setAddress }) => {
  const addresses = [
    { id: 1, text: "123 Main Street, Colombo" },
    { id: 2, text: "45 Kandy Road, Galle" },
  ];

  return (
    <div className="border rounded-lg p-4 mt-6 shadow-sm">
      <h3 className="font-semibold mb-2">Select Delivery Address</h3>
      <div className="space-y-2">
        {addresses.map((addr) => (
          <label
            key={addr.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="address"
              value={addr.id}
              checked={address === addr.id}
              onChange={() => setAddress(addr.id)}
            />
            {addr.text}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AddressSelector;
