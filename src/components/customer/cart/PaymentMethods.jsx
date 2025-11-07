import React from "react";

const PaymentMethods = ({ payment, setPayment }) => {
  const methods = [
   
    { id: "cod", label: "Cash on Delivery" },
  ];

  return (
    <div className="border rounded-lg p-4 mt-6 shadow-sm">
      <h3 className="font-semibold mb-2">Payment Method</h3>
      {methods.map((method) => (
        <label
          key={method.id}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={payment === method.id}
            onChange={() => setPayment(method.id)}
          />
          {method.label}
        </label>
      ))}
    </div>
  );
};

export default PaymentMethods;
