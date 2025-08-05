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

// This component receives a single team member object as a prop
export default function TeamMemberCard({ member }) {
  if (!member) return null;

  const isSupervisor = member.role === "SUPERVISOR";

  const handleCall = () => {
    if (member.phoneNumber) {
      Linking.openURL(`tel:${member.phoneNumber}`);
    }
  };

  return (
    <View style={[styles.card, isSupervisor && styles.supervisorCard]}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text
            style={styles.name}
          >{`${member.firstName} ${member.lastName}`}</Text>
          <Text style={styles.role}>
            {isSupervisor ? "Supervisor" : member.designation}
          </Text>
        </View>
        {isSupervisor && (
          <MaterialCommunityIcons
            name="star-circle"
            size={24}
            color={COLORS.primary}
          />
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsContainer}>
        <DetailRow icon="domain" label="Department" value={member.department} />
        <DetailRow
          icon="phone-outline"
          label="Contact"
          value={member.phoneNumber}
          onPress={handleCall}
          isLink
        />
      </View>
    </View>
  );
}

const DetailRow = ({ icon, label, value, onPress, isLink }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    style={styles.detailRow}
  >
    <MaterialCommunityIcons
      name={icon}
      size={16}
      color="#4a4a4a"
      style={styles.icon}
    />
    <Text style={styles.detailText}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={isLink && styles.linkText}> {value || "N/A"}</Text>
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  supervisorCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#f0f5ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
  },
  role: {
    fontSize: 13,
    color: "#64748b",
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  detailsContainer: {},
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#475569",
  },
  detailLabel: {
    fontWeight: "600",
    color: "#334155",
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
