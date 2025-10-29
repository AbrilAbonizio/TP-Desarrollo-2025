import { ReactNode } from "react";

interface GeneralCardProps {
  title: string;
  text: string;
  img?: string;
  children?: ReactNode;
}

function GeneralCard(props: GeneralCardProps) {
  const { title, text, img, children } = props;
  return (
    <div className="card h-100 shadow-sm border">
      <img
        src={img}
        className="card-img-top"
        alt={title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text flex-grow-1">{text}</p>
        <div className="mt-auto">{children}</div>
      </div>
    </div>
  );
}

export default GeneralCard;
