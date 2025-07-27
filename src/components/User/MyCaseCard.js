// src/components/User/MyCaseCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const getStatusInfo = (status) => {
  switch (status) {
    case "PENDING":
      return {
        text: "Pending Review",
        color: COLORS.stat_yellow,
        icon: "clock-time-three-outline",
      };
    case "INVESTIGATING":
      return {
        text: "Under Investigation",
        color: COLORS.stat_blue,
        icon: "magnify-scan",
      };
    case "ACTION_TAKEN":
      return {
        text: "Action Taken",
        color: COLORS.stat_green,
        icon: "check-decagram",
      };
    default:
      return {
        text: "Unknown",
        color: COLORS.text_secondary,
        icon: "help-circle-outline",
      };
  }
};

export default function MyCaseCard({ data }) {
  const statusInfo = getStatusInfo(data.status);

  return (
    <View style={styles.card}>
      <View
        style={[styles.statusBorder, { backgroundColor: statusInfo.color }]}
      />
      <View style={styles.cardContent}>
        <Text style={styles.description}>{data.description}</Text>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={16}
            color={COLORS.text_secondary}
          />
          <Text style={styles.date}>
            Reported on {new Date(data.reportedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name={statusInfo.icon}
            size={16}
            color={statusInfo.color}
          />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card_bg,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#a5b1c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    overflow: "hidden",
  },
  statusBorder: {
    width: 6,
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text_primary,
    marginBottom: 12,
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: COLORS.text_secondary,
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 6,
  },
});
