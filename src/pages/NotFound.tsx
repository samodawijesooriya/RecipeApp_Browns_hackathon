import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="pastel-yellow sticky-note mx-auto max-w-sm rotate-[-2deg] rounded-xl p-8">
        <div className="magnet mag-red" />
        <Icon name="search_off" className="mt-2 text-5xl text-on-surface-variant/50" />
        <h1 className="mt-3 font-hand text-3xl font-semibold text-on-surface">
          404 — note not found
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          This sticky note must have fallen behind the fridge.
        </p>
      </div>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-accent-green px-5 py-2.5 font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
      >
        Back to the fridge
      </Link>
    </main>
  );
}
