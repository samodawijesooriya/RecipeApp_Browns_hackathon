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
  mockNotifications,
  mockRecipes,
  mockUsers,
} from "../data/mockData";

export type VoteDirection = 1 | -1;

interface PersistedState {
  version: 5;
  recipes: Recipe[];
  /** Per-user saved recipe ids */
  savedByUser: Record<string, string[]>;
  /** Per-user vote direction per recipe */
  votesByUser: Record<string, Record<string, VoteDirection>>;
  notifications: AppNotification[];
}

interface RecipeContextValue {
  recipes: Recipe[];
  users: Record<string, User>;
  /** null when browsing as a guest */
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (identifier: string) => User;
  logout: () => void;
  notifications: AppNotification[];
  savedIds: string[];
  votes: Record<string, VoteDirection>;
  getRecipe: (id: string) => Recipe | undefined;
  getBranches: (id: string) => Recipe[];
  voteScore: (recipe: Recipe) => number;
  addRecipe: (draft: RecipeDraft) => Recipe | null;
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

const STATE_KEY = "kitchenboard-state-v5";
const AUTH_KEY = "kitchenboard-auth-v1";
const LEGACY_STATE_KEY = "kitchenboard-state-v3";

const DEFAULT_SAVES = [
  "r-salmon",
  "r-kottu",
  "r-pancakes",
  "r-kiribath",
  "r-sourdough",
];

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

function isVoteMap(value: unknown): value is Record<string, VoteDirection> {
  if (!value || typeof value !== "object") return false;
  return Object.values(value).every((v) => v === 1 || v === -1);
}

const usersById: Record<string, User> = Object.fromEntries(
  mockUsers.map((u) => [u.id, u]),
);

function loadAuthUserId(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const id = (parsed as Record<string, unknown>).authUserId;
    if (id === null) return null;
    if (typeof id === "string" && usersById[id]) return id;
    return null;
  } catch {
    return null;
  }
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      const data = parsed as Record<string, unknown>;
      if (data.version !== 5) return null;
      if (!Array.isArray(data.recipes) || !data.recipes.every(isRecipe)) return null;
      if (!data.savedByUser || typeof data.savedByUser !== "object") return null;
      if (!data.votesByUser || typeof data.votesByUser !== "object") return null;
      if (
        !Array.isArray(data.notifications) ||
        !data.notifications.every(isNotification)
      )
        return null;
      return data as unknown as PersistedState;
    }

    // Migrate v3 → v5 (global saves/votes → Alex's shelf; refresh recipes for new image URLs)
    const legacyRaw = localStorage.getItem(LEGACY_STATE_KEY);
    if (!legacyRaw) return null;
    const legacy: unknown = JSON.parse(legacyRaw);
    if (!legacy || typeof legacy !== "object") return null;
    const data = legacy as Record<string, unknown>;
    if (data.version !== 3) return null;
    if (!Array.isArray(data.recipes) || !data.recipes.every(isRecipe)) return null;
    if (
      !Array.isArray(data.savedIds) ||
      !data.savedIds.every((id) => typeof id === "string")
    )
      return null;
    if (!data.votes || typeof data.votes !== "object") return null;
    if (
      !Array.isArray(data.notifications) ||
      !data.notifications.every(isNotification)
    )
      return null;

    return {
      version: 5,
      recipes: mockRecipes,
      savedByUser: { "u-you": data.savedIds as string[] },
      votesByUser: {
        "u-you": isVoteMap(data.votes) ? data.votes : {},
      },
      notifications: data.notifications as AppNotification[],
    };
  } catch {
    return null;
  }
}

