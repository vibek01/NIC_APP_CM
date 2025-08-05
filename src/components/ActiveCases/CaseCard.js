import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
// ✅ 1. Import the new TeamDetailsSection component
import TeamDetailsSection from "./TeamDetailsSection";

export default function CaseCard({ data }) {
  // ✅ 2. Add state to manage the expanded/collapsed view. Defaults to false (collapsed).
  const [isExpanded, setIsExpanded] = useState(false);

  const { caseDetails, status, reportedAt } = data;
  const details = caseDetails && caseDetails.length > 0 ? caseDetails[0] : {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color="#4a4a4a"
        style={styles.icon}
      />
      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
        <Text style={styles.detailLabel}>{label}:</Text> {value || "N/A"}
      </Text>
    </View>
  );

  return (
    // ✅ 3. Wrap the entire card in a TouchableOpacity to handle taps.
    // Tapping it will toggle the isExpanded state.
    <TouchableOpacity
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.8}
    >
      <LinearGradient colors={["#ffffff", "#f1f5f9"]} style={styles.card}>
        {/* The header now includes a chevron icon that changes based on the expanded state. */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            Case at: {details.marriageAddress || "Location not specified"}
          </Text>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#475569"
          />
        </View>

        {/* This is the collapsed view, showing only minimal details. */}
        {!isExpanded ? (
          <>
            <DetailRow
              icon="calendar-month-outline"
              label="Reported"
              value={formatDate(reportedAt)}
            />
            <DetailRow
              icon="calendar-heart"
              label="Marriage Date"
              value={formatDate(details.marriageDate)}
            />
          </>
        ) : (
          // This is the expanded view, showing all details.
          <>
            <DetailRow
              icon="map-marker-outline"
              label="Location"
              value={details.marriageAddress}
            />
            <DetailRow
              icon="calendar-month-outline"
              label="Reported"
              value={formatDate(reportedAt)}
            />
            <DetailRow
              icon="face-man-outline"
              label="Boy's Name"
              value={details.boyName}
            />
            <DetailRow
              icon="face-woman-outline"
              label="Girl's Name"
              value={details.girlName}
            />
            <DetailRow
              icon="calendar-heart"
              label="Marriage Date"
              value={formatDate(details.marriageDate)}
            />

            {/* ✅ 4. The new TeamDetailsSection is rendered here when the card is expanded.
                We pass the teamMembers array that we get from the API response. */}
            <TeamDetailsSection teamMembers={details.teamMembers} />
          </>
        )}

        <View style={[styles.statusContainer, getStatusContainerStyle(status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(status)]}>
            {status ? status.replace("_", " ") : "N/A"}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const getStatusContainerStyle = (status) => {
  switch (status) {
    case "IN_PROGRESS":
    case "PENDING":
      return { backgroundColor: "rgba(230, 126, 34, 0.1)" };
    case "RESOLVED":
      return { backgroundColor: "rgba(39, 174, 96, 0.1)" };
    default:
      return { backgroundColor: "#f0f0f0" };
  }
};

const getStatusTextStyle = (status) => {
  switch (status) {
    case "IN_PROGRESS":
    case "PENDING":
      return { color: "#d35400" };
    case "RESOLVED":
      return { color: "#27ae60" };
    default:
      return { color: "#333" };
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  // New style for the header to accommodate the chevron icon
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    lineHeight: 22,
    flex: 1, // Allows the text to take up space and wrap if needed
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#334155",
  },
  statusContainer: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "capitalize",
  },
});
