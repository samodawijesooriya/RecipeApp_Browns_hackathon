import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { Icon } from "../components/Icon";
import { RecipeImage } from "../components/RecipeImage";
import { VoteControls } from "../components/VoteControls";

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getRecipe,
    getBranches,
    users,
    currentUser,
    isSaved,
    toggleSave,
    approveRecipe,
    rejectRecipe,
  } = useRecipes();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const recipe = id ? getRecipe(id) : undefined;

  if (!recipe) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <Icon name="no_meals" className="text-6xl text-on-surface-variant/40" />
        <h1 className="mt-4 font-hand text-3xl text-on-surface">
          This note fell off the fridge.
        </h1>
        <Link
          to="/library"
          className="mt-4 inline-block font-semibold text-primary hover:underline"
        >
          Back to the library →
        </Link>
      </main>
    );
  }

  const author = users[recipe.authorId];
  const branches = getBranches(recipe.id).filter(
    (b) => b.status === "approved" || currentUser.role === "admin",
  );
  const parent = recipe.parentRecipeId
    ? getRecipe(recipe.parentRecipeId)
    : undefined;
  const saved = isSaved(recipe.id);

  const toggleIngredient = (index: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 md:px-12">
      {/* Pending review banner (admin actions) */}
      {recipe.status === "pending" && (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-300/70 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <Icon name="pending_actions" className="text-3xl text-amber-600" />
          <div className="flex-grow">
            <p className="font-semibold text-amber-900">
              This {recipe.parentRecipeId ? "version" : "recipe"} is waiting
              for approval.
            </p>
            <p className="text-sm text-amber-800">
              It's invisible to the community until an admin approves it.
            </p>
          </div>
          {currentUser.role === "admin" && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => approveRecipe(recipe.id)}
                className="rounded-lg bg-accent-green px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectRecipe(recipe.id);
                  navigate("/library");
                }}
                className="rounded-lg border border-error/40 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error/10"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Branch lineage */}
      {parent && (
        <div className="flex items-center gap-2 rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
          <Icon name="account_tree" className="text-primary" />
          <span>
            Inspired by{" "}
            <Link
              to={`/recipe/${parent.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {parent.title}
            </Link>
          </span>
          {recipe.changeNote && (
            <span className="ml-2 hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 md:inline">
              What changed: {recipe.changeNote}
            </span>
          )}
        </div>
      )}

      {/* Hero */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="sticky-note relative rounded-xl bg-surface-container p-3 lg:col-span-7">
          <div className="absolute -top-3 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rotate-2 rounded-sm bg-yellow-200/60 shadow-sm" />
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <RecipeImage
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute right-0 bottom-0 left-0 flex h-24 items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-4">
              <div className="flex items-center gap-3">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-10 w-10 rounded-full border-2 border-white/50 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-primary font-hand text-white">
                    {author?.name[0] ?? "?"}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-white drop-shadow-md">
                    Crafted by
                  </p>
                  <p className="text-lg font-semibold text-white drop-shadow-md">
                    {author?.name ?? "Unknown chef"}
                    <span className="ml-2 text-xs font-normal opacity-90">
                      {author ? `${author.reputation.toLocaleString()} rep` : ""}
                    </span>
                  </p>
                </div>
              </div>
              <VoteControls recipe={recipe} />
            </div>
          </div>
        </div>

        {/* Meta notebook */}
        <div className="notebook-lines relative flex h-full min-h-[400px] flex-col rounded-lg border border-outline-variant/30 bg-paper p-6 shadow-lg md:p-8 lg:col-span-5">
          <div className="absolute -top-2 right-8 flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 bg-blue-400 shadow-md">
            <Icon name="star" fill className="text-sm text-white" />
          </div>
          <div className="mt-2 mb-8">
            <h1 className="mb-2 font-hand text-4xl leading-tight font-semibold text-on-surface md:text-5xl">
              {recipe.title}
            </h1>
            <p className="text-on-surface-variant">{recipe.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8 grid flex-grow grid-cols-2 gap-6">
            {[
              { icon: "timer", label: "Cooking Time", value: `${recipe.cookingTime} min` },
              { icon: "bar_chart", label: "Difficulty", value: recipe.difficulty },
              { icon: "group", label: "Servings", value: String(recipe.servings) },
              { icon: "public", label: "Cuisine", value: recipe.cuisine },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-on-surface-variant uppercase">
                  <Icon name={item.icon} className="text-lg" /> {item.label}
                </span>
                <span className="text-xl font-semibold text-on-surface">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-4 border-t border-outline-variant/30 pt-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="fork_right" className="text-[18px]" /> {recipe.forkCount} versions
            </span>
            <span className="flex items-center gap-1">
              <Icon name="bookmark" className="text-[18px]" /> {recipe.saveCount} saves
            </span>
            <span className="ml-auto rounded-full bg-surface-container px-3 py-1 text-xs font-bold">
              v{recipe.version}
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/commit?fork=${recipe.id}`)}
              className="flex flex-grow transform items-center justify-center gap-2 rounded-lg bg-accent-green py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:scale-95"
            >
              <Icon name="fork_right" fill /> Make it my way
            </button>
            <button
              type="button"
              aria-label={saved ? "Unsave" : "Save"}
              onClick={() => toggleSave(recipe.id)}
              className={`rounded-lg border border-outline-variant/50 p-3 transition-colors active:scale-95 ${
                saved
                  ? "bg-accent-green/15 text-accent-green-dark"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              <Icon name={saved ? "bookmark_added" : "bookmark"} fill={saved} />
            </button>
          </div>
        </div>
      </section>

      {/* Ingredients & instructions */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="rounded-xl border border-outline-variant/40 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-6 border-b border-outline-variant/30 pb-2 font-hand text-xl font-semibold text-primary">
            What you'll need
          </h3>
          <ul className="space-y-4 text-lg text-on-surface">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-3">
                <input
                  id={`ing-${index}`}
                  type="checkbox"
                  checked={checked.has(index)}
                  onChange={() => toggleIngredient(index)}
                  className="h-5 w-5 cursor-pointer rounded accent-[#4caf50]"
                />
                <label
                  htmlFor={`ing-${index}`}
                  className={`cursor-pointer transition-colors ${
                    checked.has(index)
                      ? "text-on-surface-variant/50 line-through"
                      : ""
                  }`}
                >
                  {ingredient}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-xl border border-outline-variant/40 bg-white p-6 shadow-sm md:p-8 lg:col-span-8">
          <h3 className="mb-6 border-b border-outline-variant/30 pb-2 font-hand text-xl font-semibold text-primary">
            The Process
          </h3>
          <div className="space-y-8 text-on-surface">
            {recipe.instructions.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/50 bg-primary-container font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold">{step.title}</p>
                  <p className="leading-relaxed text-on-surface-variant">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community variations */}
      {branches.length > 0 && (
        <section className="mt-4 border-t border-outline-variant/30 pt-8">
          <div className="mb-6 flex items-center gap-3">
            <Icon name="account_tree" className="text-2xl text-primary" />
            <h3 className="text-2xl font-semibold text-on-surface">
              Community Variations
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {branches.map((branch) => {
              const branchAuthor = users[branch.authorId];
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => navigate(`/recipe/${branch.id}`)}
                  className="group cursor-pointer rounded-xl border border-outline-variant/20 bg-surface-container p-5 text-left shadow-sm transition-colors hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        branch.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {branch.status === "pending" ? "Waiting" : "Approved"}
                    </span>
                    <Icon
                      name="arrow_outward"
                      className="text-sm text-on-surface-variant transition-colors group-hover:text-primary"
                    />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-on-surface">
                    {branch.title}
                  </h4>
                  <p className="mb-4 text-sm text-on-surface-variant">
                    {branch.changeNote ?? branch.description}
                  </p>
                  <div className="flex items-center gap-2">
                    {branchAuthor?.avatar ? (
                      <img
                        src={branchAuthor.avatar}
                        alt={branchAuthor.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                        {branchAuthor?.name[0] ?? "?"}
                      </div>
                    )}
                    <span className="text-xs text-on-surface-variant">
                      by {branchAuthor?.handle ?? "unknown"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
