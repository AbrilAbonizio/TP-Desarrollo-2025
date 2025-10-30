interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  step?: string;
  min?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  pattern?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  step,
  min,
  inputMode,
  pattern,
  onKeyPress,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label
        className="form-label"
        style={{ fontSize: "1.2rem", fontWeight: "500" }}
      >
        {label} {required && "*"}
      </label>
      <input
        type={type}
        className="form-control form-control-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        step={step}
        min={min}
        inputMode={inputMode}
        pattern={pattern}
        onKeyPress={onKeyPress}
        style={{
          fontSize: "1.1rem",
          ...(disabled && { backgroundColor: "#e9ecef" }),
        }}
      />
    </div>
  );
}
