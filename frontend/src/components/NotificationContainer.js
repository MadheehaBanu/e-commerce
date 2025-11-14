import React, { useState, createContext, useContext } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
        {notifications.map((notif, index) => (
          <div key={notif.id} style={{ marginTop: index > 0 ? '10px' : '0' }}>
            <Notification
              message={notif.message}
              type={notif.type}
              onClose={() => removeNotification(notif.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
