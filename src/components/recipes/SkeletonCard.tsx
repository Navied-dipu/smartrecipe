export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full bg-[#1c1209]/80 border-white/[0.05]">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-white/[0.02] shimmer" />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Badges Skeleton */}
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded bg-white/[0.03] shimmer" />
          <div className="h-5 w-16 rounded bg-white/[0.03] shimmer" />
        </div>

        {/* Title Skeleton */}
        <div className="h-6 w-3/4 rounded bg-white/[0.03] shimmer" />

        {/* Description Skeleton */}
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full rounded bg-white/[0.03] shimmer" />
          <div className="h-4 w-5/6 rounded bg-white/[0.03] shimmer" />
        </div>

        {/* Meta row Skeleton */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 w-16 rounded bg-white/[0.03] shimmer" />
          <div className="h-4 w-12 rounded bg-white/[0.03] shimmer" />
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full rounded-xl bg-white/[0.03] shimmer mt-1" />
      </div>
    </div>
  );
}
