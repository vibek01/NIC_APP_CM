// src/context/NotificationContext.js
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import NotificationPopup from "../components/common/NotificationPopup";
import AlarmSoundPlayer from "../components/common/AlarmSoundPlayer"; // Import the player

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  // ✅ THE FIX: The context now directly owns the "remote control" (ref) for the sound player.
  const alarmPlayerRef = useRef(null);

  const showNotification = useCallback((notificationData) => {
    console.log("Context: Showing notification and playing sound...");
    setNotification(notificationData);
    // Directly tell the player to play.
    alarmPlayerRef.current?.play();
  }, []);

  const hideNotification = useCallback(() => {
    console.log("Context: Hiding notification and stopping sound...");
    setNotification(null);
    // ✅ THE FIX: The same function that hides the popup now DIRECTLY stops the sound.
    // This link is unbreakable.
    alarmPlayerRef.current?.stop();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {/* The invisible sound player is rendered here, attached to the ref */}
      <AlarmSoundPlayer ref={alarmPlayerRef} />

      {children}

      {/* The popup is rendered here. When it calls onHide, it triggers the function above. */}
      {notification && (
        <NotificationPopup
          notification={notification}
          onHide={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
