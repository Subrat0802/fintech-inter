import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from "../data/transactions";
import styles from "./Insights.module.css";

function Insights() {
  const {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    categoryBreakdown,
    monthlyData,
  } = useTransactions();

  const topCategory = categoryBreakdown[0];

  const feb = monthlyData.find((m) => m.month === "2026-02");
  const mar = monthlyData.find((m) => m.month === "2026-03");

  const expenseChange =
    feb && feb.expense > 0
      ? (((mar.expense - feb.expense) / feb.expense) * 100).toFixed(1)
      : 0;

  const marSavings = mar ? mar.income - mar.expense : 0;

  // little helper to get month name from prefix string
  function monthName(prefix) {
    const m = parseInt(prefix.split("-")[1]) - 1;
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m];
  }

  return (
    <div className={styles.page}>

      {/* key numbers at the top */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <p className={styles.statVal} style={{ color: "var(--accent)" }}>
            {topCategory ? topCategory.category : "—"}
          </p>
          <p className={styles.statLbl}>Highest spending category</p>
          {topCategory && (
            <p className={styles.statSub}>{formatCurrency(topCategory.amount)} total</p>
          )}
        </div>

        <div className={styles.statBox}>
          <p className={styles.statVal} style={{ color: "var(--accent)" }}>
            {savingsRate}%
          </p>
          <p className={styles.statLbl}>Overall savings rate</p>
        </div>

        <div className={styles.statBox}>
          <p
            className={styles.statVal}
            style={{ color: marSavings >= 0 ? "#4AAB6A" : "#E24B4A" }}
          >
            {formatCurrency(marSavings)}
          </p>
          <p className={styles.statLbl}>March net savings</p>
        </div>

        <div className={styles.statBox}>
          <p
            className={styles.statVal}
            style={{ color: expenseChange > 0 ? "#E2793D" : "#4AAB6A" }}
          >
            {expenseChange > 0 ? "▲" : "▼"} {Math.abs(expenseChange)}%
          </p>
          <p className={styles.statLbl}>Expense change (Feb → Mar)</p>
        </div>
      </div>

      {/* spending breakdown with progress bars */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Spending Breakdown</h3>
        <div className={styles.breakdownList}>
          {categoryBreakdown.map((item) => {
            const pct = totalExpense > 0
              ? ((item.amount / totalExpense) * 100).toFixed(1)
              : 0;
            const color = CATEGORY_COLORS[item.category] || "#888";

            return (
              <div key={item.category} className={styles.breakdownRow}>
                <div className={styles.catInfo}>
                  <span>{CATEGORY_EMOJIS[item.category] || "💳"}</span>
                  <span className={styles.catName}>{item.category}</span>
                </div>
                <div className={styles.barWrap}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className={styles.catAmt}>{formatCurrency(item.amount)}</span>
                <span className={styles.catPct}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* month by month comparison */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Monthly Comparison</h3>
        <div className={styles.monthGrid}>
          {monthlyData.map((m) => {
            const saved = m.income - m.expense;
            return (
              <div key={m.month} className={styles.monthBox}>
                <p className={styles.monthName}>{monthName(m.month)}</p>
                <p className={styles.monthIncome}>+{formatCurrency(m.income)}</p>
                <p className={styles.monthExpense}>-{formatCurrency(m.expense)}</p>
                <p
                  className={styles.monthSaved}
                  style={{ color: saved >= 0 ? "#4AAB6A" : "#E24B4A" }}
                >
                  {formatCurrency(saved)} saved
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* plain language observations */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Observations</h3>
        <div className={styles.obsList}>
          <ObsItem
            icon="🏠"
            text={`Housing is your biggest fixed cost at ${
              totalExpense > 0
                ? (((categoryBreakdown.find((c) => c.category === "Housing")?.amount || 0) / totalExpense) * 100).toFixed(1)
                : 0
            }% of total expenses.`}
          />
          <ObsItem
            icon="📊"
            text={`You saved ${savingsRate}% of your income overall — ${
              parseFloat(savingsRate) >= 20 ? "that's a solid rate, keep it up!" : "aim for at least 20% if possible."
            }`}
          />
          <ObsItem
            icon={expenseChange > 0 ? "📈" : "📉"}
            text={`Expenses ${expenseChange > 0 ? "went up" : "came down"} by ${Math.abs(expenseChange)}% from February to March.`}
          />
          <ObsItem
            icon="🍜"
            text={`Food spending adds up quickly with dining out — cooking at home more often could save ₹2,000–3,000/month.`}
          />
        </div>
      </div>
    </div>
  );
}

// small internal component for observation items
function ObsItem({ icon, text }) {
  return (
    <div className={styles.obsItem}>
      <span className={styles.obsIcon}>{icon}</span>
      <p className={styles.obsText}>{text}</p>
    </div>
  );
}

export default Insights;
