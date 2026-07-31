export type Difficulty = "Easy" | "Medium" | "Hard";

export type ApprovalStatus = "approved" | "pending" | "rejected";

export type RecipeBadge =
  | "trending"
  | "most-forked"
  | "editors-pick"
  | "recently-approved";

export interface InstructionStep {
  title: string;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  cookingTime: number;
  difficulty: Difficulty;
  servings: number;
  ingredients: string[];
  instructions: InstructionStep[];
  category: string;
  cuisine: string;
  tags: string[];
  image?: string;
  votes: number;
  forkCount: number;
  saveCount: number;
  status: ApprovalStatus;
  version: number;
  parentRecipeId?: string;
  /** For branches: the author's "What changed?" note */
  changeNote?: string;
  badge?: RecipeBadge;
}

export type UserRole = "guest" | "member" | "admin";

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  role: UserRole;
  reputation: number;
  bio: string;
  badges: string[];
  followers: number;
  following: number;
}

export type NotificationType =
  | "approved"
  | "pending"
  | "forked"
  | "saved"
  | "comment"
  | "badge";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
  recipeId?: string;
}

export interface RecipeDraft {
  title: string;
  description: string;
  ingredients: string[];
  instructions: InstructionStep[];
  category: string;
  cuisine: string;
  cookingTime: number;
  difficulty: Difficulty;
  servings: number;
  tags: string[];
  image?: string;
  parentRecipeId?: string;
  changeNote?: string;
}
