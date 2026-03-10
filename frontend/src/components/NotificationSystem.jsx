import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const notification = {
        id: Date.now(),
        message: event.detail.message,
        type: event.detail.type || 'success',
        duration: event.detail.duration || 4000
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, notification.duration);
    };

    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <i className={`bi ${
              notification.type === 'success' ? 'bi-check-circle' :
              notification.type === 'error' ? 'bi-x-circle' :
              notification.type === 'warning' ? 'bi-exclamation-triangle' :
              'bi-info-circle'
            } me-2`}></i>
            {notification.message}
          </div>
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;