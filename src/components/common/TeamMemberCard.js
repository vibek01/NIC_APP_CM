// src/components/common/TeamMemberCard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const BORDER_COLORS = ["#a4daffff", "#acedc7ff", "#f7c89fff", "#dda2f4ff"];

// NEW: Component now accepts 'report' and 'onViewReport' props to handle report viewing
export default function TeamMemberCard({
  member,
  index,
  report,
  onViewReport,
}) {
  if (!member) return null;

  const isSupervisor = member.role === "SUPERVISOR";
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const handleCall = () => {
    if (member.phoneNumber) {
      Linking.openURL(`tel:${member.phoneNumber}`);
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department?.toUpperCase()) {
      case "POLICE":
        return "shield-account";
      case "ADMINISTRATION":
        return "briefcase-account";
      case "DICE":
        return "school";
      default:
        return "account-circle";
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.sideBorder, { backgroundColor: borderColor }]} />
      <View style={styles.mainContent}>
        <View style={styles.infoSection}>
          <MaterialCommunityIcons
            name={getDepartmentIcon(member.department)}
            size={40}
            color={borderColor}
            style={styles.deptIcon}
          />
          <View style={styles.nameContainer}>
            <Text
              style={styles.name}
            >{`${member.firstName} ${member.lastName}`}</Text>
            <Text style={styles.role}>
              {isSupervisor ? "Supervisor" : member.designation}
            </Text>
            <Text style={styles.department}>{member.department}</Text>
          </View>
        </View>

        {/* NEW: A container to hold all action buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <MaterialCommunityIcons
              name="phone"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.callButtonText}>
              {member.phoneNumber || "N/A"}
            </Text>
          </TouchableOpacity>

          {/* NEW: Conditionally render the "View Report" button ONLY if a report exists for this member */}
          {report && (
            <TouchableOpacity
              style={[styles.callButton, styles.reportButton]}
              onPress={() => onViewReport(report)} // Pass the specific report to the handler
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color={COLORS.stat_green}
              />
              <Text style={[styles.callButtonText, styles.reportButtonText]}>
                View Report
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
  },
  sideBorder: { width: 6 },
  mainContent: { flex: 1, padding: 16 },
  infoSection: { flexDirection: "row", alignItems: "center" },
  deptIcon: { marginRight: 16 },
  nameContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  role: { fontSize: 14, color: "#475569", marginTop: 2 },
  department: {
    fontSize: 13,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: 4,
  },
  // NEW: A container to allow buttons to wrap to the next line if needed
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  callButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  // NEW: Styles for the "View Report" button to give it a distinct look
  reportButton: {
    backgroundColor: "#f0fff4", // A light green, indicating a completed action
  },
  reportButtonText: {
    color: COLORS.stat_green, // A darker green text
  },
});
