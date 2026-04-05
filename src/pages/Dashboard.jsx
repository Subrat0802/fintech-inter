import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/helpers";
import StatCard from "../components/StatCard";
import BarChart from "../components/BarChart";
import CategoryDonut from "../components/CategoryDonut";
import TransactionRow from "../components/TransactionRow";
import styles from "./Dashboard.module.css";

function Dashboard({ onNavigate, onEditTxn }) {
  const {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    categoryBreakdown,
    monthlyData,
    recentTransactions,
  } = useTransactions();

  // figure out expense change from feb to march
  const feb = monthlyData.find((m) => m.month === "2026-02");
  const mar = monthlyData.find((m) => m.month === "2026-03");
  const expChangePercent =
    feb && feb.expense > 0
      ? (((mar.expense - feb.expense) / feb.expense) * 100).toFixed(1)
      : null;

  return (
    <div className={styles.page}>
      {/* summary cards */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Balance"
          value={formatCurrency(balance)}
          valueColor={balance >= 0 ? "#4AAB6A" : "#E24B4A"}
          subText={`Savings rate: ${savingsRate}%`}
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          valueColor="#4AAB6A"
          subText="Jan – Mar 2026"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpense)}
          valueColor="#E2793D"
          subText={
            expChangePercent !== null
              ? `${expChangePercent > 0 ? "▲" : "▼"} ${Math.abs(expChangePercent)}% vs last month`
              : undefined
          }
          trendPositive={expChangePercent !== null ? expChangePercent <= 0 : undefined}
        />
      </div>

      {/* charts row */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Monthly Overview</h3>
          <BarChart data={monthlyData} />
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Spending by Category</h3>
          <CategoryDonut data={categoryBreakdown} />
        </div>
      </div>

      {/* recent transactions */}
      <div className={styles.recentCard}>
        <div className={styles.recentHeader}>
          <h3 className={styles.cardTitle}>Recent Transactions</h3>
          <button
            className={styles.viewAllBtn}
            onClick={() => onNavigate("transactions")}
          >
            View all →
          </button>
        </div>

        <div className={styles.txnList}>
          {recentTransactions.length === 0 ? (
            <p className={styles.empty}>No transactions yet.</p>
          ) : (
            recentTransactions.map((txn) => (
              <TransactionRow key={txn.id} txn={txn} onEdit={onEditTxn} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
