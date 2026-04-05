import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useFinance } from '../../context/FinanceContext';
import GlassCard from '../ui/GlassCard';
import {
  Search,
  Filter,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  FileX2,
  Plus,
} from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 rounded-3xl bg-surface flex items-center justify-center mb-5">
        <FileX2 className="w-10 h-10 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-secondary">No transactions found</h3>
      <p className="text-sm text-text-muted mt-1.5 max-w-xs">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </motion.div>
  );
}

export default function TransactionList({ onAddClick }) {
  const {
    paginatedTransactions,
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    totalPages,
    CATEGORIES,
    CATEGORY_COLORS,
    userRole,
    deleteTransaction,
    resetFilters,
    theme,
  } = useFinance();

  const isLight = theme === 'light';
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = [...paginatedTransactions].sort((a, b) => {
    if (sortField === 'date') return sortDir === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    if (sortField === 'amount') return sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) { setSortDir(sortDir === 'desc' ? 'asc' : 'desc'); }
    else { setSortField(field); setSortDir('desc'); }
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedType !== 'All' || searchTerm;

  return (
    <GlassCard delay={0.2} hover={false} className="overflow-hidden">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-text-primary tracking-tighter">Recent Transactions</h3>
            <p className="text-sm text-text-muted mt-0.5">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* + Add Transaction — Admin only */}
          {userRole === 'admin' && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddClick}
              className="h-11 px-5 bg-[#28c1a0] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Add Transaction</span>
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-60 pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-border-glass text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all"
              onFocus={(e) => { e.target.style.borderColor = 'rgba(14,165,233,0.4)'; }}
              onBlur={(e) => { e.target.style.borderColor = ''; }}
            />
          </div>

          {/* Filter toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={twMerge(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all border',
              showFilters || hasActiveFilters
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                : 'border-border-glass bg-surface text-text-muted hover:bg-surface-hover'
            )}
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </motion.button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="w-10 h-10 rounded-xl border border-accent-rose/30 bg-accent-rose/10 flex items-center justify-center text-accent-rose"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-surface border border-border-glass">
              {/* Type Filter */}
              <div className="flex gap-1.5">
                {['All', 'income', 'expense'].map((type) => (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setCurrentPage(1); }}
                    className={twMerge(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize',
                      selectedType === type
                        ? 'gradient-bg text-white'
                        : 'bg-surface-hover text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="w-px h-8 bg-border-glass hidden sm:block" />

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => { setSelectedCategory('All'); setCurrentPage(1); }}
                  className={twMerge(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    selectedCategory === 'All'
                      ? 'gradient-bg text-white'
                      : 'bg-surface-hover text-text-secondary hover:text-text-primary'
                  )}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={twMerge(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      selectedCategory === cat
                        ? 'text-white'
                        : 'bg-surface-hover text-text-secondary hover:text-text-primary'
                    )}
                    style={selectedCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table / Cards ── */}
      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-glass">
                  <th className="text-left text-xs text-text-muted uppercase tracking-wider font-semibold py-4 px-4">Title</th>
                  <th
                    onClick={() => toggleSort('date')}
                    className="text-left text-xs text-text-muted uppercase tracking-wider font-semibold py-4 px-4 cursor-pointer hover:text-text-secondary transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">Date <ArrowUpDown className="w-3.5 h-3.5" /></span>
                  </th>
                  <th className="text-left text-xs text-text-muted uppercase tracking-wider font-semibold py-4 px-4">Category</th>
                  <th
                    onClick={() => toggleSort('amount')}
                    className="text-right text-xs text-text-muted uppercase tracking-wider font-semibold py-4 px-4 cursor-pointer hover:text-text-secondary transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5 justify-end">Amount <ArrowUpDown className="w-3.5 h-3.5" /></span>
                  </th>
                  {/* Actions column: only visible to Admin */}
                  {userRole === 'admin' && (
                    <th className="text-right text-xs text-text-muted uppercase tracking-wider font-semibold py-4 px-4">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {sorted.map((t, idx) => (
                    <motion.tr
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className="border-b border-border-glass last:border-none transition-colors"
                      style={{}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isLight
                          ? 'rgba(14,165,233,0.04)'
                          : 'rgba(14,165,233,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={twMerge(
                              'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                              t.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            )}
                          >
                            {t.type === 'income' ? '↓' : '↑'}
                          </div>
                          <span className="text-base text-text-primary font-medium">{t.title}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-base text-text-secondary">{formatDate(t.date)}</td>
                      <td className="py-5 px-4">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[t.category]}15`,
                            color: CATEGORY_COLORS[t.category],
                          }}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[t.category] }} />
                          {t.category}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <span
                          className={twMerge(
                            'text-base font-semibold',
                            t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                          )}
                        >
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>

                      {/* Admin actions — ALWAYS VISIBLE (no hover opacity tricks) */}
                      {userRole === 'admin' && (
                        <td className="py-5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit — Cyan tinted */}
                            <button
                              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                              aria-label="Edit transaction"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {/* Delete — Emerald tinted */}
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              aria-label="Delete transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            <AnimatePresence mode="popLayout">
              {sorted.map((t, idx) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border-glass"
                >
                  <div className="flex items-center gap-3">
                    <div className={twMerge(
                      'w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                      t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    )}>
                      {t.type === 'income' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="text-sm text-text-primary font-medium">{t.title}</p>
                      <p className="text-[11px] text-text-muted">{formatDate(t.date)} · {t.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className={twMerge(
                      'text-sm font-semibold',
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    {/* Admin delete — always visible on mobile too */}
                    {userRole === 'admin' && (
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-7 pt-5 border-t border-border-glass">
              <p className="text-sm text-text-muted font-medium">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg bg-surface border border-border-glass flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={twMerge(
                      'w-9 h-9 rounded-lg text-sm font-semibold transition-all',
                      page === currentPage
                        ? 'gradient-bg text-white'
                        : 'bg-surface border border-border-glass text-text-muted hover:text-text-primary hover:bg-surface-hover'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg bg-surface border border-border-glass flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
