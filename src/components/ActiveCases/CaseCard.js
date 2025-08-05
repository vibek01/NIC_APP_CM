import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native"; // ✅ 1. Import the useNavigation hook

export default function CaseCard({ data }) {
  const navigation = useNavigation(); // ✅ 2. Get the navigation object
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

  const handleViewTeam = () => {
    // ✅ 3. Navigate to the new screen, passing the team members as a parameter.
    if (details.teamMembers) {
      navigation.navigate("TeamDetails", { teamMembers: details.teamMembers });
    }
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
    // The card is no longer a single touchable element.
    <LinearGradient colors={["#ffffff", "#f1f5f9"]} style={styles.card}>
      <Text style={styles.title}>
        Case at: {details.marriageAddress || "Location not specified"}
      </Text>

      {/* All details are now shown by default, no more expanding. */}
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

      {/* A new footer section holds the status and the button. */}
      <View style={styles.footer}>
        <View style={[styles.statusContainer, getStatusContainerStyle(status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(status)]}>
            {status ? status.replace("_", " ") : "N/A"}
          </Text>
        </View>

        {/* ✅ 4. Add the dedicated button to view team details. */}
        <TouchableOpacity style={styles.teamButton} onPress={handleViewTeam}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.teamButtonText}>View Team</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
    borderWidth: 0.5,
    borderColor: "#939599ff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0f1725ff",
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
    color: "#7b8eaaff",
    flex: 1,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#334155",
  },
  // New style for the footer to align items horizontally
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
  },
  statusContainer: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "capitalize",
  },
  // New styles for the team button
  teamButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  teamButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
});
