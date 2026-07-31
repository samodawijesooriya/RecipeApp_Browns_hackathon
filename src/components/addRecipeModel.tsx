import React, { useRef, useState } from "react";
import { Camera, Check, Clock, Flame, Utensils, X } from "lucide-react";
import type { NewRecipeInput } from "./types";

interface AddRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onCommit: (recipe: NewRecipeInput) => void;
}

const emptyForm: NewRecipeInput = {
  title: "",
  photo: null,
  prepTime: "",
  cookTime: "",
  servings: "",
  ingredients: "",
  instructions: "",
  notes: "",
};

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  open,
  onClose,
  onCommit,
}) => {
  const [form, setForm] = useState<NewRecipeInput>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const update = <K extends keyof NewRecipeInput>(
    key: K,
    value: NewRecipeInput[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCommit = () => {
    if (!form.title.trim()) return; // require at least a name
    onCommit(form);
    setForm(emptyForm);
    onClose();
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Add a new recipe"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-3xl rounded-2xl bg-[#fbf3ee] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-black/5">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            <X className="h-4 w-4" />
            Back
          </button>
          <span className="font-serif text-lg text-slate-700">
            KitchenBoard
          </span>
          <span className="w-12" aria-hidden="true" />
        </div>

        <div className="px-8 py-8">
          <h1 className="font-serif text-4xl font-extrabold text-slate-900 mb-6">
            Add a New Recipe
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            {/* Photo upload */}
            <label className="relative mx-auto flex max-w-xl -rotate-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 py-16 text-slate-500 shadow-inner cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoPick}
              />
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Recipe preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <Camera className="h-6 w-6 mb-2" />
                  <span className="font-medium">Tap to pin a photo</span>
                </>
              )}
            </label>

            {/* Recipe name */}
            <div className="mt-8">
              <label
                htmlFor="recipe-name"
                className="block font-serif font-semibold text-slate-800 mb-2"
              >
                Recipe Name
              </label>
              <input
                id="recipe-name"
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g., Grandma's Sunday Sauce"
                className="w-full border-b border-slate-300 bg-transparent pb-2 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-600"
              />
            </div>

            {/* Details + Ingredients/Instructions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-[13rem_1fr] gap-6">
              {/* Prep / cook / servings */}
              <div className="rounded-lg bg-rose-50 p-5 space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <Clock className="h-3.5 w-3.5" />
                    Prep Time
                  </div>
                  <input
                    type="text"
                    value={form.prepTime}
                    onChange={(e) => update("prepTime", e.target.value)}
                    placeholder="15 mins"
                    className="mt-1 w-full border-b border-slate-300 bg-transparent pb-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-600"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <Flame className="h-3.5 w-3.5" />
                    Cook Time
                  </div>
                  <input
                    type="text"
                    value={form.cookTime}
                    onChange={(e) => update("cookTime", e.target.value)}
                    placeholder="45 mins"
                    className="mt-1 w-full border-b border-slate-300 bg-transparent pb-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-600"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <Utensils className="h-3.5 w-3.5" />
                    Servings
                  </div>
                  <input
                    type="text"
                    value={form.servings}
                    onChange={(e) => update("servings", e.target.value)}
                    placeholder="4"
                    className="mt-1 w-full border-b border-slate-300 bg-transparent pb-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>

              {/* Ingredients + Instructions */}
              <div className="space-y-8">
                <div>
                  <label
                    htmlFor="ingredients"
                    className="block font-serif font-semibold text-slate-800 mb-2"
                  >
                    Ingredients
                  </label>
                  <textarea
                    id="ingredients"
                    value={form.ingredients}
                    onChange={(e) => update("ingredients", e.target.value)}
                    placeholder={"- 2 cups flour\n- 1 tsp salt\n..."}
                    rows={4}
                    className="w-full resize-none border-b border-slate-200 bg-transparent leading-8 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-600"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.08) 32px)",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="instructions"
                    className="block font-serif font-semibold text-slate-800 mb-2"
                  >
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    value={form.instructions}
                    onChange={(e) => update("instructions", e.target.value)}
                    placeholder={
                      "1. Preheat the oven...\n2. Mix the dry ingredients...\n..."
                    }
                    rows={5}
                    className="w-full resize-none border-b border-slate-200 bg-transparent leading-8 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-600"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.08) 32px)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Personal notes */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <label
                htmlFor="notes"
                className="block font-serif font-semibold text-slate-800 mb-2"
              >
                Personal Notes / Memories
              </label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Tastes better the next day!"
                rows={2}
                className="w-full resize-none bg-transparent italic text-slate-600 placeholder:text-slate-400 placeholder:italic focus:outline-none"
              />
            </div>
          </div>

          {/* Commit button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleCommit}
              disabled={!form.title.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Commit Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;