import { useState, useEffect } from "react";
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
  const [isDesktop,  setIsDesktop]  = useState(
    () => typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

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

  // Shared transition string — one source of truth for timing
  const sidebarTransition = "width 300ms cubic-bezier(0.4,0,0.2,1), transform 350ms cubic-bezier(0.4,0,0.2,1)";
  const spacerTransition  = "width 300ms cubic-bezier(0.4,0,0.2,1)";

  return (
    <>
      {/* ── Mobile backdrop ── */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          opacity:        !isDesktop && mobileOpen ? 1 : 0,
          pointerEvents:  !isDesktop && mobileOpen ? "auto" : "none",
          transition:     "opacity 350ms ease",
        }}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* ── Spacer — desktop only, reserves space so main content shifts ── */}
      <div
        className="hidden md:block shrink-0 h-screen"
        style={{
          width:      isCollapsed ? 72 : 256,
          transition: "width 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "width",
        }}
      />

      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-gray-800 overflow-hidden"
        style={{
          width: isDesktop ? (isCollapsed ? 72 : 256) : 256,
          transform: !isDesktop
            ? mobileOpen ? "translateX(0)" : "translateX(-100%)"
            : "translateX(0)",
          transition: isDesktop
            ? "width 350ms cubic-bezier(0.4, 0, 0.2, 1)"
            : "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: isDesktop ? "width" : "transform",
          boxShadow: !isDesktop && mobileOpen ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
        }}
      >

        {/* ── Logo + Toggle row ── */}
        <div
          className="flex shrink-0 border-b border-gray-100 dark:border-gray-800"
          style={{
            flexDirection:  isCollapsed ? "column" : "row",
            alignItems:     "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap:            isCollapsed ? 12 : 0,
            padding:        isCollapsed ? "20px 8px" : "0 12px",
            minHeight:      61,
            transition:     "padding 300ms ease, gap 300ms ease",
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center shrink-0">
            {isCollapsed ? (
              <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-[15px] text-gray-800 dark:text-white font-poppins-semibold whitespace-nowrap">
                  FinDash
                </span>
              </div>
            )}
          </div>

          {/* Toggle button */}
          {isDesktop ? (
            <button
              onClick={() => setCollapsed(p => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
            >
              <Menu size={16} />
            </button>
          ) : (
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
              style={{
                opacity:       mobileOpen ? 1 : 0,
                pointerEvents: mobileOpen ? "auto" : "none",
                transition:    "opacity 200ms ease",
                marginLeft:    "auto",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            const isActive = activePage === label;
            return (
              <button
                key={label}
                onClick={() => handleNavClick(label)}
                title={isCollapsed ? label : ""}
                className={`
                  w-full flex items-center rounded-xl
                  transition-colors duration-150 cursor-pointer
                  ${isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-3"}
                  ${isActive
                    ? "bg-indigo-500 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                <span
                  style={{
                    opacity:    isCollapsed ? 0 : 1,
                    maxWidth:   isCollapsed ? 0 : 160,
                    transition: isCollapsed
                      ? "opacity 80ms ease-in, max-width 300ms cubic-bezier(0.4,0,0.2,1)"
                      : "opacity 200ms ease-out 180ms, max-width 300ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Bottom user section ── */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div
            className={`
              flex items-center rounded-xl
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-colors cursor-pointer
              ${isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"}
            `}
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div
              style={{
                opacity:    isCollapsed ? 0 : 1,
                maxWidth:   isCollapsed ? 0 : 160,
                transition: isCollapsed
                  ? "opacity 80ms ease-in, max-width 300ms cubic-bezier(0.4,0,0.2,1)"
                  : "opacity 200ms ease-out 180ms, max-width 300ms cubic-bezier(0.4,0,0.2,1)",
              }}
              className="min-w-0 overflow-hidden"
            >
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">Akshay</p>
              <p className="text-[10px] text-gray-400 truncate">akshay@findash.io</p>
            </div>
          </div>
        </div>

      </aside>

      {/* ── Mobile hamburger ── */}
      {!isDesktop && !mobileOpen && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shadow-sm text-gray-600 dark:text-gray-300 cursor-pointer transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>
      )}
    </>
  );
}