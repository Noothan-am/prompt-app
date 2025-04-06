import React, { useState } from "react";
import { useNotificationDemo } from "../hooks/useNotificationDemo";

// This is a demo component that shows how to use notifications with API requests
const ApiDemo: React.FC = () => {
  const { showApiSuccess, showApiError, showUserInfo } = useNotificationDemo();
  const [loading, setLoading] = useState<boolean>(false);

  // Simulated API call that succeeds
  const handleSuccessRequest = async () => {
    setLoading(true);
    showUserInfo("Making a success API request...");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful response
      showApiSuccess("API request was successful!");
    } catch (error) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Simulated API call that fails
  const handleErrorRequest = async () => {
    setLoading(true);
    showUserInfo("Making an error API request...");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate error response
      throw new Error("API request failed: 404 Not Found");
    } catch (error) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Simulated network error
  const handleNetworkError = async () => {
    setLoading(true);
    showUserInfo("Simulating a network error...");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate network error
      const error = {
        message: "Network Error",
        response: {
          data: {
            message:
              "Unable to connect to server. Please check your internet connection.",
          },
        },
      };
      throw error;
    } catch (error) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        API Request Notifications Demo
      </h2>
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleSuccessRequest}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Simulate Successful API Request"}
        </button>

        <button
          onClick={handleErrorRequest}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Simulate Failed API Request"}
        </button>

        <button
          onClick={handleNetworkError}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Simulate Network Error"}
        </button>
      </div>
    </div>
  );
};

export default ApiDemo;
