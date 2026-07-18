export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow-primary animate-float">
            <span className="text-2xl">🍳</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-white/10 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm">Loading…</p>
        </div>
      </div>
    </div>
  );
}
