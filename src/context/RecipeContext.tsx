/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppNotification,
  Recipe,
  RecipeDraft,
  User,
} from "../types/recipe";
import {
  CURRENT_USER_ID,
  mockNotifications,
  mockRecipes,
  mockUsers,
} from "../data/mockData";

export type VoteDirection = 1 | -1;

interface PersistedState {
  version: 3;
  recipes: Recipe[];
  savedIds: string[];
  /** Current user's vote direction per recipe (UI highlight only). Counts live on recipe.votes. */
  votes: Record<string, VoteDirection>;
  notifications: AppNotification[];
}

interface RecipeContextValue {
  recipes: Recipe[];
  users: Record<string, User>;
  currentUser: User;
  notifications: AppNotification[];
  savedIds: string[];
  votes: Record<string, VoteDirection>;
  getRecipe: (id: string) => Recipe | undefined;
  getBranches: (id: string) => Recipe[];
  voteScore: (recipe: Recipe) => number;
  addRecipe: (draft: RecipeDraft) => Recipe;
  deleteRecipe: (id: string) => void;
  approveRecipe: (id: string) => void;
  rejectRecipe: (id: string) => void;
  vote: (recipeId: string, direction: VoteDirection) => void;
  toggleSave: (recipeId: string) => void;
  isSaved: (recipeId: string) => boolean;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

const STORAGE_KEY = "kitchenboard-state-v3";

function isRecipe(value: unknown): value is Recipe {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.title === "string" &&
    typeof r.authorId === "string" &&
    typeof r.votes === "number" &&
    Array.isArray(r.ingredients) &&
    Array.isArray(r.instructions)
  );
}

function isNotification(value: unknown): value is AppNotification {
  if (!value || typeof value !== "object") return false;
  const n = value as Record<string, unknown>;
  return typeof n.id === "string" && typeof n.message === "string";
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const data = parsed as Record<string, unknown>;
    if (data.version !== 3) return null;
    if (!Array.isArray(data.recipes) || !data.recipes.every(isRecipe)) return null;
    if (!Array.isArray(data.savedIds) || !data.savedIds.every((id) => typeof id === "string"))
      return null;
    if (!data.votes || typeof data.votes !== "object") return null;
    if (!Array.isArray(data.notifications) || !data.notifications.every(isNotification))
      return null;
    return data as unknown as PersistedState;
  } catch {
    return null;
  }
}

const usersById: Record<string, User> = Object.fromEntries(
  mockUsers.map((u) => [u.id, u]),
);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const persisted = useMemo(() => loadPersisted(), []);

  const [recipes, setRecipes] = useState<Recipe[]>(
    persisted?.recipes ?? mockRecipes,
  );
  const [savedIds, setSavedIds] = useState<string[]>(
    persisted?.savedIds ?? ["r-salmon", "r-kottu", "r-pancakes", "r-kiribath", "r-sourdough"],
  );
  const [votes, setVotes] = useState<Record<string, VoteDirection>>(
    persisted?.votes ?? {},
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    persisted?.notifications ?? mockNotifications,
  );

  useEffect(() => {
    const state: PersistedState = {
      version: 3,
      recipes,
      savedIds,
      votes,
      notifications,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable - persistence is best-effort
    }
  }, [recipes, savedIds, votes, notifications]);

  const currentUser = usersById[CURRENT_USER_ID];

  const getRecipe = (id: string) => recipes.find((r) => r.id === id);

  const getBranches = (id: string) =>
    recipes.filter((r) => r.parentRecipeId === id);

  /** Live score — always stored on the recipe after vote(). */
  const voteScore = (recipe: Recipe) => recipe.votes;

  const pushNotification = (n: Omit<AppNotification, "id" | "time" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: `n-${Date.now()}`, time: "just now", read: false },
      ...prev,
    ]);
  };

  const addRecipe = (draft: RecipeDraft): Recipe => {
    const nowIso = new Date().toISOString();
    const recipe: Recipe = {
      id: `r-${Date.now()}`,
      title: draft.title,
      description: draft.description,
      authorId: CURRENT_USER_ID,
      createdAt: nowIso,
      updatedAt: nowIso,
      cookingTime: draft.cookingTime,
      difficulty: draft.difficulty,
      servings: draft.servings,
      ingredients: draft.ingredients,
      instructions: draft.instructions,
      category: draft.category,
      cuisine: draft.cuisine,
      tags: draft.tags,
      image: draft.image,
      votes: 0,
      forkCount: 0,
      saveCount: 0,
      status: "pending",
      version: 1,
      parentRecipeId: draft.parentRecipeId,
      changeNote: draft.changeNote,
    };
    setRecipes((prev) => {
      const next = draft.parentRecipeId
        ? prev.map((r) =>
            r.id === draft.parentRecipeId
              ? { ...r, forkCount: r.forkCount + 1 }
              : r,
          )
        : prev;
      return [recipe, ...next];
    });
    pushNotification({
      type: "pending",
      message: `Your ${draft.parentRecipeId ? "branch" : "recipe"} "${draft.title}" was committed and is pending review.`,
      recipeId: recipe.id,
    });
    return recipe;
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) =>
      prev.filter((r) => r.id !== id && r.parentRecipeId !== id),
    );
    setSavedIds((prev) => prev.filter((sid) => sid !== id));
    setVotes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const approveRecipe = (id: string) => {
    const recipe = getRecipe(id);
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved",
              badge: "recently-approved",
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    if (recipe) {
      pushNotification({
        type: "approved",
        message: `"${recipe.title}" was approved and is now live on the fridge! (+50 rep for ${usersById[recipe.authorId]?.handle ?? "the author"})`,
        recipeId: id,
      });
    }
  };

  const rejectRecipe = (id: string) => {
    const recipe = getRecipe(id);
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
    if (recipe) {
      pushNotification({
        type: "comment",
        message: `"${recipe.title}" was rejected with feedback requested.`,
        recipeId: id,
      });
    }
  };

  const vote = (recipeId: string, direction: VoteDirection) => {
    setVotes((prev) => {
      const current = prev[recipeId];
      let delta = 0;
      const next = { ...prev };

      if (current === direction) {
        // Undo the same vote
        delta = -current;
        delete next[recipeId];
      } else if (current) {
        // Switch upvote ↔ downvote
        delta = direction - current;
        next[recipeId] = direction;
      } else {
        // Fresh vote
        delta = direction;
        next[recipeId] = direction;
      }

      setRecipes((recipesPrev) =>
        recipesPrev.map((r) =>
          r.id === recipeId ? { ...r, votes: r.votes + delta } : r,
        ),
      );

      return next;
    });
  };

  const toggleSave = (recipeId: string) => {
    setSavedIds((prev) => {
      const currentlySaved = prev.includes(recipeId);

      setRecipes((recipesPrev) =>
        recipesPrev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                saveCount: currentlySaved
                  ? Math.max(0, r.saveCount - 1)
                  : r.saveCount + 1,
              }
            : r,
        ),
      );

      return currentlySaved
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
    });
  };

  const isSaved = (recipeId: string) => savedIds.includes(recipeId);

  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: RecipeContextValue = {
    recipes,
    users: usersById,
    currentUser,
    notifications,
    savedIds,
    votes,
    getRecipe,
    getBranches,
    voteScore,
    addRecipe,
    deleteRecipe,
    approveRecipe,
    rejectRecipe,
    vote,
    toggleSave,
    isSaved,
    markAllNotificationsRead,
    unreadCount,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export function useRecipes(): RecipeContextValue {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used inside RecipeProvider");
  return ctx;
}
