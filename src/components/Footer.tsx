export function Footer() {
  return (
    <footer className="mt-16 border-t border-outline-variant/40 bg-surface-container-highest pb-20 text-sm text-on-surface-variant md:pb-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-12">
        <p className="opacity-80">
          © 2026 KitchenBoard — Crafted with morning optimism.
        </p>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer opacity-80 transition-opacity hover:opacity-100">About</span>
          <span className="cursor-pointer opacity-80 transition-opacity hover:opacity-100">Privacy</span>
          <span className="cursor-pointer opacity-80 transition-opacity hover:opacity-100">Kitchen Rules</span>
        </div>
        <img
          src="/kitchenboard-logo.png"
          alt="KitchenBoard"
          className="h-10 w-auto object-contain opacity-90"
        />
      </div>
    </footer>
  );
}
