// src/components/common/NotificationPopup.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { handleTeamResponse, getCaseById } from "../../services/api";

export default function NotificationPopup({ notification, onHide }) {
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const fetchDetails = async () => {
      const caseId = notification.request.content.data.caseId;
      if (caseId) {
        const fullCase = await getCaseById(caseId);
        setCaseDetails(fullCase.caseDetails[0]);
      }
    };
    fetchDetails();
  }, [notification, fadeAnim]);

  const onRespond = async (status) => {
    setLoading(true);
    try {
      const { teamId } = notification.request.content.data;
      const personId = notification.request.content.data.personId; // We will add this
      const department = notification.request.content.data.department; // We will add this

      await handleTeamResponse({ teamId, personId, department, status });
      onHide();
    } catch (e) {
      alert("Failed to respond: " + e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons
          name="bell-alert-outline"
          size={30}
          color={COLORS.primary}
          style={{ alignSelf: "center" }}
        />
        <Text style={styles.title}>{notification.request.content.title}</Text>
        <Text style={styles.body}>{notification.request.content.body}</Text>
        <View style={styles.divider} />
        <Text style={styles.details}>
          Subdivision: {caseDetails?.girlSubdivision || "..."}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => onRespond("REJECTED")}
            disabled={loading}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onRespond("ACCEPTED")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.acceptButtonText}>Accept</Text>
            )}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.text_primary,
    marginTop: 10,
  },
  body: {
    fontSize: 15,
    color: COLORS.text_secondary,
    textAlign: "center",
    marginTop: 5,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 15 },
  details: {
    fontSize: 14,
    color: COLORS.text_primary,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around" },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: { color: COLORS.white, fontWeight: "bold" },
  rejectButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.text_secondary,
  },
  rejectButtonText: { color: COLORS.text_secondary, fontWeight: "bold" },
});
