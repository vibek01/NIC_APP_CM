import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Header from "../components/Home/Header";
import DashboardBox from "../components/Home/DashboardBox";
import Footer from "../components/Home/Footer";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.boxWrapper}>
        <View style={styles.boxContainer}>
          <DashboardBox title="ACTIVE CASES" />
          <DashboardBox title="MISSED NOTIFICATIONS" />
        </View>

        {/* Placeholder for two more boxes */}
        <View style={styles.boxContainer}>
          <DashboardBox title="COMING SOON" />
          <DashboardBox title="COMING SOON" />
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
    justifyContent: "space-between",
  },
  boxWrapper: {
    paddingHorizontal: 16,
    marginTop: 20,
    flex: 1,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
