import { useMemo } from "react";
import { useRecipes } from "../context/RecipeContext";
import { Icon } from "../components/Icon";
import { StickyNote } from "../components/StickyNote";
import type { Recipe } from "../types/recipe";

const WEEKS = 26;
const LEVEL_COLORS = [
  "bg-surface-container-high",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
];

function toDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function levelFromCount(count: number): number {
  if (count >= 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
}

/** Build a day→count map from the user's commits (created + approvals). */
function buildContributionMap(
  recipes: Recipe[],
): Map<string, { count: number; titles: string[] }> {
  const map = new Map<string, { count: number; titles: string[] }>();
  const bump = (iso: string, title: string) => {
    const key = toDayKey(iso);
    const entry = map.get(key) ?? { count: 0, titles: [] };
    entry.count += 1;
    if (!entry.titles.includes(title)) entry.titles.push(title);
    map.set(key, entry);
  };
  for (const recipe of recipes) {
    bump(recipe.createdAt, recipe.title);
    if (
      recipe.status === "approved" &&
      toDayKey(recipe.updatedAt) !== toDayKey(recipe.createdAt)
    ) {
      bump(recipe.updatedAt, recipe.title);
    }
  }
  return map;
}

export function Profile() {
  const { currentUser, recipes } = useRecipes();

  const myRecipes = useMemo(
    () => recipes.filter((r) => r.authorId === currentUser.id),
    [recipes, currentUser.id],
  );
  const approvedCount = myRecipes.filter((r) => r.status === "approved").length;
  const branchCount = myRecipes.filter((r) => r.parentRecipeId).length;

  const contributions = useMemo(
    () => buildContributionMap(myRecipes),
    [myRecipes],
  );

  /** Grid ends this week; columns are weeks, rows are Sun→Sat. */
  const gridStart = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek - (WEEKS - 1) * 7);
    return start;
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-12">
      <section className="notebook-lines relative mb-10 rounded-xl border border-outline-variant/30 bg-paper p-6 shadow-lg md:p-8">
        <div className="absolute -top-2 left-10 flex h-8 w-8 items-center justify-center rounded-full border border-red-500 bg-red-400 shadow-md">
          <Icon name="favorite" fill className="text-sm text-white" />
        </div>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-28 w-28 rotate-[-2deg] rounded-xl border-4 border-white object-cover shadow-md"
          />
          <div className="flex-grow text-center md:text-left">
            <h1 className="font-hand text-4xl font-semibold text-on-surface">
              {currentUser.name}
            </h1>
            <p className="text-on-surface-variant">
              {currentUser.handle} ·{" "}
              <span className="font-semibold text-amber-700 capitalize">
                {currentUser.role}
              </span>
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-on-surface-variant md:mx-0">
              {currentUser.bio}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start">
              {currentUser.badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800"
                >
                  <Icon name="military_tech" className="text-[14px]" /> {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-4 text-center md:grid-cols-1">
            <div>
              <p className="text-2xl font-bold text-accent-green-dark">
                {currentUser.reputation.toLocaleString()}
              </p>
              <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                Reputation
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">
                {currentUser.followers}
              </p>
              <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                Followers
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">
                {currentUser.following}
              </p>
              <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                Following
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-xl border border-outline-variant/40 bg-white p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-on-surface">
          <Icon name="calendar_month" className="text-primary" />
          Kitchen Contributions
        </h2>
        <p className="mb-4 text-sm text-on-surface-variant">
          {approvedCount} recipes approved · {branchCount} versions ·{" "}
          {myRecipes.length} total recipes
        </p>
        <div className="no-scrollbar overflow-x-auto">
          <div className="flex w-max gap-1">
            {Array.from({ length: WEEKS }, (_, week) => (
              <div key={week} className="flex flex-col gap-1">
                {Array.from({ length: 7 }, (_, day) => {
                  const cell = new Date(gridStart);
                  cell.setDate(gridStart.getDate() + week * 7 + day);
                  const key = `${cell.getFullYear()}-${cell.getMonth()}-${cell.getDate()}`;
                  const entry = contributions.get(key);
                  const count = entry?.count ?? 0;
                  const level = levelFromCount(count);
                  const dateLabel = cell.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <div
                      key={day}
                      title={
                        count > 0
                          ? `${dateLabel}: ${count} — ${entry?.titles.join(", ")}`
                          : `${dateLabel}: No contributions`
                      }
                      className={`h-3.5 w-3.5 rounded-[3px] ${LEVEL_COLORS[level]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 text-xs text-on-surface-variant">
          Less
          {LEVEL_COLORS.map((color) => (
            <span key={color} className={`h-3 w-3 rounded-[3px] ${color}`} />
          ))}
          More
        </div>
      </section>

      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-on-surface">
          <Icon name="sticky_note_2" className="text-primary" />
          My Recipes
        </h2>
        {myRecipes.length === 0 ? (
          <p className="py-10 text-center font-hand text-2xl text-on-surface-variant">
            No recipes yet — go stick something on the fridge!
          </p>
        ) : (
          <div className="masonry">
            {myRecipes.map((recipe) => (
              <div key={recipe.id} className="masonry-item">
                <StickyNote
                  recipe={recipe}
                  footer={
                    recipe.status === "pending" ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                        Waiting for Approval
                      </span>
                    ) : recipe.status === "rejected" ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-800">
                        Changes Requested
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800">
                        Live · v{recipe.version}
                      </span>
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
