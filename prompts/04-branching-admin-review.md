# Prompt 4 — Commit journal, branching, and admin review

The app already supports browsing, search, commit-as-pending, community voting, and saving. This step adds KitchenBoard’s core idea: **recipes evolve like software** through forks, review, and merges of meaning (approval), without overwriting originals.

---

## Prompt

Extend KitchenBoard with the full **recipe lifecycle** and branching workflow.

### Lifecycle to support
Recipe draft → **Commit Recipe** → Pending Review → Admin Approve/Reject → Published on Home / Library / Community → Community can **Fork** → Branch pending → Admin approves branch → appears under **Community Variations**.  
Nothing overwrites the original recipe.

### Commit / Fork journal (`/commit`)
- If URL has `?fork=:id`, prefill the form from that recipe and treat it as a **branch**
- Branch mode requires a **“What changed?”** note (e.g. “Added blueberries / reduced sugar / made vegan”)
- Button label: **Commit Branch** when forking, **Commit Recipe** otherwise
- On success, show a confirmation sticky note: committed + pending review, with links to view it or return home
- Creating a fork increments the parent’s `forkCount`
- New items get `parentRecipeId` + `changeNote` when branched

### Recipe detail enhancements
- If `status === "pending"`, show an amber banner explaining it’s invisible to the public until approved
- If current user role is **admin**, banner includes **Approve** and **Reject** actions
- If recipe is a branch, show lineage: “Branched from {parent title}” + change note
- **Community Variations** section lists child branches (approved for everyone; pending visible to admin)
- Fork Recipe button opens the commit journal with fork prefill
- Keep ingredient checklist + instructions working

### Admin review surfaces
Current logged-in user should be an **admin** mock user (member capabilities + moderation).
- Notifications include pending commit / pending branch items
- From Notifications or Detail, admin can **Approve now**
- Approve sets `status: "approved"`, stamps `updatedAt`, sets badge `recently-approved`, and pushes an approval notification (+50 rep messaging is fine as copy)
- Reject sets `status: "rejected"` and notifies with feedback-requested copy
- Approved recipes appear on Home strips, Library (public), and Community

### Roles (mock, no real auth)
- Guest capabilities are conceptual only for now
- Current session user = admin member so demo flows work
- Seed at least one pending recipe and one pending branch for review practice

### Seed branching example
Lemon Herb Salmon should have community branches such as Chili Lime Salmon, Air-Fried Lemon Herb, and a pending Garlic Butter variation — each with `parentRecipeId` and a change note.

### Guardrails
- Do not overwrite parent recipe fields when a branch is committed
- Delete parent still removes branches
- Public Community/Home continue to hide pending items

### Done when
I can: commit a new recipe → see it pending → approve it as admin → see it on the fridge → fork it → submit “what changed” → approve the branch → see it under Community Variations — and the original recipe content is unchanged.
