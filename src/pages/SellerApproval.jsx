import Footer from "../includes/Footer.jsx";
import { useState } from "react";

const dummySellers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Pending" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Approved" },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "Rejected",
  },
  { id: 4, name: "Bob Williams", email: "bob@example.com", status: "Pending" },
  { id: 5, name: "Emma Brown", email: "emma@example.com", status: "Pending" },
  { id: 6, name: "Liam Davis", email: "liam@example.com", status: "Approved" },
  {
    id: 7,
    name: "Olivia Wilson",
    email: "olivia@example.com",
    status: "Rejected",
  },
];

export default function SellerApproval() {
  const [sellers, setSellers] = useState(dummySellers);

  const handleApprove = (id) => {
    setSellers(
      sellers.map((seller) =>
        seller.id === id ? { ...seller, status: "Approved" } : seller
      )
    );
  };

  const handleReject = (id) => {
    setSellers(
      sellers.map((seller) =>
        seller.id === id ? { ...seller, status: "Rejected" } : seller
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Seller Approval & Management
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-black">
                    {seller.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {seller.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                        seller.status
                      )}`}
                    >
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      disabled={seller.status === "Approved"}
                      className={`px-3 py-1 rounded text-white ${
                        seller.status === "Approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(seller.id)}
                      disabled={seller.status === "Rejected"}
                      className={`px-3 py-1 rounded text-white ${
                        seller.status === "Rejected"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Reject
                    </button>
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
