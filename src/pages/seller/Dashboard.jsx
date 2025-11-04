import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import Card from '../../components/seller/Card';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/seller/formatters';

const mockStats = {
  totalRevenue: 125430,
  totalOrders: 1247,
  totalProducts: 89,
  totalCustomers: 3421,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  productGrowth: 15.2,
  customerGrowth: 23.1,
};

const mockSalesData = [
  { date: 'Jan', revenue: 45000, orders: 120 },
  { date: 'Feb', revenue: 52000, orders: 140 },
  { date: 'Mar', revenue: 48000, orders: 130 },
  { date: 'Apr', revenue: 61000, orders: 165 },
  { date: 'May', revenue: 55000, orders: 150 },
  { date: 'Jun', revenue: 67000, orders: 180 },
];

const mockTopProducts = [
  { id: '1', name: 'Wireless Headphones', sales: 134, revenue: 234000 },
  { id: '2', name: 'Smart Watch', sales: 129, revenue: 378000 },
  { id: '3', name: 'Laptop Stand', sales: 116, revenue: 78000 },
  { id: '4', name: 'Phone Case', sales: 103, revenue: 28600 },
  { id: '5', name: 'USB Cable', sales: 98, revenue: 12800 },
];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <div className="flex items-center mt-1">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(change)}
            </span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Seller's Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(mockStats.totalRevenue)}
          change={mockStats.revenueGrowth}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Orders"
          value={formatNumber(mockStats.totalOrders)}
          change={mockStats.orderGrowth}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Products"
          value={formatNumber(mockStats.totalProducts)}
          change={mockStats.productGrowth}
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Customers"
          value={formatNumber(mockStats.totalCustomers)}
          change={mockStats.customerGrowth}
          icon={Users}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Orders Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
        </div>
        <div className="space-y-4">
          {mockTopProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.sales} units sold</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

