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

// A predefined list of professional colors for the side-borders.
const BORDER_COLORS = ["#add0e7ff", "#acedc7ff", "#f7c89fff", "#dda2f4ff"];

// ✅ NEW: The component now accepts an 'index' prop to help cycle through colors.
export default function TeamMemberCard({ member, index }) {
  if (!member) return null;

  const isSupervisor = member.role === "SUPERVISOR";
  // Use the modulo operator to cycle through the BORDER_COLORS array.
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const handleCall = () => {
    if (member.phoneNumber) {
      Linking.openURL(`tel:${member.phoneNumber}`);
    }
  };

  // A helper to choose an icon based on the department.
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
      {/* This is the new colored side-border. */}
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
    overflow: "hidden", // Ensures the side-border stays within the rounded corners.
  },
  sideBorder: {
    width: 6,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  deptIcon: {
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  role: {
    fontSize: 14,
    color: "#475569",
    marginTop: 2,
  },
  department: {
    fontSize: 13,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: 4,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  callButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
