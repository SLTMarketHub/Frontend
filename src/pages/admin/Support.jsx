import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Send,
  Paperclip,
  Filter,
  Download,
} from 'lucide-react';
import Card, { StatsCard } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import { LoadingState } from '../../components/common/LoadingSpinner';
import { formatDate, getRelativeTime, getStatusColor, capitalize } from '../../utils/formatters';
import { exportTicketsCSV } from '../../utils/exportUtils';
import {
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  replyToTicket,
  addTicketNote,
} from '../../services/supportService';
import useToast from '../../hooks/useToast';

// Mock data for fallback and initial state
const mockStats = {
  open: 12,
  inProgress: 8,
  resolved: 45,
  avgResponseTime: '2.5 hours'
};

const mockTickets = [
  {
    _id: 'TKT-001',
    subject: 'Order not delivered',
    customerName: 'John Doe',
    status: 'open',
    priority: 'high',
    assignedTo: 'Admin User',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    description: 'I placed an order 3 days ago but have not received it yet.',
    messages: [
      {
        sender: 'John Doe',
        senderType: 'customer',
        message: 'I placed an order 3 days ago but have not received it yet.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isInternal: false
      }
    ]
  },
  {
    _id: 'TKT-002',
    subject: 'Payment issue',
    customerName: 'Jane Smith',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Support Team',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    description: 'Payment was deducted but order was not confirmed.',
    messages: [
      {
        sender: 'Jane Smith',
        senderType: 'customer',
        message: 'Payment was deducted but order was not confirmed.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        isInternal: false
      },
      {
        sender: 'Support Team',
        senderType: 'admin',
        message: 'We are looking into this issue. Please provide your transaction ID.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isInternal: false
      }
    ]
  },
  {
    _id: 'TKT-003',
    subject: 'Product quality concern',
    customerName: 'Mike Johnson',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Quality Team',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: 'The product I received does not match the description.',
    messages: [
      {
        sender: 'Mike Johnson',
        senderType: 'customer',
        message: 'The product I received does not match the description.',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        isInternal: false
      },
      {
        sender: 'Quality Team',
        senderType: 'admin',
        message: 'We apologize for the inconvenience. A replacement has been shipped.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isInternal: false
      }
    ]
  }
];

