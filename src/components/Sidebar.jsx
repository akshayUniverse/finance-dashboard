import { useState, useEffect, useRef } from "react";
import { Home, BarChart2, CreditCard, Menu, X, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { icon: Home,        label: "Dashboard"    },
  { icon: BarChart2,   label: "Analytics"    },
  { icon: CreditCard,  label: "Transactions" },
];

export default function Sidebar() {
  const { activePage, setActivePage } = useApp();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop,  setIsDesktop]  = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setMobileOpen(false);
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isCollapsed = isDesktop && collapsed;

  const handleNavClick = (label) => {
    setActivePage(label);
    if (!isDesktop) setMobileOpen(false);
  };

  return (
    <>
      
      {!isDesktop && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`
          relative shrink-0 h-screen
          transition-[width] duration-300 ease-in-out
          hidden md:block
          ${isCollapsed ? "w-[72px]" : "w-64"}
        `}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col h-screen
          bg-white dark:bg-[#111827]
          border-r border-gray-100 dark:border-gray-800
          overflow-hidden
          transition-[width,transform] duration-300 ease-in-out
          ${isCollapsed ? "w-[72px]" : "w-64"}
          ${!isDesktop
            ? mobileOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full"
            : "translate-x-0"
          }
        `}
      >
        
        <div className="flex items-center h-[61px] px-4 shrink-0 border-b border-gray-100 dark:border-gray-800">

          
          <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>

          <span
            style={{
              opacity: isCollapsed ? 0 : 1,
              transition: "opacity 200ms ease-in-out",
              pointerEvents: isCollapsed ? "none" : "auto",
            }}
            className="ml-2 font-bold text-[15px] text-gray-800 dark:text-white font-poppins-semibold whitespace-nowrap overflow-hidden"
          >
            FinDash
          </span>


          {isDesktop && (
            <button
              onClick={() => setCollapsed(p => !p)}
              className="ml-auto w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Menu size={16} />
            </button>
          )}

          {!isDesktop && mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            const isActive = activePage === label;
            return (
              <button
                key={label}
                onClick={() => handleNavClick(label)}
                title={label}
                className={`
                  w-full flex items-center rounded-xl
                  transition-colors duration-150 cursor-pointer
                  ${isCollapsed ? "justify-center p-[11px]" : "gap-3 px-3 py-[11px]"}
                  ${isActive
                    ? "bg-indigo-500 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                <span
                  style={{
                    opacity: isCollapsed ? 0 : 1,
                    maxWidth: isCollapsed ? 0 : 160,
                    transition: "opacity 200ms ease-in-out, max-width 300ms ease-in-out",
                  }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div className={`
            flex items-center rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors cursor-pointer
            ${isCollapsed ? "justify-center p-[11px]" : "gap-3 px-3 py-2.5"}
          `}>
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div
              style={{
                opacity: isCollapsed ? 0 : 1,
                maxWidth: isCollapsed ? 0 : 160,
                transition: "opacity 200ms ease-in-out, max-width 300ms ease-in-out",
              }}
              className="min-w-0 overflow-hidden"
            >
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">Akshay</p>
              <p className="text-[10px] text-gray-400 truncate">akshay@findash.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile hamburger */}
      {!isDesktop && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 w-9 h-9 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shadow-sm text-gray-600 dark:text-gray-300 cursor-pointer transition-colors"
        >
          <Menu size={16} />
        </button>
      )}
    </>
  );
}