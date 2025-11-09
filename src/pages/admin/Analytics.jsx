import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Download,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
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
} from "recharts";
import Card, { StatsCard } from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import {
  LoadingState,
  SkeletonCard,
} from "../../components/common/LoadingSpinner";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "../../utils/formatters";
import {
  exportToCSV,
  exportToPDF,
  exportSalesReportPDF,
} from "../../utils/exportUtils";
import { CHART_COLORS, TIME_PERIODS } from "../../utils/constants";
import { 
  getAnalyticsData,
  getAnalyticsOverview,
  getSalesTrend,
  getTopProducts,
  getTopCategories,
  getRevenueByCategory,
  getExportReport
} from "../../services/admin/annalytics";
import {
  getTotalRevenue,
  getTotalOrders,
  getTotalCustomers,
  getActiveSellers,
  getTotalProducts,
} from "../../services/admin/dashboard";
import {
  mockOverviewStats,
  mockSalesChartData,
  mockTopProducts,
  mockTopCategories,
  mockRevenueByCategory,
} from "../../utils/mockData";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [overviewStats, setOverviewStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Use the same endpoints as Dashboard for stats cards
      const [revenueData, ordersData, customersData, sellersData, productsData, analyticsData] = await Promise.all([
        getTotalRevenue(),
        getTotalOrders(),
        getTotalCustomers(),
        getActiveSellers(),
        getTotalProducts(),
        getAnalyticsData(selectedPeriod)
      ]);
      
      console.log('Dashboard endpoints data:');
      console.log('Revenue:', revenueData);
      console.log('Orders:', ordersData);
      console.log('Customers:', customersData);
      console.log('Sellers:', sellersData);
      console.log('Products:', productsData);
      
      // Create overview stats using dashboard endpoints (same as Dashboard.jsx)
      const dashboardOverviewStats = {
        totalRevenue: revenueData?.totalRevenue || 0,
        totalOrders: ordersData?.totalOrders || 0,
        totalCustomers: customersData?.totalCustomers || 0,
        activeSellers: sellersData?.activeSellers || 0,
        totalProducts: productsData?.totalProducts || 0,
        // Calculate average order value
        averageOrderValue: ordersData?.totalOrders > 0 ? (revenueData?.totalRevenue || 0) / ordersData.totalOrders : 0,
        // Mock growth rates for now (same as analytics service)
        growthRate: revenueData?.totalRevenue > 0 ? Math.random() * 20 + 5 : 0,
        ordersGrowthRate: ordersData?.totalOrders > 0 ? Math.random() * 15 + 8 : 0,
        avgOrderValueGrowthRate: ordersData?.totalOrders > 0 ? Math.random() * 10 + 3 : 0,
        customersGrowthRate: customersData?.totalCustomers > 0 ? Math.random() * 18 + 10 : 0,
      };
      
      console.log('Combined overview stats:', dashboardOverviewStats);
      
      setOverviewStats(dashboardOverviewStats);
      setSalesData(analyticsData.salesTrend.length > 0 ? analyticsData.salesTrend : mockSalesChartData);
      setTopProducts(analyticsData.topProducts.length > 0 ? analyticsData.topProducts : mockTopProducts);
      setTopCategories(analyticsData.topCategories.length > 0 ? analyticsData.topCategories : mockTopCategories);
      setRevenueByCategory(analyticsData.revenueByCategory.length > 0 ? analyticsData.revenueByCategory : mockRevenueByCategory);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data
      setOverviewStats(mockOverviewStats);
      setSalesData(mockSalesChartData);
      setTopProducts(mockTopProducts);
      setTopCategories(mockTopCategories);
      setRevenueByCategory(mockRevenueByCategory);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = topProducts.map(product => ({
      'Product Name': product.name,
      'Category': product.category,
      'Sales': product.sales,
      'Revenue': formatCurrency(product.revenue || 0),
      'Stock': product.stock,
    }));
    
    exportToCSV(exportData, 'top_products_report');
  };

  const handleExportPDF = () => {
    const columns = [
      { key: 'name', label: 'Product Name' },
      { key: 'category', label: 'Category' },
      { key: 'sales', label: 'Sales' },
      { key: 'revenue', label: 'Revenue', format: 'currency' },
      { key: 'stock', label: 'Stock' },
    ];

    exportToPDF(topProducts, 'top_products_report', {
      title: 'Top Selling Products Report',
      columns,
      orientation: 'landscape',
    });
  };

  const handleExportSalesReport = () => {
    const reportData = {
      totalRevenue: overviewStats?.totalRevenue,
      totalOrders: overviewStats?.totalOrders,
      avgOrderValue: overviewStats?.averageOrderValue,
      growthRate: overviewStats?.growthRate,
      topProducts: topProducts.slice(0, 5),
    };

    exportSalesReportPDF(reportData, selectedPeriod);
  };

  const productColumns = [
    {
      key: 'name',
      label: 'Product',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.image}
            alt={value}
            className="w-10 h-10 rounded object-cover"
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'sales',
      label: 'Sales',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value) => (
        <span className="text-success font-semibold">
          {formatCurrency(value || 0)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value < 50
              ? 'bg-red-100 text-red-800'
              : value < 100
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Track your platform performance and insights
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slt-primary">
            {TIME_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExportSalesReport}>
            Export Report
          </Button>
        </div>
      </div>

      <LoadingState
        loading={loading}
        skeleton={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(overviewStats?.totalRevenue || 0)}
            icon={<DollarSign size={24} />}
            trend="up"
            trendValue={`${overviewStats?.growthRate?.toFixed(1) || 0}% growth`}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={formatNumber(overviewStats?.totalOrders || 0)}
            icon={<ShoppingCart size={24} />}
            trend="up"
            trendValue={`${overviewStats?.ordersGrowthRate?.toFixed(1) || 0}% growth`}
            color="secondary"
          />
          <StatsCard
            title="Avg Order Value"
            value={formatCurrency(overviewStats?.averageOrderValue || 0)}
            icon={<TrendingUp size={24} />}
            trend="up"
            trendValue={`${overviewStats?.avgOrderValueGrowthRate?.toFixed(1) || 0}% growth`}
            color="success"
          />
          <StatsCard
            title="Total Customers"
            value={formatNumber(overviewStats?.totalCustomers || 0)}
            icon={<Users size={24} />}
            trend="up"
            trendValue={`${overviewStats?.customersGrowthRate?.toFixed(1) || 0}% growth`}
            color="warning"
          />
        </div>
      </LoadingState>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Sales Trend"
          subtitle="Revenue and orders over time"
          className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, r: 4 }}
                name="Revenue (LKR)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke={CHART_COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.secondary, r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue by Category" subtitle="Category distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {revenueByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={Object.values(CHART_COLORS)[index % 6]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card
        title="Top Selling Categories"
        subtitle="Best performing categories">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topCategories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="sales"
              fill={CHART_COLORS.primary}
              radius={[8, 8, 0, 0]}
              name="Sales"
            />
            <Bar
              dataKey="revenue"
              fill={CHART_COLORS.secondary}
              radius={[8, 8, 0, 0]}
              name="Revenue (LKR)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        title="Top Selling Products"
        subtitle="Best performing products in selected period"
        headerAction={
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={16} />}
              onClick={handleExportCSV}>
              CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={16} />}
              onClick={handleExportPDF}>
              PDF
            </Button>
          </div>
        }>
        <DataTable
          data={topProducts}
          columns={productColumns}
          pagination={true}
          pageSize={10}
          searchable={true}
        />
      </Card>
    </div>
  );
};

export default Analytics;
