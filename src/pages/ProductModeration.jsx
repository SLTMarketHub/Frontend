import Footer from "../includes/Footer.jsx";
import { useState } from "react";

const dummyProducts = [
  { id: 1, name: "Wireless Headphones", seller: "John Doe", status: "Pending" },
  { id: 2, name: "Smart Watch", seller: "Jane Smith", status: "Approved" },
  { id: 3, name: "Gaming Mouse", seller: "Alice Johnson", status: "Rejected" },
  {
    id: 4,
    name: "Bluetooth Speaker",
    seller: "Bob Williams",
    status: "Pending",
  },
  { id: 5, name: "Laptop Stand", seller: "Mary Brown", status: "Pending" },
  { id: 6, name: "USB-C Hub", seller: "Tom Clark", status: "Approved" },
];

export default function ProductModeration() {
  const [products, setProducts] = useState(dummyProducts);

  const handleApprove = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, status: "Approved" } : product
      )
    );
  };

  const handleReject = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, status: "Rejected" } : product
      )
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Product Moderation
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Seller
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {product.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleApprove(product.id)}
                      disabled={product.status === "Approved"}
                      className={`px-4 py-1 rounded text-white font-semibold ${
                        product.status === "Approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 transition"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      disabled={product.status === "Rejected"}
                      className={`px-4 py-1 rounded text-white font-semibold ${
                        product.status === "Rejected"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 transition"
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
