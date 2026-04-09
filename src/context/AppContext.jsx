/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  categoryColors,
  transactions as seedTransactions,
} from "../data/mockData";
import { normalizeTransaction, normalizeTransactions } from "../utils/finance";

const AppContext = createContext(null);
const MOBILE_QUERY = "(max-width: 767px)";
const DATA_VERSION = "2026-finance-seed-v2";
const STORAGE_KEYS = {
  dataVersion: "finance-dashboard-data-version",
  role: "finance-dashboard-role",
  theme: "finance-dashboard-theme",
  transactions: "finance-dashboard-transactions",
};
const validTypes = new Set(["income", "expense"]);

function readStorage(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures and keep the UI responsive.
  }
}

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
  const [isDark, setIsDark] = useState(() => readStorage(STORAGE_KEYS.theme, true));
  const [role, setRole] = useState(() => readStorage(STORAGE_KEYS.role, "Viewer"));
  const [transactions, setTransactions] = useState(() => {
    const storedVersion = readStorage(STORAGE_KEYS.dataVersion, null);
    const fallbackTransactions = normalizeTransactions(seedTransactions);

    if (storedVersion !== DATA_VERSION) {
      return fallbackTransactions;
    }

    const storedTransactions = readStorage(STORAGE_KEYS.transactions, fallbackTransactions);
    return normalizeTransactions(storedTransactions);
  });
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
    writeStorage(STORAGE_KEYS.theme, isDark);
  }, [isDark]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.role, role);
  }, [role]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.dataVersion, DATA_VERSION);
  }, []);

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
    const normalizedTx = normalizeTransaction({
      ...nextTx,
      description: cleanText(nextTx.description),
    });
    const amount = Number(normalizedTx.amount);

    if (
      !normalizedTx.description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !validTypes.has(normalizedTx.type) ||
      !Object.hasOwn(categoryColors, normalizedTx.category) ||
      !isValidDate(normalizedTx.date)
    ) {
      return false;
    }

    setTransactions((prev) => [
      {
        ...normalizedTx,
        id: nextTx.id || `txn-${Date.now()}`,
        amount,
      },
      ...prev,
    ]);

    return true;
  };

  const updateTransaction = (nextTx) => {
    const normalizedTx = normalizeTransaction({
      ...nextTx,
      description: cleanText(nextTx.description),
    });
    const amount = Number(normalizedTx.amount);

    if (
      !normalizedTx.id ||
      !normalizedTx.description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !validTypes.has(normalizedTx.type) ||
      !Object.hasOwn(categoryColors, normalizedTx.category) ||
      !isValidDate(normalizedTx.date)
    ) {
      return false;
    }

    let updated = false;

    setTransactions((prev) => prev.map((item) => {
      if (item.id !== normalizedTx.id) {
        return item;
      }

      updated = true;

      return {
        ...item,
        ...normalizedTx,
        amount,
      };
    }));

    return updated;
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
        updateTransaction,
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
