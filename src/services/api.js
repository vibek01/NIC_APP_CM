import axios from "axios";

// Base URLs for different parts of the API
const API_BASE_URL = "http://192.168.0.222:8080/api";
const AUTH_BASE_URL = "http://192.168.0.222:8080/auth";

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

// ✅ New function for handling login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data; // Should return { message, userId }
  } catch (error) {
    if (error.response) {
      // If the backend returns a specific error message (like 401 Unauthorized)
      // return that message to be displayed to the user.
      return error.response.data;
    }
    // For other errors (like network), throw a generic error.
    throw new Error("Network error or server is not responding.");
  }
};
