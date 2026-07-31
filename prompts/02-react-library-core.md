# Prompt 2 — React + TypeScript recipe library core

Use this after the HTML/CSS/JS skeleton exists. Goal: move into a real app shell and ship the must-have recipe box features.

---

## Prompt

We already have a static KitchenBoard fridge UI (HTML/CSS/JS). Rebuild it as a **Vite + React 19 + TypeScript + Tailwind CSS v4** app that keeps the same visual language (sticky notes, fridge home, glass nav, Bricolage Grotesque + Inter, pastel notes, magnets/tape).

### Scope for this prompt only
Focus on the **recipe library core**. Keep Home / Community / Saved / Leaderboard / Notifications / Profile as routed pages that still show mock UI if needed, but make Library + Detail + Commit + data model real.

### Architecture
Use a clean folder layout:
- `src/types` — Recipe, Ingredient/Instruction types
- `src/data/mockData.ts` — seed recipes and users (mock only, no API)
- `src/context` — recipe state provider
- `src/components` — reusable StickyNote, SearchBar, RecipeCard, IngredientInput, RecipeForm, NavBar, Footer, Icon
- `src/pages` — routed screens
- `src/utils/search.ts` — search helpers

### Recipe model (each recipe must include)
id, title, description, authorId, createdAt, updatedAt, cookingTime, difficulty (Easy/Medium/Hard), servings, ingredients (string[]), instructions ({ title, text }[]), category, cuisine, tags[], image?, votes, forkCount, saveCount, status (`approved` | `pending` | `rejected`), version, optional parentRecipeId / changeNote / badge.

### Must-have features
1. **Browse** — Library page lists approved recipes (and the current user’s own pending ones).
2. **Search** — global fuzzy-ish search across title, description, ingredients, tags, category, cuisine, author name/handle. Support multi-word queries.
3. **Filters** — category, difficulty, cooking-time buckets (any / ≤15 / ≤30 / ≤60).
4. **Add / Commit** — Commit Recipe page uses a journal form:
   - repeatable ingredient rows (add/remove)
   - repeatable instruction steps (title + body)
   - category, cuisine, time, difficulty, servings, tags
   - primary button label is **Commit Recipe** (not “Submit”)
   - new recipes start as `status: "pending"`
5. **Delete** — owner (or admin) can delete from Library with a confirm dialog; deleting a parent also removes its branches when those exist later.
6. **Recipe detail** — hero, notebook meta, checkable ingredients, numbered steps, save/fork buttons can be stubs if not wired yet, but data must render from state.
7. **Home fridge** — Today’s Picks / Trending / Recently Approved should pull from the same mock recipe state (approved only), rendered as sticky notes with deterministic pastel/rotation per id.

### Seed data
Include at least ~10 approved recipes with realistic titles (e.g. Lemon Herb Salmon, Avocado Toast, Creamy Tomato Soup, Carbonara, Ricotta Pancakes, Shakshuka, Green Goddess Crunch, Sourdough, Grain Bowl, Mac & Cheese) plus authors with handles and avatars. Use placeholder images with a graceful broken-image fallback.

### Routing
React Router: `/`, `/community`, `/library`, `/recipe/:id`, `/commit`, `/saved`, `/leaderboard`, `/notifications`, `/profile`, catch-all 404.

### Out of scope for this prompt
Do not implement real upvote/downvote math, fork/branch workflow, admin approve/reject, reputation leaderboard logic, notifications inbox behavior, or cookbook shelf interactions yet — leave those pages present but simple.

### Done when
- `npm run dev` works with no console errors
- I can add a recipe via Commit, see it as pending, search/filter in Library, open detail, check off ingredients, and delete a recipe
- Sticky-note fridge aesthetic from the skeleton is preserved in React/Tailwind
