import Sidebar from "./Sidebar";
import Header from "./Header";
import { useApp } from "../context/AppContext";

export default function Layout({ children }) {
  const { darkMode } = useApp();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0B0F1A] text-black dark:text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}