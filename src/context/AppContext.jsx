/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  categoryColors,
  transactions as seedTransactions,
} from "../data/mockData";

const AppContext = createContext(null);
const MOBILE_QUERY = "(max-width: 767px)";
const validTypes = new Set(["income", "expense"]);

function cleanText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [role, setRole] = useState("Viewer");
  const [transactions, setTransactions] = useState(seedTransactions);
  const [activePage, setActivePage] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const media = window.matchMedia(MOBILE_QUERY);
    const syncViewport = (event) => setIsMobile(event.matches);

    if (media.addEventListener) {
      media.addEventListener("change", syncViewport);
      return () => media.removeEventListener("change", syncViewport);
    }

    media.addListener(syncViewport);
    return () => media.removeListener(syncViewport);
  }, []);

  const toggleTheme = useCallback((event) => {
    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const x = rect
      ? Math.round(rect.left + rect.width / 2)
      : window.innerWidth / 2;
    const y = rect
      ? Math.round(rect.top + rect.height / 2)
      : window.innerHeight / 2;

    document.documentElement.style.setProperty("--ripple-x", `${x}px`);
    document.documentElement.style.setProperty("--ripple-y", `${y}px`);

    if (!document.startViewTransition) {
      setIsDark((prev) => !prev);
      return;
    }

    document.startViewTransition(() => {
      setIsDark((prev) => !prev);
    });
  }, []);

  const toggleRole = () => {
    setRole((prev) => (prev === "Viewer" ? "Admin" : "Viewer"));
  };

  const addTransaction = (nextTx) => {
    const description = cleanText(nextTx.description);
    const amount = Number(nextTx.amount);

    if (
      !description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !validTypes.has(nextTx.type) ||
      !Object.hasOwn(categoryColors, nextTx.category) ||
      !isValidDate(nextTx.date)
    ) {
      return false;
    }

    setTransactions((prev) => [
      {
        id: Date.now(),
        amount,
        category: nextTx.category,
        date: nextTx.date,
        description,
        type: nextTx.type,
      },
      ...prev,
    ]);

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        addTransaction,
        isDark,
        isMobile,
        role,
        setActivePage,
        toggleRole,
        toggleTheme,
        transactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
