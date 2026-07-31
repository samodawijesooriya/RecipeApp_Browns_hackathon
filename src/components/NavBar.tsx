import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { useRecipes } from "../context/RecipeContext";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: "kitchen" },
  { to: "/community", label: "Community", icon: "groups" },
  { to: "/library", label: "Library", icon: "menu_book" },
  { to: "/saved", label: "Saved", icon: "bookmarks" },
  { to: "/leaderboard", label: "Leaderboard", icon: "trophy" },
];

export function NavBar() {
  const { currentUser, unreadCount, isLoggedIn } = useRecipes();
  const navigate = useNavigate();
  const location = useLocation();

  const goLogin = () =>
    navigate("/login", { state: { from: location } });

  const goProtected = (path: string) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: path } } });
      return;
    }
    navigate(path);
  };

  return (
    <>
      {/* Top navigation */}
      <header className="glass-nav sticky top-0 z-50 px-4 py-3 shadow-sm md:px-12">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link
            to="/"
            aria-label="KitchenBoard"
            className="flex shrink-0 items-center"
          >
            <img
              src="/kitchenboard-logo.png"
              alt="KitchenBoard"
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-primary pb-0.5 font-bold text-primary"
                    : "rounded-lg px-1 text-on-surface-variant transition-colors hover:text-primary"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => goProtected("/notifications")}
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant/40"
            >
              <Icon name="notifications" />
              {isLoggedIn && unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => goProtected("/commit")}
              className="hidden transform rounded-lg bg-accent-green px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 sm:block"
            >
              Add Recipe
            </button>
            {isLoggedIn && currentUser ? (
              <Link to="/profile" aria-label="Your profile">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full border border-outline-variant object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-primary font-hand text-sm text-white">
                    {currentUser.name[0]}
                  </div>
                )}
              </Link>
            ) : (
              <button
                type="button"
                onClick={goLogin}
                className="rounded-lg border border-outline-variant/60 px-3 py-1.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating add-recipe button (mobile) */}
      <button
        type="button"
        aria-label="Add a new recipe"
        onClick={() => goProtected("/commit")}
        className="fixed right-5 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green text-white shadow-xl transition-transform active:scale-90 sm:hidden"
      >
        <Icon name="add" className="text-3xl" />
      </button>

      {/* Bottom navigation (mobile) */}
      <nav className="glass-nav fixed right-0 bottom-0 left-0 z-40 flex justify-around border-t border-outline-variant/30 py-2 md:hidden">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                isActive ? "font-bold text-primary" : "text-on-surface-variant"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={link.icon} fill={isActive} className="text-[22px]" />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
