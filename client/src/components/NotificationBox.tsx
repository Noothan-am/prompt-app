import React, { useState, useEffect } from "react";
import {
  IoCloseOutline,
  IoCheckmarkCircle,
  IoWarning,
  IoInformationCircle,
  IoAlertCircle,
} from "react-icons/io5";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationBoxProps {
  type?: NotificationType;
  title: string;
  message: string;
  duration?: number; // in milliseconds, if provided notification will auto-dismiss
  onClose?: () => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const NotificationBox: React.FC<NotificationBoxProps> = ({
  type = "info",
  title,
  message,
  duration,
  onClose,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          textColor: "text-green-800",
          icon: <IoCheckmarkCircle className="w-6 h-6 text-green-500" />,
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-300",
          textColor: "text-red-800",
          icon: <IoAlertCircle className="w-6 h-6 text-red-500" />,
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-300",
          textColor: "text-yellow-800",
          icon: <IoWarning className="w-6 h-6 text-yellow-500" />,
        };
      case "info":
      default:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          textColor: "text-blue-800",
          icon: <IoInformationCircle className="w-6 h-6 text-blue-500" />,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed ${getPositionClasses()} z-50 w-full max-w-sm overflow-hidden`}
      role="alert"
    >
      <div
        className={`flex items-start p-4 rounded-lg shadow-lg border ${styles.bgColor} ${styles.borderColor}`}
      >
        <div className="flex-shrink-0 mr-3">{styles.icon}</div>
        <div className="flex-1">
          <h3 className={`font-medium ${styles.textColor} mb-1`}>{title}</h3>
          <div className={`text-sm ${styles.textColor}`}>{message}</div>
        </div>
        <button
          type="button"
          className={`ml-3 -mt-1 -mr-1 ${styles.textColor} hover:bg-opacity-20 rounded-md p-1.5 inline-flex focus:outline-none`}
          onClick={handleClose}
          aria-label="Close"
        >
          <IoCloseOutline className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
