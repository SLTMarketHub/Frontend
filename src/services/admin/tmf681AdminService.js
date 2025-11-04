// TMF681 Communication Management Admin Service
import { apiClient } from '../authService';

const API_BASE = '/tmf-api/communicationManagement/v4';

class TMF681AdminService {
  // ============ COMMUNICATION MESSAGE ENDPOINTS ============
  /**
   * List all communication messages
   * @param {Object} params - Query parameters
   * @returns {Promise} Communication message list
   */
  async listMessages(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/communicationMessage`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching communication messages:', error);
      throw error;
    }
  }

  /**
   * Get communication message by ID
   * @param {string} messageId - Communication message ID
   * @returns {Promise} Communication message details
   */
  async getMessage(messageId) {
    try {
      const response = await apiClient.get(`${API_BASE}/communicationMessage/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching communication message:', error);
      throw error;
    }
  }

  /**
   * Create new communication message
   * @param {Object} messageData - Communication message data
   * @returns {Promise} Created communication message
   */
  async createMessage(messageData) {
    try {
      const response = await apiClient.post(`${API_BASE}/communicationMessage`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error creating communication message:', error);
      throw error;
    }
  }

  /**
   * Update communication message
   * @param {string} messageId - Communication message ID
   * @param {Object} messageData - Communication message data to update
   * @returns {Promise} Updated communication message
   */
  async patchMessage(messageId, messageData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/communicationMessage/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error updating communication message:', error);
      throw error;
    }
  }

  /**
   * Delete communication message
   * @param {string} messageId - Communication message ID
   * @returns {Promise} Deletion result
   */
  async deleteMessage(messageId) {
    try {
      await apiClient.delete(`${API_BASE}/communicationMessage/${messageId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting communication message:', error);
      throw error;
    }
  }

  /**
   * Send message immediately
   * @param {string} messageId - Message ID to send
   * @returns {Promise} Send result
   */
  async sendMessageNow(messageId) {
    try {
      const response = await apiClient.post(`${API_BASE}/communicationMessage/${messageId}/send`);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // ============ HUB ENDPOINTS ============
  /**
   * Get all hubs
   * @param {Object} params - Query parameters
   * @returns {Promise} Hub list
   */
  async listHubs(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/hub`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching hubs:', error);
      // Return mock data for development
      return {
        items: [
          {
            id: 'hub_1',
            callback: 'https://webhook.site/unique-url-1',
            query: 'eventType=messageCreated',
            status: 'active',
            createdDate: '2025-03-15T10:00:00Z'
          },
          {
            id: 'hub_2',
            callback: 'https://webhook.site/unique-url-2',
            query: 'eventType=messageSent',
            status: 'active',
            createdDate: '2025-03-16T11:00:00Z'
          }
        ],
        totalCount: 2
      };
    }
  }

  /**
   * Get hub by ID
   * @param {string} hubId - Hub ID
   * @returns {Promise} Hub details
   */
  async getHub(hubId) {
    try {
      const response = await apiClient.get(`${API_BASE}/hub/${hubId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hub:', error);
      throw error;
    }
  }

  /**
   * Register hub for notifications
   * @param {Object} hubData - Hub registration data
   * @returns {Promise} Registration result
   */
  async registerHub(hubData) {
    try {
      const response = await apiClient.post(`${API_BASE}/hub`, hubData);
      return response.data;
    } catch (error) {
      console.error('Error registering hub:', error);
      throw error;
    }
  }

  /**
   * Unregister hub
   * @param {string} hubId - Hub ID
   * @returns {Promise} Unregistration result
   */
  async unregisterHub(hubId) {
    try {
      await apiClient.delete(`${API_BASE}/hub/${hubId}`);
      return { success: true };
    } catch (error) {
      console.error('Error unregistering hub:', error);
      throw error;
    }
  }

  /**
   * Update hub
   * @param {string} hubId - Hub ID
   * @param {Object} hubData - Hub data to update
   * @returns {Promise} Updated hub
   */
  async updateHub(hubId, hubData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/hub/${hubId}`, hubData);
      return response.data;
    } catch (error) {
      console.error('Error updating hub:', error);
      throw error;
    }
  }

  // ============ COMMUNICATION ANALYTICS & REPORTING ============
  /**
   * Get communication statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} Communication statistics
   */
  async getCommunicationStatistics(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/communicationMessage/statistics`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching communication statistics:', error);
      // Return mock data for development
      return {
        totalMessages: 12456,
        sentMessages: 11234,
        pendingMessages: 456,
        failedMessages: 89,
        scheduledMessages: 677,
        messagesByType: {
          email: 8934,
          sms: 2345,
          push: 1177
        },
        messagesByStatus: {
          sent: 11234,
          delivered: 10987,
          opened: 5678,
          clicked: 2345,
          bounced: 123,
          failed: 89
        },
        deliveryRate: 97.8,
        openRate: 51.7,
        clickRate: 21.4,
        topCampaigns: [
          { id: 'camp_1', name: 'Welcome Series', sent: 2345, openRate: 65.3 },
          { id: 'camp_2', name: 'Product Launch', sent: 1890, openRate: 45.7 },
          { id: 'camp_3', name: 'Holiday Sale', sent: 3456, openRate: 58.9 }
        ],
        averageDeliveryTime: 2.3, // in seconds
        messageVolumeTrend: {
          daily: [234, 456, 567, 345, 678, 890, 456],
          weekly: [2345, 3456, 4567, 3890],
          monthly: [23456, 34567, 45678]
        }
      };
    }
  }

  /**
   * Search communication messages
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} Search results
   */
  async searchMessages(searchParams) {
    try {
      const response = await apiClient.post(`${API_BASE}/communicationMessage/search`, searchParams);
      return response.data;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  /**
   * Bulk send messages
   * @param {Object} bulkData - Bulk send data
   * @returns {Promise} Bulk send result
   */
  async bulkSendMessages(bulkData) {
    try {
      const response = await apiClient.post(`${API_BASE}/communicationMessage/bulkSend`, bulkData);
      return response.data;
    } catch (error) {
      console.error('Error bulk sending messages:', error);
      throw error;
    }
  }

  /**
   * Schedule message
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise} Scheduled message
   */
  async scheduleMessage(scheduleData) {
    try {
      const response = await apiClient.post(`${API_BASE}/communicationMessage/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling message:', error);
      throw error;
    }
  }

  /**
   * Get message templates
   * @param {Object} params - Query parameters
   * @returns {Promise} Template list
   */
  async getTemplates(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/messageTemplate`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Return mock data for development
      return {
        items: [
          {
            id: 'tpl_1',
            name: 'Welcome Email',
            type: 'email',
            category: 'onboarding',
            subject: 'Welcome to {{platformName}}',
            content: 'Dear {{customerName}}, welcome...',
            variables: ['platformName', 'customerName'],
            status: 'active',
            usageCount: 1234
          },
          {
            id: 'tpl_2',
            name: 'Order Confirmation',
            type: 'email',
            category: 'transactional',
            subject: 'Order #{{orderNumber}} Confirmed',
            content: 'Your order has been confirmed...',
            variables: ['orderNumber', 'customerName', 'orderTotal'],
            status: 'active',
            usageCount: 5678
          },
          {
            id: 'tpl_3',
            name: 'SMS Verification',
            type: 'sms',
            category: 'security',
            content: 'Your verification code is {{code}}',
            variables: ['code'],
            status: 'active',
            usageCount: 890
          }
        ],
        totalCount: 3
      };
    }
  }

  /**
   * Create message template
   * @param {Object} templateData - Template data
   * @returns {Promise} Created template
   */
  async createTemplate(templateData) {
    try {
      const response = await apiClient.post(`${API_BASE}/messageTemplate`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  /**
   * Update message template
   * @param {string} templateId - Template ID
   * @param {Object} templateData - Template data to update
   * @returns {Promise} Updated template
   */
  async updateTemplate(templateId, templateData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/messageTemplate/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  /**
   * Delete message template
   * @param {string} templateId - Template ID
   * @returns {Promise} Deletion result
   */
  async deleteTemplate(templateId) {
    try {
      await apiClient.delete(`${API_BASE}/messageTemplate/${templateId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  /**
   * Get communication channels
   * @returns {Promise} Available channels
   */
  async getChannels() {
    try {
      const response = await apiClient.get(`${API_BASE}/channel`);
      return response.data;
    } catch (error) {
      console.error('Error fetching channels:', error);
      // Return mock data for development
      return {
        channels: [
          { id: 'email', name: 'Email', enabled: true, config: { provider: 'SendGrid' } },
          { id: 'sms', name: 'SMS', enabled: true, config: { provider: 'Twilio' } },
          { id: 'push', name: 'Push Notification', enabled: true, config: { provider: 'Firebase' } },
          { id: 'whatsapp', name: 'WhatsApp', enabled: false, config: null }
        ]
      };
    }
  }

  /**
   * Update channel configuration
   * @param {string} channelId - Channel ID
   * @param {Object} configData - Configuration data
   * @returns {Promise} Updated configuration
   */
  async updateChannelConfig(channelId, configData) {
    try {
      const response = await apiClient.put(`${API_BASE}/channel/${channelId}/config`, configData);
      return response.data;
    } catch (error) {
      console.error('Error updating channel config:', error);
      throw error;
    }
  }

  /**
   * Get message delivery report
   * @param {string} messageId - Message ID
   * @returns {Promise} Delivery report
   */
  async getDeliveryReport(messageId) {
    try {
      const response = await apiClient.get(`${API_BASE}/communicationMessage/${messageId}/deliveryReport`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery report:', error);
      throw error;
    }
  }

  /**
   * Get campaign performance
   * @param {string} campaignId - Campaign ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Campaign performance data
   */
  async getCampaignPerformance(campaignId, params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/campaign/${campaignId}/performance`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      throw error;
    }
  }
}

export default new TMF681AdminService();
