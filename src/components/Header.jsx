import { useEffect, useRef, useState } from "react";
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Header() {
  const { activePage, isDark, isMobile, role, toggleRole, toggleTheme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen]);

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 pl-16 md:pl-6 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-700">
      <div className="text-lg font-semibold pl-12 md:pl-0 font-poppins-semibold">
        {activePage}
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!isMobile && (
          <>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <Bell size={18} className="text-gray-500 dark:text-gray-400" />
            </button>

            <button
              onClick={toggleRole}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                role === "Admin"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {role}
            </button>

            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              A
            </div>

            <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors">
              <LogOut size={18} className="text-gray-400 hover:text-red-500" />
            </button>
          </>
        )}

        <div ref={menuRef} className="relative">
          {isMobile && (
            <div
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            >
              A
            </div>
          )}

          {menuOpen && isMobile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1F2937] rounded-xl shadow-lg p-2 z-50 border border-gray-100 dark:border-gray-700">
              <div
                onClick={toggleTheme}
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                Toggle Theme
              </div>
              <div
                onClick={toggleRole}
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                Role: {role}
              </div>
              <div className="px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer text-red-500">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
