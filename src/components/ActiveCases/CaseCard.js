import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CaseCard({ data }) {
  const { caseDetails } = data;
  const details = caseDetails && caseDetails.length > 0 ? caseDetails[0] : {};

  // A helper function to format dates, returns "N/A" if the date is invalid
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // A helper component for rendering detail rows to avoid repetition
  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color="#4a4a4a"
        style={styles.icon}
      />
      <Text style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}:</Text> {value}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#fdfbfb", "#ebedee"]} style={styles.card}>
      <Text style={styles.title}>
        {data.description || "No description available"}
      </Text>

      <DetailRow
        icon="map-marker-outline"
        label="Location"
        value={data.caseAddress || "N/A"}
      />
      <DetailRow
        icon="calendar-month-outline"
        label="Reported At"
        value={formatDate(data.reportedAt)}
      />
      <DetailRow
        icon="face-man-outline"
        label="Boy's Name"
        value={details.boyName || "N/A"}
      />
      <DetailRow
        icon="face-woman-outline"
        label="Girl's Name"
        value={details.girlName || "N/A"}
      />
      <DetailRow
        icon="calendar-heart"
        label="Marriage Date"
        value={formatDate(details.marriageDate)}
      />

      <View
        style={[styles.statusContainer, getStatusContainerStyle(data.status)]}
      >
        <Text style={[styles.statusText, getStatusTextStyle(data.status)]}>
          {data.status || "N/A"}
        </Text>
      </View>
    </LinearGradient>
  );
}

// Styles for the container of the status badge for better visual separation
const getStatusContainerStyle = (status) => {
  switch (status) {
    case "Pending":
    case "Investigating":
      return { backgroundColor: "rgba(230, 126, 34, 0.1)" };
    case "Action Taken":
      return { backgroundColor: "rgba(39, 174, 96, 0.1)" };
    case "Verified":
      return { backgroundColor: "rgba(41, 128, 185, 0.1)" };
    default:
      return { backgroundColor: "#f0f0f0" };
  }
};

// Styles for the text color of the status badge
const getStatusTextStyle = (status) => {
  switch (status) {
    case "Pending":
    case "Investigating":
      return { color: "#d35400" };
    case "Action Taken":
      return { color: "#27ae60" };
    case "Verified":
      return { color: "#2980b9" };
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
    borderColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c3e50",
    lineHeight: 22,
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
    color: "#555",
    flex: 1, // Allows text to wrap properly
  },
  detailLabel: {
    fontWeight: "600",
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
  },
});
