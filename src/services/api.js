// File: src/services/api.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use the IP address of your computer where the backend is running.
// This is for development. For production, this will be your server's domain.
const API_BASE_URL = "http://10.220.31.8:8080/api";
const AUTH_BASE_URL = "http://10.220.31.8:8080/auth";

// ============================== ==========================================
// AUTHENTICATION
// ========================================================================

/**
 * Logs in an official user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The login response from the backend.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, {
      email,
      password,
    });
    // On success, save the userId to local storage for future API calls
    if (response.data.userId) {
      await AsyncStorage.setItem("userId", response.data.userId);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Invalid credentials.");
  }
};

/**
 * Logs out a user by clearing local storage.
 */
export const logoutUser = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      // Step 1: Tell the backend to clear the push token for this user.
      console.log(`Sending logout request to backend for user: ${userId}`);
      await axios.post(`${API_BASE_URL}/persons/${userId}/logout`);
      console.log("Backend acknowledged logout, push token cleared.");
    }
  } catch (error) {
    // We log the error but don't stop the process. The user must be
    // able to log out from the device even if the backend call fails.
    console.error(
      "Failed to clear push token on backend:",
      error.response?.data || error.message
    );
  }
};

// --- NEW FUNCTION START ---
/**
 * Registers the device's push notification token with the backend.
 * @param {string} pushToken - The Expo push token.
 * @returns {Promise<void>}
 */
export const registerPushToken = async (pushToken) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.log("No user session found, skipping push token registration.");
      return;
    }

    const payload = { pushToken }; // Matches the PushTokenRequestDTO on the backend

    // This calls the new endpoint: POST /api/persons/{id}/register-push-token
    await axios.post(
      `${API_BASE_URL}/persons/${userId}/register-push-token`,
      payload
    );

    console.log("Push token registered with backend successfully.");
  } catch (error) {
    console.error(
      "Failed to register push token:",
      error.response?.data || error.message
    );
    // We don't throw an error here because a failed push token registration
    // should not prevent the user from using the app.
  }
};
// --- NEW FUNCTION END ---

// ========================================================================
// ANONYMOUS CASE SUBMISSION
// ========================================================================

/**
 * Submits a new child marriage case report anonymously.
 * @param {object} formData - The case data from the app's form.
 * @returns {Promise<object>} The newly created case object.
 */
export const submitAnonymousCase = async (formData) => {
  try {
    const payload = {
      complainantPhone: formData.complainantPhone,
      reportedAt: new Date().toISOString(),
      status: "PENDING",
      caseDetails: {
        marriageDate: new Date(formData.marriageDate).toISOString(),
        boyName: formData.boyName,
        boyFatherName: formData.boyFatherName,
        boyAddress: formData.boyAddress,
        boySubdivision: formData.boySubdivision,
        girlName: formData.girlName,
        girlFatherName: formData.girlFatherName,
        girlAddress: formData.girlAddress,
        girlSubdivision: formData.girlSubdivision,
        marriageAddress: formData.marriageAddress,
        marriageLandmark: formData.marriageLandmark,
        policeStationNearMarriageLocation: formData.policeStation,
      },
    };

    const response = await axios.post(`${API_BASE_URL}/cases`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Case submission failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to submit the report."
    );
  }
};

// ========================================================================
// OFFICIAL USER SERVICES
// ========================================================================

/**
 * Fetches all cases.
 * @returns {Promise<Array>} A list of all case objects.
 */
export const getAllCases = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all cases:", error);
    throw error;
  }
};

/**
 * Fetches the complete details for a single case by its ID.
 * @param {string} caseId - The UUID of the case.
 * @returns {Promise<object>} The detailed case object.
 */
export const getCaseById = async (caseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for case ${caseId}:`, error);
    throw new Error(`Failed to fetch details for case ${caseId}.`);
  }
};

/**
 * Submits an official's report for a specific case.
 * @param {object} reportData - Contains caseId, report content.
 * @returns {Promise<object>} The newly created report object.
 */
export const submitOfficialReport = async ({ caseId, report }) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) throw new Error("User session not found.");

    const userProfile = await getPersonProfile();

    const payload = {
      caseId: caseId,
      personId: userId,
      report: report,
      department: userProfile.department,
    };

    const response = await axios.post(`${API_BASE_URL}/reports`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Report submission failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to submit report."
    );
  }
};

/**
 * Fetches all reports submitted for a particular case.
 * @param {string} caseId - The UUID of the case.
 * @returns {Promise<Array>} A list of report objects for that case.
 */
export const getReportsForCase = async (caseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/case/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reports for case ${caseId}:`, error);
    throw new Error(`Failed to fetch reports for case ${caseId}.`);
  }
};

/**
 * Fetches the full profile for the currently logged-in user.
 * @returns {Promise<object>} The user's person object.
 */
export const getPersonProfile = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("User session not found. Please log in again.");
    }
    const response = await axios.get(`${API_BASE_URL}/persons/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data.message || "Failed to fetch profile data."
    );
  }
};

// --- THIS IS THE MISSING FUNCTION ---
/**
 * Fetches notifications that are pending the user's response.
 * @returns {Promise<Array>} A list of pending team responses.
 */
export const getPendingResponses = async () => {
  try {
    // This endpoint is defined in TeamFormationController.java
    const response = await axios.get(
      `${API_BASE_URL}/team-formations/responses/pending`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pending responses:", error);
    // Return an empty array on error to prevent crashes.
    return [];
  }
};
