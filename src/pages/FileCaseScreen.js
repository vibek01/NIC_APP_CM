// src/pages/FileCaseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "../constants/colors";
import { submitAnonymousCase } from "../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// --- NEW: Import the date picker component ---
import DateTimePicker from "@react-native-community/datetimepicker";

// A reusable input component for this form
const FormInput = ({ label, value, onChangeText, placeholder, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#a9a9a9"
      {...props}
    />
  </View>
);

export default function FileCaseScreen({ navigation }) {
  // --- NEW: State management for the date picker ---
  const [date, setDate] = useState(new Date()); // Holds the actual Date object
  const [isPickerShow, setIsPickerShow] = useState(false); // Controls picker visibility

  // State for all form fields
  const [complainantPhone, setComplainantPhone] = useState("");

  const [girlName, setGirlName] = useState("");
  const [girlFatherName, setGirlFatherName] = useState("");
  const [girlAddress, setGirlAddress] = useState("");
  const [girlSubdivision, setGirlSubdivision] = useState("");

  const [boyName, setBoyName] = useState("");
  const [boyFatherName, setBoyFatherName] = useState("");
  const [boyAddress, setBoyAddress] = useState("");
  const [boySubdivision, setBoySubdivision] = useState("");

  // This state will now hold the formatted string for display
  const [marriageDate, setMarriageDate] = useState("");
  const [marriageAddress, setMarriageAddress] = useState("");
  const [marriageLandmark, setMarriageLandmark] = useState("");
  const [policeStation, setPoliceStation] = useState("");

  const [loading, setLoading] = useState(false);

  // --- NEW: Function to show the date picker ---
  const showPicker = () => {
    setIsPickerShow(true);
  };

  // --- NEW: Function to handle date changes from the picker ---
  const onChangeDate = (event, selectedDate) => {
    // Hide the picker
    setIsPickerShow(Platform.OS === "ios"); // On iOS, it's a modal we control
    if (event.type === "set") {
      // 'set' means the user confirmed a date
      const currentDate = selectedDate || date;
      setDate(currentDate);
      // Format the date to YYYY-MM-DD for display and submission
      const formattedDate = currentDate.toISOString().split("T")[0];
      setMarriageDate(formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (
      !complainantPhone ||
      !girlName ||
      !girlAddress ||
      !girlSubdivision ||
      !marriageDate
    ) {
      Alert.alert(
        "Missing Information",
        "Please provide your phone number and all required case details marked with *."
      );
      return;
    }

    setLoading(true);
    const formData = {
      complainantPhone,
      girlName,
      girlFatherName,
      girlAddress,
      girlSubdivision,
      boyName,
      boyFatherName,
      boyAddress,
      boySubdivision,
      marriageDate, // This will be the "YYYY-MM-DD" string
      marriageAddress,
      marriageLandmark,
      policeStation,
    };

    try {
      await submitAnonymousCase(formData);
      Alert.alert(
        "Report Submitted Successfully",
        "Thank you for your report. It has been sent confidentially.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        error.message || "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.title}>Anonymous Report</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Your identity is kept confidential. Your phone number is required
            for verification purposes only.
          </Text>

          {/* ... Other form sections (Your Contact, Girl's Details, Boy's Details) remain the same ... */}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Your Contact (Required)</Text>
            <FormInput
              label="Your Phone Number *"
              value={complainantPhone}
              onChangeText={setComplainantPhone}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Girl's Details (Required)</Text>
            <FormInput
              label="Full Name *"
              value={girlName}
              onChangeText={setGirlName}
            />
            <FormInput
              label="Father's Name"
              value={girlFatherName}
              onChangeText={setGirlFatherName}
            />
            <FormInput
              label="Address / Village *"
              value={girlAddress}
              onChangeText={setGirlAddress}
            />
            <FormInput
              label="Subdivision *"
              value={girlSubdivision}
              onChangeText={setGirlSubdivision}
              placeholder="e.g., Agartala Subdivision"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Boy's Details (Optional)</Text>
            <FormInput
              label="Full Name"
              value={boyName}
              onChangeText={setBoyName}
            />
            <FormInput
              label="Father's Name"
              value={boyFatherName}
              onChangeText={setBoyFatherName}
            />
            <FormInput
              label="Address / Village"
              value={boyAddress}
              onChangeText={setBoyAddress}
            />
            <FormInput
              label="Subdivision"
              value={boySubdivision}
              onChangeText={setBoySubdivision}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Incident Details (Required)</Text>

            {/* --- NEW: Replaced the old text input with a touchable date picker input --- */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Suspected Marriage Date *</Text>
              <TouchableOpacity onPress={showPicker} style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {marriageDate || "Select a date"}
                </Text>
                <MaterialCommunityIcons
                  name="calendar"
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <FormInput
              label="Marriage Location Address *"
              value={marriageAddress}
              onChangeText={setMarriageAddress}
            />
            <FormInput
              label="Landmark near Marriage Location"
              value={marriageLandmark}
              onChangeText={setMarriageLandmark}
            />
            <FormInput
              label="Nearest Police Station"
              value={policeStation}
              onChangeText={setPoliceStation}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit Confidential Report
              </Text>
            )}
          </TouchableOpacity>

          {/* --- NEW: Conditionally render the DateTimePicker modal --- */}
          {isPickerShow && (
            <DateTimePicker
              value={date}
              mode={"date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={onChangeDate}
              maximumDate={new Date()} // Prevent selecting future dates
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- NEW/UPDATED STYLES ADDED HERE ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f7" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  backButton: { marginRight: 15, padding: 5 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text_primary },
  content: { padding: 20, paddingBottom: 50 },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 25,
    textAlign: "center",
  },
  formSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#ccc",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 15,
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#1F2937", marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  // New style for the touchable date input to make it look like other inputs
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    height: 50, // To match the TextInput height
  },
  // New style for the text inside the date input
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  submitButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
});
