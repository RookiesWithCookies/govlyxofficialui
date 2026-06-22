import { createElement } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle2, Info, XCircle } from "lucide-react";

const getToastStyle = (isDarkMode: boolean) => ({
  borderRadius: "16px",
  background: isDarkMode ? "#FFFFFF" : "#1D232A",
  color: isDarkMode ? "#1F2937" : "#F8FAFC",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "1.25",
  padding: "12px 18px",
  border: isDarkMode ? "1px solid #E5E7EB" : "1px solid #2A303C",
  boxShadow: isDarkMode
    ? "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)"
    : "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "min(92vw, 520px)",
});

const isDarkMode = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("dark");

export const showToast = {
  success: (msg: string) => {
    toast.success(msg, {
      style: getToastStyle(isDarkMode()),
      icon: createElement(CheckCircle2, {
        size: 22,
        color: "#10B981",
        fill: "rgba(16,185,129,0.16)",
      }),
      duration: 3000,
    });
  },
  error: (msg: string) => {
    toast.error(msg, {
      style: getToastStyle(isDarkMode()),
      icon: createElement(XCircle, {
        size: 22,
        color: "#EF4444",
        fill: "rgba(239,68,68,0.14)",
      }),
      duration: 4000,
    });
  },
  info: (msg: string) => {
    toast(msg, {
      style: getToastStyle(isDarkMode()),
      icon: createElement(Info, {
        size: 22,
        color: "#1d4ed8",
        fill: "rgba(29,78,216,0.14)",
      }),
      duration: 3000,
    });
  },
};
