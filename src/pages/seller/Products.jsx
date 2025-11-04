import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import Table from '../../components/seller/Table';
import Modal from '../../components/seller/Modal';
import Layout from '../../components/seller/Layout';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/seller/formatters';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import toast from 'react-hot-toast';

const mockProducts = [
  { id: '1', name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 5099.99, stock: 45, status: 'active', createdAt: '2024-01-15T10:30:00Z', images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'] },
  { id: '2', name: 'Smart Fitness Watch', category: 'Electronics', price: 10599.99, stock: 23, status: 'active', createdAt: '2024-01-14T09:15:00Z', images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'] },
  { id: '3', name: 'Portable Laptop Stand', category: 'Accessories', price: 3449.99, stock: 0, status: 'inactive', createdAt: '2024-01-13T14:22:00Z', images: ['https://images.pexels.com/photos/4482896/pexels-photo-4482896.jpeg'] },
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Electronics', 'Accessories', 'Clothing', 'Home & Garden'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Product', render: (value, row) => (
      <div className="flex items-center space-x-3">
        <img src={row.images[0]} alt={value} className="w-12 h-12 object-cover rounded-lg" />
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.category}</p>
        </div>
      </div>
    ) },
    { key: 'price', label: 'Price', render: (value) => (<span className="font-medium">{formatCurrency(value)}</span>) },
    { key: 'stock', label: 'Stock', render: (value) => (<span className={`font-medium ${value === 0 ? 'text-red-600' : value < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{value}</span>) },
    { key: 'status', label: 'Status', render: (value) => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>) },
    { key: 'createdAt', label: 'Created', render: (value) => formatDate(value) },
    { key: 'actions', label: 'Actions', render: (value, row) => (
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
        <Link to={`/products/edit/${row.id}`} className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></Link>
        <button onClick={() => { setProductToDelete(row.id); setShowDeleteModal(true); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link to="/products/add">
          <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {categories.map((category) => (<option key={category} value={category === 'All' ? '' : category}>{category}</option>))}
          </select>
        </div>
      </Card>

      <Table data={filteredProducts} columns={columns} emptyMessage="No products found" />

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Product">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" loading={loading} onClick={() => productToDelete && handleDeleteProduct(productToDelete)}>Delete Product</Button>
          </div>
        </div>
      </Modal>
    </div>
    </Layout>
    <Footer />
    </>
  );
};

export default Products;

