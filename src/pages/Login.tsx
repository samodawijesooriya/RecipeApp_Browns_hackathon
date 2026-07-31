import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { mockUsers } from "../data/mockData";
import { Icon } from "../components/Icon";

/** Pickable mock accounts shown on the login fridge door. */
const PICKABLE = mockUsers.filter((u) =>
  ["u-you", "u-nimali", "u-sarah", "u-mark", "u-anna", "u-dave"].includes(u.id),
);

export function Login() {
  const { login, isLoggedIn } = useRecipes();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  const [selectedId, setSelectedId] = useState(PICKABLE[0]?.id ?? "u-you");
  const [handleInput, setHandleInput] = useState("");
  const [password, setPassword] = useState("");

  if (isLoggedIn) {
    return <Navigate to={from === "/login" ? "/" : from} replace />;
  }

  const selected = PICKABLE.find((u) => u.id === selectedId) ?? PICKABLE[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const identifier = handleInput.trim() || selectedId;
    login(identifier);
    // password is intentionally ignored — any value (including empty) works
    void password;
    navigate(from === "/login" ? "/" : from, { replace: true });
  };

  return (
    <main className="fridge-texture mx-auto flex w-full max-w-lg flex-col items-center px-4 py-12 md:px-12">
      <div className="pastel-mint sticky-note relative w-full rotate-[-1deg] rounded-xl p-6 shadow-lg md:p-8">
        <div className="magnet mag-green" />
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src="/kitchenboard-logo.png"
            alt="KitchenBoard"
            className="mb-4 h-14 w-auto object-contain"
          />
          <h1 className="font-hand text-3xl font-semibold text-on-surface md:text-4xl">
            Come into the kitchen
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Pick a chef, type any password — it unlocks the fridge door.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="mb-3 text-xs font-bold tracking-wide text-on-surface-variant uppercase">
              Who&apos;s cooking today?
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {PICKABLE.map((user) => {
                const active = selectedId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(user.id);
                      setHandleInput("");
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all ${
                      active
                        ? "border-accent-green bg-white shadow-md"
                        : "border-transparent bg-white/50 hover:border-outline-variant/50"
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-hand text-lg text-white">
                        {user.name[0]}
                      </div>
                    )}
                    <span className="text-center text-xs font-semibold leading-tight text-on-surface">
                      {user.name.split(" ")[0]}
                    </span>
                    {user.role === "admin" && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                        Admin
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selected && (
              <p className="mt-2 text-center text-xs text-on-surface-variant">
                Signing in as{" "}
                <span className="font-semibold text-on-surface">
                  {selected.name}
                </span>{" "}
                ({selected.handle})
              </p>
            )}
          </fieldset>

          <div>
            <label
              htmlFor="handle"
              className="mb-1 block text-xs font-bold tracking-wide text-on-surface-variant uppercase"
            >
              Or type a handle
            </label>
            <input
              id="handle"
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="@lanka_kitchen"
              className="w-full rounded-lg border border-outline-variant/60 bg-white px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-accent-green focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-bold tracking-wide text-on-surface-variant uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="anything works"
              className="w-full rounded-lg border border-outline-variant/60 bg-white px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-accent-green focus:outline-none"
            />
            <p className="mt-1.5 flex items-center gap-1 text-xs text-on-surface-variant">
              <Icon name="lock_open" className="text-[14px]" />
              Any password unlocks the fridge door — this is mock auth.
            </p>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-green py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <Icon name="door_open" />
            Open the fridge
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-on-surface-variant">
        Just browsing?{" "}
        <Link to="/" className="font-semibold text-primary hover:underline">
          Peek at recipes without logging in →
        </Link>
      </p>
    </main>
  );
}
