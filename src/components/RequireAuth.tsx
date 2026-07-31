import { Navigate, useLocation } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import type { ReactNode } from "react";

/** Redirect guests to /login, preserving the return path. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useRecipes();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
