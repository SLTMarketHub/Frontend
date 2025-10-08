import Footer from "../includes/Footer.jsx";

const dummyCommissions = [
  { seller: "John Doe", commission: "10%", fee: "$50" },
  { seller: "Jane Smith", commission: "12%", fee: "$70" },
  { seller: "Alice Johnson", commission: "8%", fee: "$30" },
  { seller: "Bob Williams", commission: "11%", fee: "$60" },
  { seller: "Mary Brown", commission: "15%", fee: "$80" },
  { seller: "Tom Clark", commission: "9%", fee: "$40" },
];

export default function Commissions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Seller Commissions / Fees
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyCommissions.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {item.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                    {item.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {item.fee}
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
