// src/pages/UserDashboardScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

// Reusable Action Card Component
const ActionCard = ({ icon, title, description, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={28} color={COLORS.primary} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <MaterialCommunityIcons
      name="chevron-right"
      size={24}
      color={COLORS.text_secondary}
    />
  </TouchableOpacity>
);

export default function UserDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>Welcome</Text>
          <Text style={styles.headerTitle}>Citizen Reporter</Text>
        </View>

        {/* ✅ WRAPPED THE IMAGE IN A CLICKABLE COMPONENT */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1053/1053244.png",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ActionCard
          icon="file-document-edit-outline"
          title="Report a New Case"
          description="Submit a confidential report of a suspected incident."
          onPress={() => navigation.navigate("FileCase")}
        />

        <ActionCard
          icon="format-list-checks"
          title="My Submitted Cases"
          description="Track the status and history of your reports."
          onPress={() => navigation.navigate("MyCases")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  headerWelcome: {
    fontSize: 16,
    color: COLORS.text_secondary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text_primary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  actionCard: {
    backgroundColor: COLORS.card_bg,
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#95a5a6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EBF2FF", // A light blue that complements the primary color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text_primary,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.text_secondary,
    marginTop: 2,
  },
});
