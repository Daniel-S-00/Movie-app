import { useI18n } from "../i18n/I18nContext.js";

function EmptyState({ searchTerm }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img
        src="/no-movie.png"
        alt=""
        aria-hidden="true"
        className="mb-6 w-32 opacity-50"
      />
      <h3 className="mb-2 text-xl font-semibold text-white">
        {searchTerm ? t("empty.noResults", { term: searchTerm }) : t("empty.title")}
      </h3>
      <p className="max-w-md text-sm text-light-200">{t("empty.hint")}</p>
    </div>
  );
}

export default EmptyState;
