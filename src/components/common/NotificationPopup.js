// src/components/common/NotificationPopup.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// This is a simplified and updated notification popup.
// It acts as an "alarm" to inform the user, as requested.
export default function NotificationPopup({ notification, onHide }) {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // This function handles what happens when the user taps "View Case".
  const handleViewCase = () => {
    const caseId = notification.request.content.data.caseId;

    // First, hide this popup.
    onHide();

    // If a caseId was sent in the notification, navigate to the ActiveCases screen.
    if (caseId) {
      navigation.navigate("ActiveCases", { highlightCaseId: caseId });
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons
          name="bell-alert-outline"
          size={32}
          color={COLORS.primary}
          style={{ alignSelf: "center" }}
        />
        <Text style={styles.title}>
          {notification.request.content.title || "New Notification"}
        </Text>
        <Text style={styles.body}>
          {notification.request.content.body || "You have a new update."}
        </Text>

        <View style={styles.divider} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.dismissButton} onPress={onHide}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton} onPress={handleViewCase}>
            <Text style={styles.viewButtonText}>View Case</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 10,
  },
  body: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  viewButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  dismissButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  dismissButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
});
