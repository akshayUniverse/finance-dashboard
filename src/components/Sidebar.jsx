import { useState } from "react";
import { Home, BarChart2, CreditCard, Menu, X, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  {
    icon: <Home size={18} className="shrink-0" />,
    label: "Dashboard",
  },
  {
    icon: <BarChart2 size={18} className="shrink-0" />,
    label: "Analytics",
  },
  {
    icon: <CreditCard size={18} className="shrink-0" />,
    label: "Transactions",
  },
];

export default function Sidebar() {
  const { activePage, isMobile, setActivePage } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCollapsed = !isMobile && collapsed;
  const showMobileSidebar = isMobile && mobileOpen;

  const handleNavClick = (label) => {
    setActivePage(label);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          opacity: showMobileSidebar ? 1 : 0,
          pointerEvents: showMobileSidebar ? "auto" : "none",
          transition: "opacity 350ms ease",
        }}
        className="fixed inset-0 bg-black/60 z-40"
      />

      <div
        className="hidden md:block shrink-0 h-screen"
        style={{
          width: isCollapsed ? 72 : 256,
          transition: "width 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "width",
        }}
      />

      <aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-gray-800 overflow-hidden"
        style={{
          width: isMobile ? 256 : isCollapsed ? 72 : 256,
          transform: isMobile
            ? showMobileSidebar
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          transition: isMobile
            ? "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)"
            : "width 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: isMobile ? "transform" : "width",
          boxShadow: showMobileSidebar ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
        }}
      >
        <div
          className="flex shrink-0 border-b border-gray-100 dark:border-gray-800"
          style={{
            flexDirection: isCollapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap: isCollapsed ? 12 : 0,
            padding: isCollapsed ? "20px 8px" : "0 12px",
            minHeight: 61,
            transition: "padding 300ms ease, gap 300ms ease",
          }}
        >
          <div className="flex items-center justify-center shrink-0">
            {isCollapsed ? (
              <div className="size-8 bg-indigo-500 rounded-[10px] flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-8 bg-indigo-500 rounded-[10px] flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-[15px] text-gray-800 dark:text-white font-poppins-semibold whitespace-nowrap">
                  FinDash
                </span>
              </div>
            )}
          </div>

          {!isMobile ? (
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="size-8 flex items-center justify-center rounded-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
            >
              <Menu size={16} />
            </button>
          ) : (
            <button
              onClick={() => setMobileOpen(false)}
              className="size-8 flex items-center justify-center rounded-[10px] text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
              style={{
                opacity: showMobileSidebar ? 1 : 0,
                pointerEvents: showMobileSidebar ? "auto" : "none",
                transition: "opacity 200ms ease",
                marginLeft: "auto",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ icon, label }) => {
            const isActive = activePage === label;

            return (
              <button
                key={label}
                onClick={() => handleNavClick(label)}
                title={isCollapsed ? label : undefined}
                className={`
                  w-full flex items-center rounded-[10px]
                  transition-colors duration-150 cursor-pointer
                  ${isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-3"}
                  ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }
                `}
              >
                {icon}
                <span
                  style={{
                    opacity: isCollapsed ? 0 : 1,
                    maxWidth: isCollapsed ? 0 : 160,
                    transition: isCollapsed
                      ? "opacity 80ms ease-in, max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                      : "opacity 200ms ease-out 180ms, max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="text-[14px] font-poppins-medium whitespace-nowrap overflow-hidden"
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div
            className={`
              flex items-center rounded-[10px]
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-colors cursor-pointer
              ${isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"}
            `}
          >
            <div className="size-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[12px] font-poppins-bold shrink-0">
              A
            </div>
            <div
              style={{
                opacity: isCollapsed ? 0 : 1,
                maxWidth: isCollapsed ? 0 : 160,
                transition: isCollapsed
                  ? "opacity 80ms ease-in, max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                  : "opacity 200ms ease-out 180ms, max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="min-w-0 overflow-hidden"
            >
              <p className="text-[12px] font-poppins-semibold text-gray-700 dark:text-gray-200 truncate">Akshay</p>
              <p className="text-[10px] text-gray-400 truncate">akshay@findash.io</p>
            </div>
          </div>
        </div>
      </aside>

      {isMobile && !showMobileSidebar && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <div className="size-8 bg-indigo-500 rounded-[10px] flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-[10px] flex items-center justify-center shadow-sm text-gray-600 dark:text-gray-300 cursor-pointer transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>
      )}
    </>
  );
}
