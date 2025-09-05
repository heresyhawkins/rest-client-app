import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "store/store";
import { toggleLocale } from "states/uiSlice";

export const LanguageToggle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locale = useSelector((state: RootState) => state.ui.locale);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => dispatch(toggleLocale())}
        className={`relative flex h-6 w-12 items-center rounded-full p-1 transition ${
          locale === "en" ? "bg-violet-500" : "bg-violet-500"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-md transform transition ${
            locale === "en" ? "translate-x-0" : "translate-x-6"
          }`}
        />
      </button>

      <div className="flex gap-1 text-sm font-medium">
        <span
          className={`transition ${
            locale === "en" ? "text-violet-700 font-bold" : "text-gray-400"
          }`}
        >
          EN
        </span>
        <span className="text-gray-400">|</span>
        <span
          className={`transition ${
            locale === "ru" ? "text-violet-700 font-bold" : "text-gray-400"
          }`}
        >
          RU
        </span>
      </div>
    </div>
  );
};
