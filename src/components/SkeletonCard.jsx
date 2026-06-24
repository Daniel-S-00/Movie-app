function SkeletonCard() {
  return (
    <div className="movie-card animate-pulse" aria-hidden="true">
      <div className="aspect-[2/3] w-full rounded-lg bg-light-100/5" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-light-100/10" />
        <div className="flex gap-2">
          <div className="h-3 w-10 rounded bg-light-100/10" />
          <div className="h-3 w-6 rounded bg-light-100/10" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
