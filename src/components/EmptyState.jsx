function EmptyState({ searchTerm }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img
        src="/no-movie.png"
        alt=""
        aria-hidden="true"
        className="mb-6 w-32 opacity-50"
      />
      <h3 className="mb-2 text-xl font-semibold text-white">
        {searchTerm
          ? `No movies found for "${searchTerm}"`
          : "No movies to show"}
      </h3>
      <p className="max-w-md text-sm text-light-200">
        Try a different search term, check your spelling, or browse the popular
        movies above.
      </p>
    </div>
  );
}

export default EmptyState;
