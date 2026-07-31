import { Icon } from "../Icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Icon
        name="search"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search recipes, ingredients, cuisines, chefs..."}
        className="w-full rounded-full border border-outline-variant/60 bg-white py-3 pr-4 pl-12 text-on-surface shadow-sm transition-shadow placeholder:text-on-surface-variant/60 focus:border-primary focus:shadow-md focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      )}
    </div>
  );
}
