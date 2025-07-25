import axios from "axios";

// The IP address from your ipconfig command.
const API_URL = "http://192.168.0.222:8080/api";

export const getActiveCases = async () => {
  try {
    console.log(`Attempting to fetch cases from: ${API_URL}/cases`);
    const response = await axios.get(`${API_URL}/cases`);
    console.log("Successfully fetched cases:", response.data); // Helpful log for debugging
    return response.data;
  } catch (error) {
    // This log is crucial for seeing the actual error in your terminal
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "Error fetching active cases (server responded with error):",
        error.response.data
      );
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        "Error fetching active cases (no response received):",
        error.request
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(
        "Error fetching active cases (request setup failed):",
        error.message
      );
    }
    throw error;
  }
};
