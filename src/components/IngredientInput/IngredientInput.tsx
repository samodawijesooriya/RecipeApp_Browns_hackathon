import { Icon } from "../Icon";

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

/** Repeatable ingredient rows for the recipe journal. */
export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const update = (index: number, value: string) =>
    onChange(ingredients.map((ing, i) => (i === index ? value : ing)));

  const remove = (index: number) =>
    onChange(ingredients.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent-green/60" />
          <input
            type="text"
            value={ingredient}
            onChange={(e) => update(index, e.target.value)}
            placeholder={`Ingredient ${index + 1} — e.g. 2 cups flour`}
            className="w-full rounded-lg border border-outline-variant/60 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            aria-label={`Remove ingredient ${index + 1}`}
            onClick={() => remove(index)}
            disabled={ingredients.length <= 1}
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-30"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...ingredients, ""])}
        className="mt-1 flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-accent-green-dark transition-colors hover:bg-accent-green/10"
      >
        <Icon name="add" className="text-[18px]" /> Add ingredient
      </button>
    </div>
  );
}
