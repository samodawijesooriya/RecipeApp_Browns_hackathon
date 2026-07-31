import { useState, type FormEvent } from "react";
import type { Difficulty, InstructionStep, RecipeDraft } from "../../types/recipe";
import { CATEGORIES } from "../../data/mockData";
import { Icon } from "../Icon";
import { IngredientInput } from "../IngredientInput/IngredientInput";

interface RecipeFormProps {
  /** Prefill (used when forking an existing recipe) */
  initial?: Partial<RecipeDraft>;
  isFork?: boolean;
  onCommit: (draft: RecipeDraft) => void;
}

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export function RecipeForm({ initial, isFork = false, onCommit }: RecipeFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients?.length ? initial.ingredients : ["", "", ""],
  );
  const [steps, setSteps] = useState<InstructionStep[]>(
    initial?.instructions?.length
      ? initial.instructions
      : [{ title: "", text: "" }],
  );
  const [category, setCategory] = useState(initial?.category ?? "Dinner");
  const [cuisine, setCuisine] = useState(initial?.cuisine ?? "");
  const [cookingTime, setCookingTime] = useState(initial?.cookingTime ?? 30);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? "Easy",
  );
  const [servings, setServings] = useState(initial?.servings ?? 2);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [changeNote, setChangeNote] = useState(initial?.changeNote ?? "");
  const [error, setError] = useState("");

  const updateStep = (index: number, patch: Partial<InstructionStep>) =>
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    const cleanSteps = steps.filter((s) => s.text.trim());

    if (!title.trim()) return setError("Give your recipe a name.");
    if (cleanIngredients.length === 0)
      return setError("Add at least one ingredient.");
    if (cleanSteps.length === 0)
      return setError("Write at least one instruction step.");
    if (isFork && !changeNote.trim())
      return setError("Tell the community what you changed in this branch.");

    setError("");
    onCommit({
      title: title.trim(),
      description: description.trim(),
      ingredients: cleanIngredients,
      instructions: cleanSteps.map((s, i) => ({
        title: s.title.trim() || `Step ${i + 1}`,
        text: s.text.trim(),
      })),
      category,
      cuisine: cuisine.trim() || "Home-style",
      cookingTime,
      difficulty,
      servings,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      image: initial?.image,
      parentRecipeId: initial?.parentRecipeId,
      changeNote: changeNote.trim() || undefined,
    });
  };

  const labelCls =
    "mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase";
  const inputCls =
    "w-full rounded-lg border border-outline-variant/60 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basics */}
      <section>
        <label htmlFor="title" className={labelCls}>
          Recipe name
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Grandma's Cinnamon Rolls"
          className={`${inputCls} font-hand !text-2xl !py-3`}
        />
        <label htmlFor="description" className={`${labelCls} mt-4`}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="What makes this recipe special?"
          className={inputCls}
        />
      </section>

      {isFork && (
        <section className="rounded-xl border border-amber-300/60 bg-amber-50 p-4">
          <label htmlFor="changeNote" className={labelCls}>
            <span className="flex items-center gap-1 text-amber-800">
              <Icon name="fork_right" className="text-[16px]" /> What changed?
            </span>
          </label>
          <textarea
            id="changeNote"
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            rows={2}
            placeholder="e.g. Added blueberries, reduced sugar, made it vegan..."
            className={inputCls}
          />
        </section>
      )}

      {/* Meta */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label htmlFor="category" className={labelCls}>
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cuisine" className={labelCls}>
            Cuisine
          </label>
          <input
            id="cuisine"
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Italian, Thai..."
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="time" className={labelCls}>
            Time (minutes)
          </label>
          <input
            id="time"
            type="number"
            min={1}
            value={cookingTime}
            onChange={(e) => setCookingTime(Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="servings" className={labelCls}>
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </section>

      <section>
        <span className={labelCls}>Difficulty</span>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                difficulty === d
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className="rounded-xl border border-outline-variant/40 bg-paper p-5 shadow-sm">
        <h3 className="mb-4 font-hand text-xl font-semibold text-primary">
          What you'll need
        </h3>
        <IngredientInput ingredients={ingredients} onChange={setIngredients} />
      </section>

      {/* Instructions */}
      <section className="rounded-xl border border-outline-variant/40 bg-paper p-5 shadow-sm">
        <h3 className="mb-4 font-hand text-xl font-semibold text-primary">
          The process
        </h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/50 bg-primary-container font-bold text-primary">
                {index + 1}
              </div>
              <div className="w-full space-y-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(index, { title: e.target.value })}
                  placeholder="Step title (optional)"
                  className={`${inputCls} font-semibold`}
                />
                <textarea
                  value={step.text}
                  onChange={(e) => updateStep(index, { text: e.target.value })}
                  rows={2}
                  placeholder="Describe this step..."
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                aria-label={`Remove step ${index + 1}`}
                onClick={() =>
                  setSteps((prev) => prev.filter((_, i) => i !== index))
                }
                disabled={steps.length <= 1}
                className="mt-1 h-8 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-30"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSteps((prev) => [...prev, { title: "", text: "" }])}
          className="mt-3 flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-accent-green-dark transition-colors hover:bg-accent-green/10"
        >
          <Icon name="add" className="text-[18px]" /> Add step
        </button>
      </section>

      <section>
        <label htmlFor="tags" className={labelCls}>
          Tags (comma separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="quick, vegetarian, comfort..."
          className={inputCls}
        />
      </section>

      {error && (
        <p className="flex items-center gap-2 rounded-lg bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          <Icon name="error" className="text-[18px]" /> {error}
        </p>
      )}

      <button
        type="submit"
        className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-accent-green py-4 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
      >
        <Icon name="commit" className="text-2xl" />
        {isFork ? "Commit Branch" : "Commit Recipe"}
      </button>
      <p className="text-center text-xs text-on-surface-variant">
        Your {isFork ? "branch" : "recipe"} will be pending review until an
        admin approves it. The original is never overwritten.
      </p>
    </form>
  );
}
