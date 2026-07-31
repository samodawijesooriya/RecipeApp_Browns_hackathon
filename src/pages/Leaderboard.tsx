import { useMemo, useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { Icon } from "../components/Icon";
import type { User } from "../types/recipe";

type Ranking = "Highest Reputation" | "Most Remixed" | "Most Approved Recipes";

const RANKINGS: Ranking[] = [
  "Highest Reputation",
  "Most Remixed",
  "Most Approved Recipes",
];

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const { users, recipes } = useRecipes();
  const [ranking, setRanking] = useState<Ranking>("Highest Reputation");

  const stats = useMemo(() => {
    const byUser = new Map<string, { forks: number; approved: number }>();
    for (const r of recipes) {
      const s = byUser.get(r.authorId) ?? { forks: 0, approved: 0 };
      s.forks += r.forkCount;
      if (r.status === "approved") s.approved += 1;
      byUser.set(r.authorId, s);
    }
    return byUser;
  }, [recipes]);

  const ranked: User[] = useMemo(() => {
    const all = Object.values(users);
    const score = (u: User) => {
      const s = stats.get(u.id) ?? { forks: 0, approved: 0 };
      if (ranking === "Most Remixed") return s.forks;
      if (ranking === "Most Approved Recipes") return s.approved;
      return u.reputation;
    };
    return [...all].sort((a, b) => score(b) - score(a));
  }, [users, stats, ranking]);

  const statLabel = (u: User): string => {
    const s = stats.get(u.id) ?? { forks: 0, approved: 0 };
    if (ranking === "Most Remixed") return `${s.forks} versions`;
    if (ranking === "Most Approved Recipes")
      return `${s.approved} approved recipe${s.approved === 1 ? "" : "s"}`;
    return `${u.reputation.toLocaleString()} rep`;
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-12">
      <header className="mb-8">
        <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold text-on-surface md:text-5xl">
          <Icon name="trophy" fill className="text-amber-500" />
          Top Chefs
        </h1>
        <p className="text-lg text-on-surface-variant">
          The community members keeping this fridge legendary.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {RANKINGS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRanking(r)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                ranking === r
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <ol className="space-y-3">
        {ranked.map((user, index) => (
          <li
            key={user.id}
            className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 ${
              index === 0
                ? "border-amber-300 bg-gradient-to-r from-amber-50 to-paper"
                : "border-outline-variant/40 bg-white"
            }`}
          >
            <span className="w-10 text-center text-2xl font-bold text-on-surface-variant">
              {MEDALS[index] ?? index + 1}
            </span>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-12 w-12 rounded-full border border-outline-variant object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-hand text-lg text-white">
                {user.name[0]}
              </div>
            )}
            <div className="min-w-0 flex-grow">
              <p className="truncate font-semibold text-on-surface">
                {user.name}
                <span className="ml-2 text-sm font-normal text-on-surface-variant">
                  {user.handle}
                </span>
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {user.badges.slice(0, 3).map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-accent-green/10 px-3 py-1.5 text-sm font-bold text-accent-green-dark">
              {statLabel(user)}
            </span>
          </li>
        ))}
      </ol>
    </main>
  );
}
