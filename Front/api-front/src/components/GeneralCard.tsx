import { ReactNode } from "react";

interface DataItemProps {
  label: string;
  value: ReactNode;
  isLast?: boolean;
}

function DataItem({ label, value, isLast = false }: DataItemProps) {
  return (
    <p style={{ fontSize: "1.2rem", marginBottom: isLast ? "0" : "0.5rem" }}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

interface GeneralCardProps {
  title?: string;
  data: Array<{ label: string; value: ReactNode }>;
  bgColor?: string;
  titleColor?: string;
}

export default function GeneralCard({
  title,
  data,
  bgColor = "bg-light",
  titleColor = "#0d6efd",
}: GeneralCardProps) {
  return (
    <div className={`card mt-4 shadow-extra-dark ${bgColor}`}>
      <div className="card-body">
        {title && (
          <h5 style={{ fontSize: "1.5rem", color: titleColor }}>{title}</h5>
        )}
        {data.map((item, index) => (
          <DataItem
            key={index}
            label={item.label}
            value={item.value}
            isLast={index === data.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
