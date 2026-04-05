import { formatCurrency } from "../utils/helpers";
import styles from "./BarChart.module.css";

// simple bar chart built with divs - didn't want to bring in a chart library
// for just 3 months of data this is totally fine
function BarChart({ data }) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense)));

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dot} style={{ background: "#4AAB6A" }} />
          Income
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dot} style={{ background: "#E2793D" }} />
          Expenses
        </span>
      </div>

      <div className={styles.chart}>
        {data.map((d) => {
          // calculate bar heights as percentage of max value
          const incomeH = maxVal > 0 ? (d.income / maxVal) * 100 : 0;
          const expenseH = maxVal > 0 ? (d.expense / maxVal) * 100 : 0;

          return (
            <div key={d.month} className={styles.group}>
              <div className={styles.bars}>
                <div
                  className={styles.bar}
                  style={{ height: `${incomeH}%`, background: "#4AAB6A" }}
                  title={`Income: ${formatCurrency(d.income)}`}
                />
                <div
                  className={styles.bar}
                  style={{ height: `${expenseH}%`, background: "#E2793D" }}
                  title={`Expenses: ${formatCurrency(d.expense)}`}
                />
              </div>
              {/* show just month name - full prefix is "2026-01" so we grab the last part */}
              <span className={styles.monthLabel}>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
                  parseInt(d.month.split("-")[1]) - 1
                ]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BarChart;
