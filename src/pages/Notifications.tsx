import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { Icon } from "../components/Icon";
import type { NotificationType } from "../types/recipe";

const TYPE_META: Record<NotificationType, { icon: string; className: string }> = {
  approved: { icon: "verified", className: "bg-green-100 text-green-700" },
  pending: { icon: "pending_actions", className: "bg-amber-100 text-amber-700" },
  forked: { icon: "fork_right", className: "bg-blue-100 text-blue-700" },
  saved: { icon: "bookmark_added", className: "bg-purple-100 text-purple-700" },
  comment: { icon: "chat_bubble", className: "bg-pink-100 text-pink-700" },
  badge: { icon: "military_tech", className: "bg-orange-100 text-orange-700" },
};

export function Notifications() {
  const {
    notifications,
    markAllNotificationsRead,
    unreadCount,
    getRecipe,
    approveRecipe,
    currentUser,
  } = useRecipes();
  const navigate = useNavigate();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-12">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-on-surface md:text-5xl">
            Notifications
          </h1>
          <p className="text-lg text-on-surface-variant">
            {unreadCount > 0
              ? `${unreadCount} new note${unreadCount === 1 ? "" : "s"} on the fridge.`
              : "All caught up. The fridge is quiet."}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="rounded-lg border border-outline-variant/60 px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Mark all read
          </button>
        )}
      </header>

      <ul className="space-y-3">
        {notifications.map((n) => {
          const meta = TYPE_META[n.type];
          const recipe = n.recipeId ? getRecipe(n.recipeId) : undefined;
          const needsReview =
            n.type === "pending" &&
            recipe?.status === "pending" &&
            currentUser.role === "admin";

          return (
            <li
              key={n.id}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                n.read
                  ? "border-outline-variant/30 bg-surface-container-low"
                  : "border-outline-variant/50 bg-white shadow-sm"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.className}`}
              >
                <Icon name={meta.icon} className="text-[20px]" />
              </span>
              <div className="min-w-0 flex-grow">
                <p
                  className={`text-sm ${n.read ? "text-on-surface-variant" : "font-semibold text-on-surface"}`}
                >
                  {n.message}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant/70">{n.time}</p>
                {recipe && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                      className="rounded-lg bg-surface-container px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-surface-container-highest"
                    >
                      View recipe
                    </button>
                    {needsReview && (
                      <button
                        type="button"
                        onClick={() => approveRecipe(recipe.id)}
                        className="rounded-lg bg-accent-green px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                      >
                        Approve now
                      </button>
                    )}
                  </div>
                )}
              </div>
              {!n.read && (
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent-green" />
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
