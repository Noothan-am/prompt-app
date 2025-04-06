import { useNotification } from "../context/NotificationContext";

// This hook provides a simplified set of methods for showing different types of notifications
// It's a wrapper around the useNotification hook that provides more convenient methods
export const useNotificationDemo = () => {
  const { showNotification } = useNotification();

  // Show a success notification
  const showSuccess = (
    title: string,
    message: string,
    duration?: number,
    position?: any
  ) => {
    return showNotification("success", title, message, duration, position);
  };

  // Show an error notification
  const showError = (
    title: string,
    message: string,
    duration?: number,
    position?: any
  ) => {
    return showNotification("error", title, message, duration, position);
  };

  // Show an info notification
  const showInfo = (
    title: string,
    message: string,
    duration?: number,
    position?: any
  ) => {
    return showNotification("info", title, message, duration, position);
  };

  // Show a warning notification
  const showWarning = (
    title: string,
    message: string,
    duration?: number,
    position?: any
  ) => {
    return showNotification("warning", title, message, duration, position);
  };

  // Show a notification when an API request is successful
  const showApiSuccess = (
    message: string = "Operation completed successfully"
  ) => {
    return showNotification("success", "Success", message, 3000);
  };

  // Show a notification when an API request fails
  const showApiError = (error: any) => {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    return showNotification("error", "Error", errorMessage, 5000);
  };

  // Show a notification when the user needs to be warned about something
  const showUserWarning = (message: string) => {
    return showNotification("warning", "Warning", message, 5000);
  };

  // Show a notification to inform the user about something
  const showUserInfo = (message: string) => {
    return showNotification("info", "Information", message, 4000);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showApiSuccess,
    showApiError,
    showUserWarning,
    showUserInfo,
    // Also expose the original showNotification method for full control
    showNotification,
  };
};

export default useNotificationDemo;
