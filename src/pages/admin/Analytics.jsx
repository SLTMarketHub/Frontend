import React, { useState, useEffect } from 'react';
import { Download, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import Card, { StatsCard } from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import { LoadingState } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { exportSalesReportPDF, exportToCSV, exportToPDF } from '../../utils/exportUtils';
import useToast from '../../hooks/useToast';
import adminDashboardService from '../../services/admin/adminDashboardService';
import {
  mockOverviewStats,
  mockTopProducts,
  mockTopCategories,
} from '../../utils/mockData';

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [overviewStats, setOverviewStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const { success, error } = useToast();

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [salesResp, productsResp, categoriesResp] = await Promise.all([
        adminDashboardService.getSalesReport(selectedPeriod),
        adminDashboardService.getTopProducts(10),
        adminDashboardService.getTopCategories(10),
      ]);

      const stats = {
        totalRevenue: salesResp?.totalRevenue ?? mockOverviewStats.totalRevenue,
        totalOrders: salesResp?.totalOrders ?? mockOverviewStats.totalOrders,
        averageOrderValue: salesResp?.averageOrderValue ?? mockOverviewStats.averageOrderValue,
        growthRate: salesResp?.revenueGrowth ?? mockOverviewStats.growthRate,
        totalCustomers: salesResp?.totalCustomers ?? mockOverviewStats.totalCustomers,
      };

      const products = (productsResp || mockTopProducts).map((p, i) => ({
        id: p.id ?? i + 1,
        name: p.name ?? p.productName ?? `Product ${i + 1}`,
        category: p.category ?? 'General',
        sales: p.sales ?? p.orderCount ?? 0,
        revenue: p.revenue ?? 0,
        stock: p.stock ?? 100,
        image: p.image ?? 'https://via.placeholder.com/50',
      }));

      const categories = (categoriesResp || mockTopCategories).map((c, i) => ({
        id: c.id ?? i + 1,
        name: c.name ?? c.categoryName ?? `Category ${i + 1}`,
        sales: c.sales ?? c.orderCount ?? 0,
        revenue: c.revenue ?? 0,
      }));

      setOverviewStats(stats);
      setTopProducts(products);
      setTopCategories(categories);
    } catch (e) {
      console.warn('[Analytics] fetch failed, using mock data', e);
      setOverviewStats(mockOverviewStats);
      setTopProducts(mockTopProducts);
      setTopCategories(mockTopCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSalesReport = () => {
    try {
      if (!overviewStats) {
        error('No data to export');
        return;
      }
      const reportData = {
        totalRevenue: overviewStats.totalRevenue,
        totalOrders: overviewStats.totalOrders,
        avgOrderValue: overviewStats.averageOrderValue,
        growthRate: overviewStats.growthRate,
        topProducts: topProducts.slice(0, 5).map((p) => ({
          name: p.name,
          category: p.category,
          sales: p.sales,
          revenue: p.revenue,
        })),
      };
      const ok = exportSalesReportPDF(reportData, selectedPeriod);
      if (!ok) throw new Error('PDF generation failed');
      success('Sales report exported');
    } catch (e) {
      console.error('Export sales report error:', e);
      error(`Failed to export: ${e.message}`);
    }
  };

  const handleExportProductsCSV = () => {
    try {
      const data = topProducts.map((p) => ({
        name: p.name,
        category: p.category,
        sales: p.sales,
        revenue: p.revenue,
        stock: p.stock,
      }));
      exportToCSV(data, 'top_products');
      success('Products CSV exported');
    } catch (e) {
      error('CSV export failed');
    }
  };

  const handleExportProductsPDF = () => {
    try {
      exportToPDF(topProducts, 'top_products', {
        title: 'Top Products',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'sales', label: 'Sales', format: 'number' },
          { key: 'revenue', label: 'Revenue', format: 'currency' },
          { key: 'stock', label: 'Stock', format: 'number' },
        ],
        orientation: 'landscape',
      });
      success('Products PDF exported');
    } catch {
      error('PDF export failed');
    }
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
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/50';
            }}
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'sales',
      label: 'Sales',
      render: (v) => <span className="font-semibold">{formatNumber(v)}</span>,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (v) => <span className="text-green-600 font-semibold">{formatCurrency(v)}</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            v < 50 ? 'bg-red-100 text-red-700' : v < 100 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {v}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Performance overview and reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="input">
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <Button variant="outline" icon={<Download size={18} />} onClick={handleExportSalesReport} disabled={loading}>
            Export Report
          </Button>
        </div>
      </div>

      <LoadingState loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(overviewStats?.totalRevenue)}
            icon={<DollarSign size={24} />}
            trend="up"
            trendValue={formatPercentage(overviewStats?.growthRate)}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={formatNumber(overviewStats?.totalOrders)}
            icon={<ShoppingCart size={24} />}
            trend="up"
            trendValue="+8%"
            color="secondary"
          />
          <StatsCard
            title="Avg Order Value"
            value={formatCurrency(overviewStats?.averageOrderValue)}
            icon={<TrendingUp size={24} />}
            trend="up"
            trendValue="+3%"
            color="success"
          />
          <StatsCard
            title="Total Customers"
            value={formatNumber(overviewStats?.totalCustomers)}
            icon={<Users size={24} />}
            trend="up"
            trendValue="+12%"
            color="info"
          />
        </div>
      </LoadingState>

      <Card
        title="Top Selling Products"
        subtitle="Best performers in selected period"
        headerAction={
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" icon={<Download size={16} />} onClick={handleExportProductsCSV}>
              CSV
            </Button>
            <Button variant="ghost" size="sm" icon={<Download size={16} />} onClick={handleExportProductsPDF}>
              PDF
            </Button>
          </div>
        }
      >
        <DataTable data={topProducts} columns={productColumns} pagination pageSize={10} searchable emptyMessage="No product data" />
      </Card>

      <Card title="Top Categories" subtitle="Category performance">
        <DataTable
          data={topCategories}
          columns={[
            { key: 'name', label: 'Category' },
            { key: 'sales', label: 'Sales', render: (v) => formatNumber(v) },
            { key: 'revenue', label: 'Revenue', render: (v) => formatCurrency(v) },
          ]}
          pagination
          pageSize={10}
          emptyMessage="No category data"
        />
      </Card>
    </div>
  );
};

export default Analytics;