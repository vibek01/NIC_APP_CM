// src/Navigation/AppNavigator.js
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import { useNotification } from "../context/NotificationContext";
import * as Notifications from "expo-notifications";
import { navigate } from "./RootNavigation"; // Import the navigate function

// Import all your pages
import AuthLoadingScreen from "../pages/AuthLoadingScreen";
import WelcomeScreen from "../pages/WelcomeScreen";
import FileCaseScreen from "../pages/FileCaseScreen";
import LoginScreen from "../pages/Login";
import Home from "../pages/Home";
import ActiveCases from "../pages/ActiveCases";
import Profile from "../pages/Profile";
import NotificationsScreen from "../pages/NotificationsScreen";

const Stack = createNativeStackNavigator();

// ✅ NEW: This component contains the screens ONLY a logged-in user can see.
// It also contains the foreground notification handler.
const AuthenticatedStack = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    // This listener is now ONLY active when the user is logged in.
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "AuthenticatedStack: Foreground notification received. Telling context to handle it."
        );
        showNotification(notification);
      });

    // This listener handles TAPPING a background notification.
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "AuthenticatedStack: User tapped on notification, navigating..."
        );
        const data = response.notification.request.content.data;

        if (data && data.caseId) {
          navigate("ActiveCases", { highlightCaseId: data.caseId });
        } else {
          navigate("Notifications");
        }
      });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, [showNotification]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ActiveCases" component={ActiveCases} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

// This component contains the screens anyone can see.
const UnauthenticatedStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="FileCase" component={FileCaseScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { userId, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading screen while we check for a user session.
    return <AuthLoadingScreen />;
  }

  return (
    // If a userId exists, show the authenticated screens.
    // Otherwise, show the public screens.
    userId ? <AuthenticatedStack /> : <UnauthenticatedStack />
  );
}
