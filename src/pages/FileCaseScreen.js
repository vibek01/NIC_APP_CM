// src/pages/FileCaseScreen.js
import React, { useState, useEffect } from "react";
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
// --- NEW: Import the new geography API functions ---
import {
  getDistricts,
  getSubdivisionsByDistrict,
} from "../services/geographyApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
// --- NEW: Import the Picker component ---
import { Picker } from "@react-native-picker/picker";

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

// --- NEW: Reusable Picker component for this form ---
const PickerInput = ({
  label,
  selectedValue,
  onValueChange,
  items,
  enabled = true,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        enabled={enabled}
        style={{ color: enabled ? "#000" : "#a9a9a9" }}
      >
        <Picker.Item
          label={
            enabled
              ? `Select a ${label.replace(" *", "").toLowerCase()}`
              : "..."
          }
          value=""
        />
        {items.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.name} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function FileCaseScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- NEW: State for geography dropdowns ---
  const [districts, setDistricts] = useState([]);
  const [girlDistrict, setGirlDistrict] = useState("");
  const [boyDistrict, setBoyDistrict] = useState("");
  const [girlSubdivisions, setGirlSubdivisions] = useState([]);
  const [boySubdivisions, setBoySubdivisions] = useState([]);
  const [isGirlSubdivisionsLoading, setIsGirlSubdivisionsLoading] =
    useState(false);
  const [isBoySubdivisionsLoading, setIsBoySubdivisionsLoading] =
    useState(false);

  // Form fields state
  const [complainantPhone, setComplainantPhone] = useState("");
  const [girlName, setGirlName] = useState("");
  const [girlFatherName, setGirlFatherName] = useState("");
  const [girlAddress, setGirlAddress] = useState("");
  const [girlSubdivision, setGirlSubdivision] = useState("");
  const [boyName, setBoyName] = useState("");
  const [boyFatherName, setBoyFatherName] = useState("");
  const [boyAddress, setBoyAddress] = useState("");
  const [boySubdivision, setBoySubdivision] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [marriageAddress, setMarriageAddress] = useState("");
  const [marriageLandmark, setMarriageLandmark] = useState("");
  const [policeStation, setPoliceStation] = useState("");

  // --- NEW: Fetch all districts when the screen loads ---
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await getDistricts();
        setDistricts(data);
      } catch (error) {
        Alert.alert(
          "Error",
          "Could not load location data. Please try again later."
        );
      }
    };
    fetchDistricts();
  }, []);

  // --- NEW: Fetch subdivisions for the girl when her district changes ---
  useEffect(() => {
    if (girlDistrict) {
      const fetchSubdivisions = async () => {
        setIsGirlSubdivisionsLoading(true);
        setGirlSubdivisions([]); // Clear previous list
        try {
          const data = await getSubdivisionsByDistrict(girlDistrict);
          setGirlSubdivisions(data);
        } catch (error) {
          Alert.alert("Error", error.message);
        } finally {
          setIsGirlSubdivisionsLoading(false);
        }
      };
      fetchSubdivisions();
    }
  }, [girlDistrict]);

  // --- NEW: Fetch subdivisions for the boy when his district changes ---
  useEffect(() => {
    if (boyDistrict) {
      const fetchSubdivisions = async () => {
        setIsBoySubdivisionsLoading(true);
        setBoySubdivisions([]);
        try {
          const data = await getSubdivisionsByDistrict(boyDistrict);
          setBoySubdivisions(data);
        } catch (error) {
          Alert.alert("Error", error.message);
        } finally {
          setIsBoySubdivisionsLoading(false);
        }
      };
      fetchSubdivisions();
    }
  }, [boyDistrict]);

  const showPicker = () => setIsPickerShow(true);

  const onChangeDate = (event, selectedDate) => {
    setIsPickerShow(Platform.OS === "ios");
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
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
      marriageDate,
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
            {/* --- NEW: Replaced text input with Pickers --- */}
            <PickerInput
              label="District *"
              selectedValue={girlDistrict}
              onValueChange={(itemValue) => {
                setGirlDistrict(itemValue);
                setGirlSubdivision("");
              }}
              items={districts}
            />
            <PickerInput
              label="Subdivision *"
              selectedValue={girlSubdivision}
              onValueChange={(itemValue) => setGirlSubdivision(itemValue)}
              items={
                isGirlSubdivisionsLoading
                  ? [{ id: "loading", name: "Loading..." }]
                  : girlSubdivisions
              }
              enabled={!!girlDistrict && !isGirlSubdivisionsLoading}
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
            {/* --- NEW: Replaced text input with Pickers --- */}
            <PickerInput
              label="District"
              selectedValue={boyDistrict}
              onValueChange={(itemValue) => {
                setBoyDistrict(itemValue);
                setBoySubdivision("");
              }}
              items={districts}
            />
            <PickerInput
              label="Subdivision"
              selectedValue={boySubdivision}
              onValueChange={(itemValue) => setBoySubdivision(itemValue)}
              items={
                isBoySubdivisionsLoading
                  ? [{ id: "loading", name: "Loading..." }]
                  : boySubdivisions
              }
              enabled={!!boyDistrict && !isBoySubdivisionsLoading}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Incident Details (Required)</Text>
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

          {isPickerShow && (
            <DateTimePicker
              value={date}
              mode={"date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    height: 50,
  },
  dateText: { fontSize: 16, color: "#333" },
  // --- NEW: Style for the picker container to look like other inputs ---
  pickerContainer: {
    backgroundColor: "#f4f5f7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    justifyContent: "center",
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
