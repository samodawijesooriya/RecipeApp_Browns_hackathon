// ---------------------------------------------------------------------------
// Shared recipe types
// ---------------------------------------------------------------------------

/** The shape a recipe takes once a user has committed it via the form. */
export interface StoredRecipe {
  id: string;
  title: string;
  /** base64 data URL of the pinned photo, or null if none was added */
  photo: string | null;
  prepTime: string;
  cookTime: string;
  servings: string;
  /** raw multi-line text, one ingredient per line */
  ingredients: string;
  /** raw multi-line text, one instruction step per line */
  instructions: string;
  notes: string;
  createdAt: number;
}

/** Fields the "Add a New Recipe" form collects before an id/timestamp exists. */
export type NewRecipeInput = Omit<StoredRecipe, "id" | "createdAt">;

export type PinColor = "red" | "green" | "blue" | "yellow";

export type CardTheme = "teal" | "yellow" | "pink" | "blue" | "mint";

/** The shape the sticky-note RecipeCard component expects. */
export interface RecipeCardData {
  id: string;
  title: string;
  image: string;
  theme: CardTheme;
  pin?: PinColor;
  time?: string;
  calories?: string;
  excerpt?: string;
  liked?: boolean;
  approved?: boolean;
  tapeStyle?: "tape" | "clip" | "pin";
}