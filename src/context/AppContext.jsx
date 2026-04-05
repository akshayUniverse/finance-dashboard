import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { transactions as initialTransactions } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [role, setRole] = useState("Viewer");
  const [transactions, setTransactions] = useState(initialTransactions);
   const [activePage, setActivePage]     = useState("Dashboard");

   useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = useCallback((event) => {
    // Get button center position on screen
    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const x = rect
      ? Math.round(rect.left + rect.width / 2)
      : window.innerWidth / 2;
    const y = rect
      ? Math.round(rect.top + rect.height / 2)
      : window.innerHeight / 2;

    // Tell CSS where the ripple starts
    document.documentElement.style.setProperty("--ripple-x", `${x}px`);
    document.documentElement.style.setProperty("--ripple-y", `${y}px`);

    // If browser supports View Transitions
    if (!document.startViewTransition) {
      setDarkMode((prev) => !prev);
      return;
    }

    document.startViewTransition(() => {
      setDarkMode((prev) => !prev);
    });
  }, []);

  const toggleRole = () => {
    setRole((prev) => (prev === "Viewer" ? "Admin" : "Viewer"));
  };

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev]);
  };

  const editTransaction = (id, updated) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updated } : tx)),
    );
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        isDark: darkMode,
        toggleTheme,
        role,
        toggleRole,
        transactions,
        addTransaction,
        editTransaction,
        activePage,
        setActivePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
