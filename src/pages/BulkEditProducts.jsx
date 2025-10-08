import Footer from "../includes/Footer.jsx";
import { useState } from "react";

const dummyProducts = [
  { id: 1, name: "Wireless Headphones", category: "Electronics" },
  { id: 2, name: "Smart Watch", category: "Electronics" },
  { id: 3, name: "Gaming Mouse", category: "Electronics" },
  { id: 4, name: "Bluetooth Speaker", category: "Audio" },
  { id: 5, name: "Laptop Stand", category: "Accessories" },
  { id: 6, name: "USB-C Hub", category: "Accessories" },
];

export default function BulkEditProducts() {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDeleteSelected = () => {
    alert(`Deleting products: ${selected.join(", ")}`);
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Bulk Edit / Delete Products
        </h2>

        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={handleDeleteSelected}
            disabled={selected.length === 0}
            className={`px-4 py-2 rounded font-semibold ${
              selected.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 transition"
            }`}
          >
            Delete Selected
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {dummyProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition ${
                selected.includes(product.id) ? "border-2 border-blue-600" : ""
              }`}
              onClick={() => toggleSelect(product.id)}
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-700">Category: {product.category}</p>
              <p className="text-gray-500 text-sm mt-2">
                {selected.includes(product.id) ? "Selected" : "Click to select"}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
