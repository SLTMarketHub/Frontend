import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Package, Truck } from 'lucide-react';
import Card from '../../components/seller/Card';
import Table from '../../components/seller/Table';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatCurrency, formatDate, getStatusColor } from '../../utils/seller/formatters';

const mockOrders = [
  { id: 'ORD-001', customerName: 'A1', customerEmail: 'a1@gmail.com', total: 20299.00, status: 'pending', paymentStatus: 'paid', items: 3, createdAt: '2024-09-15T10:30:00Z' },
  { id: 'ORD-002', customerName: 'B1', customerEmail: 'b1@gmail.com', total: 10490.00, status: 'shipped', paymentStatus: 'paid', items: 1, createdAt: '2024-09-14T14:22:00Z' },
  { id: 'ORD-003', customerName: 'C1', customerEmail: 'c1@gamil.com', total: 5799.00, status: 'delivered', paymentStatus: 'paid', items: 2, createdAt: '2024-08-13T09:15:00Z' },
];

const Orders = () => {
  const [orders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const statuses = ['All', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'id', label: 'Order ID', render: (value) => (<Link to={`/orders/${value}`} className="font-medium text-blue-600 hover:text-blue-800">{value}</Link>) },
    { key: 'customerName', label: 'Customer', render: (value, row) => (<div><p className="font-medium text-gray-900">{value}</p><p className="text-sm text-gray-500">{row.customerEmail}</p></div>) },
    { key: 'items', label: 'Items', render: (value) => (<span>{value} item{value !== 1 ? 's' : ''}</span>) },
    { key: 'total', label: 'Total', render: (value) => (<span className="font-medium">{formatCurrency(value)}</span>) },
    { key: 'status', label: 'Status', render: (value) => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>) },
    { key: 'paymentStatus', label: 'Payment', render: (value) => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>) },
    { key: 'createdAt', label: 'Date', render: (value) => formatDate(value) },
    { key: 'actions', label: 'Actions', render: (value, row) => (
      <div className="flex items-center space-x-2">
        <Link to={`/orders/${row.id}`} className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></Link>
        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors"><Package className="w-4 h-4" /></button>
        <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors"><Truck className="w-4 h-4" /></button>
      </div>
    ) },
  ];

  return (
    <>
    <Header />
    <Layout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track your orders</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {statuses.map((status) => (<option key={status} value={status === 'All' ? '' : status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>))}
          </select>
        </div>
      </Card>

      <Table data={filteredOrders} columns={columns} emptyMessage="No orders found" />
    </div>
    </Layout>
    <Footer />
    </>
  );
};

export default Orders;