/** Resolve a mock user by id, handle, or name. Unknown → Alex (u-you). */
export function resolveMockUser(identifier: string): User {
  const raw = identifier.trim();
  if (!raw) return usersById["u-you"];

  const byId = usersById[raw];
  if (byId) return byId;

  const normalized = raw.toLowerCase().replace(/^@/, "");
  const byHandle = mockUsers.find(
    (u) => u.handle.toLowerCase().replace(/^@/, "") === normalized,
  );
  if (byHandle) return byHandle;

  const byName = mockUsers.find(
    (u) => u.name.toLowerCase() === raw.toLowerCase(),
  );
  if (byName) return byName;

  return usersById["u-you"];
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const persisted = useMemo(() => loadPersisted(), []);
  const initialAuthId = useMemo(() => loadAuthUserId(), []);

  const [authUserId, setAuthUserId] = useState<string | null>(initialAuthId);
  const [recipes, setRecipes] = useState<Recipe[]>(
    persisted?.recipes ?? mockRecipes,
  );
  const [savedByUser, setSavedByUser] = useState<Record<string, string[]>>(
    persisted?.savedByUser ?? { "u-you": DEFAULT_SAVES },
  );
  const [votesByUser, setVotesByUser] = useState<
    Record<string, Record<string, VoteDirection>>
  >(persisted?.votesByUser ?? {});
  const [notifications, setNotifications] = useState<AppNotification[]>(
    persisted?.notifications ?? mockNotifications,
  );

  useEffect(() => {
    const state: PersistedState = {
      version: 5,
      recipes,
      savedByUser,
      votesByUser,
      notifications,
    };
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — persistence is best-effort
    }
  }, [recipes, savedByUser, votesByUser, notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ authUserId }),
      );
    } catch {
      // best-effort
    }
  }, [authUserId]);

  const currentUser = authUserId ? (usersById[authUserId] ?? null) : null;
  const isLoggedIn = currentUser !== null;

  const savedIds = currentUser
    ? (savedByUser[currentUser.id] ?? [])
    : [];
  const votes = currentUser ? (votesByUser[currentUser.id] ?? {}) : {};

  const login = (identifier: string): User => {
    const user = resolveMockUser(identifier);
    setAuthUserId(user.id);
    setSavedByUser((prev) =>
      prev[user.id] !== undefined ? prev : { ...prev, [user.id]: [] },
    );
    setVotesByUser((prev) =>
      prev[user.id] !== undefined ? prev : { ...prev, [user.id]: {} },
    );
    return user;
  };

  const logout = () => setAuthUserId(null);

  const getRecipe = (id: string) => recipes.find((r) => r.id === id);

  const getBranches = (id: string) =>
    recipes.filter((r) => r.parentRecipeId === id);

  const voteScore = (recipe: Recipe) => recipe.votes;

  const pushNotification = (
    n: Omit<AppNotification, "id" | "time" | "read">,
  ) => {
    setNotifications((prev) => [
      { ...n, id: `n-${Date.now()}`, time: "just now", read: false },
      ...prev,
    ]);
  };

  const addRecipe = (draft: RecipeDraft): Recipe | null => {
    if (!currentUser) return null;
    const nowIso = new Date().toISOString();
    const recipe: Recipe = {
      id: `r-${Date.now()}`,
      title: draft.title,
      description: draft.description,
      authorId: currentUser.id,
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
      message: `Your ${draft.parentRecipeId ? "version" : "recipe"} "${draft.title}" was sent and is waiting for approval.`,
      recipeId: recipe.id,
    });
    return recipe;
  };

  const deleteRecipe = (id: string) => {
    if (!currentUser) return;
    const recipe = getRecipe(id);
    if (!recipe) return;
    if (
      recipe.authorId !== currentUser.id &&
      currentUser.role !== "admin"
    )
      return;

    setRecipes((prev) =>
      prev.filter((r) => r.id !== id && r.parentRecipeId !== id),
    );
    setSavedByUser((prev) => {
      const next: Record<string, string[]> = {};
      for (const [uid, ids] of Object.entries(prev)) {
        next[uid] = ids.filter((sid) => sid !== id);
      }
      return next;
    });
    setVotesByUser((prev) => {
      const next: Record<string, Record<string, VoteDirection>> = {};
      for (const [uid, map] of Object.entries(prev)) {
        const copy = { ...map };
        delete copy[id];
        next[uid] = copy;
      }
      return next;
    });
  };

  const approveRecipe = (id: string) => {
    if (!currentUser || currentUser.role !== "admin") return;
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
    if (!currentUser || currentUser.role !== "admin") return;
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
    if (!currentUser) return;
    const uid = currentUser.id;

    setVotesByUser((prev) => {
      const userVotes = { ...(prev[uid] ?? {}) };
      const current = userVotes[recipeId];
      let delta = 0;

      if (current === direction) {
        delta = -current;
        delete userVotes[recipeId];
      } else if (current) {
        delta = direction - current;
        userVotes[recipeId] = direction;
      } else {
        delta = direction;
        userVotes[recipeId] = direction;
      }

      setRecipes((recipesPrev) =>
        recipesPrev.map((r) =>
          r.id === recipeId ? { ...r, votes: r.votes + delta } : r,
        ),
      );

      return { ...prev, [uid]: userVotes };
    });
  };

  const toggleSave = (recipeId: string) => {
    if (!currentUser) return;
    const uid = currentUser.id;

    setSavedByUser((prev) => {
      const userSaves = prev[uid] ?? [];
      const currentlySaved = userSaves.includes(recipeId);

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

      return {
        ...prev,
        [uid]: currentlySaved
          ? userSaves.filter((id) => id !== recipeId)
          : [...userSaves, recipeId],
      };
    });
  };

  const isSaved = (recipeId: string) =>
    Boolean(currentUser && savedIds.includes(recipeId));

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = currentUser
    ? notifications.filter((n) => !n.read).length
    : 0;

  const value: RecipeContextValue = {
    recipes,
    users: usersById,
    currentUser,
    isLoggedIn,
    login,
    logout,
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
