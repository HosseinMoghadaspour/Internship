import React from "react";

type SnackbarProps = {
  message: string;
  type: "success" | "error";
};

const Snackbar: React.FC<SnackbarProps> = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 animate-fadeIn z-50
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
      `}
    >
      {message}
    </div>
  );
};

export default Snackbar;
