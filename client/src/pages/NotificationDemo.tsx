import React from "react";
import { useNotification } from "../context/NotificationContext";
import ApiDemo from "../components/ApiDemo";

const NotificationDemo = () => {
  const { showNotification } = useNotification();

  const handleShowSuccessNotification = () => {
    showNotification(
      "success",
      "Success!",
      "Your operation was completed successfully.",
      5000
    );
  };

  const handleShowErrorNotification = () => {
    showNotification(
      "error",
      "Error!",
      "Something went wrong. Please try again.",
      5000
    );
  };

  const handleShowInfoNotification = () => {
    showNotification(
      "info",
      "Information",
      "Here is some information you might find useful.",
      5000
    );
  };

  const handleShowWarningNotification = () => {
    showNotification(
      "warning",
      "Warning",
      "This action might have consequences.",
      5000
    );
  };

  const handleShowBottomRightNotification = () => {
    showNotification(
      "info",
      "Position: Bottom Right",
      "This notification appears at the bottom right of the screen.",
      5000,
      "bottom-right"
    );
  };

  const handleShowTopCenterNotification = () => {
    showNotification(
      "success",
      "Position: Top Center",
      "This notification appears at the top center of the screen.",
      5000,
      "top-center"
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notification Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Notification Types</h2>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleShowSuccessNotification}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Show Success
            </button>
            <button
              onClick={handleShowErrorNotification}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Show Error
            </button>
            <button
              onClick={handleShowInfoNotification}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Show Info
            </button>
            <button
              onClick={handleShowWarningNotification}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Show Warning
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Notification Positions</h2>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleShowBottomRightNotification}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Bottom Right
            </button>
            <button
              onClick={handleShowTopCenterNotification}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Top Center
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Custom Notification</h2>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                const type = document.getElementById(
                  "notification-type"
                ) as HTMLSelectElement;
                const title = document.getElementById(
                  "notification-title"
                ) as HTMLInputElement;
                const message = document.getElementById(
                  "notification-message"
                ) as HTMLTextAreaElement;
                const position = document.getElementById(
                  "notification-position"
                ) as HTMLSelectElement;

                showNotification(
                  type.value as any,
                  title.value || "Custom Notification",
                  message.value || "This is a custom notification message.",
                  5000,
                  position.value as any
                );
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition mb-3"
            >
              Show Custom Notification
            </button>

            <select
              id="notification-type"
              className="px-3 py-2 border rounded mb-2"
              defaultValue="info"
            >
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
            </select>

            <input
              id="notification-title"
              type="text"
              placeholder="Notification Title"
              className="px-3 py-2 border rounded mb-2"
            />

            <textarea
              id="notification-message"
              placeholder="Notification Message"
              className="px-3 py-2 border rounded mb-2"
              rows={2}
            ></textarea>

            <select
              id="notification-position"
              className="px-3 py-2 border rounded"
              defaultValue="top-right"
            >
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-center">Top Center</option>
              <option value="bottom-center">Bottom Center</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Demo Component */}
      <div className="mb-8">
        <ApiDemo />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Use</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
          {`// Import the hook
import { useNotification } from '../context/NotificationContext';

// Inside your component
const { showNotification } = useNotification();

// Show a notification
showNotification(
  'success',       // type: 'success' | 'error' | 'info' | 'warning'
  'Success!',      // title
  'Operation completed successfully.',  // message
  5000,            // duration in milliseconds (optional, default: 5000)
  'top-right'      // position (optional, default: 'top-right')
);`}
        </pre>

        <h2 className="text-lg font-semibold mb-2 mt-4">
          Using the Simplified Hook
        </h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
          {`// Import the simplified hook
import { useNotificationDemo } from '../hooks/useNotificationDemo';

// Inside your component
const { 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning,
  showApiSuccess,
  showApiError 
} = useNotificationDemo();

// Show a success notification
showSuccess('Success!', 'Operation completed successfully.');

// Show an error notification
showError('Error!', 'Something went wrong.');

// Show an API success notification
showApiSuccess('Data saved successfully!');

// Show an API error notification (automatically extracts error message)
try {
  // API call
} catch (error) {
  showApiError(error);
}`}
        </pre>
      </div>
    </div>
  );
};

export default NotificationDemo;
