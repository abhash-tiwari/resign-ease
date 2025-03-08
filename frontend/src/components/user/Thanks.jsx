import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell, Loader2, Check } from 'lucide-react';
import api from "../../services/api"

const Thanks = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await api.get('/user/notifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="ml-2 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 mt-1">
              {error === 'Authentication required' 
                ? 'Please login to view your notifications' 
                : error === 'Unauthorized access'
                ? 'Your session has expired. Please login again.'
                : 'Unable to load notifications. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <Bell className="h-5 w-5 text-gray-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-gray-800 font-medium">No Notifications</h3>
            <p className="text-gray-700 mt-1">
              You don't have any notifications at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {notifications.map((notification) => (
        <div 
          key={notification._id}
          className={`bg-white border rounded-lg p-4 shadow ${
            !notification.read ? 'border-blue-200' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start">
            <div className={`rounded-full p-1 ${
              !notification.read ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {notification.read ? (
                <Check className="h-4 w-4 text-gray-600" />
              ) : (
                <Bell className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-gray-900 font-medium">{notification.title}</h3>
                <span className="text-xs text-gray-500">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{notification.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Thanks;