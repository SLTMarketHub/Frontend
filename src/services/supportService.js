/*
Support Service

Features:
- Get all tickets with filters (status, priority, search)
- Get ticket by ID with full message history
- Update ticket status (open, in_progress, resolved, closed)
- Assign ticket to admin/team
- Reply to ticket (customer-facing messages)
- Add internal notes (admin-only notes)
- Get ticket statistics (open, in progress, resolved, avg response time)
- Fallback to mock data when backend is not available

Ticket Structure:
{
  _id: 'TKT-001',
  subject: string,
  description: string,
  customerName: string,
  customerId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  assignedTo: string (admin name or team name),
  assignedToId: string,
  createdAt: Date,
  updatedAt: Date,
  messages: [{
    sender: string,
    senderType: 'customer' | 'admin',
    message: string,
    timestamp: Date,
    isInternal: boolean
  }]
}
*/

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Mock data for development/fallback
const mockStats = {
  open: 12,
  inProgress: 8,
  resolved: 45,
  closed: 10,
  total: 75,
  avgResponseTime: '2.5 hours'
};

const mockTickets = [
  {
    _id: 'TKT-001',
    subject: 'Order not delivered',
    customerName: 'John Doe',
    customerId: 'CUST-001',
    status: 'open',
    priority: 'high',
    assignedTo: 'Admin User',
    assignedToId: 'ADMIN-001',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    description: 'I placed an order 3 days ago but have not received it yet.',
    category: 'Order Issue',
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
    customerId: 'CUST-002',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Support Team',
    assignedToId: 'ADMIN-002',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    description: 'Payment was deducted but order was not confirmed.',
    category: 'Payment Issue',
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
    customerId: 'CUST-003',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Quality Team',
    assignedToId: 'ADMIN-003',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: 'The product I received does not match the description.',
    category: 'Product Quality',
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
  },
  {
    _id: 'TKT-004',
    subject: 'Refund request',
    customerName: 'Sarah Williams',
    customerId: 'CUST-004',
    status: 'open',
    priority: 'high',
    assignedTo: 'Finance Team',
    assignedToId: 'ADMIN-004',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    description: 'I need a refund for order #12345 as the product was damaged.',
    category: 'Order Issue',
    messages: [
      {
        sender: 'Sarah Williams',
        senderType: 'customer',
        message: 'I need a refund for order #12345 as the product was damaged.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isInternal: false
      }
    ]
  },
  {
    _id: 'TKT-005',
    subject: 'Account access issue',
    customerName: 'David Brown',
    customerId: 'CUST-005',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: 'Tech Support',
    assignedToId: 'ADMIN-005',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    description: 'Cannot login to my account. Password reset not working.',
    category: 'Account Issue',
    messages: [
      {
        sender: 'David Brown',
        senderType: 'customer',
        message: 'Cannot login to my account. Password reset not working.',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
        isInternal: false
      },
      {
        sender: 'Tech Support',
        senderType: 'admin',
        message: 'We are investigating this issue. Will update you shortly.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isInternal: false
      },
      {
        sender: 'Tech Support',
        senderType: 'admin',
        message: 'Internal note: User account flagged for security review.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isInternal: true
      }
    ]
  }
];

// Filter mock tickets based on parameters
const filterMockTickets = (params = {}) => {
  let filtered = [...mockTickets];
  
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(t => t.status === params.status);
  }
  
  if (params.priority && params.priority !== 'all') {
    filtered = filtered.filter(t => t.priority === params.priority);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.subject.toLowerCase().includes(searchLower) ||
      t.customerName.toLowerCase().includes(searchLower) ||
      t._id.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

// Get all tickets with optional filters
export const getTickets = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.TICKETS, {
      params: {
        status: params.status,
        priority: params.priority,
        search: params.search,
        page: params.page || 1,
        limit: params.limit || 100,
      },
    });
    
    console.log(`Found ${response.data?.tickets?.length || 0} tickets from API`);
    
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data:', error.message);
    
    // Return mock data with proper structure
    const filtered = filterMockTickets(params);
    
    return {
      tickets: filtered,
      stats: mockStats,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 100,
        total: filtered.length,
        totalPages: 1
      }
    };
  }
};

// Get ticket by ID with full details and message history
export const getTicketById = async (id) => {
  try {
    console.log(`Fetching ticket details for: ${id}`);
    
    const response = await api.get(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id));
    
    console.log(`Loaded ticket ${id} with ${response.data?.messages?.length || 0} messages`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, using mock data for ticket ${id}`);
    
    // Return mock ticket
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      return mockTicket;
    }
    
    throw new Error(`Ticket ${id} not found`);
  }
};

// Update ticket status
export const updateTicketStatus = async (id, status) => {
  try {
    console.log(`Updating ticket ${id} status to: ${status}`);
    
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      status,
    });
    
    console.log(`Ticket ${id} status updated successfully`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, simulating status update for ticket ${id}`);
    
    // Simulate success for demo purposes
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      mockTicket.status = status;
      mockTicket.updatedAt = new Date();
      return mockTicket;
    }
    
    throw error;
  }
};

// Assign ticket to admin/team
export const assignTicket = async (id, adminId) => {
  try {
    console.log(`Assigning ticket ${id} to admin: ${adminId}`);
    
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      assignedTo: adminId,
    });
    
    console.log(`Ticket ${id} assigned successfully`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, simulating assignment for ticket ${id}`);
    
    // Simulate success for demo purposes
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      mockTicket.assignedToId = adminId;
      mockTicket.assignedTo = adminId; // In real scenario, fetch admin name
      mockTicket.updatedAt = new Date();
      return mockTicket;
    }
    
    throw error;
  }
};

// Reply to ticket (customer-facing message)
export const replyToTicket = async (id, message) => {
  try {
    console.log(`Sending reply to ticket ${id}`);
    
    const response = await api.post(
      API_ENDPOINTS.TICKET_NOTES.replace(':id', id),
      { 
        message, 
        isInternal: false 
      }
    );
    
    console.log(`Reply sent to ticket ${id} successfully`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, simulating reply for ticket ${id}`);
    
    // Simulate success for demo purposes
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      mockTicket.messages.push({
        sender: 'Admin User',
        senderType: 'admin',
        message: message,
        timestamp: new Date(),
        isInternal: false
      });
      mockTicket.updatedAt = new Date();
      return mockTicket;
    }
    
    throw error;
  }
};

