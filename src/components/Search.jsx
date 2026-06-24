const Search = ({ searchTerm, setSearchTerm }) => {
  const handleSubmit = (e) => e.preventDefault();

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <div>
        <img src="search.svg" alt="" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search a movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for movies"
        />
      </div>
    </form>
  );
};

export default Search;
