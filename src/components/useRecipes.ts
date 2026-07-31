import { useCallback, useEffect, useState } from "react";
import type { NewRecipeInput, StoredRecipe } from "./types";

const STORAGE_KEY = "kitchenboard-recipes";

function readFromStorage(): StoredRecipe[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Couldn't read recipes from localStorage:", err);
    return [];
  }
}

function writeToStorage(recipes: StoredRecipe[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (err) {
    console.error("Couldn't save recipes to localStorage:", err);
  }
}

/**
 * Reads/writes the user's committed recipes to localStorage and keeps
 * React state in sync. Also listens for the `storage` event so multiple
 * tabs stay consistent.
 */
export function useRecipes() {
  const [recipes, setRecipes] = useState<StoredRecipe[]>(() =>
    readFromStorage()
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setRecipes(readFromStorage());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addRecipe = useCallback((input: NewRecipeInput) => {
    const newRecipe: StoredRecipe = {
      ...input,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `recipe-${Date.now()}`,
      createdAt: Date.now(),
    };

    setRecipes((prev) => {
      const next = [newRecipe, ...prev];
      writeToStorage(next);
      return next;
    });

    return newRecipe;
  }, []);

  const removeRecipe = useCallback((id: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  return { recipes, addRecipe, removeRecipe };
}