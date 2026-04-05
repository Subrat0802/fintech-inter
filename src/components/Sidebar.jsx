import { useApp } from "../context/AppContext";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights", label: "Insights", icon: "◎" },
];

function Sidebar({ activePage, onNavigate }) {
  const { role, setRole, darkMode, setDarkMode } = useApp();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>FinTrack</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`${styles.navBtn} ${activePage === item.id ? styles.active : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* role switcher at the bottom feels cleaner than in the topbar */}
      <div className={styles.bottomSection}>
        <div className={styles.roleWrapper}>
          <span className={styles.roleLabel}>Role</span>
          <select
            className={styles.roleSelect}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        <button
          className={styles.themeToggle}
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "☀ Light mode" : "◑ Dark mode"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
