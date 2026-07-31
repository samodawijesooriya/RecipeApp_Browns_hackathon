import { Icon } from "./Icon";
import { useRecipes } from "../context/RecipeContext";
import type { Recipe } from "../types/recipe";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function VoteControls({ recipe }: { recipe: Recipe }) {
  const { votes, vote, voteScore } = useRecipes();
  const current = votes[recipe.id];

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Upvote"
        onClick={(e) => {
          e.stopPropagation();
          vote(recipe.id, 1);
        }}
        className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold transition-colors ${
          current === 1
            ? "bg-accent-green/15 text-accent-green-dark"
            : "text-on-surface-variant hover:text-accent-green-dark hover:bg-accent-green/10"
        }`}
      >
        <Icon name="keyboard_arrow_up" className="text-[20px]" />
        {formatCount(voteScore(recipe))}
      </button>
      <button
        type="button"
        aria-label="Downvote"
        onClick={(e) => {
          e.stopPropagation();
          vote(recipe.id, -1);
        }}
        className={`rounded-full p-1 transition-colors ${
          current === -1
            ? "bg-error/10 text-error"
            : "text-on-surface-variant hover:text-error hover:bg-error/10"
        }`}
      >
        <Icon name="keyboard_arrow_down" className="text-[20px]" />
      </button>
    </div>
  );
}
