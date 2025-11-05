import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Tag, 
  Trash2, 
  Flag, 
  Filter,
  Search,
  Download,
  AlertTriangle,
  ShieldCheck,
  Store,
  Star,
  RefreshCcw,
  MessageSquare,
} from 'lucide-react';
import Card, { StatsCard } from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal, { ConfirmModal } from '../components/common/Modal';
import { LoadingState } from '../components/common/LoadingSpinner';
import { formatDate, getStatusColor, formatCurrency, getRelativeTime } from '../utils/formatters';
import useToast from '../hooks/useToast';
import { tmf620AdminService, tmf681AdminService } from '../services/admin';
import { exportToCSV } from '../utils/exportUtils';

const dummyProducts = [
  { id: 1, name: "Wireless Headphones", seller: "John Doe", status: "pending", category: "Electronics", price: 15000, submittedAt: "2025-03-16", image: "https://via.placeholder.com/50", flagged: false, reports: 0 },
  { id: 2, name: "Smart Watch", seller: "Jane Smith", status: "approved", category: "Electronics", price: 45000, submittedAt: "2025-03-10", image: "https://via.placeholder.com/50", flagged: false, reports: 0 },
  { id: 3, name: "Gaming Mouse", seller: "Alice Johnson", status: "rejected", category: "Gaming", price: 8500, submittedAt: "2025-03-14", image: "https://via.placeholder.com/50", flagged: true, reports: 3 },
  { id: 4, name: "Bluetooth Speaker", seller: "Bob Williams", status: "pending", category: "Electronics", price: 12000, submittedAt: "2025-03-17", image: "https://via.placeholder.com/50", flagged: true, reports: 2 },
  { id: 5, name: "Laptop Stand", seller: "Mary Brown", status: "pending", category: "Accessories", price: 3500, submittedAt: "2025-03-18", image: "https://via.placeholder.com/50", flagged: false, reports: 0 },
  { id: 6, name: "USB-C Hub", seller: "Tom Clark", status: "approved", category: "Electronics", price: 7500, submittedAt: "2025-03-08", image: "https://via.placeholder.com/50", flagged: false, reports: 0 },
  { id: 7, name: "Counterfeit Phone Case", seller: "Bad Seller", status: "pending", category: "Accessories", price: 2500, submittedAt: "2025-03-18", image: "https://via.placeholder.com/50", flagged: true, reports: 5 },
];

