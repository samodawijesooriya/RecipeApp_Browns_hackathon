import type { Recipe, User } from "../types/recipe";

/**
 * Token-based fuzzy search: every word in the query must loosely match
 * (substring, or all characters in order) somewhere in the recipe's
 * searchable text (title, description, ingredients, tags, category,
 * cuisine, author).
 */
export function searchRecipes(
  recipes: Recipe[],
  users: Record<string, User>,
  query: string,
): Recipe[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return recipes;

  return recipes.filter((recipe) => {
    const author = users[recipe.authorId];
    const haystack = [
      recipe.title,
      recipe.description,
      recipe.category,
      recipe.cuisine,
      ...recipe.tags,
      ...recipe.ingredients,
      author?.name ?? "",
      author?.handle ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return tokens.every(
      (token) => haystack.includes(token) || fuzzyIncludes(haystack, token),
    );
  });
}

/** True if every char of `needle` appears in order inside `haystack`. */
function fuzzyIncludes(haystack: string, needle: string): boolean {
  if (needle.length < 3) return false;
  let i = 0;
  for (const ch of haystack) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return false;
}
