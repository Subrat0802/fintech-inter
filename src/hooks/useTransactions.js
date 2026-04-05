import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  getTotalIncome,
  getTotalExpense,
  getSpendingByCategory,
  getMonthlyData,
} from "../utils/helpers";

// centralizes all the derived data calculations so pages don't repeat logic
export function useTransactions() {
  const { transactions } = useApp();

  const totalIncome = useMemo(() => getTotalIncome(transactions), [transactions]);
  const totalExpense = useMemo(() => getTotalExpense(transactions), [transactions]);
  const balance = totalIncome - totalExpense;

  const savingsRate = totalIncome > 0
    ? ((balance / totalIncome) * 100).toFixed(1)
    : "0.0";

  const categoryBreakdown = useMemo(
    () => getSpendingByCategory(transactions),
    [transactions]
  );

  // hardcoding these 3 months since the data covers Jan-Mar 2026
  const monthlyData = useMemo(
    () => getMonthlyData(transactions, ["2026-01", "2026-02", "2026-03"]),
    [transactions]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [transactions]
  );

  return {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    categoryBreakdown,
    monthlyData,
    recentTransactions,
  };
}
