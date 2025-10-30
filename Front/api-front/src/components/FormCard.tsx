import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
  borderColor?: string;
  titleColor?: string;
  warning?: string;
}

export default function FormCard({
  title,
  children,
  borderColor,
  titleColor = "#000",
  warning,
}: FormCardProps) {
  return (
    <div
      className={`card mt-4 shadow-lg ${
        borderColor ? `border-${borderColor}` : ""
      }`}
    >
      <div className="card-body p-4">
        <h4
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            color: titleColor,
          }}
        >
          {title}
        </h4>
        {warning && (
          <div className="alert alert-warning" style={{ fontSize: "1.1rem" }}>
            <strong>⚠️ Advertencia:</strong> {warning}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
