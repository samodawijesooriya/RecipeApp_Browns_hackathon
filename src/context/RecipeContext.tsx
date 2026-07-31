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
  recipes: Recipe[];
  savedIds: string[];
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

const STORAGE_KEY = "kitchenboard-state-v1";

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
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
    persisted?.savedIds ?? ["r-salmon", "r-pancakes", "r-sourdough"],
  );
  const [votes, setVotes] = useState<Record<string, VoteDirection>>(
    persisted?.votes ?? {},
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    persisted?.notifications ?? mockNotifications,
  );

  useEffect(() => {
    const state: PersistedState = { recipes, savedIds, votes, notifications };
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

  const voteScore = (recipe: Recipe) => recipe.votes + (votes[recipe.id] ?? 0);

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
      // Forking bumps the parent's fork count
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
      const next = { ...prev };
      if (current === direction) {
        delete next[recipeId]; // clicking again removes the vote
      } else {
        next[recipeId] = direction;
      }
      return next;
    });
  };

  const toggleSave = (recipeId: string) => {
    setSavedIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId
          ? {
              ...r,
              saveCount: savedIds.includes(recipeId)
                ? Math.max(0, r.saveCount - 1)
                : r.saveCount + 1,
            }
          : r,
      ),
    );
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
