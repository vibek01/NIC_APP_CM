// src/components/Home/Footer.js
import React from "react";
import { View, Text } from "react-native";
import { styles } from "./FooterStyles";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Developed by NIC_WEST</Text>
    </View>
  );
}