// Add internal note (admin-only, not visible to customer)
export const addTicketNote = async (id, note) => {
  try {
    console.log(`Adding internal note to ticket ${id}`);
    
    const response = await api.post(
      API_ENDPOINTS.TICKET_NOTES.replace(':id', id),
      { 
        note, 
        isInternal: true 
      }
    );
    
    console.log(`Internal note added to ticket ${id} successfully`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, simulating note addition for ticket ${id}`);
    
    // Simulate success for demo purposes
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      mockTicket.messages.push({
        sender: 'Admin User',
        senderType: 'admin',
        message: note,
        timestamp: new Date(),
        isInternal: true
      });
      mockTicket.updatedAt = new Date();
      return mockTicket;
    }
    
    throw error;
  }
};

// Close ticket with optional resolution
export const closeTicket = async (id, resolution = '') => {
  try {
    console.log(`Closing ticket ${id}`);
    
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      status: 'closed',
      resolution,
    });
    
    console.log(`Ticket ${id} closed successfully`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, simulating close for ticket ${id}`);
    
    // Simulate success for demo purposes
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      mockTicket.status = 'closed';
      mockTicket.resolution = resolution;
      mockTicket.updatedAt = new Date();
      return mockTicket;
    }
    
    throw error;
  }
};

// Get ticket statistics
export const getTicketStats = async () => {
  try {
    console.log('Fetching ticket statistics');
    
    const response = await api.get(API_ENDPOINTS.TICKET_STATS);
    
    console.log('Ticket stats:', response.data);
    
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock stats');
    return mockStats;
  }
};

// Update ticket priority
export const updateTicketPriority = async (id, priority) => {
  try {
    console.log(`Updating ticket ${id} priority to: ${priority}`);
    
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      priority,
    });
    
    console.log(`Ticket ${id} priority updated successfully`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, simulating priority update for ticket ${id}`);
    
    const mockTicket = mockTickets.find(t => t._id === id);
    if (mockTicket) {
      mockTicket.priority = priority;
      mockTicket.updatedAt = new Date();
      return mockTicket;
    }
    
    throw error;
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  try {
    console.log('Creating new ticket:', ticketData.subject);
    
    const response = await api.post(API_ENDPOINTS.TICKETS, {
      subject: ticketData.subject,
      description: ticketData.description,
      customerName: ticketData.customerName,
      customerId: ticketData.customerId,
      priority: ticketData.priority || 'medium',
      category: ticketData.category,
    });
    
    console.log('Ticket created successfully:', response.data?._id);
    
    return response.data;
  } catch (error) {
    console.warn('API not available, simulating ticket creation');
    
    const newTicket = {
      _id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      ...ticketData,
      status: 'open',
      assignedTo: null,
      assignedToId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [{
        sender: ticketData.customerName,
        senderType: 'customer',
        message: ticketData.description,
        timestamp: new Date(),
        isInternal: false
      }]
    };
    
    mockTickets.push(newTicket);
    return newTicket;
  }
};

// Get tickets by customer ID
export const getCustomerTickets = async (customerId) => {
  try {
    console.log(`Fetching tickets for customer: ${customerId}`);
    
    const response = await api.get(API_ENDPOINTS.CUSTOMER_TICKETS.replace(':customerId', customerId));
    
    console.log(`Found ${response.data?.length || 0} tickets for customer ${customerId}`);
    
    return response.data;
  } catch (error) {
    console.warn(`API not available, using mock data for customer ${customerId}`);
    return mockTickets.filter(t => t.customerId === customerId);
  }
};

// Get available admins/teams for assignment
export const getAvailableAssignees = async () => {
  try {
    console.log('Fetching available assignees');
    
    const response = await api.get(API_ENDPOINTS.TICKET_ASSIGNEES);
    
    console.log(`Found ${response.data?.length || 0} available assignees`);
    
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock assignees');
    return [
      { id: 'ADMIN-001', name: 'Admin User', role: 'Admin' },
      { id: 'ADMIN-002', name: 'Support Team', role: 'Support' },
      { id: 'ADMIN-003', name: 'Quality Team', role: 'Quality' },
      { id: 'ADMIN-004', name: 'Finance Team', role: 'Finance' },
      { id: 'ADMIN-005', name: 'Tech Support', role: 'Technical' }
    ];
  }
};

// Get ticket categories/types
export const getTicketCategories = async () => {
  try {
    console.log('Fetching ticket categories');
    
    const response = await api.get(API_ENDPOINTS.TICKET_CATEGORIES);
    
    console.log(`Found ${response.data?.length || 0} ticket categories`);
    
    return response.data;
  } catch (error) {
    console.warn('API not available, using default categories');
    return [
      'Order Issue',
      'Payment Issue',
      'Product Quality',
      'Delivery Issue',
      'Account Issue',
      'Technical Support',
      'General Inquiry',
      'Other',
    ];
  }
};

// Export all functions as default
export default {
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  replyToTicket,
  addTicketNote,
  closeTicket,
  getTicketStats,
  updateTicketPriority,
  createTicket,
  getCustomerTickets,
  getAvailableAssignees,
  getTicketCategories,
};