import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header({ toggleTheme, isDark }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [role, setRole] = useState("Viewer");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 pl-16 md:pl-6 bg-white dark:bg-[#111827] border-b border-gray-700">
      <div className="text-lg font-semibold pl-12 md:pl-0">Dashboard</div>

      <div className="flex items-center gap-4 relative">
        <button onClick={toggleTheme} className="icon-btn cursor-pointer">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!isMobile && (
          <>
            <Bell className="text-gray-400 cursor-pointer" />
            <div
              onClick={() => setRole(role === "Viewer" ? "Admin" : "Viewer")}
              className="bg-gray-100 dark:bg-[#1F2937] px-3 py-2 rounded-lg text-sm cursor-pointer"
            >
              {role}
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-500 cursor-pointer"></div>
            <LogOut className="text-gray-400 cursor-pointer hover:text-red-500" />
          </>
        )}
        <div className="relative profile-menu">
          {isMobile && (
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="w-8 h-8 rounded-full bg-indigo-500 cursor-pointer"
            ></div>
          )}

          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1F2937] rounded-xl shadow-lg p-2 z-50">
              {isMobile && (
                <>
                  <div className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    Profile
                  </div>
                  <div className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-between">
                    Notifications
                    <Bell size={16} />
                  </div>

                  <div
                    onClick={toggleTheme}
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    Toggle Theme
                  </div>
                  <div
                    onClick={() =>
                      setRole(role === "Viewer" ? "Admin" : "Viewer")
                    }
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    Role: {role}
                  </div>
                </>
              )}

              <div className="px-3 py-2 text-sm hover:bg-white dark:hover:bg-red-300 rounded-lg cursor-pointer text-red-500">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
