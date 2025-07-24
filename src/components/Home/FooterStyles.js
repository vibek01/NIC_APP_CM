// **`src/components/Home/FooterStyles.js`**
// ```javascript
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    padding: 20, // Increased padding
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0", // Light grey border
    backgroundColor: "#f5f5f5", // Slightly different background color
  },
  footerText: {
    color: "#616161", // Darker grey for better readability
    fontSize: 12, // Slightly smaller font size
    fontStyle: "italic", // Italicize the text
  },
});
