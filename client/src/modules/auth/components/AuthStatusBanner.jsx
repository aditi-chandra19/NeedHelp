import { CircleAlert, CircleCheckBig } from "lucide-react";

export default function AuthStatusBanner({ type, message }) {
  if (!message) {
    return null;
  }

  const styles =
    type === "error"
      ? "nh-status-error"
      : "nh-status-success";

  return (
    <div className={`mt-5 flex items-start gap-3 ${styles}`}>
      {type === "error" ? (
        <CircleAlert size={18} className="mt-0.5 shrink-0" />
      ) : (
        <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
}
