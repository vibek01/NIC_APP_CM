import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CaseCard({ data }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.detail}>📍 Location: {data.location}</Text>
      <Text style={styles.detail}>📅 Date: {data.date}</Text>
      <Text style={[styles.status, getStatusStyle(data.status)]}>
        Status: {data.status}
      </Text>
    </View>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return { color: "orange" };
    case "Investigating":
      return { color: "#e67e22" };
    case "Action Taken":
      return { color: "green" };
    case "Verified":
      return { color: "#2980b9" };
    default:
      return { color: "#333" };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2c3e50",
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
  status: {
    fontWeight: "bold",
    marginTop: 6,
  },
});
