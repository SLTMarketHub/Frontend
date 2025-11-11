import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Users,
  UserCheck,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Bell,
  AlertTriangle,
  Info,
  XCircle,
  Store,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card, { StatsCard } from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import {
  LoadingState,
  SkeletonCard,
} from "../../components/common/LoadingSpinner";
import {
  formatCurrency,
  formatNumber,
  getRelativeTime,
} from "../../utils/formatters";
import {
  getTotalRevenue,
  getTotalOrders,
  getTotalCustomers,
  getActiveSellers,
  getTotalProducts,
  getRecentOrders,
  getRecentActivity,
  getLowStockAlert,
  getRevenueByCategory,
  getRevenueTrend,
  getOrdersTrend,
  getTopSellingProducts,
  getSystemAlerts,
  getPlatformPerformance,
} from "../../services/admin/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revenue, orders, customers, sellers, products] = await Promise.all([
          getTotalRevenue(),
          getTotalOrders(),
          getTotalCustomers(),
          getActiveSellers(),
          getTotalProducts()
        ]);
        
        setRevenueData(revenue);
        setOrderData(orders);
        setCustomerData(customers);
        setSellerData(sellers);
        setProductData(products);
        
        // Fetch other data
        const [recentOrdersData, recentActivityData, lowStockData, categoryDataRes, revenueTrendData, ordersTrendData, topProductsData, systemAlertsData, platformPerformanceData] = await Promise.all([
          getRecentOrders(),
          getRecentActivity(),
          getLowStockAlert(),
          getRevenueByCategory(),
          getRevenueTrend(),
          getOrdersTrend(),
          getTopSellingProducts(),
          getSystemAlerts(),
          getPlatformPerformance()
        ]);
        
        setRecentOrders(recentOrdersData.length > 0 ? recentOrdersData : [
          {
            id: 'sample-order-1',
            externalId: 'ORDER-12345',
            state: 'acknowledged',
            orderDate: new Date().toISOString(),
            relatedParty: [{ role: 'customer', name: 'John Doe' }],
            orderItem: [
              { product: { name: 'Bluetooth Speaker' } },
              { product: { name: 'USB Cable' } }
            ],
            relatedPlace: [{ role: 'deliveryAddress', name: 'Sample Address, Colombo, Sri Lanka' }]
          },
          {
            id: 'sample-order-2',
            externalId: 'ORDER-12346',
            state: 'completed',
            orderDate: new Date(Date.now() - 3600000).toISOString(),
            relatedParty: [{ role: 'customer', name: 'Jane Smith' }],
            orderItem: [
              { product: { name: 'Smart Lock' } }
            ],
            relatedPlace: [{ role: 'deliveryAddress', name: 'Sample Address, Kandy, Sri Lanka' }]
          }
        ]);
        setRecentActivity(recentActivityData.length > 0 ? recentActivityData : [
          {
            message: 'New customer registration: John Doe',
            time: new Date().toISOString(),
            color: 'text-green-500',
            icon: '👤'
          },
          {
            message: 'Product "Bluetooth Speaker" updated by seller',
            time: new Date(Date.now() - 1800000).toISOString(),
            color: 'text-blue-500',
            icon: '📦'
          },
          {
            message: 'Payment processed for order #12345',
            time: new Date(Date.now() - 3600000).toISOString(),
            color: 'text-green-500',
            icon: '💳'
          }
        ]);
        setLowStockAlerts(lowStockData);
        setLowStockProducts(lowStockData); // Set low stock products for display
        setCategoryData(categoryDataRes);
        
        // Set revenue trend data for charts
        if (revenueTrendData.trendData && ordersTrendData.trendData) {
          // Combine revenue and orders data for charts
          const combinedData = revenueTrendData.trendData.map(revenueDay => {
            const orderDay = ordersTrendData.trendData.find(o => o.date === revenueDay.date);
            return {
              date: revenueDay.date,
              revenue: revenueDay.revenue,
              orders: orderDay ? orderDay.orders : 0,
              billCount: revenueDay.billCount,
              totalItems: orderDay ? orderDay.totalItems : 0
            };
          });
          setSalesData(combinedData);
        } else if (revenueTrendData.trendData) {
          setSalesData(revenueTrendData.trendData);
        }
        
        // Set top products data
        if (topProductsData.topProducts) {
          setTopProducts(topProductsData.topProducts);
        }
        
        // Set system alerts data
        setSystemAlerts(systemAlertsData.length > 0 ? systemAlertsData : [
          {
            id: 'alert-1',
            type: 'warning',
            title: 'High Server Load',
            message: 'Server CPU usage is above 80% for the past 15 minutes',
            time: new Date().toISOString(),
            action: true
          },
          {
            id: 'alert-2',
            type: 'info',
            title: 'Maintenance Scheduled',
            message: 'System maintenance scheduled for tonight at 2:00 AM',
            time: new Date(Date.now() - 3600000).toISOString(),
            action: false
          }
        ]);
        
        // Set pie chart data from category analysis
        if (categoryDataRes.categories) {
          const pieData = categoryDataRes.categories.map(cat => ({
            name: cat.name,
            value: parseFloat(cat.percentage),
            count: cat.productCount,
            activeCount: cat.activeProducts,
            fill: cat.fill
          }));
          setPieChartData(pieData);
        }
        
        // Set platform performance data
        setPerformanceData(platformPerformanceData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("Revenue")
                ? formatCurrency(entry.value)
                : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        skeleton={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(revenueData?.totalRevenue || 0)}
            icon={<DollarSign size={24} />}
            trend="up"
            trendValue={`${revenueData?.billCount || 0} bills`}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={formatNumber(orderData?.totalOrders || 0)}
            icon={<ShoppingCart size={24} />}
            trend="up"
            trendValue={`${orderData?.orderCount || 0} orders`}
            color="secondary"
          />
          <StatsCard
            title="Total Customers"
            value={formatNumber(customerData?.totalCustomers || 0)}
            icon={<Users size={24} />}
            trend="up"
            trendValue={`${customerData?.customerCount || 0} customers`}
            color="success"
          />
          <StatsCard
            title="Active Sellers"
            value={formatNumber(sellerData?.activeSellers || 0)}
            icon={<Store size={24} />}
            trend="up"
            trendValue={`${sellerData?.sellerCount || 0} total`}
            color="warning"
          />
          <StatsCard
            title="Total Products"
            value={formatNumber(productData?.totalProducts || 0)}
            icon={<Package size={24} />}
            trend="up"
            trendValue={`${productData?.activeProducts || 0} active`}
            color="info"
          />
        </div>
      </LoadingState>

      {/* Revenue and Orders Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Trend" subtitle="Daily revenue for the past week">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A651" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00A651"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Orders Trend" subtitle="Daily orders for the past week">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#0066CC"
                strokeWidth={2}
                dot={{ fill: "#0066CC" }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Performance and Top Products */}
      {/* COMMENTED OUT: These features require Product Catalog and Analytics APIs that are not currently available
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Revenue by Category"
          subtitle="Category-wise revenue distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} products, ${props.payload.activeCount} active)`,
                  'Distribution'
                ]} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Selling Products" subtitle="Best performing products">
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-slt-light hover:to-blue-50 transition-all cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slt-primary bg-slt-light px-2 py-1 rounded">
                      #{product.rank}
                    </span>
                    <p className="font-medium text-sm text-gray-900">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {product.totalQuantity} units sold
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      {product.orderCount} orders
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slt-primary">
                    Avg: {product.averageQuantityPerOrder}
                  </p>
                  <p className="text-xs text-gray-500">
                    per order
                  </p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No product sales data available</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Platform Performance" subtitle="Key performance metrics">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Fulfillment Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.fulfillmentRate}%
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.customerSatisfaction}/5
                </p>
              </div>
              <Activity className="text-blue-600" size={32} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.avgResponseTime}h
                </p>
              </div>
              <TrendingUp className="text-slt-teal" size={32} />
            </div>
          </div>
        </Card>
      </div>
      END COMMENTED SECTION */}

      {/* System Alerts & Notifications */}
      {/* COMMENTED OUT: System Alerts require notification/alert APIs that are not currently available
      <Card
        title="System Alerts"
        subtitle="Important notifications and warnings"
        headerAction={
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        }>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === "error"
                  ? "bg-red-50 border-error"
                  : alert.type === "warning"
                  ? "bg-orange-50 border-warning"
                  : alert.type === "success"
                  ? "bg-green-50 border-success"
                  : "bg-blue-50 border-info"
              }`}>
              <div className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 ${
                    alert.type === "error"
                      ? "text-error"
                      : alert.type === "warning"
                      ? "text-warning"
                      : alert.type === "success"
                      ? "text-success"
                      : "text-info"
                  }`}>
                  {alert.type === "error" ? (
                    <XCircle size={20} />
                  ) : alert.type === "warning" ? (
                    <AlertTriangle size={20} />
                  ) : alert.type === "success" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {alert.title}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {getRelativeTime(alert.time)}
                  </p>
                </div>
                {alert.action && (
                  <button className="px-3 py-1 text-xs font-medium text-slt-primary hover:bg-slt-light rounded-lg transition">
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      END COMMENTED SECTION */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card title="Recent Orders" subtitle="Latest platform orders">
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-all cursor-pointer border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          {order.externalId || order.id}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.state === 'acknowledged' 
                            ? 'bg-blue-100 text-blue-700'
                            : order.state === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.state === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {order.relatedParty?.find(p => p.role === 'customer')?.name || 'Unknown Customer'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package size={14} />
                          {order.orderItem?.length || 0} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity size={14} />
                          {getRelativeTime(order.orderDate)}
                        </span>
                      </div>
                      {order.orderItem && order.orderItem.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {order.orderItem.slice(0, 3).map((item, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-slt-light text-slt-secondary rounded">
                              {item.product?.name}
                            </span>
                          ))}
                          {order.orderItem.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                              +{order.orderItem.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="px-3 py-1 text-xs font-medium text-slt-primary hover:bg-slt-light rounded-lg transition">
                        View Details
                      </button>
                      {order.relatedPlace?.find(p => p.role === 'deliveryAddress') && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {order.relatedPlace.find(p => p.role === 'deliveryAddress').name.split(',')[1]?.trim() || 'Location'}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent orders available</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Platform activity feed">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`mt-0.5 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Low Stock and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card title="Low Stock Alert" subtitle="Products running low">
          <div className="space-y-3">
            {lowStockProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">
                    {product.stock}
                  </p>
                  <p className="text-xs text-gray-500">units left</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Common administrative tasks">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/sellers")}
              className="p-4 text-left bg-gradient-to-r from-slt-light to-blue-100 rounded-xl hover:from-blue-100 hover:to-cyan-50 transition-all group hover:scale-105">
              <UserCheck
                size={24}
                className="text-slt-secondary mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-sm font-medium text-gray-900">
                Approve Sellers
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {sellerData ? Math.max(0, (sellerData.sellerCount || 0) - (sellerData.activeSellers || 0)) : 0} pending
              </p>
            </button>
            <button
              onClick={() => navigate("/admin/products")}
              className="p-4 text-left bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-green-200 transition-all group hover:scale-105">
              <Package
                size={24}
                className="text-slt-green mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-sm font-medium text-gray-900">
                Moderate Products
              </p>
              <p className="text-xs text-gray-600 mt-1">8 flagged</p>
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className="p-4 text-left bg-gradient-to-r from-teal-50 to-cyan-100 rounded-xl hover:from-cyan-100 hover:to-teal-200 transition-all group hover:scale-105">
              <AlertCircle
                size={24}
                className="text-slt-teal mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-sm font-medium text-gray-900">
                Resolve Disputes
              </p>
              <p className="text-xs text-gray-600 mt-1">3 open</p>
            </button>
            <button
              onClick={() => navigate("/admin/support")}
              className="p-4 text-left bg-gradient-to-r from-orange-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-orange-200 transition-all group hover:scale-105">
              <Bell
                size={24}
                className="text-orange-600 mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-sm font-medium text-gray-900">
                Send Notifications
              </p>
              <p className="text-xs text-gray-600 mt-1">Campaign tools</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
