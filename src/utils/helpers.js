// small helper functions used across the app

// format numbers as Indian Rupee - en-IN locale handles the lakh/crore formatting
export function formatCurrency(amount) {
  return "₹" + Math.abs(amount).toLocaleString("en-IN");
}

// get YYYY-MM prefix from a date string, useful for filtering by month
export function getMonthPrefix(dateStr) {
  return dateStr.slice(0, 7);
}

// takes a transactions array and returns total income
export function getTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

// same for expenses, returns positive number
export function getTotalExpense(transactions) {
  return Math.abs(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );
}

// groups expenses by category, returns sorted array [{category, amount}]
export function getSpendingByCategory(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.category;
      map[cat] = (map[cat] || 0) + Math.abs(t.amount);
    });

  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// returns monthly summary for a list of month prefixes
export function getMonthlyData(transactions, months) {
  return months.map((prefix) => {
    const monthTxns = transactions.filter((t) =>
      t.date.startsWith(prefix)
    );
    return {
      month: prefix,
      income: getTotalIncome(monthTxns),
      expense: getTotalExpense(monthTxns),
    };
  });
}
