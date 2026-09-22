export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-4 w-3/4 rounded-md" />
        <div className="skeleton h-3 w-1/2 rounded-md" />
        <div className="skeleton mt-2 h-5 w-1/3 rounded-md" />
      </div>
    </div>
  );
}
