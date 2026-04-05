import styles from "./StatCard.module.css";

// reusable card for showing a single metric
// trend is optional - pass positive/negative to show colored % change
function StatCard({ label, value, valueColor, subText, trendPositive }) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value} style={{ color: valueColor }}>
        {value}
      </p>
      {subText && (
        <p
          className={styles.sub}
          style={{
            color:
              trendPositive === true
                ? "#4AAB6A"
                : trendPositive === false
                ? "#E2793D"
                : undefined,
          }}
        >
          {subText}
        </p>
      )}
    </div>
  );
}

export default StatCard;
