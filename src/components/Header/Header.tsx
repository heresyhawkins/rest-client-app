import { LanguageToggle } from "@components";
import type {FC} from "react";
import { useEffect, useState } from "react";
import { BiCool } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "states/uiSlice";
import type { AppDispatch, RootState } from "store/store";

export const Header: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector((state: RootState) => state.ui.isAuthenticated);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled
          ? "bg-violet-400 h-12 shadow-md"
          : "bg-violet-300 h-20"
        } text-violet-50`}
    >
      <div className="flex items-center gap-2">
        <BiCool className="size-15 m-2 text-violet-500"/>
      </div>
      
      <div>
        <LanguageToggle />
      </div>

      <nav>
        <ul className="flex gap-4 items-center">
          <li>
            <a href="/" className="text-lg">Main</a>
          </li>

          {isAuthenticated && (
            <li>
              <button
                onClick={() => dispatch(signOut())}
                className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 transition"
              >Sign out</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}