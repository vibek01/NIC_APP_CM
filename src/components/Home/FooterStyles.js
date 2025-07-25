// src/components/Home/FooterStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  footer: {
    paddingVertical: 25,
    alignItems: "center",
  },
  footerText: {
    color: COLORS.text_secondary,
    fontSize: 12,
  },
});
