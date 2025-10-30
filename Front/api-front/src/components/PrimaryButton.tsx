interface PrimaryButtonProps {
  texto: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' | 'link';
}

function PrimaryButton({ texto, onClick, color = 'primary' }: PrimaryButtonProps) {
  return (
    <button type="button" className={`btn btn-${color}`} onClick={onClick}>
      {texto}
    </button>
  );
}

interface PrimaryOutlineButtonProps {
  texto: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
}

export function PrimaryOutlineButton({ texto, onClick, color = 'primary' }: PrimaryOutlineButtonProps) {
  return (
    <button type="button" className={`btn btn-outline-${color}`} onClick={onClick}>
      {texto}
    </button>
  );
}

export default PrimaryButton;
