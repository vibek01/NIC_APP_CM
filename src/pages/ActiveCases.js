import React from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import CaseCard from "../components/ActiveCases/CaseCard";

export default function ActiveCases() {
  const dummyCases = [
    {
      id: 1,
      title: "Suspicious Event in West Tripura",
      location: "Agartala",
      date: "2025-07-14",
      status: "Pending",
    },
    {
      id: 2,
      title: "Anonymous Report in Dhalai",
      location: "Ambassa",
      date: "2025-07-10",
      status: "Investigating",
    },
    {
      id: 3,
      title: "School Dropout Girl at Risk",
      location: "Udaipur",
      date: "2025-07-09",
      status: "Action Taken",
    },
    {
      id: 4,
      title: "Early Marriage Suspected",
      location: "Khowai",
      date: "2025-07-08",
      status: "Pending",
    },
    {
      id: 5,
      title: "Unverified Social Media Alert",
      location: "Belonia",
      date: "2025-07-07",
      status: "Verified",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scroll}>
        {dummyCases.map((item) => (
          <CaseCard key={item.id} data={item} />
        ))}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
  },
  scroll: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
});
