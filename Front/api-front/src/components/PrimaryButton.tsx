interface PrimaryButtonProps {
  texto: string;
}

function PrimaryButton({ texto }: PrimaryButtonProps) {
  return <button className="btn btn-primary">{texto}</button>;
}

export default PrimaryButton;
