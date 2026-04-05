import { createContext, useContext, useState } from "react";
import { transactions as initialTransactions } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [role, setRole] = useState("Viewer");
  const [transactions, setTransactions] = useState(initialTransactions);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
