import React, { useState } from 'react';
import { Plus, Search, Calendar, Percent, Tag, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import Table from '../../components/seller/Table';
import Modal from '../../components/seller/Modal';
import { formatDate, formatPercentage, getStatusColor } from '../../utils/seller/formatters';
import toast from 'react-hot-toast';

const mockPromotions = [
  { id: '1', name: 'Summer Sale', type: 'percentage', value: 20, code: 'SUMMER20', startDate: '2024-06-01T00:00:00Z', endDate: '2024-08-31T23:59:59Z', usageLimit: 1000, usageCount: 245, status: 'active', minOrderValue: 50 },
  { id: '2', name: 'Free Shipping Weekend', type: 'free_shipping', value: 0, code: 'FREESHIP', startDate: '2024-01-15T00:00:00Z', endDate: '2024-01-17T23:59:59Z', usageCount: 156, status: 'expired' },
  { id: '3', name: 'New Customer Discount', type: 'fixed', value: 15, code: 'WELCOME15', startDate: '2024-01-01T00:00:00Z', endDate: '2024-12-31T23:59:59Z', usageLimit: 500, usageCount: 89, status: 'active', minOrderValue: 30 },
];

const Promotions = () => {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = ['All', 'active', 'inactive', 'expired'];

  const validationRules = {
    name: (value) => !value ? 'Promotion name is required' : null,
    code: (value) => !value ? 'Promotion code is required' : null,
    value: (value) => value < 0 ? 'Value cannot be negative' : null,
    startDate: (value) => !value ? 'Start date is required' : null,
    endDate: (value) => !value ? 'End date is required' : null,
  };

  const [form, setForm] = useState({ name: '', type: 'percentage', value: 0, code: '', startDate: '', endDate: '', usageLimit: 0, minOrderValue: 0 });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    const rule = validationRules[name];
    if (rule) {
      const err = rule(value);
      if (err) setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) || promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'All' || promotion.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPromotion = { id: Date.now().toString(), ...form, usageCount: 0, status: 'active' };
      setPromotions([...promotions, newPromotion]);
      toast.success('Promotion created successfully');
      setShowAddModal(false);
      setForm({ name: '', type: 'percentage', value: 0, code: '', startDate: '', endDate: '', usageLimit: 0, minOrderValue: 0 });
    } catch (error) {
      toast.error('Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPromotions(promotions.filter(p => p.id !== id));
      toast.success('Promotion deleted successfully');
      setShowDeleteModal(false);
      setPromotionToDelete(null);
    } catch (error) {
      toast.error('Failed to delete promotion');
    } finally {
      setLoading(false);
    }
  };

  const getPromotionValue = (promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% OFF`;
      case 'fixed':
        return `LKR${promotion.value} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return '-';
    }
  };

  const columns = [
    { key: 'name', label: 'Promotion', render: (value, row) => (<div><p className="font-medium text-gray-900">{value}</p><p className="text-sm text-gray-500">{row.code}</p></div>) },
    { key: 'type', label: 'Type', render: (value, row) => (<div className="flex items-center space-x-2">{value === 'percentage' && <Percent className="w-4 h-4 text-blue-500" />}{value === 'fixed' && <Tag className="w-4 h-4 text-green-500" />}{value === 'free_shipping' && <Tag className="w-4 h-4 text-purple-500" />}<span>{getPromotionValue(row)}</span></div>) },
    { key: 'startDate', label: 'Start Date', render: (value) => formatDate(value) },
    { key: 'endDate', label: 'End Date', render: (value) => formatDate(value) },
    { key: 'usageCount', label: 'Usage', render: (value, row) => (<div className="text-sm"><p>{value} used</p>{row.usageLimit && (<p className="text-gray-500">of {row.usageLimit} limit</p>)}</div>) },
    { key: 'status', label: 'Status', render: (value) => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>) },
    { key: 'actions', label: 'Actions', render: (value, row) => (
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
        <button onClick={() => { setPromotionToDelete(row.id); setShowDeleteModal(true); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    ) },
  ];

  const activePromotions = promotions.filter(p => p.status === 'active').length;
  const expiredPromotions = promotions.filter(p => p.status === 'expired').length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Promotions</h1>
          <p className="text-gray-600">Manage discounts and promotional codes</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4 mr-2" />Add Promotion</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><div className="flex items-center"><div className="p-3 bg-green-50 rounded-lg"><Tag className="w-6 h-6 text-green-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Active Promotions</p><p className="text-2xl font-semibold text-gray-900">{activePromotions}</p></div></div></Card>
        <Card><div className="flex items-center"><div className="p-3 bg-red-50 rounded-lg"><Calendar className="w-6 h-6 text-red-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Expired</p><p className="text-2xl font-semibold text-gray-900">{expiredPromotions}</p></div></div></Card>
        <Card><div className="flex items-center"><div className="p-3 bg-blue-50 rounded-lg"><Percent className="w-6 h-6 text-blue-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Usage</p><p className="text-2xl font-semibold text-gray-900">{totalUsage}</p></div></div></Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search promotions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {statusOptions.map((status) => (<option key={status} value={status === 'All' ? '' : status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>))}
          </select>
        </div>
      </Card>

      <Table data={filteredPromotions} columns={columns} emptyMessage="No promotions found" />

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Promotion" size="lg">
        <form onSubmit={handleAddPromotion} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter promotion name" />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Code *</label>
              <input type="text" name="code" value={form.code} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.code ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter promotion code" />
              {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount Discount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            {form.type !== 'free_shipping' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value {form.type === 'percentage' ? '(%)' : '($)'}</label>
                <input type="number" name="value" value={form.value} onChange={handleChange} min="0" step={form.type === 'percentage' ? '1' : '0.01'} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.value ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter discount value" />
                {errors.value && <p className="text-sm text-red-600 mt-1">{errors.value}</p>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-300' : 'border-gray-300'}`} />
              {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.endDate ? 'border-red-300' : 'border-gray-300'}`} />
              {errors.endDate && <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (0 = unlimited)</label>
              <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter usage limit" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (LKR)</label>
              <input type="number" name="minOrderValue" value={form.minOrderValue} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter minimum order value" />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" loading={loading}>Create Promotion</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Promotion">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this promotion? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" loading={loading} onClick={() => promotionToDelete && handleDeletePromotion(promotionToDelete)}>Delete Promotion</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Promotions;

