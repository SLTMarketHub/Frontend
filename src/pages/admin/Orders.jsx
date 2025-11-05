import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Calendar,
  Download,
  RefreshCcw,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  CreditCard,
  User,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card, { StatsCard } from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getStatusColor, formatNumber, getRelativeTime } from '../../utils/formatters';
import useToast from '../../hooks/useToast';
import { tmf622AdminService, tmf681AdminService, tmf678AdminService } from '../../services/admin';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const dummyOrders = [
  { id: '#ORD-101', customer: "Michael Scott", seller: "John Doe", date: "2025-03-20", status: "pending", amount: 120000 },
  { id: '#ORD-102', customer: "Pam Beesly", seller: "Jane Smith", date: "2025-03-18", status: "delivered", amount: 95500 },
  { id: '#ORD-103', customer: "Jim Halpert", seller: "Alice Johnson", date: "2025-03-19", status: "disputed", amount: 75250 },
  { id: '#ORD-104', customer: "Dwight Schrute", seller: "John Doe", date: "2025-03-21", status: "refunded", amount: 150000 },
  { id: '#ORD-105', customer: "Stanley Hudson", seller: "Tech Store", date: "2025-03-17", status: "shipped", amount: 234000 },
  { id: '#ORD-106', customer: "Angela Martin", seller: "Fashion Hub", date: "2025-03-16", status: "confirmed", amount: 67800 },
];

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [refundData, setRefundData] = useState({ amount: 0, reason: '', type: 'full' });
  const [statusUpdateData, setStatusUpdateData] = useState({ status: '', reason: '' });
  const [disputeResolution, setDisputeResolution] = useState({ decision: '', notes: '', refundAmount: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFrom, dateTo]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        limit: 100,
        offset: 0,
        ...(statusFilter !== 'all' && { state: statusFilter }),
        ...(dateFrom && { 'orderDate.gte': dateFrom }),
        ...(dateTo && { 'orderDate.lte': dateTo }),
        ...(searchTerm && { search: searchTerm })
      };

      const [ordersResponse, statsData] = await Promise.all([
        tmf622AdminService.listProductOrders(params),
        tmf622AdminService.getOrderStatistics({ period: 'month' })
      ]);

      // Format orders for display
      const formattedOrders = ordersResponse.map(order => ({
        id: order.id || `#ORD-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: order.externalId || order.id,
        customer: order.relatedParty?.find(p => p.role === 'customer')?.name || 'Unknown Customer',
        customerId: order.relatedParty?.find(p => p.role === 'customer')?.id,
        seller: order.relatedParty?.find(p => p.role === 'seller')?.name || 'Unknown Seller',
        sellerId: order.relatedParty?.find(p => p.role === 'seller')?.id,
        date: order.orderDate || new Date().toISOString(),
        orderDate: order.orderDate || new Date().toISOString(),
        status: order.state || 'pending',
        amount: order.totalOrderPrice?.reduce((sum, price) => sum + (price.price?.value || 0), 0) || 0,
        total: order.totalOrderPrice?.reduce((sum, price) => sum + (price.price?.value || 0), 0) || 0,
        paymentStatus: order.payment?.[0]?.status || 'pending',
        items: order.productOrderItem || [],
        shippingAddress: order.deliveryAddress,
        billingAddress: order.billingAddress
      }));

      setOrders(formattedOrders);
      setOrderStats(statsData);
      
      // Fetch disputes from cancelled orders
      const cancelledOrders = await tmf622AdminService.listCancelProductOrders({ limit: 20 });
      const disputedOrders = cancelledOrders.filter(o => o.cancellationReason?.includes('dispute'));
      setDisputes(disputedOrders.map(d => ({
        id: d.id,
        orderId: d.productOrder?.id,
        reason: d.cancellationReason,
        date: d.requestedCancellationDate,
        status: d.state
      })));
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Use mock data as fallback
      setOrders(dummyOrders);
      setOrderStats({
        totalOrders: dummyOrders.length,
        pendingOrders: dummyOrders.filter(o => o.status === 'pending').length,
        completedOrders: dummyOrders.filter(o => o.status === 'delivered').length,
        disputedOrders: dummyOrders.filter(o => o.status === 'disputed').length,
        totalRevenue: dummyOrders.reduce((sum, o) => sum + o.amount, 0)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      await tmf622AdminService.updateProductOrder(selectedOrder.id, {
        state: statusUpdateData.status,
        note: [{
          text: statusUpdateData.reason,
          date: new Date().toISOString(),
          author: 'Admin'
        }]
      });

      // Send notification using admin service
      await tmf681AdminService.createMessage({
        sender: {
          id: 'admin',
          name: 'Platform Admin',
          '@type': 'Organization'
        },
        receiver: [{
          id: selectedOrder.customerId,
          name: selectedOrder.customer,
          '@type': 'Individual'
        }],
        communicationType: 'order_status_update',
        subject: `Order ${selectedOrder.id} Status Update`,
        content: `Your order status has been updated to ${statusUpdateData.status}`,
        channel: ['email'],
        priority: 'normal',
        status: 'pending'
      });

      success('Order status updated successfully');
      setShowStatusUpdateModal(false);
      fetchOrders();
    } catch (err) {
      showError('Failed to update order status');
    }
  };

  const handleProcessRefund = async () => {
    try {
      // Create a cancel order request for refund
      await tmf622AdminService.createCancelProductOrder({
        productOrder: {
          id: selectedOrder.id,
          href: `/productOrder/${selectedOrder.id}`
        },
        cancellationReason: refundData.reason,
        requestedCancellationDate: new Date().toISOString(),
        state: 'acknowledged',
        '@type': 'CancelProductOrder'
      });
      
      // Create a customer bill adjustment for refund
      if (refundData.type === 'full') {
        await tmf678AdminService.createCustomerBill({
          billNo: `REFUND-${selectedOrder.id}`,
          billDate: new Date().toISOString(),
          amountDue: { value: -refundData.amount, unit: 'LKR' },
          relatedParty: [{
            id: selectedOrder.customerId,
            name: selectedOrder.customer,
            role: 'customer'
          }],
          billDocument: [{
            name: 'Refund Document',
            description: refundData.reason,
            '@type': 'BillDocument'
          }]
        });
      }
      
      success('Refund processed successfully');
      setShowRefundModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Refund error:', err);
      showError('Failed to process refund');
    }
  };

  const handleResolveDispute = async () => {
    try {
      // Update the order status based on dispute resolution
      await tmf622AdminService.updateProductOrder(selectedDispute.orderId, {
        state: disputeResolution.decision === 'refund' ? 'cancelled' : 'completed',
        note: [{
          text: `Dispute resolved: ${disputeResolution.notes}`,
          date: new Date().toISOString(),
          author: 'Admin'
        }]
      });
      
      // Process refund if needed
      if (disputeResolution.decision === 'refund' && disputeResolution.refundAmount > 0) {
        await tmf678AdminService.createCustomerBill({
          billNo: `DISPUTE-REFUND-${selectedDispute.id}`,
          billDate: new Date().toISOString(),
          amountDue: { value: -disputeResolution.refundAmount, unit: 'LKR' },
          relatedParty: [{
            id: selectedDispute.customerId,
            name: selectedDispute.customerName,
            role: 'customer'
          }]
        });
      }
      
      success('Dispute resolved successfully');
      setShowDisputeModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Dispute resolution error:', err);
      showError('Failed to resolve dispute');
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const detailedOrder = await tmf622AdminService.getProductOrder(order.id);
      // Format the detailed order for display
      const formattedOrder = {
        ...order,
        ...detailedOrder,
        customer: detailedOrder.relatedParty?.find(p => p.role === 'customer')?.name || order.customer,
        seller: detailedOrder.relatedParty?.find(p => p.role === 'seller')?.name || order.seller,
        items: detailedOrder.productOrderItem || order.items,
        total: detailedOrder.totalOrderPrice?.reduce((sum, price) => sum + (price.price?.value || 0), 0) || order.amount
      };
      setSelectedOrder(formattedOrder);
      setShowDetailsModal(true);
    } catch (err) {
      // Use the basic order data if detailed fetch fails
      setSelectedOrder(order);
      setShowDetailsModal(true);
    }
  };

  const handleExportOrders = async (format = 'csv') => {
    const exportData = filteredOrders.map(o => ({
      'Order ID': o.id || o.orderNumber,
      'Customer': o.customer,
      'Seller': o.seller,
      'Date': formatDate(o.date || o.orderDate),
      'Status': o.status,
      'Amount': o.amount || o.total,
      'Payment Status': o.paymentStatus || 'N/A'
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'orders_export');
    } else {
      exportToPDF(exportData, 'orders_export');
    }
    success('Orders exported successfully');
  };

  const filteredOrders = orders.filter(o => {
    const statusMatch = statusFilter === 'all' || o.status === statusFilter;
    const searchLower = searchTerm.trim().toLowerCase();
    const searchMatch = !searchLower ||
      o.customer?.toLowerCase().includes(searchLower) ||
      o.seller?.toLowerCase().includes(searchLower) ||
      (o.id || o.orderNumber)?.toLowerCase().includes(searchLower);
    const orderDate = o.date || o.orderDate;
    const d = orderDate ? new Date(orderDate) : new Date();
    const fromOk = !dateFrom || d >= new Date(dateFrom);
    const toOk = !dateTo || d <= new Date(dateTo);
    return statusMatch && searchMatch && fromOk && toOk;
  });

  // Calculate stats from orderStats or orders
  const stats = {
    total: orderStats?.totalOrders || orders.length,
    pending: orderStats?.pendingOrders || orders.filter(o => o.status === 'pending').length,
    disputed: disputes?.length || orders.filter(o => o.status === 'disputed').length,
    completed: orderStats?.deliveredOrders || orders.filter(o => o.status === 'delivered').length,
    revenue: orderStats?.totalRevenue || orders.reduce((sum, o) => sum + (o.amount || o.total || 0), 0)
  };

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value) => <span className="font-mono text-sm font-semibold text-slt-primary">{value}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">Seller: {row.seller}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
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
      key: 'date',
      label: 'Date',
      render: (value) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Oversight</h1>
        <p className="text-gray-600 mt-1">Manage and oversee all platform orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingCart size={24} />}
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<AlertTriangle size={24} />}
          color="warning"
        />
        <StatsCard
          title="Disputed"
          value={stats.disputed}
          icon={<XCircle size={24} />}
          color="error"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle size={24} />}
          color="success"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by order ID, customer, or seller"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="disputed">Disputed</option>
            <option value="refunded">Refunded</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input w-44"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input w-44"
            />
          </div>

          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              icon={<Download size={18} />}
              onClick={() => handleExportOrders('csv')}
            >
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              icon={<RefreshCcw size={18} />}
              onClick={() => fetchOrders()}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <DataTable
        data={filteredOrders}
        columns={orderColumns}
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
            {(row.status === 'pending' || row.status === 'disputed') && (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleResolve(row.id)}
              >
                Resolve
              </Button>
            )}
          </div>
        )}
        emptyMessage="No orders found"
      />

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Order Details: ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Customer: {selectedOrder.customer}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Seller: {selectedOrder.seller}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(selectedOrder.amount)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status & Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Date:</span>
                    <span className="text-sm text-gray-900">{formatDate(selectedOrder.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {(selectedOrder.status === 'pending' || selectedOrder.status === 'disputed') && (
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    handleResolve(selectedOrder.id);
                    setShowDetailsModal(false);
                  }}
                >
                  Mark as Resolved
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
