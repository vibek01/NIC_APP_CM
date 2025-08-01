// src/services/notificationService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { registerPushToken } from "./api"; // <-- Import the new function from api.js

export async function registerForPushNotificationsAsync() {
  let token;
  if (!Device.isDevice) {
    // Alert is commented out as it can be annoying in simulators.
    // console.log("Push notifications require a physical device.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Ask for permission if not already granted.
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If permission is not granted after asking, exit.
  if (finalStatus !== "granted") {
    console.log("User did not grant permission for push notifications.");
    return null;
  }

  // Get the Expo push token.
  try {
    token = (
      await Notifications.getExpoPushTokenAsync({
        // You can get your project ID from app.json or by running `npx expo config --json | jq .expo.projectId`
        // It's recommended to add it here.
        // projectId: 'YOUR_PROJECT_ID',
      })
    ).data;
    console.log("Acquired Expo Push Token:", token);
  } catch (e) {
    console.error("Failed to get Expo push token", e);
    return null;
  }

  // Set notification channel for Android.
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // --- MODIFIED PART ---
  // Save the token to your backend via the api service.
  if (token) {
    await registerPushToken(token);
  }

  return token;
}
