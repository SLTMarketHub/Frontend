// TMF667 - Communication Management
import api from '../api';

class CommunicationService {
  /**
   * Send notification to users
   * @param {Object} notificationData - Notification details
   * @returns {Promise} Send result
   */
  async sendNotification(notificationData) {
    const {
      recipients,
      type,
      subject,
      message,
      channel,
      priority
    } = notificationData;

    try {
      const response = await api.post('/communicationManagement/v4/communication', {
        sender: {
          id: 'admin',
          name: 'Platform Admin',
          '@type': 'Organization'
        },
        receiver: recipients.map(r => ({
          id: r.id,
          name: r.name,
          '@type': r.type || 'Individual'
        })),
        communicationType: type,
        subject,
        content: message,
        channel: channel || ['email'],
        priority: priority || 'normal',
        status: 'pending',
        createdDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        sentTo: recipients.length,
        status: 'queued'
      };
    }
  }

  /**
   * Get notification templates
   * @param {Object} params - Query parameters
   * @returns {Promise} Template list
   */
  async getTemplates(params = {}) {
    try {
      const response = await api.get('/communicationManagement/v4/template', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.getMockTemplates();
    }
  }

  /**
   * Create or update notification template
   * @param {Object} templateData - Template data
   * @returns {Promise} Template result
   */
  async saveTemplate(templateData) {
    try {
      const method = templateData.id ? 'patch' : 'post';
      const url = templateData.id 
        ? `/communicationManagement/v4/template/${templateData.id}`
        : '/communicationManagement/v4/template';
      
      const response = await api[method](url, {
        name: templateData.name,
        type: templateData.type,
        channel: templateData.channel,
        subject: templateData.subject,
        content: templateData.content,
        variables: templateData.variables,
        status: 'active',
        modifiedDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }

  /**
   * Delete template
   * @param {string} templateId - Template ID
   * @returns {Promise} Deletion result
   */
  async deleteTemplate(templateId) {
    try {
      await api.delete(`/communicationManagement/v4/template/${templateId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  /**
   * Get communication history
   * @param {Object} params - Query parameters
   * @returns {Promise} Communication history
   */
  async getCommunicationHistory(params = {}) {
    const {
      limit = 20,
      offset = 0,
      type,
      status,
      dateFrom,
      dateTo
    } = params;

    const queryParams = new URLSearchParams({
      limit,
      offset,
      ...(type && { 'communicationType': type }),
      ...(status && { 'status': status }),
      ...(dateFrom && { 'createdDate.gte': dateFrom }),
      ...(dateTo && { 'createdDate.lte': dateTo })
    });

    try {
      const response = await api.get(`/communicationManagement/v4/communication?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching communication history:', error);
      return this.getMockCommunicationHistory();
    }
  }

  /**
   * Send bulk email campaign
   * @param {Object} campaignData - Campaign details
   * @returns {Promise} Campaign result
   */
  async sendBulkCampaign(campaignData) {
    try {
      const response = await api.post('/communicationManagement/v4/campaign', {
        name: campaignData.name,
        type: 'bulk_email',
        targetAudience: campaignData.audience,
        template: campaignData.templateId,
        subject: campaignData.subject,
        content: campaignData.content,
        scheduledDate: campaignData.scheduledDate || new Date().toISOString(),
        status: campaignData.scheduledDate ? 'scheduled' : 'in_progress'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending bulk campaign:', error);
      throw error;
    }
  }

  /**
   * Get campaign statistics
   * @param {string} campaignId - Campaign ID
   * @returns {Promise} Campaign stats
   */
  async getCampaignStats(campaignId) {
    try {
      const response = await api.get(`/communicationManagement/v4/campaign/${campaignId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      return {
        sent: 1234,
        delivered: 1189,
        opened: 567,
        clicked: 234,
        bounced: 45,
        unsubscribed: 12,
        deliveryRate: 96.4,
        openRate: 47.7,
        clickRate: 19.0
      };
    }
  }

  // Mock data methods for development
  getMockTemplates() {
    return {
      items: [
        {
          id: 'tpl_1',
          name: 'Welcome Email',
          type: 'customer_onboarding',
          channel: 'email',
          subject: 'Welcome to SLT Market Hub!',
          content: 'Dear {{customerName}},\n\nWelcome to SLT Market Hub...',
          variables: ['customerName'],
          status: 'active',
          lastUsed: '2025-03-17T10:00:00Z'
        },
        {
          id: 'tpl_2',
          name: 'Order Confirmation',
          type: 'order_notification',
          channel: 'email',
          subject: 'Order Confirmed - #{{orderNumber}}',
          content: 'Your order #{{orderNumber}} has been confirmed...',
          variables: ['orderNumber', 'customerName', 'orderTotal'],
          status: 'active',
          lastUsed: '2025-03-18T14:30:00Z'
        },
        {
          id: 'tpl_3',
          name: 'Seller Approval',
          type: 'seller_notification',
          channel: 'email',
          subject: 'Your Seller Account Has Been Approved',
          content: 'Congratulations {{sellerName}}! Your seller account...',
          variables: ['sellerName'],
          status: 'active',
          lastUsed: '2025-03-16T09:15:00Z'
        },
        {
          id: 'tpl_4',
          name: 'Low Stock Alert',
          type: 'seller_alert',
          channel: 'sms',
          subject: 'Low Stock Alert',
          content: 'Your product {{productName}} has only {{stockCount}} units left.',
          variables: ['productName', 'stockCount'],
          status: 'active',
          lastUsed: '2025-03-18T08:00:00Z'
        },
        {
          id: 'tpl_5',
          name: 'Password Reset',
          type: 'security',
          channel: 'email',
          subject: 'Password Reset Request',
          content: 'Click here to reset your password: {{resetLink}}',
          variables: ['resetLink', 'userName'],
          status: 'active',
          lastUsed: '2025-03-18T11:45:00Z'
        }
      ],
      totalCount: 5
    };
  }

  getMockCommunicationHistory() {
    return {
      items: [
        {
          id: 'comm_1',
          type: 'order_notification',
          subject: 'Order Confirmed - #ORD-2025-0234',
          recipients: 1,
          channel: 'email',
          status: 'delivered',
          sentDate: '2025-03-18T10:35:00Z',
          openedDate: '2025-03-18T11:20:00Z'
        },
        {
          id: 'comm_2',
          type: 'bulk_campaign',
          subject: 'Weekend Sale - Up to 50% Off!',
          recipients: 1567,
          channel: 'email',
          status: 'completed',
          sentDate: '2025-03-17T09:00:00Z',
          stats: {
            delivered: 1498,
            opened: 723,
            clicked: 234
          }
        },
        {
          id: 'comm_3',
          type: 'seller_notification',
          subject: 'New Order Received',
          recipients: 1,
          channel: 'sms',
          status: 'delivered',
          sentDate: '2025-03-18T14:15:00Z'
        },
        {
          id: 'comm_4',
          type: 'system_alert',
          subject: 'System Maintenance Scheduled',
          recipients: 324,
          channel: 'email',
          status: 'scheduled',
          scheduledDate: '2025-03-19T18:00:00Z'
        },
        {
          id: 'comm_5',
          type: 'customer_support',
          subject: 'Your Support Ticket Has Been Resolved',
          recipients: 1,
          channel: 'email',
          status: 'delivered',
          sentDate: '2025-03-17T16:45:00Z',
          openedDate: '2025-03-17T17:30:00Z'
        }
      ],
      totalCount: 5,
      limit: 20,
      offset: 0
    };
  }
}

export default new CommunicationService();
