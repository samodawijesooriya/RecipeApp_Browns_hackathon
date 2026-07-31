# Prompt 1 — KitchenBoard skeleton (HTML / CSS / JS)

Paste this into the AI coding tool as the first build step. Ask for a **working skeleton only** — static pages, no framework, no backend.

---

## Prompt

We are building **KitchenBoard**, a collaborative recipe web app that looks like a warm family refrigerator covered in sticky notes — not an admin dashboard.

**Tech for this step only:** plain `index.html`, `styles.css`, and `app.js`. No React, no build tools yet. Use Google Fonts (**Bricolage Grotesque** for handwritten notes, **Inter** for body) and Material Symbols Outlined for icons. Soft cream / morning-kitchen colors, pastel sticky notes, magnets, washi tape, paper texture. Avoid purple gradients and dark-mode defaults.

### Product feel
- Home = refrigerator door (“today’s kitchen”), not the full database
- Recipes appear as sticky notes with unique pastel colors, slight random rotation, magnets or tape, soft shadow, hover lift
- Soft rounded corners, friendly motion, natural imperfections

### Build these static pages (linked in a shared top nav)
1. **Home (fridge)** — sections: Today’s Picks (masonry sticky notes), Trending (horizontal scroll), Recently Approved (horizontal scroll). Left sidebar (desktop): family polaroid, Tip of the Day, shopping checklist. Use placeholder food images and 4–6 fake recipe titles.
2. **Community** — masonry “paper card” feed with fake upvote counts and badges (Trending, Most Forked, Editor’s Pick). Filter pill row (All / Trending / categories).
3. **Library** — search input + filter chips (category, difficulty, time) + grid of recipe cards. Empty-state message when filters would match nothing (hardcode a couple cards).
4. **Recipe detail** — hero image, notebook-style meta panel (time, difficulty, servings, cuisine), checkable ingredients list, numbered instructions, a “Community Variations” area with 2–3 stub cards, Fork + Save buttons (non-functional for now).
5. **Commit Recipe** — static “recipe journal” form: title, description, ingredients rows, instruction steps, category, time, difficulty, servings, tags. Submit button labeled **Commit Recipe** (can `preventDefault` and alert “pending review”).
6. **Saved** — empty wooden-shelf layout with 2–3 fake “cookbook spine” books.
7. **Leaderboard** — ranked list of fake chefs with reputation numbers.
8. **Notifications** — list of fake alerts (approved, pending, forked, badge).
9. **Profile** — avatar, bio, badges, a GitHub-style green contribution grid (can be decorative), and a small “My Recipes” sticky-note strip.

### Shared chrome
- Sticky glass-style top nav: KitchenBoard brand, Home, Community, Library, Saved, Leaderboard; notifications icon; green **Commit Recipe** button; avatar linking to Profile
- Mobile: bottom tab bar + floating round Commit button
- Simple footer: “© KitchenBoard — Crafted with morning optimism.”
- Unknown route / missing page: a friendly 404 sticky note (“fell behind the fridge”)

### JS for this step
- Mobile nav toggle if needed
- Ingredient checkboxes on the detail page (toggle strikethrough)
- Optional: highlight active nav link based on current file
- No real data store yet — hardcode content in HTML

### Do not build yet
Auth, APIs, React, branching logic, real voting math, localStorage persistence, admin approve/reject flows.

### Done when
- Every page above loads in the browser with no console errors
- Home clearly reads as a fridge of sticky notes
- Nav links between all pages work
- Detail page ingredient checkboxes work
- Layout is usable on phone and desktop

Return the full file set and a one-line note on how to open it (Live Server or opening `index.html`).
