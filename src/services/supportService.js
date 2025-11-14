/*
Support Service - Connected to TMF681 Communication Management API

Uses TMF681 communicationMessage endpoint as support ticket system:
- category: 'support-ticket' for filtering
- subject: ticket subject
- content: ticket description
- state: ticket status (open, pending, closed, etc.)
- priority: ticket priority
- sender: customer information
- receiver: assigned admin/team
*/

import { axiosInstance } from "./axiosInstance";
import { 
  API_ENDPOINTS, 
  TMF_MESSAGE_CATEGORIES,
  TMF_STATE_MAPPING,
  TICKET_TO_TMF_STATE 
} from "../utils/constants";

// Map TMF681 states to ticket statuses using constants
const mapTMFStateToTicketStatus = (tmfState) => {
  return TMF_STATE_MAPPING[tmfState] || 'open';
};

// Map ticket status back to TMF state using constants
const mapTicketStatusToTMFState = (ticketStatus) => {
  return TICKET_TO_TMF_STATE[ticketStatus] || 'pending';
};

// Calculate statistics from tickets
const calculateStats = (tickets) => {
  const stats = {
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    total: tickets.length,
    avgResponseTime: '2.5 hours' // Would need timestamp calculation
  };
  
  tickets.forEach(ticket => {
    if (ticket.status === 'open') stats.open++;
    else if (ticket.status === 'in_progress') stats.inProgress++;
    else if (ticket.status === 'resolved') stats.resolved++;
    else if (ticket.status === 'closed') stats.closed++;
  });
  
  return stats;
};

