// src/context/NotificationContext.js
import React, { createContext, useState, useContext } from "react";
import NotificationPopup from "../components/common/NotificationPopup";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (notificationData) => {
    setNotification(notificationData);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      {notification && (
        <NotificationPopup
          notification={notification}
          onHide={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
