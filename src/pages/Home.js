// src/pages/Home.js
import React from "react";
import { View, ScrollView, StatusBar, Text, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Home/Header";
import DashboardBox from "../components/Home/DashboardBox";
import Footer from "../components/Home/Footer";
import { styles } from "../components/Home/HomeStyles";
import { COLORS } from "../constants/colors";

const STATS_DATA = [
  { id: "1", label: "Total Cases", value: "4", color: COLORS.stat_blue },
  {
    id: "2",
    label: "Resolved This Month",
    value: "2",
    color: COLORS.stat_green,
  },
  { id: "3", label: "Pending Review", value: "1", color: COLORS.stat_yellow },
  { id: "4", label: "High Priority", value: "2", color: COLORS.alert_text },
];

const DASHBOARD_ITEMS = [
  { title: "ACTIVE CASES", iconName: "file-document-outline" },
  { title: "MISSED NOTIFICATIONS", iconName: "bell-off-outline" },
  { title: "REPORTS & ANALYTICS", iconName: "chart-line" },
  { title: "USER MANAGEMENT", iconName: "account-group-outline" },
  { title: "ARCHIVED CASES", iconName: "archive-outline" },
  { title: "SETTINGS", iconName: "cog-outline" },
];

// New Stat Card Component (kept inside Home.js for simplicity, can be moved)
const StatCard = ({ item }) => (
  <View style={[styles.statCard, { backgroundColor: item.color }]}>
    <Text style={styles.statValue}>{item.value}</Text>
    <Text style={styles.statLabel}>{item.label}</Text>
  </View>
);

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header userName="Vibek" />

      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Stats Section --- */}
        <Text style={styles.sectionTitle}>Monthly Overview</Text>
        <FlatList
          horizontal
          data={STATS_DATA}
          renderItem={({ item }) => <StatCard item={item} />}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsListContainer}
        />

        {/* --- Urgent Alert Section --- */}
        <View style={styles.alertContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={24}
            color={COLORS.alert_text}
          />
          <Text style={styles.alertText}>
            3 new high-priority cases require your immediate attention.
          </Text>
        </View>

        {/* --- Dashboard Grid Section --- */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.dashboardGrid}>
          {DASHBOARD_ITEMS.map((item, index) => (
            <View key={item.title} style={styles.boxWrapper}>
              <DashboardBox
                index={index}
                title={item.title}
                iconName={item.iconName}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