// Get all tickets with optional filters
export const getTickets = async (params = {}) => {
  try {
    console.log('Fetching tickets from TMF681 Communication Management API');
    
    const queryParams = {
      category: 'support-ticket', // Filter for support tickets
    };
    
    // Add status filter if provided
    if (params.status && params.status !== 'all') {
      queryParams.state = mapTicketStatusToTMFState(params.status);
    }
    
    // Add priority filter if provided
    if (params.priority && params.priority !== 'all') {
      queryParams.priority = params.priority;
    }
    
    const response = await axiosInstance.get(
      'communicationManagement/v4/communicationMessage',
      { params: queryParams }
    );
    
    const messages = Array.isArray(response.data) ? response.data : [];
    console.log(`Found ${messages.length} support tickets from API`);
    
    // Transform TMF681 messages to ticket format
    let tickets = messages.map(msg => ({
      _id: msg.id || msg._id,
      subject: msg.subject || 'No Subject',
      description: msg.content || msg.description || '',
      status: mapTMFStateToTicketStatus(msg.state),
      priority: msg.priority || 'medium',
      customerName: msg.sender?.name || 'Unknown Customer',
      customerId: msg.sender?.id || msg.sender?.['@referredType'],
      assignedTo: msg.receiver?.[0]?.name || 'Unassigned',
      assignedToId: msg.receiver?.[0]?.id,
      createdAt: msg.sendTime || msg.createdAt || new Date(),
      updatedAt: msg.updatedAt || msg.sendTime || new Date(),
      category: msg.characteristic?.find(c => c.name === 'category')?.value || 'General',
      messageType: msg.messageType,
      messages: [] // Would need separate call to get message thread
    }));
    
    // Apply client-side search filter if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.subject.toLowerCase().includes(searchLower) ||
        t.customerName.toLowerCase().includes(searchLower) ||
        t._id.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    const stats = calculateStats(tickets);
    
    return {
      tickets,
      stats,
      pagination: {
        page: 1,
        limit: tickets.length,
        total: tickets.length,
        totalPages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching tickets from TMF681 API:', error);
    throw error;
  }
};

// Get ticket by ID with full details
export const getTicketById = async (id) => {
  try {
    console.log(`Fetching ticket details for: ${id}`);
    
    const response = await axiosInstance.get(
      `communicationManagement/v4/communicationMessage/${id}`
    );
    
    const msg = response.data;
    
    // Transform to ticket format with message history
    const ticket = {
      _id: msg.id || msg._id,
      subject: msg.subject || 'No Subject',
      description: msg.content || msg.description || '',
      status: mapTMFStateToTicketStatus(msg.state),
      priority: msg.priority || 'medium',
      customerName: msg.sender?.name || 'Unknown Customer',
      customerId: msg.sender?.id,
      assignedTo: msg.receiver?.[0]?.name || 'Unassigned',
      assignedToId: msg.receiver?.[0]?.id,
      createdAt: msg.sendTime || msg.createdAt,
      updatedAt: msg.updatedAt || msg.sendTime,
      category: msg.characteristic?.find(c => c.name === 'category')?.value || 'General',
      // Build message thread from attachment or characteristic
      messages: [
        {
          sender: msg.sender?.name || 'Customer',
          senderType: 'customer',
          message: msg.content || msg.description || '',
          timestamp: msg.sendTime || msg.createdAt,
          isInternal: false
        }
      ]
    };
    
    console.log(`Loaded ticket ${id} successfully`);
    
    return ticket;
  } catch (error) {
    console.error(`Error fetching ticket ${id}:`, error);
    throw error;
  }
};

// Update ticket status
export const updateTicketStatus = async (id, status) => {
  try {
    console.log(`Updating ticket ${id} status to: ${status}`);
    
    const tmfState = mapTicketStatusToTMFState(status);
    
    const response = await axiosInstance.patch(
      `communicationManagement/v4/communicationMessage/${id}`,
      {
        state: tmfState
      }
    );
    
    console.log(`Ticket ${id} status updated successfully`);
    
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket ${id} status:`, error);
    throw error;
  }
};

// Assign ticket to admin/team
export const assignTicket = async (id, adminId) => {
  try {
    console.log(`Assigning ticket ${id} to admin: ${adminId}`);
    
    const response = await axiosInstance.patch(
      `communicationManagement/v4/communicationMessage/${id}`,
      {
        receiver: [
          {
            id: adminId,
            '@referredType': 'Admin'
          }
        ]
      }
    );
    
    console.log(`Ticket ${id} assigned successfully`);
    
    return response.data;
  } catch (error) {
    console.error(`Error assigning ticket ${id}:`, error);
    throw error;
  }
};

// Reply to ticket (create new message linked to original)
export const replyToTicket = async (id, message) => {
  try {
    console.log(`Sending reply to ticket ${id}`);
    
    // Create a new communication message as a reply
    const response = await axiosInstance.post(
      'communicationManagement/v4/communicationMessage',
      {
        subject: `Re: Ticket ${id}`,
        content: message,
        messageType: 'Email', // or 'SMS', 'WebMessage'
        state: 'delivered',
        category: 'support-reply',
        relatedParty: [
          {
            id: id,
            role: 'originalTicket',
            '@referredType': 'CommunicationMessage'
          }
        ],
        sender: {
          name: 'Support Team',
          '@referredType': 'Admin'
        },
        characteristic: [
          {
            name: 'isInternal',
            value: 'false'
          }
        ]
      }
    );
    
    console.log(`Reply sent to ticket ${id} successfully`);
    
    return response.data;
  } catch (error) {
    console.error(`Error sending reply to ticket ${id}:`, error);
    throw error;
  }
};

// Add internal note (admin-only note)
export const addTicketNote = async (id, note) => {
  try {
    console.log(`Adding internal note to ticket ${id}`);
    
    // Create a new communication message as internal note
    const response = await axiosInstance.post(
      'communicationManagement/v4/communicationMessage',
      {
        subject: `Internal Note - Ticket ${id}`,
        content: note,
        messageType: 'InternalNote',
        state: 'delivered',
        category: 'support-internal',
        relatedParty: [
          {
            id: id,
            role: 'originalTicket',
            '@referredType': 'CommunicationMessage'
          }
        ],
        sender: {
          name: 'Admin User',
          '@referredType': 'Admin'
        },
        characteristic: [
          {
            name: 'isInternal',
            value: 'true'
          }
        ]
      }
    );
    
    console.log(`Internal note added to ticket ${id} successfully`);
    
    return response.data;
  } catch (error) {
    console.error(`Error adding note to ticket ${id}:`, error);
    throw error;
  }
};

// Close ticket
export const closeTicket = async (id, resolution = '') => {
  try {
    console.log(`Closing ticket ${id}`);
    
    const response = await axiosInstance.patch(
      `communicationManagement/v4/communicationMessage/${id}`,
      {
        state: 'closed',
        characteristic: [
          {
            name: 'resolution',
            value: resolution
          }
        ]
      }
    );
    
    console.log(`Ticket ${id} closed successfully`);
    
    return response.data;
  } catch (error) {
    console.error(`Error closing ticket ${id}:`, error);
    throw error;
  }
};

// Get ticket statistics
export const getTicketStats = async () => {
  try {
    console.log('Calculating ticket statistics');
    
    // Fetch all support tickets
    const result = await getTickets({ status: 'all' });
    
    return result.stats;
  } catch (error) {
    console.error('Error calculating ticket stats:', error);
    // Return default stats
    return {
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      total: 0,
      avgResponseTime: 'N/A'
    };
  }
};

// Update ticket priority
export const updateTicketPriority = async (id, priority) => {
  try {
    console.log(`Updating ticket ${id} priority to: ${priority}`);
    
    const response = await axiosInstance.patch(
      `communicationManagement/v4/communicationMessage/${id}`,
      {
        priority: priority
      }
    );
    
    console.log(`Ticket ${id} priority updated successfully`);
    
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket ${id} priority:`, error);
    throw error;
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  try {
    console.log('Creating new support ticket:', ticketData.subject);
    
    const response = await axiosInstance.post(
      'communicationManagement/v4/communicationMessage',
      {
        subject: ticketData.subject,
        content: ticketData.description,
        messageType: 'Email',
        state: 'pending',
        category: 'support-ticket',
        priority: ticketData.priority || 'medium',
        sender: {
          id: ticketData.customerId,
          name: ticketData.customerName,
          '@referredType': 'Customer'
        },
        characteristic: [
          {
            name: 'ticketCategory',
            value: ticketData.category || 'General'
          }
        ]
      }
    );
    
    console.log('Ticket created successfully:', response.data?.id);
    
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Get tickets by customer ID
export const getCustomerTickets = async (customerId) => {
  try {
    console.log(`Fetching tickets for customer: ${customerId}`);
    
    const response = await axiosInstance.get(
      'communicationManagement/v4/communicationMessage',
      {
        params: {
          category: 'support-ticket',
          'sender.id': customerId
        }
      }
    );
    
    const messages = Array.isArray(response.data) ? response.data : [];
    
    const tickets = messages.map(msg => ({
      _id: msg.id,
      subject: msg.subject,
      status: mapTMFStateToTicketStatus(msg.state),
      priority: msg.priority || 'medium',
      createdAt: msg.sendTime || msg.createdAt,
      updatedAt: msg.updatedAt
    }));
    
    console.log(`Found ${tickets.length} tickets for customer ${customerId}`);
    
    return tickets;
  } catch (error) {
    console.error(`Error fetching customer ${customerId} tickets:`, error);
    throw error;
  }
};

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
};