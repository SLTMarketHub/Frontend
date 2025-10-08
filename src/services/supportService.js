import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const getTickets = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.TICKETS, {
      params: {
        status: params.status,
        priority: params.priority,
        search: params.search,
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getTicketById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id));
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

export const updateTicketStatus = async (id, status) => {
  try {
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

export const assignTicket = async (id, adminId) => {
  try {
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      assignedTo: adminId,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning ticket:', error);
    throw error;
  }
};

export const addTicketNote = async (id, note) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.TICKET_NOTES.replace(':id', id),
      { note, isInternal: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding ticket note:', error);
    throw error;
  }
};

export const replyToTicket = async (id, message) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.TICKET_NOTES.replace(':id', id),
      { message, isInternal: false }
    );
    return response.data;
  } catch (error) {
    console.error('Error replying to ticket:', error);
    throw error;
  }
};

export const closeTicket = async (id, resolution) => {
  try {
    const response = await api.patch(API_ENDPOINTS.TICKET_DETAIL.replace(':id', id), {
      status: 'closed',
      resolution,
    });
    return response.data;
  } catch (error) {
    console.error('Error closing ticket:', error);
    throw error;
  }
};

export default {
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  addTicketNote,
  replyToTicket,
  closeTicket,
};