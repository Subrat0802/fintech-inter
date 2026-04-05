import { CATEGORY_COLORS, CATEGORY_EMOJIS } from "../data/transactions";
import { formatCurrency } from "../utils/helpers";
import { useApp } from "../context/AppContext";
import styles from "./TransactionRow.module.css";

function TransactionRow({ txn, onEdit }) {
  const { role, deleteTransaction } = useApp();

  const emoji = CATEGORY_EMOJIS[txn.category] || "💳";
  const color = CATEGORY_COLORS[txn.category] || "#888";
  const isIncome = txn.type === "income";

  return (
    <div className={styles.row}>
      {/* category icon with soft colored background */}
      <div
        className={styles.iconBox}
        style={{ background: color + "20" }}
      >
        {emoji}
      </div>

      <div className={styles.info}>
        <p className={styles.desc}>{txn.description}</p>
        <p className={styles.meta}>
          {txn.date} ·{" "}
          <span
            className={styles.categoryBadge}
            style={{ background: color + "20", color }}
          >
            {txn.category}
          </span>
        </p>
      </div>

      <p
        className={styles.amount}
        style={{ color: isIncome ? "#4AAB6A" : "#E2793D" }}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(txn.amount)}
      </p>

      {/* only admins can edit/delete */}
      {role === "Admin" && (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => onEdit(txn)}
            title="Edit"
          >
            ✎
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => deleteTransaction(txn.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionRow;