export default function ProductModeration() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [flagFilter, setFlagFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const { success, error } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [statusFilter, flagFilter, categoryFilter, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        limit: 100,
        offset: 0,
        ...(activeTab === 'flagged' && { lifecycleStatus: 'flagged' }),
        ...(statusFilter !== 'all' && activeTab !== 'flagged' && { lifecycleStatus: statusFilter }),
        ...(categoryFilter !== 'all' && { 'category.name': categoryFilter }),
        ...(searchTerm && { name: searchTerm })
      };

      const [productsResponse, statsData] = await Promise.all([
        tmf620AdminService.listProductOfferings(params),
        tmf620AdminService.getProductStats()
      ]);

      // Format products for display
      const formattedProducts = (Array.isArray(productsResponse) ? productsResponse : productsResponse.items || []).map(p => ({
        id: p.id,
        name: p.name || 'Unknown Product',
        seller: p.relatedParty?.find(rp => rp.role === 'seller')?.name || 'Unknown Seller',
        sellerId: p.relatedParty?.find(rp => rp.role === 'seller')?.id,
        status: p.lifecycleStatus || 'pending',
        category: p.category?.[0]?.name || 'Uncategorized',
        price: p.productOfferingPrice?.[0]?.price?.value || 0,
        submittedAt: p.validFor?.startDateTime || p.createdDate || new Date().toISOString(),
        image: p.attachment?.[0]?.href || 'https://via.placeholder.com/50',
        flagged: p.lifecycleStatus === 'flagged' || p.characteristic?.find(c => c.name === 'flagged')?.value || false,
        reports: p.characteristic?.find(c => c.name === 'reportCount')?.value || 0,
        description: p.description,
        specifications: p.productSpecification,
        stock: p.characteristic?.find(c => c.name === 'stock')?.value || 0
      }));

      // Filter flagged products if needed
      let finalProducts = formattedProducts;
      if (flagFilter === 'flagged') {
        finalProducts = formattedProducts.filter(p => p.flagged);
      } else if (flagFilter === 'not_flagged') {
        finalProducts = formattedProducts.filter(p => !p.flagged);
      }

      setProducts(finalProducts);
      setStats(statsData || {
        totalProducts: finalProducts.length,
        pendingApproval: finalProducts.filter(p => p.status === 'pending').length,
        flaggedProducts: finalProducts.filter(p => p.flagged).length,
        activeProducts: finalProducts.filter(p => p.status === 'active' || p.status === 'approved').length,
        rejectedProducts: finalProducts.filter(p => p.status === 'rejected').length
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      // Use mock data as fallback
      setProducts(dummyProducts);
      setStats({
        totalProducts: dummyProducts.length,
        pendingApproval: dummyProducts.filter(p => p.status === 'pending').length,
        flaggedProducts: dummyProducts.filter(p => p.flagged).length,
        activeProducts: dummyProducts.filter(p => p.status === 'approved').length,
        rejectedProducts: dummyProducts.filter(p => p.status === 'rejected').length
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await tmf620AdminService.listCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.items || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Use default categories as fallback
      setCategories([
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Fashion' },
        { id: '3', name: 'Home & Garden' },
        { id: '4', name: 'Sports & Outdoors' },
        { id: '5', name: 'Books & Media' }
      ]);
    }
  };

  const handleApprove = async (id) => {
    try {
      await tmf620AdminService.updateProductOffering(id, {
        lifecycleStatus: 'active',
        note: [{
          text: 'Product approved by admin',
          date: new Date().toISOString(),
          author: 'Admin'
        }]
      });
      
      const product = products.find(p => p.id === id);
      if (product && product.sellerId) {
        await tmf681AdminService.createMessage({
          sender: {
            id: 'admin',
            name: 'Platform Admin',
            '@type': 'Organization'
          },
          receiver: [{
            id: product.sellerId,
            name: product.seller,
            '@type': 'Organization'
          }],
          communicationType: 'product_approval',
          subject: 'Product Approved',
          content: `Your product "${product.name}" has been approved and is now live on the marketplace.`,
          channel: ['email'],
          priority: 'normal',
          status: 'pending'
        });
      }

      success('Product approved successfully');
      fetchProducts();
    } catch (err) {
      console.error('Error approving product:', err);
      error('Failed to approve product');
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;
    
    try {
      await tmf620AdminService.updateProductOffering(selectedProduct.id, {
        lifecycleStatus: 'rejected',
        note: [{
          text: `Product rejected: ${rejectionReason}`,
          date: new Date().toISOString(),
          author: 'Admin'
        }]
      });
      
      if (selectedProduct.sellerId) {
        await tmf681AdminService.createMessage({
          sender: {
            id: 'admin',
            name: 'Platform Admin',
            '@type': 'Organization'
          },
          receiver: [{
            id: selectedProduct.sellerId,
            name: selectedProduct.seller,
            '@type': 'Organization'
          }],
          communicationType: 'product_rejection',
          subject: 'Product Review Update',
          content: `Your product "${selectedProduct.name}" has been reviewed. ${rejectionReason}`,
          channel: ['email'],
          priority: 'normal',
          status: 'pending'
        });
      }

      success('Product rejected');
      setShowRejectModal(false);
      setShowDetailsModal(false);
      setRejectionReason('');
      fetchProducts();
    } catch (err) {
      error('Failed to reject product');
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleBulkAction = (action) => {
    setBulkAction(action);
    setShowBulkConfirm(true);
  };

  const confirmBulkAction = async () => {
    try {
      if (bulkAction === 'approve') {
        await tmf620AdminService.bulkUpdateProducts(selectedProducts, {
          lifecycleStatus: 'active'
        });
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'active' } : p
        ));
        success(`${selectedProducts.length} products approved successfully!`);
      } else if (bulkAction === 'reject') {
        await tmf620AdminService.bulkUpdateProducts(selectedProducts, {
          lifecycleStatus: 'rejected'
        });
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'rejected' } : p
        ));
        success(`${selectedProducts.length} products rejected successfully!`);
      } else if (bulkAction === 'delete') {
        // Delete products one by one
        await Promise.all(
          selectedProducts.map(id => tmf620AdminService.deleteProductOffering(id))
        );
        setProducts(products.filter(p => !selectedProducts.includes(p.id)));
        success(`${selectedProducts.length} products deleted successfully!`);
      }
    } catch (err) {
      console.error('Error performing bulk action:', err);
      error('Failed to perform bulk action');
    }
    setSelectedProducts([]);
    setShowBulkConfirm(false);
  };

  const filteredProducts = products.filter(p => {
    const statusMatch = statusFilter === 'all' || p.status === statusFilter;
    const flagMatch = flagFilter === 'all' || 
      (flagFilter === 'flagged' && p.flagged) || 
      (flagFilter === 'not_flagged' && !p.flagged);
    return statusMatch && flagMatch;
  });

  const handleExport = () => {
    const exportData = filteredProducts.map(p => ({
      'Product Name': p.name,
      'Category': p.category,
      'Seller': p.seller,
      'Price': p.price,
      'Status': p.status,
      'Stock': p.stock || 0,
      'Rating': p.rating || 0,
      'Created Date': formatDate(p.createdAt || p.submittedAt),
      'Flagged': p.flagged ? 'Yes' : 'No',
      'Reports': p.reports || p.reportCount || 0
    }));

    exportToCSV(exportData, 'products_moderation');
    success('Products exported successfully');
  };

  const displayStats = {
    pending: stats?.pendingApproval || products.filter(p => p.status === 'pending').length,
    approved: stats?.activeProducts || products.filter(p => p.status === 'approved' || p.status === 'active').length,
    rejected: stats?.rejectedProducts || products.filter(p => p.status === 'rejected').length,
    flagged: stats?.flaggedProducts || products.filter(p => p.flagged || p.status === 'flagged').length,
  };

  const productColumns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts(filteredProducts.map(p => p.id));
            } else {
              setSelectedProducts([]);
            }
          }}
          className="rounded border-gray-300 text-slt-primary focus:ring-slt-primary"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts([...selectedProducts, row.id]);
            } else {
              setSelectedProducts(selectedProducts.filter(id => id !== row.id));
            }
          }}
          className="rounded border-gray-300 text-slt-primary focus:ring-slt-primary"
        />
      ),
    },
    {
      key: 'name',
      label: 'Product',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <img src={row.image} alt={value} className="w-10 h-10 rounded object-cover" />
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900">{value}</p>
              {row.flagged && (
                <Flag size={14} className="text-error" title={`${row.reports} reports`} />
              )}
            </div>
            <p className="text-sm text-gray-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'seller',
      label: 'Seller',
      render: (value) => <span className="text-sm text-gray-900">{value}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Submitted',
      render: (value) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Moderation</h1>
        <p className="text-gray-600 mt-1">Review and approve product listings</p>
      </div>

      <LoadingState loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Pending Review"
            value={displayStats.pending}
            icon={<Package size={24} />}
            color="warning"
          />
          <StatsCard
            title="Approved Products"
            value={displayStats.approved}
            icon={<CheckCircle size={24} />}
            color="success"
          />
          <StatsCard
            title="Rejected"
            value={displayStats.rejected}
            icon={<XCircle size={24} />}
            color="error"
          />
          <StatsCard
            title="Flagged Products"
            value={displayStats.flagged}
            icon={<Flag size={24} />}
            color="error"
          />
        </div>
      </LoadingState>

      {/* Filters & Bulk Actions */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Filter size={20} className="text-gray-500" />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-48"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value)}
              className="input w-48"
            >
              <option value="all">All Products</option>
              <option value="flagged">Flagged Only</option>
              <option value="not_flagged">Not Flagged</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedProducts.length} selected</span>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                >
                  Approve Selected
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                >
                  Reject Selected
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete Selected
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<Download size={16} />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCcw size={16} />}
              onClick={fetchProducts}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <DataTable
        data={filteredProducts}
        columns={productColumns}
        pagination={true}
        pageSize={10}
        searchable={true}
        actions={(row) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye size={14} />}
              onClick={() => handleViewDetails(row)}
            >
              View
            </Button>
            {row.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(row.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(row.id)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
        emptyMessage="No products found"
      />

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Product Details: ${selectedProduct?.name}`}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-32 h-32 rounded-lg object-cover border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600 mt-1">by {selectedProduct.seller}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedProduct.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-slt-primary">{formatCurrency(selectedProduct.price)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Submitted: {formatDate(selectedProduct.submittedAt)}
                </div>
              </div>

              {selectedProduct.flagged && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Flag size={16} className="text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-error">This product has been flagged</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {selectedProduct.reports} customer report{selectedProduct.reports !== 1 ? 's' : ''} received
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedProduct.status === 'pending' && (
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleReject(selectedProduct.id);
                    setShowDetailsModal(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    handleApprove(selectedProduct.id);
                    setShowDetailsModal(false);
                  }}
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Bulk Action Confirmation */}
      <ConfirmModal
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={confirmBulkAction}
        title={`Bulk ${bulkAction === 'approve' ? 'Approve' : bulkAction === 'reject' ? 'Reject' : 'Delete'} Products`}
        message={`Are you sure you want to ${bulkAction} ${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''}?`}
        variant={bulkAction === 'delete' || bulkAction === 'reject' ? 'danger' : 'primary'}
        confirmText={bulkAction === 'approve' ? 'Approve All' : bulkAction === 'reject' ? 'Reject All' : 'Delete All'}
      />
    </div>
  );
}
