import ApexChart from "react-apexcharts";

function App() {
  // Example data (replace with API data later)
  const stats = {
    users: 1240,
    sellers: 87,
    orders: 542,
    revenue: 76450,
  };

  const revenueSeries = [
    { name: "Revenue", data: [12000, 15000, 18000, 14000, 20000, 22000] },
    { name: "Orders", data: [150, 200, 250, 180, 300, 350] },
  ];

  const revenueOptions = {
    chart: { id: "revenue-orders" },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    stroke: { curve: "smooth" },
    yaxis: [
      { title: { text: "Revenue ($)" } },
      { opposite: true, title: { text: "Orders" } },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => (typeof val === "number" ? val.toLocaleString() : val),
      },
    },
  };

  const recentActivity = [
    "User JohnDoe registered",
    "Order #1023 completed",
    "Seller Acme Corp added a new product",
    "System backup completed",
  ];

  const alerts = [
    "⚠️ Payment gateway response time is slow",
    "🔔 New seller requests approval",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard Overview</h1>

      {/* Stats */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr>
            <th className="p-4 bg-gray-50 border-b">Metric</th>
            <th className="p-4 bg-gray-50 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border-b">Total Users</td>
            <td className="p-4 border-b">{stats.users}</td>
          </tr>
          <tr>
            <td className="p-4 border-b">Total Sellers</td>
            <td className="p-4 border-b">{stats.sellers}</td>
          </tr>
          <tr>
            <td className="p-4 border-b">Total Orders</td>
            <td className="p-4 border-b">{stats.orders}</td>
          </tr>
          <tr>
            <td className="p-4 border-b">Revenue</td>
            <td className="p-4 border-b">${stats.revenue.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {/* Charts */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Revenue & Orders</h2>
        <ApexChart
          type="line"
          height={350}
          series={revenueSeries}
          options={revenueOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {recentActivity.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* System Alerts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
          <ul className="space-y-2">
            {alerts.map((alert, i) => (
              <li
                key={i}
                className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
              >
                {alert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;