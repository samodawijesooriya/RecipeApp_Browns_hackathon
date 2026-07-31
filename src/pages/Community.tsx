import { useMemo, useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { CATEGORIES } from "../data/mockData";
import { RecipeCard } from "../components/RecipeCard/RecipeCard";

const FILTERS = ["All", "Trending Today", ...CATEGORIES] as const;

/** Reddit-style community feed of paper recipe cards. */
export function Community() {
  const { recipes } = useRecipes();
  const [filter, setFilter] = useState<string>("All");

  const feed = useMemo(() => {
    const visible = recipes.filter((r) => r.status === "approved");
    if (filter === "Trending Today") {
      return [...visible].sort(
        (a, b) =>
          b.votes + b.forkCount * 50 - (a.votes + a.forkCount * 50),
      );
    }
    if (filter !== "All") {
      return visible.filter((r) => r.category === filter);
    }
    return [...visible].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [recipes, filter]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="mb-2 text-4xl font-bold text-on-surface md:text-5xl">
          Community Kitchen
        </h1>
        <p className="text-lg text-on-surface-variant">
          See what's cooking right now. Vote, fork, and pin your favorites.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border border-outline-variant/30 px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {feed.length === 0 ? (
        <p className="py-20 text-center font-hand text-2xl text-on-surface-variant">
          Nothing simmering in this category yet — be the first to commit one!
        </p>
      ) : (
        <div className="masonry">
          {feed.map((recipe) => (
            <div key={recipe.id} className="masonry-item">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
