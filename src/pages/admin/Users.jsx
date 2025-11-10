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
import { tmf629AdminService, tmf668AdminService, tmf681AdminService, userManagementService } from '../../services/admin';
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
      // Use the new userManagementService for cleaner code
      const filters = {
        role: roleFilter,
        status: userFilter !== 'all' ? userFilter : undefined,
        search: searchTerm,
        limit: 100,
        offset: 0
      };

      // Fetch users and statistics using the new service
      const [allUsers, statistics] = await Promise.all([
        userManagementService.getAllUsers(filters),
        userManagementService.getUserStatistics()
      ]);

      console.log('Fetched users:', allUsers.length, 'users');
      if (allUsers.length > 0) {
        console.log('Sample user:', allUsers[0]);
      }

      console.log('Statistics received from service:', statistics);
      console.log('Stats being set:', {
        totalUsers: statistics.totalUsers,
        activeCustomers: statistics.activeCustomers,
        activeSellers: statistics.activeSellers,
        pendingApprovals: statistics.pendingSellers,
        newThisMonth: statistics.newUsersThisMonth,
        growthRate: statistics.overallGrowthRate
      });

      setUsers(allUsers);
      setStats({
        totalUsers: statistics.totalUsers,
        activeCustomers: statistics.activeCustomers,
        activeSellers: statistics.activeSellers,
        pendingApprovals: statistics.pendingSellers,
        newThisMonth: statistics.newUsersThisMonth,
        growthRate: statistics.overallGrowthRate
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      // Use mock data on error
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', orders: 5, spent: 450000, joinedAt: '2025-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'seller', status: 'active', products: 23, revenue: 890000, joinedAt: '2025-01-20' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'customer', status: 'suspended', orders: 2, spent: 120000, joinedAt: '2025-02-10' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'seller', status: 'pending', products: 0, revenue: 0, joinedAt: '2025-03-01' },
        { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'customer', status: 'active', orders: 12, spent: 780000, joinedAt: '2024-12-05' }
      ]);
      setStats({ totalUsers: 2456, activeCustomers: 1890, activeSellers: 289, pendingApprovals: 12, newThisMonth: 234, growthRate: 15.3 });
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
      if (!selectedUser || (!selectedUser.id && !selectedUser._id)) {
        console.error('Invalid user selected:', selectedUser);
        error('Invalid user selected');
        return;
      }

      const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
      const reason = `Admin action: ${newStatus === 'suspended' ? 'Account suspended' : 'Account reactivated'}`;

      console.log('Suspending user:', {
        id: selectedUser.id,
        _id: selectedUser._id,
        role: selectedUser.role,
        newStatus
      });

      const userId = selectedUser._id || selectedUser.id;
      await userManagementService.updateUserStatus(
        userId,
        selectedUser.role,
        newStatus,
        reason
      );

      // Update local state immediately
      setUsers(users.map(u =>
        (u.id === selectedUser.id || u._id === selectedUser._id) ? { ...u, status: newStatus } : u
      ));

      // Refresh the entire user list to ensure consistency with backend
      setTimeout(() => {
        fetchUsers();
      }, 1000);

      success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      setShowSuspendConfirm(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user status:', err);
      console.error('Error details:', err.response?.data);
      error(err.response?.data?.error || 'Failed to update user status');
    }
  };

  const handleExport = async (type = 'all') => {
    try {
      let exportData;
      
      if (type === 'selected') {
        // Export selected users
        const dataToExport = users.filter(u => selectedUsers.includes(u.id));
        exportData = dataToExport.map(u => ({
          Name: u.name,
          Email: u.email,
          Phone: u.phone,
          Role: u.role,
          Status: u.status,
          'Total Orders': u.orders || u.products,
          'Total Spent/Revenue': u.role === 'seller' ? u.revenue : u.spent,
          'Joined Date': u.joinedAt
        }));
      } else {
        // Export all users using the service
        const filters = {
          role: roleFilter,
          status: userFilter !== 'all' ? userFilter : undefined,
          search: searchTerm
        };
        exportData = await userManagementService.getUsersForExport(filters);
      }

      exportToCSV(exportData, 'users_export');
      success('Users exported successfully');
    } catch (err) {
      console.error('Error exporting users:', err);
      error('Failed to export users');
    }
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
      render: (value, row) => {
        const displayValue = row.role === 'seller' ? (row.products || 0) : (value || 0);
        return <span className="font-semibold text-gray-900">{displayValue}</span>;
      },
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
