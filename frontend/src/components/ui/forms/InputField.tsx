import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: any;
  error?: { message?: string };
}

export default function InputField({ label, name, register, error, ...rest }: InputFieldProps) {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        id={name}
        {...register(name)}
        {...rest}
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
      />
      {error && <span className="text-sm text-error mt-1">{error.message}</span>}
    </div>
  );
}
