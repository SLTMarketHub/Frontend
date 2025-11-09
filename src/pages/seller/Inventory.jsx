import React, { useState } from 'react';
import { Search, AlertTriangle, Package, TrendingDown, Plus } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import Table from '../../components/seller/Table';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatDate } from '../../utils/seller/formatters';

const mockInventory = [
  { id: '1', name: 'Wireless Bluetooth Headphones', sku: 'WBH-001', category: 'Electronics', currentStock: 5, minStock: 10, maxStock: 100, status: 'low_stock', lastRestocked: '2024-09-10T10:30:00Z' },
  { id: '2', name: 'Smart Fitness Watch', sku: 'SFW-002', category: 'Electronics', currentStock: 23, minStock: 15, maxStock: 50, status: 'in_stock', lastRestocked: '2024-09-12T14:22:00Z' },
  { id: '3', name: 'Portable Laptop Stand', sku: 'PLS-003', category: 'Accessories', currentStock: 0, minStock: 5, maxStock: 30, status: 'out_of_stock', lastRestocked: '2024-09-05T09:15:00Z' },
];

const Inventory = () => {
  const [inventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const statusOptions = ['All', 'in_stock', 'low_stock', 'out_of_stock'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (current, min, max) => {
    const percentage = (current / max) * 100;
    let color = 'bg-green-500';
    if (current <= min) color = 'bg-red-500';
    else if (current <= min * 1.5) color = 'bg-yellow-500';
    return { percentage, color };
  };

  const columns = [
    { key: 'name', label: 'Product', render: (value, row) => (<div><p className="font-medium text-gray-900">{value}</p><p className="text-sm text-gray-500">{row.sku}</p></div>) },
    { key: 'category', label: 'Category' },
    { key: 'currentStock', label: 'Current Stock', render: (value, row) => {
      const { percentage, color } = getStockLevel(value, row.minStock, row.maxStock);
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between"><span className="font-medium">{value}</span><span className="text-sm text-gray-500">/ {row.maxStock}</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(percentage, 100)}%` }} /></div>
        </div>
      );
    } },
    { key: 'minStock', label: 'Min Stock', render: (value) => (<span className="text-sm text-gray-600">{value}</span>) },
    { key: 'status', label: 'Status', render: (value) => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(value)}`}>{value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1)}</span>) },
    { key: 'lastRestocked', label: 'Last Restocked', render: (value) => formatDate(value) },
    { key: 'actions', label: 'Actions', render: () => (<Button size="sm" variant="outline">Restock</Button>) },
  ];

  const lowStockCount = inventory.filter(item => item.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(item => item.status === 'out_of_stock').length;
  const totalItems = inventory.length;
  const inStockCount = inventory.filter(item => item.status === 'in_stock').length;

  return (
    <>
    <Header />
    <Layout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage your product inventory</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Stock</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><div className="flex items-center"><div className="p-3 bg-green-50 rounded-lg"><Package className="w-6 h-6 text-green-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">In Stock</p><p className="text-2xl font-semibold text-gray-900">{inStockCount}</p></div></div></Card>
        <Card><div className="flex items-center"><div className="p-3 bg-yellow-50 rounded-lg"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Low Stock</p><p className="text-2xl font-semibold text-gray-900">{lowStockCount}</p></div></div></Card>
        <Card><div className="flex items-center"><div className="p-3 bg-red-50 rounded-lg"><TrendingDown className="w-6 h-6 text-red-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Out of Stock</p><p className="text-2xl font-semibold text-gray-900">{outOfStockCount}</p></div></div></Card>
        <Card><div className="flex items-center"><div className="p-3 bg-blue-50 rounded-lg"><Package className="w-6 h-6 text-blue-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Items</p><p className="text-2xl font-semibold text-gray-900">{totalItems}</p></div></div></Card>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <Card className="border-l-4 border-l-yellow-400 bg-yellow-50">
          <div className="flex items-center space-x-2"><AlertTriangle className="w-5 h-5 text-yellow-600" /><p className="text-yellow-800 font-medium">Inventory Alert: {lowStockCount} items low on stock, {outOfStockCount} items out of stock</p></div>
        </Card>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {statusOptions.map((status) => (<option key={status} value={status === 'All' ? '' : status}>{status === 'All' ? 'All Status' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}</option>))}
          </select>
        </div>
      </Card>

      <Table data={filteredInventory} columns={columns} emptyMessage="No inventory items found" />
    </div>
    </Layout>
    <Footer />
    </>
  );
};

export default Inventory;

