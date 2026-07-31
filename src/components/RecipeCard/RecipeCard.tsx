import { useNavigate } from "react-router-dom";
import type { Recipe, RecipeBadge } from "../../types/recipe";
import { useRecipes } from "../../context/RecipeContext";
import { noteDecor } from "../../utils/noteStyle";
import { Icon } from "../Icon";
import { RecipeImage } from "../RecipeImage";
import { VoteControls } from "../VoteControls";

const BADGE_META: Record<RecipeBadge, { label: string; icon: string; className: string }> = {
  trending: { label: "TRENDING", icon: "local_fire_department", className: "bg-orange-500 text-white" },
  "most-forked": { label: "MOST REMIXED", icon: "fork_right", className: "bg-primary text-white" },
  "editors-pick": { label: "EDITOR'S PICK", icon: "star", className: "bg-amber-500 text-white" },
  "recently-approved": { label: "RECENTLY APPROVED", icon: "verified", className: "bg-accent-green text-white" },
};

interface RecipeCardProps {
  recipe: Recipe;
  /** Show a delete button (used in Library for your own recipes / admin) */
  onDelete?: (recipe: Recipe) => void;
}

/** Reddit-style community card, dressed as a paper note. */
export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const navigate = useNavigate();
  const { users, isSaved, toggleSave } = useRecipes();
  const author = users[recipe.authorId];
  const decor = noteDecor(recipe.id);
  const badge = recipe.badge ? BADGE_META[recipe.badge] : undefined;
  const saved = isSaved(recipe.id);

  return (
    <article
      className={`sticky-note note-in relative rounded-lg p-3 ${decor.pastel}`}
      style={{ transform: `rotate(${decor.rotation * 0.4}deg)` }}
    >
      {decor.fastener === "magnet" ? (
        <div className={`magnet ${decor.magnet}`} />
      ) : (
        <div className="tape" />
      )}

      {badge && (
        <div
          className={`absolute top-4 right-4 z-10 flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold tracking-wider shadow-sm ${badge.className}`}
        >
          <Icon name={badge.icon} fill className="text-[12px]" />
          {badge.label}
        </div>
      )}

      {recipe.status === "pending" && (
        <div className="absolute top-4 left-4 z-10 rounded bg-amber-100 px-2 py-1 text-[10px] font-bold tracking-wider text-amber-800 shadow-sm">
          WAITING FOR APPROVAL
        </div>
      )}

      <div
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/recipe/${recipe.id}`)}
        className="group relative mb-3 cursor-pointer overflow-hidden rounded"
      >
        <RecipeImage
          src={recipe.image}
          alt={recipe.title}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="glass-panel absolute right-0 bottom-0 left-0 border-t border-white/20 p-3">
          <h3 className="font-hand text-lg leading-tight font-semibold text-on-surface">
            {recipe.title}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="person" className="text-[14px]" />
              {author?.handle ?? "unknown"}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="timer" className="text-[14px]" />
              {recipe.cookingTime}m
            </span>
            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold">
              {recipe.category}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-on-surface/10 px-1 pt-2">
        <VoteControls recipe={recipe} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Make it my way"
            title="Make it my way"
            onClick={() => navigate(`/commit?fork=${recipe.id}`)}
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
          >
            <Icon name="fork_right" className="text-[18px]" />
          </button>
          <button
            type="button"
            aria-label={saved ? "Unsave recipe" : "Save recipe"}
            onClick={() => toggleSave(recipe.id)}
            className={`rounded-full p-1.5 transition-colors ${
              saved
                ? "text-accent-green-dark"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            <Icon name={saved ? "bookmark_added" : "bookmark"} fill={saved} className="text-[18px]" />
          </button>
          {onDelete && (
            <button
              type="button"
              aria-label="Delete recipe"
              title="Delete recipe"
              onClick={() => onDelete(recipe)}
              className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
            >
              <Icon name="delete" className="text-[18px]" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
