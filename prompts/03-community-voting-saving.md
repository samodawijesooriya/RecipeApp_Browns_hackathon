# Prompt 3 — Community feed, voting, and saving

Build on the React KitchenBoard app after Library/Commit/Detail already work. Do not rewrite the skeleton; extend it.

---

## Prompt

KitchenBoard already has React + TypeScript, mock recipes, Library search/add/delete, and a fridge Home. Next we need the **community layer**: Reddit-style discovery, voting, and saves.

### Community feed (`/community`)
- Infinite-feeling masonry of paper/sticky recipe cards (reuse pastel note styling)
- Each card shows: image, title, author handle, cooking time, category, vote controls, save, fork shortcut
- Filter pills: All, Trending Today, plus categories (Breakfast, Lunch, Dinner, Baking, Dessert, Soup, Salad, Snacks)
- Trending Today sorts by votes + forks (forks weighted)
- Badges on cards when present: `trending`, `most-forked`, `editors-pick`, `recently-approved` (pill labels like TRENDING / MOST FORKED / EDITOR'S PICK / RECENTLY APPROVED)
- Pending recipes stay out of the public Community feed

### Voting
- Members can upvote or downvote once per recipe
- Clicking the same vote again removes it
- Switching vote updates the total correctly (no double-count bugs)
- Persist the user’s vote direction for UI highlight
- Store the live score on the recipe (`votes` field updates by delta)
- Home “Today’s Picks” and Community trending must re-sort when votes change

### Saving
- Save / unsave from Community cards and Recipe detail
- `saveCount` increments/decrements without stale-state bugs (use functional updates)
- Track `savedIds` in app state
- Home sidebar can list a few saved titles linking to detail

### Recipe cards & controls
Extract reusable pieces if missing:
- `VoteControls`
- `RecipeCard` (community/library)
- Keep StickyNote for fridge Home

### Visual / UX rules
- Keep the warm kitchen look (no dashboard chrome)
- Hover: note lifts; active press slightly scales down
- Fork button may navigate to `/commit?fork=:id` even if fork logic is still incomplete — that’s fine for this step

### Still leave for later
Admin approve/reject UI, full branch “what changed” form behavior, leaderboard calculations, notifications actions, Saved page cookbook shelf interactions, contribution graph tied to real dates.

### Done when
- Community feed filters and sorts correctly
- Voting up/down/toggle/switch updates counts and rankings immediately
- Saving updates counts and appears in Home’s “from your cookbook” notes
- No console errors; existing Library commit/search/delete still works
