// src/pages/NotificationsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/colors";
import {
  getPendingResponses,
  getCaseById,
  handleTeamResponse,
} from "../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NotificationCard = ({ notification, caseDetails, onRespond }) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async (status) => {
    setLoading(true);
    await onRespond(notification, status);
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>New Case Assignment</Text>
      <Text style={styles.cardSubtitle}>
        You have been requested to join the response team.
      </Text>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={16}
          color={COLORS.text_secondary}
        />
        <Text style={styles.detailText}>
          Subdivision: {caseDetails?.girlSubdivision || "Loading..."}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialCommunityIcons
          name="calendar-alert"
          size={16}
          color={COLORS.text_secondary}
        />
        <Text style={styles.detailText}>
          Marriage Date:{" "}
          {caseDetails
            ? new Date(caseDetails.marriageDate).toLocaleDateString()
            : "Loading..."}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handlePress("REJECTED")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.alert_text} />
          ) : (
            <Text style={styles.rejectButtonText}>Reject</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handlePress("ACCEPTED")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.acceptButtonText}>Accept</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("Authentication error");

      const allPending = await getPendingResponses();
      const myPending = allPending.filter((p) => p.personId === userId);

      if (myPending.length === 0) {
        setNotifications([]);
        return;
      }

      const caseIds = [...new Set(myPending.map((p) => p.caseId))];
      const caseDetailsPromises = caseIds.map((id) => getCaseById(id));
      const casesData = await Promise.all(caseDetailsPromises);
      const casesMap = casesData.reduce((acc, caseInfo) => {
        acc[caseInfo.id] = caseInfo.caseDetails[0];
        return acc;
      }, {});

      const enrichedNotifications = myPending.map((p) => ({
        ...p,
        caseDetails: casesMap[p.caseId],
      }));

      setNotifications(enrichedNotifications);
    } catch (e) {
      setError("Failed to load notifications. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handleRespond = async (notification, status) => {
    try {
      const userData = await AsyncStorage.multiGet(["userId", "department"]);
      const sessionData = Object.fromEntries(userData);

      await handleTeamResponse({
        teamId: notification.teamId,
        personId: sessionData.userId,
        department: notification.department,
        status: status,
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      Alert.alert(
        "Response Submitted",
        `You have successfully ${status.toLowerCase()}ed the assignment.`
      );
    } catch (e) {
      Alert.alert("Error", e.message || "Could not submit your response.");
    }
  };

  const renderContent = () => {
    if (loading)
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    if (error)
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    return (
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            caseDetails={item.caseDetails}
            onRespond={handleRespond}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              You have no pending notifications.
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.text_primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Pending Assignments</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  backButton: { marginRight: 15, padding: 5 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text_primary },
  list: { padding: 20 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { fontSize: 16, color: COLORS.alert_text, textAlign: "center" },
  emptyText: {
    fontSize: 16,
    color: COLORS.text_secondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text_primary },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.text_secondary,
    marginTop: 4,
    marginBottom: 15,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  detailText: { marginLeft: 8, color: COLORS.text_primary, fontSize: 14 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  acceptButtonText: { color: COLORS.white, fontWeight: "bold" },
  rejectButton: {
    borderWidth: 1,
    borderColor: COLORS.alert_text,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rejectButtonText: { color: COLORS.alert_text, fontWeight: "bold" },
});
