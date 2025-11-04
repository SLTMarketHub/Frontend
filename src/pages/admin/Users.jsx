import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Ban,
  CheckCircle,
  Download,
  Send,
  Shield,
  Activity,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import Card, { StatsCard } from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingSpinner';
import { formatDate, formatCurrency, getStatusColor, getRelativeTime } from '../../utils/formatters';
import useToast from '../../hooks/useToast';
import customerService from '../../services/tmf/customerService';
import partnerService from '../../services/tmf/partnerService';
import communicationService from '../../services/tmf/communicationService';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const { success, error } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [userFilter, roleFilter, searchTerm]);

  // Sync search from URL query (?search=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchTerm(q);
  }, [location.search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        status: userFilter !== 'all' ? userFilter : undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        searchTerm: searchTerm || undefined,
        limit: 50
      };

      // Fetch customers and sellers based on role filter
      let allUsers = [];
      
      if (roleFilter === 'all' || roleFilter === 'customer') {
        const customerData = await customerService.listCustomers(params);
        const customers = (customerData.items || []).map(c => ({
          ...c,
          role: 'customer',
          orders: c.totalOrders,
          spent: c.totalSpent,
          joinedAt: c.joinedDate
        }));
        allUsers = [...allUsers, ...customers];
      }

      if (roleFilter === 'all' || roleFilter === 'seller') {
        const sellerData = await partnerService.listSellers(params);
        const sellers = (sellerData.items || []).map(s => ({
          ...s,
          role: 'seller',
          joinedAt: s.joinedDate
        }));
        allUsers = [...allUsers, ...sellers];
      }

      // Apply additional filters
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allUsers = allUsers.filter(u => 
          u.name?.toLowerCase().includes(term) || 
          u.email?.toLowerCase().includes(term)
        );
      }

      setUsers(allUsers);

      // Fetch statistics
      const [customerStats, sellerStats] = await Promise.all([
        customerService.getCustomerStats(),
        partnerService.getSellerStats()
      ]);

      setStats({
        totalUsers: customerStats.totalCustomers + sellerStats.totalSellers,
        activeCustomers: customerStats.activeCustomers,
        activeSellers: sellerStats.activeSellers,
        pendingApprovals: sellerStats.totalSellers - sellerStats.activeSellers,
        newThisMonth: customerStats.newThisMonth,
        growthRate: customerStats.growth
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setShowSuspendConfirm(true);
  };

  const confirmSuspend = async () => {
    try {
      const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
      
      if (selectedUser.role === 'customer') {
        await customerService.updateCustomerStatus(selectedUser.id, newStatus);
      } else {
        await partnerService.updateSellerStatus(
          selectedUser.id, 
          newStatus === 'suspended' ? 'suspend' : 'reactivate',
          `Admin action: ${newStatus === 'suspended' ? 'Account suspended' : 'Account reactivated'}`
        );
      }

      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, status: newStatus } : u
      ));
      
      success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      setShowSuspendConfirm(false);
    } catch (err) {
      error('Failed to update user status');
    }
  };

  const handleExport = (type = 'all') => {
    const dataToExport = type === 'selected' 
      ? users.filter(u => selectedUsers.includes(u.id))
      : users;

    const exportData = dataToExport.map(u => ({
      Name: u.name,
      Email: u.email,
      Phone: u.phone,
      Role: u.role,
      Status: u.status,
      'Total Orders': u.orders,
      'Total Spent/Revenue': u.role === 'seller' ? u.revenue : u.spent,
      'Joined Date': u.joinedAt
    }));

    exportToCSV(exportData, 'users_export');
    success('Users exported successfully');
  };

  const userColumns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'seller' ? 'bg-green-100 text-slt-primary' : 'bg-blue-100 text-slt-secondary'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
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
      key: 'orders',
      label: 'Orders/Sales',
      render: (value, row) => (
        <span className="font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      key: 'spent',
      label: 'Spent/Revenue',
      render: (value, row) => {
        const amount = row.role === 'seller' ? row.revenue : value;
        return (
          <span className="text-success font-semibold">
            LKR {(amount / 1000).toFixed(1)}K
          </span>
        );
      },
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      render: (value) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage customers and sellers on the platform</p>
      </div>

      {/* Stats */}
      <LoadingState loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<UsersIcon size={24} />}
            color="primary"
          />
          <StatsCard
            title="Active Customers"
            value={stats?.activeCustomers || 0}
            icon={<UserCheck size={24} />}
            color="secondary"
          />
          <StatsCard
            title="Active Sellers"
            value={stats?.activeSellers || 0}
            icon={<UserCheck size={24} />}
            color="success"
          />
          <StatsCard
            title="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            icon={<UserX size={24} />}
            color="warning"
          />
        </div>
      </LoadingState>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3">
            <Filter size={20} className="text-gray-500" />
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input w-40"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="seller">Sellers</option>
            </select>
            
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="input w-40"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={userColumns}
        loading={loading}
        onRowClick={handleViewUser}
        pagination={true}
        pageSize={10}
        searchable={true}
        actions={(row) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Edit2 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleViewUser(row);
              }}
            >
              View
            </Button>
            <Button
              variant={row.status === 'suspended' ? 'success' : 'danger'}
              size="sm"
              icon={row.status === 'suspended' ? <CheckCircle size={14} /> : <Ban size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleSuspendUser(row);
              }}
            >
              {row.status === 'suspended' ? 'Activate' : 'Suspend'}
            </Button>
          </div>
        )}
        emptyMessage="No users found"
      />

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={`User Details: ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Joined {formatDate(selectedUser.joinedAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Role:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.role === 'seller' ? 'bg-green-100 text-slt-primary' : 'bg-blue-100 text-slt-secondary'
                    }`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedUser.role === 'seller' ? 'Total Sales:' : 'Total Orders:'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedUser.role === 'seller' ? 'Revenue:' : 'Total Spent:'}
                    </span>
                    <span className="text-sm font-semibold text-success">
                      LKR {((selectedUser.role === 'seller' ? selectedUser.revenue : selectedUser.spent) / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </Button>
              <Button
                variant={selectedUser.status === 'suspended' ? 'success' : 'danger'}
                icon={selectedUser.status === 'suspended' ? <CheckCircle size={18} /> : <Ban size={18} />}
                onClick={() => {
                  setShowUserModal(false);
                  handleSuspendUser(selectedUser);
                }}
              >
                {selectedUser.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Suspend Confirmation */}
      <ConfirmModal
        isOpen={showSuspendConfirm}
        onClose={() => setShowSuspendConfirm(false)}
        onConfirm={confirmSuspend}
        title={selectedUser?.status === 'suspended' ? 'Activate User' : 'Suspend User'}
        message={
          selectedUser?.status === 'suspended'
            ? `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the platform.`
            : `Are you sure you want to suspend ${selectedUser?.name}? They will lose access to the platform.`
        }
        variant={selectedUser?.status === 'suspended' ? 'primary' : 'danger'}
        confirmText={selectedUser?.status === 'suspended' ? 'Activate' : 'Suspend'}
      />
    </div>
  );
};

export default Users;
