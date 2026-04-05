import { useState, useEffect } from "react";
import { ALL_CATEGORIES } from "../data/transactions";
import { useApp } from "../context/AppContext";
import styles from "./TransactionModal.module.css";

// handles both adding new and editing existing transactions
function TransactionModal({ isOpen, onClose, editingTxn }) {
  const { addTransaction, editTransaction } = useApp();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  // populate form when editing
  useEffect(() => {
    if (editingTxn) {
      setForm({
        description: editingTxn.description,
        amount: Math.abs(editingTxn.amount),
        category: editingTxn.category,
        type: editingTxn.type,
        date: editingTxn.date,
      });
    } else {
      // reset when adding new
      setForm({
        description: "",
        amount: "",
        category: "Food",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [editingTxn, isOpen]);

  function validate() {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const payload = { ...form, amount: parseFloat(form.amount) };

    if (editingTxn) {
      editTransaction(editingTxn.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  }

  function handleChange(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    // clear error on change
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editingTxn ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <input
            className={`${styles.input} ${errors.description ? styles.inputError : ""}`}
            placeholder="e.g. Grocery Shopping"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Amount (₹)</label>
            <input
              className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
            {errors.amount && <p className={styles.error}>{errors.amount}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select
              className={styles.input}
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.input}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && <p className={styles.error}>{errors.date}</p>}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            {editingTxn ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
