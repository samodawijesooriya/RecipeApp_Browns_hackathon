import { useMemo, useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { searchRecipes } from "../utils/search";
import { CATEGORIES } from "../data/mockData";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { RecipeCard } from "../components/RecipeCard/RecipeCard";
import { Icon } from "../components/Icon";
import type { Difficulty, Recipe } from "../types/recipe";

const TIME_FILTERS = [
  { label: "Any time", max: Infinity },
  { label: "Under 15m", max: 15 },
  { label: "Under 30m", max: 30 },
  { label: "Under 60m", max: 60 },
];

/** The full recipe database: global search + filters + delete. */
export function Library() {
  const { recipes, users, currentUser, deleteRecipe } = useRecipes();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [maxTime, setMaxTime] = useState(Infinity);
  const [confirmDelete, setConfirmDelete] = useState<Recipe | null>(null);

  const results = useMemo(() => {
    // Members see approved recipes plus their own pending commits;
    // admins see everything so they can review.
    let pool = recipes.filter(
      (r) =>
        r.status === "approved" ||
        r.authorId === currentUser.id ||
        currentUser.role === "admin",
    );
    pool = searchRecipes(pool, users, query);
    if (category !== "All") pool = pool.filter((r) => r.category === category);
    if (difficulty !== "All")
      pool = pool.filter((r) => r.difficulty === difficulty);
    pool = pool.filter((r) => r.cookingTime <= maxTime);
    return pool;
  }, [recipes, users, currentUser, query, category, difficulty, maxTime]);

  const handleDelete = (recipe: Recipe) => setConfirmDelete(recipe);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-on-surface md:text-5xl">
          Recipe Library
        </h1>
        <p className="text-lg text-on-surface-variant">
          Every recipe on the fridge. Search by name, ingredient, cuisine, or
          chef.
        </p>
      </header>

      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant">
          <Icon name="tune" className="text-[18px]" /> Filters:
        </span>
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-full border border-outline-variant/60 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | "All")}
          className="rounded-full border border-outline-variant/60 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <div className="flex gap-1">
          {TIME_FILTERS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setMaxTime(t.max)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                maxTime === t.max
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-on-surface-variant">
          {results.length} recipe{results.length === 1 ? "" : "s"}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center">
          <Icon name="search_off" className="text-6xl text-on-surface-variant/40" />
          <p className="mt-4 font-hand text-2xl text-on-surface-variant">
            No recipes match — try loosening the filters.
          </p>
        </div>
      ) : (
        <div className="masonry">
          {results.map((recipe) => (
            <div key={recipe.id} className="masonry-item">
              <RecipeCard
                recipe={recipe}
                onDelete={
                  recipe.authorId === currentUser.id ||
                  currentUser.role === "admin"
                    ? handleDelete
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-paper p-6 shadow-2xl">
            <h2 className="mb-2 font-hand text-2xl font-semibold text-on-surface">
              Take this note off the fridge?
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              "{confirmDelete.title}" and all of its branches will be removed.
              This can't be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRecipe(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Delete recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
