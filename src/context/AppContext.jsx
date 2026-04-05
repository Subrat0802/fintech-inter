import { createContext, useContext, useState, useEffect } from "react";
import { transactions as initialData } from "../data/transactions";

const AppContext = createContext(null);

// tried using redux first but honestly context is enough for this scale
export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    // load from localStorage if available, otherwise use default data
    try {
      const saved = localStorage.getItem("fintrack_transactions");
      return saved ? JSON.parse(saved) : initialData;
    } catch {
      return initialData;
    }
  });

  const [role, setRole] = useState("Admin");
  const [darkMode, setDarkMode] = useState(false);
  const [nextId, setNextId] = useState(46);

  // persist to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("fintrack_transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(txn) {
    const newTxn = {
      ...txn,
      id: nextId,
      // make amount negative if it's an expense
      amount: txn.type === "expense" ? -Math.abs(txn.amount) : Math.abs(txn.amount),
    };
    setTransactions((prev) => [newTxn, ...prev]);
    setNextId((n) => n + 1);
  }

  function editTransaction(id, updates) {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          ...updates,
          amount:
            updates.type === "expense"
              ? -Math.abs(updates.amount)
              : Math.abs(updates.amount),
        };
      })
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const value = {
    transactions,
    role,
    setRole,
    darkMode,
    setDarkMode,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// custom hook so I don't have to import useContext everywhere
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
