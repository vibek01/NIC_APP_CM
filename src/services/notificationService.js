// src/services/notificationService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { registerPushToken } from "./api";

export async function registerForPushNotificationsAsync() {
  let token;
  if (!Device.isDevice) {
    console.warn("Push Notifications require a physical device.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("User did not grant permission for push notifications.");
    return null;
  }

  try {
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "d26437b2-46e1-44dc-9587-4221a277e9d1",
      })
    ).data;
    console.log("Acquired Expo Push Token:", token);
  } catch (e) {
    console.error("Failed to get Expo push token", e);
    return null;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "Default notifications",
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    Notifications.setNotificationChannelAsync("alarm-channel", {
      name: "High Priority Alarms",
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm.mp3",
    });
  }

  if (token) {
    await registerPushToken(token);
  }

  return token;
}
