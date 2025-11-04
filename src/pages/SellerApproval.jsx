import React, { useState } from 'react';
import { UserCheck, UserX, Store, Mail, Calendar, Eye, Star, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import Card, { StatsCard } from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { formatDate, getStatusColor, formatCurrency, formatNumber } from '../utils/formatters';
import useToast from '../hooks/useToast';

const dummySellers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "pending", storeName: "John's Electronics", phone: "+94771234567", appliedAt: "2025-03-10", revenue: 0, totalOrders: 0, rating: 0, productsListed: 0 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "approved", storeName: "Fashion Hub", phone: "+94772345678", appliedAt: "2025-02-15", revenue: 850000, totalOrders: 156, rating: 4.8, productsListed: 45 },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", status: "rejected", storeName: "Alice's Books", phone: "+94773456789", appliedAt: "2025-03-12", revenue: 0, totalOrders: 0, rating: 0, productsListed: 0 },
  { id: 4, name: "Bob Williams", email: "bob@example.com", status: "pending", storeName: "Tech World", phone: "+94774567890", appliedAt: "2025-03-14", revenue: 0, totalOrders: 0, rating: 0, productsListed: 0 },
  { id: 5, name: "Emma Brown", email: "emma@example.com", status: "pending", storeName: "Home Essentials", phone: "+94775678901", appliedAt: "2025-03-16", revenue: 0, totalOrders: 0, rating: 0, productsListed: 0 },
  { id: 6, name: "Liam Davis", email: "liam@example.com", status: "approved", storeName: "Gaming Pro", phone: "+94776789012", appliedAt: "2025-01-20", revenue: 1250000, totalOrders: 289, rating: 4.9, productsListed: 67 },
  { id: 7, name: "Olivia Wilson", email: "olivia@example.com", status: "rejected", storeName: "Beauty Shop", phone: "+94777890123", appliedAt: "2025-03-08", revenue: 0, totalOrders: 0, rating: 0, productsListed: 0 },
  { id: 8, name: "Michael Chen", email: "michael@example.com", status: "approved", storeName: "Tech Store LK", phone: "+94778901234", appliedAt: "2023-11-20", revenue: 2340000, totalOrders: 512, rating: 4.7, productsListed: 89 },
];

export default function SellerApproval() {
  const [sellers, setSellers] = useState(dummySellers);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { success } = useToast();

  const handleApprove = (id) => {
    setSellers(
      sellers.map((seller) =>
        seller.id === id ? { ...seller, status: "approved" } : seller
      )
    );
    success('Seller approved successfully!');
  };

  const handleReject = (id) => {
    setSellers(
      sellers.map((seller) =>
        seller.id === id ? { ...seller, status: "rejected" } : seller
      )
    );
    success('Seller rejected successfully!');
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setShowDetailsModal(true);
  };

  const stats = {
    pending: sellers.filter(s => s.status === 'pending').length,
    approved: sellers.filter(s => s.status === 'approved').length,
    rejected: sellers.filter(s => s.status === 'rejected').length,
  };

  const sellerColumns = [
    {
      key: 'name',
      label: 'Seller',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'storeName',
      label: 'Store Name',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Store size={16} className="text-gray-400" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
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
      key: 'appliedAt',
      label: 'Applied Date',
      render: (value) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Approval & Management</h1>
        <p className="text-gray-600 mt-1">Review and approve new seller registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Pending Approval"
          value={stats.pending}
          icon={<UserCheck size={24} />}
          color="warning"
        />
        <StatsCard
          title="Approved Sellers"
          value={stats.approved}
          icon={<UserCheck size={24} />}
          color="success"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<UserX size={24} />}
          color="error"
        />
      </div>

      <DataTable
        data={sellers}
        columns={sellerColumns}
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
        emptyMessage="No sellers found"
      />

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Seller Details: ${selectedSeller?.name}`}
        size="lg"
      >
        {selectedSeller && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedSeller.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Applied {formatDate(selectedSeller.appliedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Store size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedSeller.storeName}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status & Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSeller.status)}`}>
                      {selectedSeller.status.charAt(0).toUpperCase() + selectedSeller.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm text-gray-900">{selectedSeller.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics for Approved Sellers */}
            {selectedSeller.status === 'approved' && selectedSeller.totalOrders > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-slt-primary/10 to-slt-primary/5 rounded-lg border border-slt-primary/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slt-primary rounded-lg">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Revenue</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedSeller.revenue)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-25 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slt-secondary rounded-lg">
                        <ShoppingCart size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Orders</p>
                        <p className="text-lg font-bold text-gray-900">{formatNumber(selectedSeller.totalOrders)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-25 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-warning rounded-lg">
                        <Star size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Rating</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSeller.rating.toFixed(1)} ⭐</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-slt-primary">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slt-primary rounded-lg">
                        <Package size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Products Listed</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSeller.productsListed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSeller.status === 'pending' && (
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
                    handleReject(selectedSeller.id);
                    setShowDetailsModal(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    handleApprove(selectedSeller.id);
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
    </div>
  );
}
