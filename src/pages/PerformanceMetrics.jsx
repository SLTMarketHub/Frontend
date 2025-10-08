import Footer from "../includes/Footer.jsx";

const dummyMetrics = [
  { seller: "John Doe", sales: 120, rating: 4.5, orders: 35 },
  { seller: "Jane Smith", sales: 95, rating: 4.8, orders: 40 },
  { seller: "Alice Johnson", sales: 75, rating: 4.2, orders: 28 },
  { seller: "Bob Williams", sales: 150, rating: 4.9, orders: 50 },
  { seller: "Emma Brown", sales: 65, rating: 4.1, orders: 20 },
];

export default function PerformanceMetrics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Seller Performance Metrics
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {dummyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {metric.seller}
              </h3>
              <p className="text-gray-700 mb-1">
                Total Sales: <span className="font-bold">{metric.sales}</span>
              </p>
              <p className="text-gray-700 mb-1">
                Orders: <span className="font-bold">{metric.orders}</span>
              </p>
              <p className="text-gray-700">
                Rating:{" "}
                <span className="font-semibold text-yellow-500">
                  {metric.rating} ⭐
                </span>
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
