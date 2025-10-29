interface PrimaryButtonProps {
  texto: string;
  onClick?: () => void;
}

function PrimaryButton({ texto, onClick }: PrimaryButtonProps) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {texto}
    </button>
  );
}

export default PrimaryButton;
