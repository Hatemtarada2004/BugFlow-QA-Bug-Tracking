import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-white transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
          hover:border-slate-300 cursor-pointer
          ${error
            ? "border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-500"
            : "border-slate-200"
          } ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {error}</p>
      )}
    </div>
  )
);
Select.displayName = "Select";
