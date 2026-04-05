import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinanceProvider } from './context/FinanceContext';
import { useFinance } from './context/FinanceContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import StatCards from './components/dashboard/StatCards';
import ChartSection from './components/dashboard/ChartSection';
import TransactionList from './components/transactions/TransactionList';
import AddTransactionModal from './components/transactions/AddTransactionModal';
import InsightsPage from './components/dashboard/InsightsPage';
import AIChatDrawer from './components/layout/AIChatDrawer';
import './index.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function DashboardPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
      <div>
        <h2 className="text-4xl font-bold text-text-primary tracking-tighter">Dashboard</h2>
        <p className="text-base text-text-muted mt-1.5 font-medium">Your financial overview at a glance</p>
      </div>
      <StatCards />
      <ChartSection />
    </motion.div>
  );
}

function TransactionsPage({ onAddClick, onEditClick }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
      <div>
        <h2 className="text-4xl font-bold text-text-primary tracking-tighter">Transactions</h2>
        <p className="text-base text-text-muted mt-1.5 font-medium">Manage and track all your transactions</p>
      </div>
      <TransactionList onAddClick={onAddClick} onEditClick={onEditClick} />
    </motion.div>
  );
}

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { theme } = useFinance();
  const isLight = theme === 'light';

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key="dashboard" />;
      case 'transactions':
        return <TransactionsPage key="transactions" onAddClick={() => setShowAddModal(true)} onEditClick={(t) => { setEditingTransaction(t); setShowAddModal(true); }} />;
      case 'insights':
        return (
          <motion.div key="insights" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="mb-7">
              <h2 className="text-4xl font-bold text-text-primary tracking-tighter">Insights</h2>
              <p className="text-base text-text-muted mt-1.5 font-medium">Deep-dive analytics and spending breakdowns</p>
            </div>
            <InsightsPage />
          </motion.div>
        );
      default:
        return <DashboardPage key="dashboard" />;
    }
  };

  return (
    /*
      ROOT: `h-screen overflow-hidden flex`
      This is the outermost constraint — the entire viewport, nothing overflows here.
      The sidebar and main column each manage their own internal scroll.
    */
    <div
      className="flex h-screen overflow-hidden"
      data-theme={theme}
      style={{
        // Light mode: slightly darker off-white so white cards pop; dark: deep obsidian navy
        backgroundColor: isLight ? '#F1F5F9' : '#050505',
        // Neutral Obsidian mesh: Cyan (top-left) + Emerald (bottom-right) @ 10% — ghostly depth
        backgroundImage: isLight
          ? `radial-gradient(circle at 8% 12%,    rgba(14,165,233,0.06)  0%, transparent 45%),
             radial-gradient(circle at 85% 88%,   rgba(16,185,129,0.06)  0%, transparent 45%)`
          : `radial-gradient(circle at 8% 12%,    rgba(14,165,233,0.10)  0%, transparent 45%),
             radial-gradient(circle at 85% 88%,   rgba(16,185,129,0.10)  0%, transparent 45%)`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {showMobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowMobileSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/*
        ── SIDEBAR ──
        `h-screen sticky top-0 overflow-hidden flex-shrink-0`
        • h-screen  → always full viewport height
        • sticky top-0 → locks to the top of the scroll container
        • overflow-hidden → sidebar itself NEVER scrolls
        • flex-shrink-0 → never compressed by flex layout
        On mobile: absolutely positioned overlay driven by showMobileSidebar state.
      */}
      <div
        className={`
          flex-shrink-0 h-screen sticky top-0 overflow-hidden z-50
          ${showMobileSidebar ? 'block' : 'hidden'} md:block
        `}
        style={{ position: 'sticky', top: 0 }}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={(page) => { setActivePage(page); setShowMobileSidebar(false); }}
        />
      </div>

      {/*
        ── MAIN COLUMN ──
        `flex-1 h-screen overflow-y-auto flex flex-col`
        • flex-1    → fills all remaining horizontal space
        • h-screen  → constrains to viewport height
        • overflow-y-auto → THIS is the ONLY scroll container in the app
        TopBar is sticky within this column. Page content scrolls underneath it.
      */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col">
        <TopBar onMenuClick={() => setShowMobileSidebar(!showMobileSidebar)} />

        <main className="flex-1 p-8 md:p-10">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer
          className="px-10 py-4 flex-shrink-0"
          style={{ borderTop: `1px solid ${isLight ? 'rgba(203,213,225,0.6)' : 'rgba(14,165,233,0.08)'}` }}
        >
          <p className="text-xs text-center font-medium tracking-wide text-text-muted">
            Built with 💙 by <span className="gradient-text font-semibold">Zorvyn Finance</span> · Data stored locally in your browser
          </p>
        </footer>
      </div>

      {/* Global Overlays */}
      <AIChatDrawer />
      <AddTransactionModal 
        isOpen={showAddModal} 
        onClose={() => { setShowAddModal(false); setEditingTransaction(null); }} 
        initialData={editingTransaction}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
