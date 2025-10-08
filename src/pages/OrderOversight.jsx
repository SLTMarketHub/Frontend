import Footer from "../includes/Footer.jsx";
import { useState } from "react";

const dummyOrders = [
  {
    id: 101,
    customer: "Michael Scott",
    seller: "John Doe",
    date: "2025-09-20",
    status: "Pending",
    amount: "$120.00",
  },
  {
    id: 102,
    customer: "Pam Beesly",
    seller: "Jane Smith",
    date: "2025-09-18",
    status: "Completed",
    amount: "$95.50",
  },
  {
    id: 103,
    customer: "Jim Halpert",
    seller: "Alice Johnson",
    date: "2025-09-19",
    status: "Disputed",
    amount: "$75.25",
  },
  {
    id: 104,
    customer: "Dwight Schrute",
    seller: "John Doe",
    date: "2025-09-21",
    status: "Refunded",
    amount: "$150.00",
  },
];

export default function OrderOversight() {
  const [orders, setOrders] = useState(dummyOrders);

  const handleResolve = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Completed" } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Order Oversight
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {order.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {order.date}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold ${
                      order.status === "Completed"
                        ? "text-green-600"
                        : order.status === "Disputed" ||
                          order.status === "Refunded"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {(order.status === "Pending" ||
                      order.status === "Disputed") && (
                      <button
                        onClick={() => handleResolve(order.id)}
                        className="px-3 py-1 rounded text-white bg-green-500 hover:bg-green-600"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
