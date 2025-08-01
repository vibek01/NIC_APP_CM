// src/Navigation/AppNavigator.js
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av"; // Correct import for Expo SDK 48+
import { useNotification } from "../context/NotificationContext";

// Import all your pages
import WelcomeScreen from "../pages/WelcomeScreen";
import AuthLoadingScreen from "../pages/AuthLoadingScreen";
import LoginScreen from "../pages/Login";
import Home from "../pages/Home";
import ActiveCases from "../pages/ActiveCases";
import Profile from "../pages/Profile";
import NotificationsScreen from "../pages/NotificationsScreen";
import FileCaseScreen from "../pages/FileCaseScreen";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // This will use the default system sound
    shouldSetBadge: true, // Good to badge the app icon
  }),
});

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const navigationRef = useRef();
  const { showNotification } = useNotification();

  useEffect(() => {
    let soundObject = null;

    const playSound = async () => {
      try {
        if (soundObject === null) {
          soundObject = new Audio.Sound();
          await soundObject.loadAsync(require("../../assets/sounds/alarm.mp3"));
        }
        await soundObject.replayAsync();
      } catch (error) {
        console.error("Failed to load or play sound", error);
      }
    };

    // Listener for when a notification is received while the app is running
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
        playSound(); // Play the custom alarm sound
        showNotification(notification);
      });

    // --- MODIFIED LISTENER FOR TAPPING NOTIFICATION ---
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped on notification, navigating...");
        const data = response.notification.request.content.data;

        // Check if there is a caseId in the notification data
        if (data && data.caseId) {
          // Navigate to the ActiveCases screen and pass the caseId as a parameter.
          // The ActiveCases screen can then use this parameter to highlight
          // or directly open the details for this specific case.
          navigationRef.current?.navigate("ActiveCases", {
            highlightCaseId: data.caseId,
          });
        } else {
          // Fallback to the generic notifications screen if no caseId is present
          navigationRef.current?.navigate("Notifications");
        }
      });

    // Cleanup function to unload sound and remove listeners
    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
      soundObject?.unloadAsync();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="FileCase" component={FileCaseScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ActiveCases" component={ActiveCases} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
