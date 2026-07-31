import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { RecipeForm } from "../components/RecipeForm/RecipeForm";
import { Icon } from "../components/Icon";
import type { Recipe, RecipeDraft } from "../types/recipe";

/** The recipe journal: commit a new recipe or a branch of an existing one. */
export function CommitRecipe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getRecipe, addRecipe } = useRecipes();
  const [committed, setCommitted] = useState<Recipe | null>(null);

  const forkId = searchParams.get("fork");
  const parent = forkId ? getRecipe(forkId) : undefined;
  const isFork = Boolean(parent);

  const initial: Partial<RecipeDraft> | undefined = parent
    ? {
        title: `${parent.title} (my version)`,
        description: parent.description,
        ingredients: [...parent.ingredients],
        instructions: parent.instructions.map((s) => ({ ...s })),
        category: parent.category,
        cuisine: parent.cuisine,
        cookingTime: parent.cookingTime,
        difficulty: parent.difficulty,
        servings: parent.servings,
        tags: [...parent.tags],
        image: parent.image,
        parentRecipeId: parent.id,
      }
    : undefined;

  const handleCommit = (draft: RecipeDraft) => {
    const recipe = addRecipe(draft);
    setCommitted(recipe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (committed) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center md:px-12">
        <div className="pastel-mint sticky-note mx-auto max-w-md rotate-[-2deg] rounded-xl p-8">
          <div className="magnet mag-green" />
          <Icon name="check_circle" fill className="mt-2 text-6xl text-accent-green-dark" />
          <h1 className="mt-4 font-hand text-3xl font-semibold text-on-surface">
            {isFork ? "Submitted for approval!" : "Recipe sent for review!"}
          </h1>
          <p className="mt-3 text-on-surface-variant">
            "{committed.title}" is <strong>waiting for approval</strong>. It will
            appear on the fridge once an admin approves it.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/recipe/${committed.id}`)}
            className="rounded-lg bg-accent-green px-5 py-2.5 font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            View & review it
          </button>
          <Link
            to="/"
            className="rounded-lg border border-outline-variant/60 px-5 py-2.5 font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Back to the fridge
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-12">
      <header className="mb-8">
        <p className="mb-1 flex items-center gap-2 font-hand text-lg text-on-surface-variant">
          <Icon name="edit_note" className="text-2xl" />
          {isFork ? "Make this recipe your way..." : "Write a new recipe..."}
        </p>
        <h1 className="text-4xl font-bold text-on-surface md:text-5xl">
          {isFork ? "Make it my way" : "Add a Recipe"}
        </h1>
        {parent && (
          <p className="mt-3 flex items-center gap-2 rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
            <Icon name="account_tree" className="text-primary" />
            Starting from{" "}
            <Link
              to={`/recipe/${parent.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {parent.title}
            </Link>
            — the original recipe is never changed.
          </p>
        )}
      </header>

      <div className="notebook-lines rounded-xl border border-outline-variant/30 bg-paper p-5 shadow-lg md:p-8">
        <RecipeForm initial={initial} isFork={isFork} onCommit={handleCommit} />
      </div>
    </main>
  );
}
