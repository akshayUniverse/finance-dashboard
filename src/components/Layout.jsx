import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-white dark:bg-[#0B0F1A] text-black dark:text-white">
        
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header 
            toggleTheme={toggleTheme} 
            isDark={darkMode}   
          />

          <main className="flex-1 p-4">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}