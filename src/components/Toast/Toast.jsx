import React, { ReactNode } from "react";
import { Slide, toast, ToastContainer, ToastOptions } from "react-toastify";

const defaultOptions = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};

// Toaster implementation
const toaster = {
  success: (msg, options = {}) => {
    toast.success(msg, {
      ...defaultOptions,
      ...options,
      // icon: <ApproveIcon />,
    });
  },
  warning: (msg, options = {}) => {
    toast.warning(msg, {
      ...defaultOptions,
      ...options,
      // icon: <AlertIcon />,
    });
  },
  error: (msg, options = {}) => {
    toast.error(msg, {
      ...defaultOptions,
      ...options,
      // icon: <RejectIcon />,
    });
  },
  info: (msg, options = {}) => {
    toast.info(msg, {
      ...defaultOptions,
      ...options,
      // icon: <AlertIcon />,
    });
  },
};

// Main component for the Toast container
export const ToastStyled = () => {
  return <ToastContainer className="toast-container" />;
};

// Export toaster as default
export default toaster;
