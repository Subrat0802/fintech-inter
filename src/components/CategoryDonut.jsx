import { CATEGORY_COLORS } from "../data/transactions";
import styles from "./CategoryDonut.module.css";

// draws a donut chart using SVG paths
// reference: https://www.smashingmagazine.com/2015/07/designing-simple-pie-charts-with-css/
// ended up using SVG instead of the CSS approach since it's more flexible
function CategoryDonut({ data }) {
  const total = data.reduce((s, d) => s + d.amount, 0);

  // build SVG path for each slice
  const slices = buildSlices(data, total);

  const topItems = data.slice(0, 6);

  return (
    <div className={styles.wrapper}>
      <svg className={styles.svg} viewBox="0 0 160 160">
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={CATEGORY_COLORS[slice.category] || "#888"}
            stroke="var(--card)"
            strokeWidth="2"
          />
        ))}
        {/* hole in the middle */}
        <circle cx="80" cy="80" r="32" fill="var(--card)" />
      </svg>

      <div className={styles.legend}>
        {topItems.map((item) => (
          <div key={item.category} className={styles.legendRow}>
            <span
              className={styles.dot}
              style={{ background: CATEGORY_COLORS[item.category] || "#888" }}
            />
            <span className={styles.catName}>{item.category}</span>
            <span className={styles.pct}>
              {((item.amount / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildSlices(data, total) {
  const r = 60;
  const cx = 80;
  const cy = 80;
  let cumAngle = -90; // start from top

  return data.map((d) => {
    const angle = (d.amount / total) * 360;
    const startRad = (cumAngle * Math.PI) / 180;
    const endRad = ((cumAngle + angle) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

    cumAngle += angle;
    return { ...d, path };
  });
}

export default CategoryDonut;
