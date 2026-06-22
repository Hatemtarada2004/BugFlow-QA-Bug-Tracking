interface BadgeProps {
  label: string;
  className: string;
}

export const Badge = ({ label, className }: BadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${className}`}
  >
    {label}
  </span>
);
