interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Array<{ value: string | number; label: string }>;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = "Seleccione una opción",
}: FormSelectProps) {
  return (
    <div className="mb-4">
      <label
        className="form-label"
        style={{ fontSize: "1.2rem", fontWeight: "500" }}
      >
        {label} {required && "*"}
      </label>
      <select
        className="form-select form-select-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ fontSize: "1.1rem" }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
