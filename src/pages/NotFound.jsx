import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.js";

function NotFound() {
  const { t } = useI18n();

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="mb-2 text-7xl font-bold text-white sm:text-8xl">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-light-200 sm:text-3xl">
          {t("notFound.title")}
        </h2>
        <p className="mb-6 max-w-md text-light-200">{t("notFound.message")}</p>
        <Link
          to="/"
          className="rounded-lg bg-light-100/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/40"
        >
          {t("notFound.backHome")}
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
