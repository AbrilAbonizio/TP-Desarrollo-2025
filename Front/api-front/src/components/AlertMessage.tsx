interface AlertMessageProps {
  type: "loading" | "error" | "success" | "info";
  message?: string;
}

export default function AlertMessage({ type, message }: AlertMessageProps) {
  if (!message && type !== "loading") return null;

  const alertClasses = {
    loading: "alert alert-info",
    error: "alert alert-danger",
    success: "alert alert-success",
    info: "alert alert-info",
  };

  return (
    <div
      className={`${alertClasses[type]} mt-4`}
      style={{ fontSize: "1.1rem" }}
    >
      {type === "loading" && (
        <>
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          ></div>
          Procesando...
        </>
      )}
      {type !== "loading" && message}
    </div>
  );
}
