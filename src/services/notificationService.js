// src/services/notificationService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiClient } from "./apiClient"; // Assuming you have apiClient.js from previous refactor

// This is a new function in api.js we will add
export const savePushToken = async (token) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return; // Don't proceed if user is not logged in

    await apiClient.put(`/persons/${userId}/push-token`, { token });
    console.log("Push token saved successfully for user:", userId);
  } catch (error) {
    console.error("Failed to save push token to backend:", error);
  }
};

export async function registerForPushNotificationsAsync() {
  let token;
  if (!Device.isDevice) {
    alert("Must use physical device for Push Notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  await savePushToken(token); // Save the token to your backend
  return token;
}
