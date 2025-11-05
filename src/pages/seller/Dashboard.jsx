import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import Card from '../../components/seller/Card';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/seller/formatters';
import { listProductOfferings, listProductOfferingPrices } from '../../services/seller/productService';
import { fetchOrders } from '../../services/seller/orderService';

// Initial placeholders; populated from backend on mount
const initialStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  revenueGrowth: 0,
  orderGrowth: 0,
  productGrowth: 0,
  customerGrowth: 0,
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [stats, setStats] = useState(initialStats);
  const [orders, setOrders] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [ordersRes, offeringsRes, promosRes] = await Promise.all([
          fetchOrders({ limit: 100, signal: controller.signal }),
          listProductOfferings({ limit: 50 }),
          listProductOfferingPrices({ limit: 100, priceType: 'discount' })
        ]);

        const ordersList = Array.isArray(ordersRes?.productOrder) ? ordersRes.productOrder : [];
        const offeringsList = offeringsRes?.data || [];
        const promosList = promosRes?.data || [];

        setOrders(ordersList);
        setOfferings(offeringsList);
        setPromotions(promosList);

        setStats((prev) => ({
          ...prev,
          totalOrders: ordersList.length,
          totalProducts: offeringsList.length,
          // Promotions count surfaced via top products card subtitle later
          // totalRevenue remains 0 unless pricing is computed elsewhere
        }));
      } catch (e) {
        if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
          // Fail silently in UI but keep console for dev
          console.error('Failed to load dashboard data', e);
        }
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const salesData = useMemo(() => {
    // Build a simple orders count by month chart from orders.orderDate/createdAt
    const map = new Map();
    orders.forEach((o) => {
      const dateStr = o.orderDate || o.createdAt || new Date().toISOString();
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    const entries = Array.from(map.entries()).sort((a, b) => (a[0] > b[0] ? 1 : -1));
    return entries.map(([key, count]) => ({ date: key, orders: count, revenue: 0 }));
  }, [orders]);

  const topProducts = useMemo(() => {
    // Without sales per product, show top N offerings alphabetically
    const sorted = [...offerings].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return sorted.slice(0, 5).map((o, idx) => ({
      id: o.id || String(idx),
      name: o.name || 'Product',
      sales: 0,
      revenue: 0
    }));
  }, [offerings]);

  const promotionBreakdown = useMemo(() => {
    let freeShipping = 0;
    let fixedAmount = 0;
    let percentage = 0;

    (promotions || []).forEach((p) => {
      const name = (p?.name || '').toLowerCase();
      const desc = (p?.description || '').toLowerCase();
      const isFreeShip = name.includes('free') && name.includes('ship') || desc.includes('free shipping');
      if (isFreeShip) {
        freeShipping += 1;
        return;
      }
      // Heuristic: contains '%' => percentage; contains currency or negative value => fixed amount
      if (desc.includes('%')) {
        percentage += 1;
        return;
      }
      fixedAmount += 1;
    });

    const data = [
      { name: 'Free Shipping', value: freeShipping },
      { name: 'Fixed Amount Discount', value: fixedAmount },
      { name: 'Percentage Discount', value: percentage }
    ];
    const total = data.reduce((s, d) => s + d.value, 0);
    return { data, total };
  }, [promotions]);

    const PROMO_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const renderPromoLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.9;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const pct = `${Math.round(percent * 100)}%`;
    return (
      <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
        {name} ({pct})
      </text>
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, trend, accent = 'blue' }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          <div className="mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-50 border border-gray-200">
            {trend === 'up' ? (
              <TrendingUp className={`w-4 h-4 mr-1 ${accent === 'green' ? 'text-green-600' : 'text-emerald-600'}`} />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-emerald-700' : 'text-red-600'}>{formatPercentage(change)}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl shadow-inner bg-gradient-to-br ${
          accent === 'blue' ? 'from-blue-50 to-indigo-50' : ''
        } ${accent === 'green' ? 'from-emerald-50 to-green-50' : ''} ${accent === 'amber' ? 'from-amber-50 to-yellow-50' : ''} ${accent === 'purple' ? 'from-purple-50 to-fuchsia-50' : ''}`}>
          <Icon className={`w-6 h-6 ${
            accent === 'blue' ? 'text-blue-600' : accent === 'green' ? 'text-emerald-600' : accent === 'amber' ? 'text-amber-600' : 'text-purple-600'
          }`} />
        </div>
      </div>
    </Card>
  );

  return (
    <>
    <Header />
    <Layout>
    <div className="space-y-6">
      <Card>
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 opacity-95"></div>
          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl font-semibold">Seller's Dashboard</h1>
              <p className="mt-1 text-white/90">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 text-white border-white/30 rounded-lg px-3 py-2 backdrop-blur focus:ring-2 focus:ring-white/60 focus:border-white/60"
              >
                <option className="text-gray-900" value="7d">Last 7 days</option>
                <option className="text-gray-900" value="30d">Last 30 days</option>
                <option className="text-gray-900" value="90d">Last 90 days</option>
                <option className="text-gray-900" value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="transition-shadow hover:shadow-md">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={stats.revenueGrowth}
            icon={DollarSign}
            trend="up"
            accent="blue"
          />
        </div>
        <div className="transition-shadow hover:shadow-md">
          <StatCard
            title="Orders"
            value={formatNumber(stats.totalOrders)}
            change={stats.orderGrowth}
            icon={ShoppingCart}
            trend="up"
            accent="green"
          />
        </div>
        <div className="transition-shadow hover:shadow-md">
          <StatCard
            title="Products"
            value={formatNumber(stats.totalProducts)}
            change={stats.productGrowth}
            icon={Package}
            trend="up"
            accent="amber"
          />
        </div>
        <div className="transition-shadow hover:shadow-md">
          <StatCard
            title="Customers"
            value={formatNumber(stats.totalCustomers)}
            change={stats.customerGrowth}
            icon={Users}
            trend="up"
            accent="purple"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
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
          <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
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

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Promotions</h3>
        </div>
        {promotionBreakdown.total === 0 ? (
          <div className="p-4 text-sm text-gray-600">No promotions available.</div>
        ) : (
          <div className="relative w-full flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-semibold text-gray-900">{promotionBreakdown.total}</div>
                <div className="text-xs text-gray-500">Active Promotions</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  <linearGradient id="promoGrad0" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="promoGrad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="promoGrad2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <Pie
                  data={promotionBreakdown.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  label={renderPromoLabel}
                  labelLine
                >
                  {promotionBreakdown.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#promoGrad${index})`} />
                  ))}
                </Pie>
                 <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
    </Layout>
    <Footer />
    </>
  );
};

export default Dashboard;

