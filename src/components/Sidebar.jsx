import { useState, useEffect } from "react";
import { Home, BarChart2, CreditCard, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const effectiveCollapsed = isDesktop ? collapsed : false;

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {!isDesktop && open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-50 md:relative h-screen bg-[#111827] transition-all duration-300
                    ${isDesktop ? (collapsed ? "w-20" : "w-64") : "w-64"}
                    ${!isDesktop && !open ? "-translate-x-full" : "translate-x-0"}
                    `}
      >
        <div className="flex p-4 flex-col h-full">
          <div
            className={`flex flex-col items-center mb-6 py-1 ${
              effectiveCollapsed ? "gap-6" : "justify-between flex-row"
            }`}
          >
            <div className="flex items-center justify-center">
              {effectiveCollapsed ? (
                <div className="size-8 bg-indigo-500 rounded-[10px] flex items-center justify-center font-poppins-bold">
                  F
                </div>
              ) : (
                <h1 className="text-22 font-poppins-bold text-indigo-500 pl-3">FinDash</h1>
              )}
            </div>

            <button
              className="cursor-pointer"
              onClick={() =>
                isDesktop ? setCollapsed(!collapsed) : setOpen(false)
              }
              aria-label="Toggle Sidebar"
            >
              {isDesktop ? <Menu /> : <X />}
            </button>
          </div>
          <nav
            className={`space-y-3 transition-all duration-300 ${
              !isDesktop && !open
                ? "opacity-0 translate-x-5"
                : "opacity-100 translate-x-0"
            }`}
          >
            <Item
              icon={<Home />}
              label="Dashboard"
              collapsed={effectiveCollapsed}
            />
            <Item
              icon={<BarChart2 />}
              label="Analytics"
              collapsed={effectiveCollapsed}
            />
            <Item
              icon={<CreditCard />}
              label="Transactions"
              collapsed={effectiveCollapsed}
            />
          </nav>
        </div>
      </aside>

      {!isDesktop && !open && (
        <div className="fixed top-3 left-4 z-50 flex items-center gap-2">
         
          <div className="size-8 bg-indigo-500 rounded-[10px] flex items-center justify-center font-poppins-bold text-white">
            F
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-[#111827] p-2 rounded-[10px]"
          >
            <Menu />
          </button>
        </div>
      )}
    </>
  );
}

function Item({ icon, label, collapsed }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-gray-700 transition-all duration-200 cursor-pointer">
      {icon}
      {!collapsed && <span>{label}</span>}
    </div>
  );
}
