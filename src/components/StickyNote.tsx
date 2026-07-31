import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types/recipe";
import { noteDecor } from "../utils/noteStyle";
import { Icon } from "./Icon";
import { RecipeImage } from "./RecipeImage";

interface StickyNoteProps {
  recipe: Recipe;
  /** Extra footer content (e.g. an "Approved" pill) */
  footer?: React.ReactNode;
  className?: string;
}

/** A recipe pinned to the fridge as a pastel sticky note. */
export function StickyNote({ recipe, footer, className = "" }: StickyNoteProps) {
  const navigate = useNavigate();
  const decor = noteDecor(recipe.id);

  return (
    <button
      type="button"
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      style={{ transform: `rotate(${decor.rotation}deg)` }}
      className={`sticky-note note-in w-full cursor-pointer rounded-lg p-4 text-left ${decor.pastel} ${className}`}
    >
      {decor.fastener === "magnet" ? (
        <div className={`magnet ${decor.magnet}`} />
      ) : (
        <div className="tape" />
      )}

      <h3 className="mt-2 mb-3 text-center font-hand text-xl leading-tight font-semibold text-on-surface">
        {recipe.title}
      </h3>

      <div className="relative mb-3 h-32 w-full overflow-hidden rounded border border-black/10 bg-white">
        <RecipeImage
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Icon name="timer" className="text-[16px]" /> {recipe.cookingTime}m
        </span>
        <span className="flex items-center gap-1">
          <Icon name="bar_chart" className="text-[16px]" /> {recipe.difficulty}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="fork_right" className="text-[16px]" /> {recipe.forkCount}
        </span>
      </div>

      {footer && <div className="mt-2 flex justify-center">{footer}</div>}
    </button>
  );
}
