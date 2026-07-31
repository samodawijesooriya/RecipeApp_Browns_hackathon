interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
}

export function Icon({ name, className = "", fill = false }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${fill ? "fill-icon" : ""} ${className}`}
    >
      {name}
    </span>
  );
}
