import api from '../api';

const adminDashboardService = {
    // Analytics & Reports
    getSalesReport: (period = 'daily') =>
        api.get('/admin/analytics/sales', { params: { period } }).then(r => r.data),

    getTopProducts: (limit = 10) =>
        api.get('/admin/analytics/top-products', { params: { limit } }).then(r => r.data),

    getTopCategories: (limit = 10) =>
        api.get('/admin/analytics/top-categories', { params: { limit } }).then(r => r.data),

    exportReport: (payload = {}, type = 'csv') =>
        api.get('/admin/analytics/export', { 
            params: { type, ...payload }, 
            responseType: 'blob' 
        }).then(r => r.data),

    // Platform Settings
    getSettings: () =>
        api.get('/admin/settings').then(r => r.data),

    updateSettings: (payload) =>
        api.put('/admin/settings', payload).then(r => r.data),

    // Support & Tickets
    listTickets: (params = {}) =>
        api.get('/admin/tickets', { params }).then(r => r.data),

    getTicket: (id) =>
        api.get(`/admin/tickets/${id}`).then(r => r.data),

    updateTicket: (id, payload) =>
        api.put(`/admin/tickets/${id}`, payload).then(r => r.data),

    addTicketNote: (id, note) =>
        api.post(`/admin/tickets/${id}/notes`, { note }).then(r => r.data),

    assignTicket: (id, assigneeId) =>
        api.put(`/admin/tickets/${id}/assign`, { assigneeId }).then(r => r.data),

    closeTicket: (id, resolution) =>
        api.put(`/admin/tickets/${id}/close`, { resolution }).then(r => r.data),
};

export default adminDashboardService;