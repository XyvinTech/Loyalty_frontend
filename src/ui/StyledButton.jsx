import { ArrowPathIcon } from "@heroicons/react/24/outline";

function defaultBusyLabel(name) {
  if (name == null) return "Please wait…";
  if (typeof name !== "string") return "Please wait…";
  const n = name.toLowerCase();
  if (n.includes("upload")) return "Uploading…";
  if (n.includes("add") || n.includes("create")) return "Adding…";
  if (
    n.includes("save") ||
    n.includes("update") ||
    n.includes("change password")
  ) {
    return "Saving…";
  }
  if (n.includes("delete")) return "Deleting…";
  if (n.includes("reduce")) return "Processing…";
  if (n.includes("reset")) return "Working…";
  return "Working…";
}

const StyledButton = ({
  onClick,
  name,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  isLoading = false,
  loadingLabel,
}) => {
  const busy = Boolean(isLoading);
  const isDisabled = disabled || busy;

  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    delete: "bg-red-600 hover:bg-red-700 text-white",
    tertiary: "bg-transparent text-black hover:bg-gray-100",
    download:
      "text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50",
  };

  const cursorClass = busy
    ? "cursor-wait opacity-90"
    : disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

  const busyText = loadingLabel ?? defaultBusyLabel(name);

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isDisabled}
      className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 ${cursorClass} ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {busy ? (
        <>
          <ArrowPathIcon
            className="h-4 w-4 shrink-0 animate-spin"
            aria-hidden
          />
          <span>{busyText}</span>
        </>
      ) : (
        name
      )}
    </button>
  );
};

export default StyledButton;
