import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Filter, Search } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import Table from '../../components/seller/Table';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatCurrency, formatDate } from '../../utils/seller/formatters';

const mockPayouts = [
  { id: 'PO-001', amount: 2450.75, status: 'completed', method: 'Bank Transfer', account: '****1234', requestDate: '2025-09-10T10:30:00Z', completedDate: '2025-08-12T14:22:00Z', fees: 25.50, netAmount: 2425.25 },
  { id: 'PO-002', amount: 1875.00, status: 'pending', method: 'PayPal', account: 'user@gmail.com', requestDate: '2025-09-15T09:15:00Z', completedDate: null, fees: 18.75, netAmount: 1856.25 },
  { id: 'PO-003', amount: 3250.50, status: 'processing', method: 'Bank Transfer', account: '****5678', requestDate: '2025-07-14T16:45:00Z', completedDate: null, fees: 32.51, netAmount: 3217.99 },
];

const mockStats = { totalEarnings: 45678.90, availableBalance: 3425.75, pendingPayouts: 5125.25, thisMonthPayouts: 12450.50 };

const Payouts = () => {
  const [payouts] = useState(mockPayouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const statusOptions = ['All', 'pending', 'processing', 'completed', 'failed'];

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.account.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'All' || payout.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getPayoutStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'id', label: 'Payout ID', render: (value) => (<span className="font-medium text-blue-600">{value}</span>) },
    { key: 'amount', label: 'Amount', render: (value, row) => (<div><p className="font-medium">{formatCurrency(value)}</p><p className="text-sm text-gray-500">Net: {formatCurrency(row.netAmount)}</p></div>) },
    { key: 'method', label: 'Method', render: (value, row) => (<div><p className="font-medium">{value}</p><p className="text-sm text-gray-500">{row.account}</p></div>) },
    { key: 'status', label: 'Status', render: (value) => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${getPayoutStatusColor(value)}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>) },
    { key: 'requestDate', label: 'Requested', render: (value) => formatDate(value) },
    { key: 'completedDate', label: 'Completed', render: (value) => value ? formatDate(value) : '-' },
    { key: 'fees', label: 'Fees', render: (value) => (<span className="text-red-600">{formatCurrency(value)}</span>) },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
            </div>
          )}
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
          <h1 className="text-2xl font-semibold text-gray-900">Payouts</h1>
          <p className="text-gray-600">Manage your earnings and payout requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button>Request Payout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" value={formatCurrency(mockStats.totalEarnings)} change="+12.5%" icon={DollarSign} trend="up" />
        <StatCard title="Available Balance" value={formatCurrency(mockStats.availableBalance)} icon={DollarSign} />
        <StatCard title="Pending Payouts" value={formatCurrency(mockStats.pendingPayouts)} icon={Calendar} />
        <StatCard title="This Month" value={formatCurrency(mockStats.thisMonthPayouts)} change="+8.2%" icon={TrendingUp} trend="up" />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Available Balance</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(mockStats.availableBalance)}</p>
            <p className="text-sm text-gray-500 mt-1">Ready for payout • Minimum: LKR 500.00</p>
          </div>
          <Button size="lg">Request Payout</Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search payouts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {statusOptions.map((status) => (<option key={status} value={status === 'All' ? '' : status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>))}
          </select>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Payout History</h3>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
        </div>
        <Table data={filteredPayouts} columns={columns} emptyMessage="No payouts found" />
      </Card>

      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payout Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded"><DollarSign className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-gray-500">Account ending in ****1234</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Primary</span>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded"><DollarSign className="w-5 h-5 text-purple-600" /></div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-500">user@gmail.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full">Add New Method</Button>
      </Card>
    </div>
    </Layout>
    <Footer />
    </>
  );
};

export default Payouts;

