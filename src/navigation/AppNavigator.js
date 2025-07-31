// src/Navigation/AppNavigator.js
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-audio"; // ✅ FIXED: Import from the new audio library
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
    shouldSetBadge: false,
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
          // Make sure you have an alarm.mp3 file in your assets/sounds folder
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
        playSound();
        showNotification(notification);
      });

    // Listener for when a user taps on a notification
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped on notification:", response);
        navigationRef.current?.navigate("Notifications");
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
