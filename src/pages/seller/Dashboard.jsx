import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import Card from '../../components/seller/Card';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/seller/formatters';

// Data placeholders; integrate with backend analytics when available
const stats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  revenueGrowth: 0,
  orderGrowth: 0,
  productGrowth: 0,
  customerGrowth: 0,
};

const salesData = [];

const topProducts = [];

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
    <>
    <Header />
    <Layout>
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
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueGrowth}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Orders"
          value={formatNumber(stats.totalOrders)}
          change={stats.orderGrowth}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Products"
          value={formatNumber(stats.totalProducts)}
          change={stats.productGrowth}
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Customers"
          value={formatNumber(stats.totalCustomers)}
          change={stats.customerGrowth}
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
            <LineChart data={salesData}>
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
            <BarChart data={salesData}>
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
          {topProducts.length === 0 && (
            <div className="p-4 text-sm text-gray-600">No data available yet.</div>
          )}
          {topProducts.map((product) => (
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
    </Layout>
    <Footer />
    </>
  );
};

export default Dashboard;

