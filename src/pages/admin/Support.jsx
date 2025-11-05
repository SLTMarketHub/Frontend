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
  mockTicketStats,
  mockTickets,
  mockTicketMessages,
  mockAdminUsers,
} from '../../utils/mockData';
import useToast from '../../hooks/useToast';

const Support = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [showInternalNote, setShowInternalNote] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        let filtered = mockTickets;
        if (statusFilter !== 'all') {
          filtered = filtered.filter(t => t.status === statusFilter);
        }
        if (priorityFilter !== 'all') {
          filtered = filtered.filter(t => t.priority === priorityFilter);
        }
        setTickets(filtered);
        setStats(mockTicketStats);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketMessages(mockTicketMessages[ticket.id] || []);
    setShowTicketModal(true);
  };
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      ));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
      success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignTicket = async (ticketId, adminId) => {
    try {
      const admin = mockAdminUsers.find(a => a.id === parseInt(adminId));
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, assignedTo: admin?.name, updatedAt: new Date().toISOString() } : t
      ));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, assignedTo: admin?.name });
      }
      success('Ticket assigned successfully');
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    
    try {
      const newMessage = {
        id: Date.now(),
        sender: 'Admin User',
        senderType: 'admin',
        message: replyMessage,
        timestamp: new Date().toISOString(),
        isInternal: false,
      };
      
      setTicketMessages([...ticketMessages, newMessage]);
      setReplyMessage('');
      
      if (selectedTicket.status === 'open') {
        handleStatusChange(selectedTicket.id, 'in_progress');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleAddInternalNote = async () => {
    if (!internalNote.trim()) return;
    
    try {
      const newNote = {
        id: Date.now(),
        sender: 'Admin User',
        senderType: 'admin',
        message: internalNote,
        timestamp: new Date().toISOString(),
        isInternal: true,
      };
      
      setTicketMessages([...ticketMessages, newNote]);
      setInternalNote('');
      setShowInternalNote(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleExportTickets = () => {
    const exportData = tickets.map(ticket => ({
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      customerName: ticket.customerName,
      createdAt: formatDate(ticket.createdAt),
      updatedAt: formatDate(ticket.updatedAt),
    }));
    
    exportTicketsCSV(exportData);
  };

  const ticketColumns = [
    {
      key: 'id',
      label: 'Ticket ID',
      render: (value) => (
        <span className="font-mono text-sm font-semibold text-slt-primary">{value}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.category}</p>
        </div>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value, row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.customerType}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {capitalize(value.replace('_', ' '))}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {capitalize(value)}
        </span>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (value) => (
        <span className="text-sm text-gray-700">{value || 'Unassigned'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-sm text-gray-600">{getRelativeTime(new Date(value))}</span>
      ),
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
        >
          Export Tickets
        </Button>
      </div>

      <LoadingState loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Open Tickets"
            value={stats?.open || 0}
            icon={<MessageSquare size={24} />}
            trend="down"
            trendValue="-8%"
            color="warning"
          />
          <StatsCard
            title="In Progress"
            value={stats?.inProgress || 0}
            icon={<Clock size={24} />}
            trend="up"
            trendValue="+12%"
            color="info"
          />
          <StatsCard
            title="Resolved"
            value={stats?.resolved || 0}
            icon={<CheckCircle size={24} />}
            trend="up"
            trendValue="+18%"
            color="success"
          />
          <StatsCard
            title="Avg Response Time"
            value={stats?.avgResponseTime || '-'}
            icon={<Clock size={24} />}
            trend="down"
            trendValue="-15%"
            color="primary"
          />
        </div>
      </LoadingState>

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

      <DataTable
        data={tickets}
        columns={ticketColumns}
        loading={loading}
        onRowClick={handleViewTicket}
        pagination={true}
        pageSize={10}
        emptyMessage="No tickets found"
      />

      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title={`Ticket ${selectedTicket?.id}`}
        size="xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedTicket.subject}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>{selectedTicket.customerName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(selectedTicket.createdAt, 'long')}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {capitalize(selectedTicket.status.replace('_', ' '))}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.priority)}`}>
                  {capitalize(selectedTicket.priority)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="input w-48"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={mockAdminUsers.find(a => a.name === selectedTicket.assignedTo)?.id || ''}
                  onChange={(e) => handleAssignTicket(selectedTicket.id, e.target.value)}
                  className="input w-48"
                >
                  <option value="">Assign to...</option>
                  {mockAdminUsers.map(admin => (
                    <option key={admin.id} value={admin.id}>{admin.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Original Message:</p>
              <p className="text-gray-900">{selectedTicket.description}</p>
              {selectedTicket.orderNumber && (
                <p className="text-sm text-gray-600 mt-2">
                  Order: <span className="font-mono font-semibold">{selectedTicket.orderNumber}</span>
                </p>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {ticketMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.isInternal
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : msg.senderType === 'admin'
                      ? 'bg-blue-50 border-l-4 border-blue-400'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {msg.sender}
                        {msg.isInternal && (
                          <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                            Internal Note
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{getRelativeTime(new Date(msg.timestamp))}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachments && (
                    <div className="flex gap-2 mt-2">
                      {msg.attachments.map((file, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded flex items-center">
                          <Paperclip size={12} className="mr-1" />
                          {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex space-x-2">
                <Button
                  variant={showInternalNote ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => setShowInternalNote(false)}
                >
                  Reply to Customer
                </Button>
                <Button
                  variant={showInternalNote ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShowInternalNote(true)}
                >
                  Add Internal Note
                </Button>
              </div>

              {!showInternalNote ? (
                <div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the customer..."
                    className="input min-h-[120px]"
                    rows="4"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      icon={<Send size={18} />}
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                    >
                      Send Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Add an internal note (not visible to customer)..."
                    className="input min-h-[120px] bg-yellow-50 border-yellow-300"
                    rows="4"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      icon={<Send size={18} />}
                      onClick={handleAddInternalNote}
                      disabled={!internalNote.trim()}
                      variant="warning"
                    >
                      Add Note
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Support;