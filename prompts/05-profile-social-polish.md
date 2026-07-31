# Prompt 5 — Profile, leaderboard, notifications, saved shelf, polish

Final feature pass. Library, community voting, and branching/admin review already work. Close the remaining navigation destinations and harden state.

---

## Prompt

Finish KitchenBoard’s remaining screens and polish so the app feels complete for a demo.

### Saved Recipes (`/saved`)
- Render saved recipes as **cookbooks on wooden shelves** (book spines with titles, varied spine colors, slight tilt)
- Click a book → recipe detail
- Hover reveals remove-from-shelf control that unsaves
- Empty state: friendly handwritten message that the shelf is empty
- Group books onto shelves (e.g. 4 per shelf)

### Leaderboard (`/leaderboard`)
Rank mock users with toggle modes:
- Highest Reputation
- Most Forked (sum of forkCount on authored recipes)
- Most Approved Recipes
Show medals for top 3, avatar, handle, badge chips, and the active metric. Keep the paper/kitchen card style.

### Notifications (`/notifications`)
- List items with type icons: approved, pending, forked, saved, comment, badge
- Unread indicator + count badge on the nav bell
- Mark all read
- Pending items for admin include **View recipe** and **Approve now**
- Creating commits / approvals should push new notifications into the list

### Profile (`/profile`)
- Avatar, name, handle, role, bio, reputation, followers/following
- Badge chips (Breakfast Expert, Community Hero, Admin’s Choice, etc.)
- **Contribution graph** like GitHub: last ~26 weeks of green squares driven by **real** commit/approval dates for the current user’s recipes (hover shows date + recipe titles) — not random noise
- “My Recipes” sticky notes with pending / rejected / live status pills

### Persistence & correctness
- Persist recipes, savedIds, votes, notifications to `localStorage` with a versioned key and basic shape validation; invalid data falls back to mocks
- Voting/save updates must remain free of stale closures
- Catch-all **404** page (sticky note “fell behind the fridge”)
- Scroll to top on route change

### Home fridge completeness check
Ensure Home still includes:
- Today’s Picks (sorted by votes)
- Trending (forks/saves weighted)
- Recently Approved
- Sidebar: family polaroid, tip of the day, shopping list, saved cookbook links

### Reputation / badges (display-level)
Keep reputation and badges as mock user fields shown on Profile/Leaderboard/Detail author tags. No need for a full points engine beyond the copy/notifications already implied by approvals.

### Explicitly do not add (future)
Meal planning, shopping-list generator beyond the static fridge note, AI substitutions, nutrition calculator, barcode scan, voice mode, live collab, marketplace, etc.

### Done when
- Every nav item is a real working page
- Saved shelf, leaderboard modes, notifications inbox, and profile graph all use live app state
- Refreshing the browser keeps commits/votes/saves (valid v2 state)
- Mobile nav + floating commit button still work
- `npm run build` and lint succeed with no errors

Ship only what’s needed for the above; match existing components and warm fridge styling.
