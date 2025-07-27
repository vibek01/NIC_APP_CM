import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.43.8:8080/api";
const AUTH_BASE_URL = "http://192.168.43.8:8080/auth";

// Function for user registration (no changes needed)
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/persons`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Signup failed. Please try again."
      );
    }
    throw new Error("Network error or server is not responding.");
  }
};

// Function for handling login (no changes needed)
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data; // Return backend error message
    }
    throw new Error("Network error or server is not responding.");
  }
};

// ✅ FULLY IMPLEMENTED: This function now correctly builds the nested payload.
export const submitCaseReport = async (formData) => {
  try {
    const userPhone = await AsyncStorage.getItem("userPhone");
    if (!userPhone) {
      throw new Error(
        "Authentication error: Phone number not found. Please log in again."
      );
    }

    // This is the "smart constructor" for your backend request.
    // It transforms the flat form data into the required nested structure.
    const payload = {
      complainantPhone: userPhone,
      reportedAt: new Date().toISOString(),
      status: "PENDING",
      caseDetails: {
        // All the data from the form goes inside this 'caseDetails' object
        marriageDate: new Date(formData.marriageDate).toISOString(),
        boyName: formData.boyName,
        boyFatherName: formData.boyFatherName,
        boyAddress: formData.boyAddress,
        boySubdivision: formData.boySubdivision,
        girlName: formData.girlName,
        girlFatherName: formData.girlFatherName,
        girlAddress: formData.girlAddress,
        girlSubdivision: formData.girlSubdivision, // Critical field for team formation
        marriageAddress: formData.marriageAddress,
        marriageLandmark: formData.marriageLandmark,
        policeStationNearMarriageLocation: formData.policeStation,
      },
    };

    const response = await axios.post(`${API_BASE_URL}/cases`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Provide a more specific error message from the backend if available
      throw new Error(
        error.response.data.message || "Failed to submit the report."
      );
    }
    throw new Error("Network error or server is not responding.");
  }
};

// ✅ NEW: Function to get cases submitted by the currently logged-in user.
// NOTE: This requires a new backend endpoint, e.g., GET /api/cases/user/{userId}
export const getMyCases = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // You will need to create this endpoint on your backend.
    // For now, it will fail if called, but the structure is ready.
    const response = await axios.get(`${API_BASE_URL}/cases/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch your cases."
      );
    }
    throw new Error("Network error or server is not responding.");
  }
};

// Function for officials to get all active cases.
export const getActiveCases = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Error fetching active cases (server responded):",
        error.response.data
      );
    } else if (error.request) {
      console.error(
        "Error fetching active cases (no response):",
        error.request
      );
    } else {
      console.error(
        "Error fetching active cases (setup failed):",
        error.message
      );
    }
    throw error;
  }
};
