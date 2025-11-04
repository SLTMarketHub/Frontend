import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      notificationId: 'notif-001',
      customerId: 'cust-123',
      type: 'OrderConfirmation',
      channel: 'Email',
      message: 'Your order #ORD-12345 has been confirmed and is being processed.',
      sentAt: '2024-01-15T10:30:00Z',
      status: 'Sent',
      read: false
    },
    {
      notificationId: 'notif-002',
      customerId: 'cust-123',
      type: 'Promotion',
      channel: 'SMS',
      message: 'Special offer: 20% off on all mobile plans this week!',
      sentAt: '2024-01-14T14:15:00Z',
      status: 'Sent',
      read: false
    },
    {
      notificationId: 'notif-003',
      customerId: 'cust-123',
      type: 'Alert',
      channel: 'PushNotification',
      message: 'Your service activation is complete. Welcome to TelcoMarket!',
      sentAt: '2024-01-13T09:45:00Z',
      status: 'Sent',
      read: true
    }
  ]);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      notificationId: `notif-${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.notificationId === notificationId 
          ? { ...n, read: true }
          : n
      )
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};