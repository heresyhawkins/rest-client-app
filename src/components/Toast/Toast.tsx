import { useState, type FC } from "react";

export interface ToastProps {
  message: string;
  type: "error" | "success" | "info";
}

const Toast: FC<ToastProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  const dismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg text-white max-w-sm z-50 transition-opacity duration-300 ${
        type === "error"
          ? "bg-red-600"
          : type === "success"
          ? "bg-green-600"
          : "bg-blue-600"
      }`}
      onClick={dismiss}
    >
      <p>{message}</p>
      <button onClick={dismiss} className="text-white ml-2 text-xs">
        ×
      </button>
    </div>
  );
};

export default Toast;
