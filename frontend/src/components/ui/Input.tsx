import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
          placeholder:text-slate-400
          ${error
            ? "border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-500"
            : "border-slate-200 bg-white hover:border-slate-300"
          }
          disabled:bg-slate-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
);
Input.displayName = "Input";
