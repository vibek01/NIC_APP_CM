// src/pages/TeamDetailsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import TeamMemberCard from "../components/common/TeamMemberCard";

export default function TeamDetailsScreen({ route, navigation }) {
  const { teamMembers, caseId } = route.params;

  if (!teamMembers || teamMembers.length === 0) {
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
          <Text style={styles.headerTitle}>Assigned Team</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.infoText}>Team has not been assigned yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const supervisor = teamMembers.find((member) => member.role === "SUPERVISOR");
  const members = teamMembers.filter((member) => member.role !== "SUPERVISOR");

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
        <Text style={styles.headerTitle}>Assigned Team</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Render the supervisor first with a special header */}
        {supervisor && (
          <>
            <Text style={styles.sectionTitle}>Supervisor</Text>
            <TeamMemberCard member={supervisor} index={0} />
          </>
        )}

        {/* Render the rest of the team members */}
        {members.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Department Members</Text>
            {members.map((member, index) => (
              // ✅ FIX: We now pass the index to the card component.
              // We add 1 to the index to ensure the color cycle is different from the supervisor.
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index + 1}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // A lighter, cleaner background
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text_primary,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
    paddingLeft: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: COLORS.text_secondary,
    fontSize: 16,
  },
});
