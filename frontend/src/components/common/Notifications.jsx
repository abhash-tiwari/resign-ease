import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/user/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/user/notifications/${notificationId}/read`);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className="bg-white shadow-lg rounded-lg p-4 mb-2 max-w-sm animate-fade-in"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{notification.title}</h4>
              <p className="text-gray-600">{notification.message}</p>
            </div>
            <button
              onClick={() => markAsRead(notification._id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;