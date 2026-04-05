import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import TransactionRow from "../components/TransactionRow";
import styles from "./Transactions.module.css";

// the list of sort options - keeping it simple
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
  { value: "desc-asc", label: "Name A–Z" },
];

function Transactions({ onAddClick, onEditTxn }) {
  const { transactions } = useApp();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // get unique categories from current transaction data
  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map((t) => t.category))];
    return cats.sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (typeFilter !== "all") {
      list = list.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      list = list.filter((t) => t.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // sort
    const [key, dir] = sortBy.split("-");
    list.sort((a, b) => {
      let av, bv;
      if (key === "date") {
        av = a.date;
        bv = b.date;
      } else if (key === "amount") {
        av = Math.abs(a.amount);
        bv = Math.abs(b.amount);
      } else {
        av = a.description.toLowerCase();
        bv = b.description.toLowerCase();
      }
      if (av < bv) return dir === "desc" ? 1 : -1;
      if (av > bv) return dir === "desc" ? -1 : 1;
      return 0;
    });

    return list;
  }, [transactions, search, typeFilter, categoryFilter, sortBy]);

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setSortBy("date-desc");
  }

  const hasActiveFilters =
    search || typeFilter !== "all" || categoryFilter !== "all";

  return (
    <div className={styles.page}>
      {/* filters bar */}
      <div className={styles.filtersBar}>
        <input
          className={styles.searchInput}
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className={styles.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* results count + clear */}
      <div className={styles.resultsMeta}>
        <span className={styles.count}>
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* transaction list */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No transactions found</p>
            <p className={styles.emptySub}>Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map((txn) => (
            <TransactionRow key={txn.id} txn={txn} onEdit={onEditTxn} />
          ))
        )}
      </div>
    </div>
  );
}

export default Transactions;
