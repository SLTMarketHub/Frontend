import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import Card, { StatsCard } from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import { LoadingState, SkeletonCard } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatNumber, getRelativeTime, getStatusColor } from '../../utils/formatters';
import orderService from '../../services/tmf/orderService';
import customerService from '../../services/tmf/customerService';
import partnerService from '../../services/tmf/partnerService';
import productCatalogService from '../../services/tmf/productCatalogService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [salesData, setSalesData] = useState([
    { date: '2025-03-12', revenue: 450000, orders: 120 },
    { date: '2025-03-13', revenue: 520000, orders: 145 },
    { date: '2025-03-14', revenue: 580000, orders: 165 },
    { date: '2025-03-15', revenue: 610000, orders: 180 },
    { date: '2025-03-16', revenue: 690000, orders: 210 },
    { date: '2025-03-17', revenue: 750000, orders: 235 },
    { date: '2025-03-18', revenue: 820000, orders: 256 },
  ]);
  const [categoryData, setCategoryData] = useState([
    { name: 'Electronics', value: 35, sales: 234 },
    { name: 'Fashion', value: 28, sales: 189 },
    { name: 'Home & Living', value: 22, sales: 156 },
    { name: 'Beauty', value: 15, sales: 123 },
    { name: 'Sports', value: 12, sales: 98 },
    { name: 'Books', value: 8, sales: 67 },
  ]);
  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'Samsung Galaxy S24', stock: 45, category: 'Electronics', sales: 234, revenue: 95000 },
    { id: 2, name: 'Nike Air Max 2025', stock: 78, category: 'Sports', sales: 189, revenue: 45000 },
    { id: 3, name: 'Apple MacBook Pro', stock: 23, category: 'Electronics', sales: 156, revenue: 280000 },
    { id: 4, name: 'Adidas Running Shoes', stock: 56, category: 'Sports', sales: 123, revenue: 32000 },
    { id: 5, name: 'Sony WH-1000XM5', stock: 15, category: 'Electronics', sales: 98, revenue: 25000 },
  ]);
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all statistics in parallel
      const [orderData, customerData, sellerData, productData] = await Promise.all([
        orderService.getOrderStats({ period: 'month' }),
        customerService.getCustomerStats(),
        partnerService.getSellerStats(),
        productCatalogService.getProductStats()
      ]);

      setOrderStats(orderData);
      // Only update if we got real data from API
      if (orderData.ordersByDay && orderData.ordersByDay.length > 0) {
        setSalesData(orderData.ordersByDay);
      }
      if (orderData.revenueByCategory && orderData.revenueByCategory.length > 0) {
        setCategoryData(orderData.revenueByCategory);
      }
      
      setStats({
        totalRevenue: orderData.totalRevenue || 125678900,
        totalOrders: orderData.totalOrders || 3456,
        totalCustomers: customerData.totalCustomers || 1248,
        totalProducts: productData.totalProducts || 2456,
        totalSellers: sellerData.totalSellers || 324,
        activeSellers: sellerData.activeSellers || 298,
        conversionRate: 3.8,
        averageOrderValue: orderData.averageOrderValue || 36450,
        growth: {
          revenue: 12.5,
          orders: 8.2,
          customers: 15.3,
          products: 4.7
        }
      });

      setPerformanceData({
        fulfillmentRate: 97.8,
        customerSatisfaction: 4.7,
        avgResponseTime: 2.4,
        returnRate: 1.8
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentOrders = [
    { id: '#ORD-2025-0234', customer: 'Kamal Perera', amount: 125000, status: 'pending', date: new Date('2025-03-18T10:30:00Z') },
    { id: '#ORD-2025-0233', customer: 'Nimal Silva', amount: 87500, status: 'confirmed', date: new Date('2025-03-18T09:15:00Z') },
    { id: '#ORD-2025-0232', customer: 'Saman Fernando', amount: 234000, status: 'shipped', date: new Date('2025-03-17T16:45:00Z') },
    { id: '#ORD-2025-0231', customer: 'Kumari Jayasinghe', amount: 56200, status: 'delivered', date: new Date('2025-03-17T14:20:00Z') },
    { id: '#ORD-2025-0230', customer: 'Ravi Mendis', amount: 145800, status: 'cancelled', date: new Date('2025-03-17T11:00:00Z') },
  ];

  const recentActivity = [
    { type: 'order', message: 'New order received from Kamal Perera', time: new Date('2025-03-18T10:30:00Z'), icon: <ShoppingCart size={16} />, color: 'text-blue-600' },
    { type: 'product', message: 'Product "Samsung Galaxy S24" approved', time: new Date('2025-03-18T09:45:00Z'), icon: <CheckCircle size={16} />, color: 'text-green-600' },
    { type: 'seller', message: 'New seller registration: Tech Store LK', time: new Date('2025-03-18T08:20:00Z'), icon: <Users size={16} />, color: 'text-slt-primary' },
    { type: 'alert', message: 'Low stock alert: Apple iPhone 15 Pro', time: new Date('2025-03-17T18:15:00Z'), icon: <AlertCircle size={16} />, color: 'text-orange-600' },
    { type: 'order', message: 'Order #ORD-2025-0230 cancelled', time: new Date('2025-03-17T17:00:00Z'), icon: <TrendingDown size={16} />, color: 'text-red-600' },
  ];

  const lowStockProducts = [
    { name: 'Apple iPhone 15 Pro', stock: 12, category: 'Electronics' },
    { name: 'Dell XPS 15 Laptop', stock: 8, category: 'Computers' },
    { name: 'Sony WH-1000XM5', stock: 15, category: 'Electronics' },
  ];

  // Chart colors - SLT theme
  const COLORS = ['#003366', '#0066CC', '#00ACC1', '#008B8B', '#00A651', '#4CAF50'];
  
  // Format data for pie chart
  const pieChartData = categoryData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const systemAlerts = [
    { id: 1, type: 'warning', title: 'Pending Seller Approvals', message: '5 sellers waiting for approval', time: new Date('2025-03-18T09:30:00Z'), action: '/admin/sellers' },
    { id: 2, type: 'error', title: 'Payment Gateway Issue', message: 'Stripe connection failed - 3 pending payments', time: new Date('2025-03-18T08:15:00Z'), action: '/admin/settings' },
    { id: 3, type: 'info', title: 'System Maintenance', message: 'Scheduled maintenance on March 20, 2025 at 2:00 AM', time: new Date('2025-03-17T16:00:00Z'), action: null },
    { id: 4, type: 'success', title: 'Backup Completed', message: 'Daily database backup completed successfully', time: new Date('2025-03-18T02:00:00Z'), action: null },
  ];

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value) => <span className="font-mono text-sm font-semibold text-slt-primary">{value}</span>,
    },
    { key: 'customer', label: 'Customer' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => <span className="text-sm text-gray-600">{getRelativeTime(value)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform today.</p>
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
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue)}
            icon={<DollarSign size={24} />}
            trend="up"
            trendValue={`+${stats?.growth?.revenue || 12.5}%`}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={formatNumber(stats?.totalOrders)}
            icon={<ShoppingCart size={24} />}
            trend="up"
            trendValue={`+${stats?.growth?.orders || 8.2}%`}
            color="secondary"
          />
          <StatsCard
            title="Total Customers"
            value={formatNumber(stats?.totalCustomers)}
            icon={<Users size={24} />}
            trend="up"
            trendValue={`+${stats?.growth?.customers || 15.3}%`}
            color="success"
          />
          <StatsCard
            title="Active Sellers"
            value={formatNumber(stats?.activeSellers)}
            icon={<Store size={24} />}
            trend="up"
            trendValue={`${stats?.totalSellers} total`}
            color="warning"
          />
          <StatsCard
            title="Total Products"
            value={formatNumber(stats?.totalProducts)}
            icon={<Package size={24} />}
            trend="up"
            trendValue={`+${stats?.growth?.products || 4.7}%`}
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
                  <stop offset="5%" stopColor="#00A651" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00A651" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
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
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#0066CC"
                strokeWidth={2}
                dot={{ fill: '#0066CC' }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Performance and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue by Category" subtitle="Category-wise revenue distribution">
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
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Selling Products" subtitle="Best performing products">
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-slt-light hover:to-blue-50 transition-all cursor-pointer">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{product.sales} sold</span>
                    <span className="text-xs px-2 py-0.5 bg-slt-light text-slt-secondary rounded">{product.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slt-primary">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Platform Performance" subtitle="Key performance metrics">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Fulfillment Rate</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData?.fulfillmentRate}%</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData?.customerSatisfaction}/5</p>
              </div>
              <Activity className="text-blue-600" size={32} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData?.avgResponseTime}h</p>
              </div>
              <TrendingUp className="text-slt-teal" size={32} />
            </div>
          </div>
        </Card>
      </div>

      {/* System Alerts & Notifications */}
      <Card title="System Alerts" subtitle="Important notifications and warnings" 
        headerAction={
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        }
      >
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'error'
                  ? 'bg-red-50 border-error'
                  : alert.type === 'warning'
                  ? 'bg-orange-50 border-warning'
                  : alert.type === 'success'
                  ? 'bg-green-50 border-success'
                  : 'bg-blue-50 border-info'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 ${
                  alert.type === 'error'
                    ? 'text-error'
                    : alert.type === 'warning'
                    ? 'text-warning'
                    : alert.type === 'success'
                    ? 'text-success'
                    : 'text-info'
                }`}>
                  {alert.type === 'error' ? (
                    <XCircle size={20} />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle size={20} />
                  ) : alert.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{alert.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{getRelativeTime(alert.time)}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card title="Recent Orders" subtitle="Latest platform orders">
            <DataTable
              data={recentOrders}
              columns={orderColumns}
              pagination={false}
              searchable={false}
              sortable={false}
            />
          </Card>
        </div>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Platform activity feed">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`mt-0.5 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{getRelativeTime(activity.time)}</p>
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
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">{product.stock}</p>
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
              onClick={() => navigate('/admin/sellers')}
              className="p-4 text-left bg-gradient-to-r from-slt-light to-blue-100 rounded-xl hover:from-blue-100 hover:to-cyan-50 transition-all group hover:scale-105">
              <UserCheck size={24} className="text-slt-secondary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Approve Sellers</p>
              <p className="text-xs text-gray-600 mt-1">{stats?.totalSellers - stats?.activeSellers || 26} pending</p>
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-4 text-left bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-green-200 transition-all group hover:scale-105">
              <Package size={24} className="text-slt-green mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Moderate Products</p>
              <p className="text-xs text-gray-600 mt-1">8 flagged</p>
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="p-4 text-left bg-gradient-to-r from-teal-50 to-cyan-100 rounded-xl hover:from-cyan-100 hover:to-teal-200 transition-all group hover:scale-105">
              <AlertCircle size={24} className="text-slt-teal mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Resolve Disputes</p>
              <p className="text-xs text-gray-600 mt-1">3 open</p>
            </button>
            <button 
              onClick={() => navigate('/admin/support')}
              className="p-4 text-left bg-gradient-to-r from-orange-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-orange-200 transition-all group hover:scale-105">
              <Bell size={24} className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Send Notifications</p>
              <p className="text-xs text-gray-600 mt-1">Campaign tools</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