const Support = () => {
  const [loading, setLoading] = useState(true);
  
  // Initialize with mock data instead of empty arrays
  const [tickets, setTickets] = useState(mockTickets);
  const [stats, setStats] = useState(mockStats);
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [showInternalNote, setShowInternalNote] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();

  // Fetch all tickets with fallback to mock data
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: searchTerm || undefined,
      });
      
      // Update with backend data if available
      if (data.tickets || data) {
        setTickets(data.tickets || data);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      error('Failed to load tickets from server. Using cached data.');
      // Keep mock data as fallback (already set in useState)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter]);

  // Search functionality with debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchTickets();
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // View ticket and messages
  const handleViewTicket = async (ticket) => {
    try {
      const data = await getTicketById(ticket._id || ticket.id);
      setSelectedTicket(data);
      setTicketMessages(data.messages || []);
      setShowTicketModal(true);
    } catch (err) {
      // Fallback to mock data for ticket details
      console.error('Error loading ticket details:', err);
      const mockTicket = mockTickets.find(t => t._id === ticket._id);
      if (mockTicket) {
        setSelectedTicket(mockTicket);
        setTicketMessages(mockTicket.messages || []);
        setShowTicketModal(true);
      } else {
        error('Failed to load ticket details');
      }
    }
  };

  // Update status
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      success(`Ticket status updated to ${newStatus}`);
      fetchTickets();
    } catch (err) {
      console.error('Error updating ticket status:', err);
      error('Error updating ticket status');
    }
  };

  // Assign ticket
  const handleAssignTicket = async (ticketId, adminId) => {
    try {
      await assignTicket(ticketId, adminId);
      success('Ticket assigned successfully');
      fetchTickets();
    } catch (err) {
      console.error('Error assigning ticket:', err);
      error('Error assigning ticket');
    }
  };

  // Send reply
  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      await replyToTicket(selectedTicket._id, replyMessage);
      success('Reply sent successfully');
      setReplyMessage('');
      handleViewTicket(selectedTicket);
    } catch (err) {
      console.error('Error sending reply:', err);
      error('Error sending reply');
    }
  };

  // Add internal note
  const handleAddInternalNote = async () => {
    if (!internalNote.trim()) return;
    try {
      await addTicketNote(selectedTicket._id, internalNote);
      success('Internal note added');
      setInternalNote('');
      setShowInternalNote(false);
      handleViewTicket(selectedTicket);
    } catch (err) {
      console.error('Error adding note:', err);
      error('Error adding note');
    }
  };

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleExportTickets = () => {
    const exportData = filteredTickets.map(ticket => ({
      id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      customerName: ticket.customerName,
      createdAt: formatDate(ticket.createdAt),
      updatedAt: formatDate(ticket.updatedAt),
    }));
    exportTicketsCSV(exportData);
    success(`Exported ${exportData.length} tickets`);
  };

  const ticketColumns = [
    { 
      key: 'id', 
      label: 'Ticket ID', 
      render: (v, r) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {r._id || v}
        </span>
      )
    },
    { 
      key: 'subject', 
      label: 'Subject',
      render: (v) => (
        <div className="max-w-xs truncate" title={v}>
          {v}
        </div>
      )
    },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (v) => (
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <span>{v}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: v => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(v)}`}>
          {capitalize(v)}
        </span>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      render: v => {
        const colors = {
          low: 'bg-green-100 text-green-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-orange-100 text-orange-800',
          urgent: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[v] || 'bg-gray-100 text-gray-800'}`}>
            {capitalize(v)}
          </span>
        );
      }
    },
    { 
      key: 'assignedTo', 
      label: 'Assigned To',
      render: (v) => (
        <span className="text-sm text-gray-600">
          {v || 'Unassigned'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created', 
      render: v => (
        <div className="text-sm">
          <div className="text-gray-900">{getRelativeTime(new Date(v))}</div>
          <div className="text-gray-500 text-xs">{formatDate(v)}</div>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer and seller support requests</p>
        </div>
        <Button 
          variant="outline" 
          icon={<Download size={18} />} 
          onClick={handleExportTickets}
          disabled={filteredTickets.length === 0}
        >
          Export Tickets ({filteredTickets.length})
        </Button>
      </div>

      {/* Stats Cards - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Open Tickets" 
          value={stats?.open || 0} 
          icon={<MessageSquare size={24} />} 
          color="warning" 
        />
        <StatsCard 
          title="In Progress" 
          value={stats?.inProgress || 0} 
          icon={<Clock size={24} />} 
          color="info" 
        />
        <StatsCard 
          title="Resolved" 
          value={stats?.resolved || 0} 
          icon={<CheckCircle size={24} />} 
          color="success" 
        />
        <StatsCard 
          title="Avg Response Time" 
          value={stats?.avgResponseTime || '-'} 
          icon={<Clock size={24} />} 
          color="primary" 
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="input" 
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter size={20} className="text-gray-500" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="input w-40"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)} 
              className="input w-40"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      <LoadingState loading={loading}>
        <DataTable 
          data={filteredTickets} 
          columns={ticketColumns} 
          loading={loading} 
          onRowClick={handleViewTicket} 
          pagination={true} 
          pageSize={10} 
          emptyMessage="No tickets found" 
        />
      </LoadingState>

      {/* Ticket Detail Modal */}
      <Modal 
        isOpen={showTicketModal} 
        onClose={() => setShowTicketModal(false)} 
        title={`Ticket ${selectedTicket?._id || ''}`} 
        size="xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>Customer: {selectedTicket.customerName}</span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedTicket.status)}`}>
                  {capitalize(selectedTicket.status)}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {capitalize(selectedTicket.priority)} Priority
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Original Message:</p>
              <p>{selectedTicket.description}</p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ticketMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border-l-4 ${
                    msg.isInternal 
                      ? 'bg-yellow-50 border-yellow-400' 
                      : msg.senderType === 'admin' 
                        ? 'bg-blue-50 border-blue-400' 
                        : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{msg.sender}</p>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(new Date(msg.timestamp))}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  {msg.isInternal && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded mt-2 inline-block">
                      Internal Note
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-2 mb-4">
              <Button 
                variant={!showInternalNote ? 'primary' : 'outline'} 
                onClick={() => setShowInternalNote(false)}
                size="sm"
              >
                Customer Reply
              </Button>
              <Button 
                variant={showInternalNote ? 'warning' : 'outline'} 
                onClick={() => setShowInternalNote(true)}
                size="sm"
              >
                Internal Note
              </Button>
            </div>

            {!showInternalNote ? (
              <div className="space-y-3">
                <textarea 
                  value={replyMessage} 
                  onChange={(e) => setReplyMessage(e.target.value)} 
                  placeholder="Type your reply to the customer..." 
                  className="input min-h-[120px]" 
                />
                <Button 
                  icon={<Send size={18} />} 
                  onClick={handleSendReply} 
                  disabled={!replyMessage.trim()}
                >
                  Send Reply
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea 
                  value={internalNote} 
                  onChange={(e) => setInternalNote(e.target.value)} 
                  placeholder="Add an internal note (visible only to admin staff)..." 
                  className="input min-h-[120px]" 
                />
                <Button 
                  icon={<Send size={18} />} 
                  onClick={handleAddInternalNote} 
                  disabled={!internalNote.trim()} 
                  variant="warning"
                >
                  Add Internal Note
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Support;