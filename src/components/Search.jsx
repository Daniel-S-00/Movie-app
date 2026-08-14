import { useI18n } from "../i18n/I18nContext.js";

const Search = ({ searchTerm, setSearchTerm }) => {
  const { t } = useI18n();
  const handleSubmit = (e) => e.preventDefault();

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <div>
        <img src="search.svg" alt="" aria-hidden="true" />
        <input
          type="search"
          placeholder={t("search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label={t("search.aria")}
        />
      </div>
    </form>
  );
};

export default Search;
