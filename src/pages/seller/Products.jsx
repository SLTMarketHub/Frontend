import React, { useEffect, useState } from 'react';
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
import { listProductOfferings, deleteProductOffering, getProductOfferingPrice, listCategories } from '../../services/seller/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [priceMap, setPriceMap] = useState({});

  const [categories, setCategories] = useState([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await listCategories({ limit: 200 });
        setCategories(res?.data || []);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const load = async () => {
      setInitialLoading(true);
      try {
        const params = { limit: 100 };
        if (selectedCategoryId) {
          params.categoryId = selectedCategoryId;
        }
        const res = await listProductOfferings(params);
        const offerings = (res?.data || []).map(off => {
          let categoryName = 'Uncategorized';
          let categoryId = '';
          if (Array.isArray(off.category) && off.category.length > 0) {
            const firstCategory = off.category[0];
            if (typeof firstCategory === 'string') {
              categoryName = firstCategory;
            } else {
              categoryName = firstCategory?.name || 'Uncategorized';
              categoryId = firstCategory?.id || '';
            }
          }

          let imageUrl = '';
          if (Array.isArray(off.attachment) && off.attachment.length > 0) {
            imageUrl = off.attachment[0].url || off.attachment[0].href || '';
          } else if (Array.isArray(off.images) && off.images.length > 0) {
            imageUrl = off.images[0];
          }
          
          return {
            id: off.id,
            name: off.name,
            category: categoryName,
            categoryId,
            images: imageUrl ? [imageUrl] : [],
            status: (off.lifecycleStatus || 'Active').toLowerCase(),
            createdAt: off.createdAt,
            priceRefs: off.productOfferingPrice || []
          };
        });
        setProducts(offerings);

        const uniquePriceIds = Array.from(new Set(offerings
          .map(o => (o.priceRefs?.[0]?.id))
          .filter(Boolean)));
        const prices = await Promise.all(uniquePriceIds.map(id => getProductOfferingPrice(id).catch(() => null)));
        const map = {};
        prices.forEach(p => {
          if (p && p.id) {
            const amt = p?.price?.taxIncludedAmount?.value ?? p?.price?.dutyFreeAmount?.value ?? 0;
            map[p.id] = amt;
          }
        });
        setPriceMap(map);
      } catch (e) {
        toast.error('Failed to load products');
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [selectedCategoryId]);

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      await deleteProductOffering(id);
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
    { key: 'price', label: 'Price', render: (value, row) => {
      const firstPriceId = row.priceRefs?.[0]?.id;
      const amount = firstPriceId ? priceMap[firstPriceId] ?? 0 : 0;
      return (<span className="font-medium">{formatCurrency(amount)}</span>);
    } },
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
          <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All categories</option>
            {(categories || []).map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
          </select>
        </div>
      </Card>

      <Table data={filteredProducts} columns={columns} emptyMessage={initialLoading ? 'Loading...' : 'No products found'} />

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
