import { ReactNode } from "react";

interface CardProps {
  title?: string;
  text?: string;
  img?: string;
  children?: ReactNode;
}

export default function Card({ title, text, img, children }: CardProps) {
  return (
    <div className="card h-100 shadow-sm">
      {img && (
        <img
          src={img}
          className="card-img-top"
          alt={title}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <div className="card-body d-flex flex-column">
        {title && (
          <h5
            className="card-title"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {title}
          </h5>
        )}
        {text && (
          <p className="card-text flex-grow-1" style={{ fontSize: "1.1rem" }}>
            {text}
          </p>
        )}
        {children && <div className="mt-auto">{children}</div>}
      </div>
    </div>
  );
}
