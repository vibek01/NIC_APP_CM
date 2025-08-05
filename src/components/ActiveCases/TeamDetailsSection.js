// src/components/ActiveCases/TeamDetailsSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TeamMemberCard from "../common/TeamMemberCard";
import { COLORS } from "../../constants/colors";

export default function TeamDetailsSection({ teamMembers }) {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Team Details</Text>
        <Text style={styles.noTeamText}>Team has not been assigned yet.</Text>
      </View>
    );
  }

  // Find and separate the supervisor from the other members
  const supervisor = teamMembers.find((member) => member.role === "SUPERVISOR");
  const members = teamMembers.filter((member) => member.role !== "SUPERVISOR");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Assigned Team</Text>

      {/* Render the supervisor first, if one exists */}
      {supervisor && <TeamMemberCard member={supervisor} />}

      {/* Then render the rest of the team members */}
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text_primary,
    marginBottom: 12,
  },
  noTeamText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    padding: 10,
  },
});
