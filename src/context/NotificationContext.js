// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useCallback } from "react";
import NotificationPopup from "../components/common/NotificationPopup";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  // showNotification is called by the listener in AppNavigator
  // when a push notification is received while the app is in the foreground.
  const showNotification = useCallback((notificationData) => {
    setNotification(notificationData);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      {/* 
        If the 'notification' state is not null, it means we should display
        the popup. We pass the notification data and the function to hide it.
      */}
      {notification && (
        <NotificationPopup
          notification={notification}
          onHide={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
