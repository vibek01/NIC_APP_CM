import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Developed by NIC_WEST</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
});
