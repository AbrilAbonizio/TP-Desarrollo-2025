import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

function Card(props: CardProps) {
  const { children } = props;
  return <div className="card ">{children}</div>;
}

export default Card;
