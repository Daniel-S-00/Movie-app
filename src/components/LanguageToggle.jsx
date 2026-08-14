import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "../i18n/languages.js";
import { useI18n } from "../i18n/I18nContext.js";

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LanguageToggle({ language, onLanguageChange }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const code = language.split("-")[0].toUpperCase();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed top-4 right-16 z-30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("language.selectLabel")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="icon-toggle flex h-10 w-10 items-center justify-center gap-1 rounded-full bg-light-100/10 text-white transition hover:bg-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/40"
      >
        <GlobeIcon />
        <span className="text-[10px] font-semibold">{code}</span>
      </button>
      {open && (
        <ul
          role="menu"
          aria-label={t("language.selectLabel")}
          className="absolute top-14 right-0 w-44 overflow-hidden rounded-xl bg-dark-100 py-1 shadow-2xl ring-1 ring-light-100/20"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onLanguageChange(lang.code);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition hover:bg-light-100/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-100/40 ${
                  lang.code === language
                    ? "font-semibold text-light-100"
                    : "text-light-200"
                }`}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageToggle;
