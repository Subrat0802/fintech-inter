import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import TransactionModal from "./components/TransactionModal";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import "./index.css";

// inner component so it can access context
function AppLayout() {
  const { darkMode, role } = useApp();

  const [activePage, setActivePage] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  // apply dark class to root element when darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  function openAddModal() {
    setEditingTxn(null);
    setModalOpen(true);
  }

  function openEditModal(txn) {
    setEditingTxn(txn);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTxn(null);
  }

  const PAGE_TITLES = {
    dashboard: "Overview",
    transactions: "Transactions",
    insights: "Insights",
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="main-area">
        {/* top bar */}
        <div className="topbar">
          <div>
            <h1 className="page-title">{PAGE_TITLES[activePage]}</h1>
            <p className="role-tag">
              {role === "Admin" ? "Admin — full access" : "Viewer — read only"}
            </p>
          </div>

          {/* only show add button for admins */}
          {role === "Admin" && (
            <button className="add-btn" onClick={openAddModal}>
              + Add Transaction
            </button>
          )}
        </div>

        {/* page content */}
        <div className="page-content">
          {activePage === "dashboard" && (
            <Dashboard onNavigate={setActivePage} onEditTxn={openEditModal} />
          )}
          {activePage === "transactions" && (
            <Transactions onAddClick={openAddModal} onEditTxn={openEditModal} />
          )}
          {activePage === "insights" && <Insights />}
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingTxn={editingTxn}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
