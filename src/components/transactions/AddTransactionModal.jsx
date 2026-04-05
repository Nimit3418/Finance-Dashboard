import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { X, Plus, Calendar, DollarSign, Tag, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

// ── Fintech-Safe Solid Colors (no gradients) ──
const EMERALD = '#28c1a0';
const EMERALD_HOVER = '#209d82';
const EMERALD_SHADOW = '0 4px 16px rgba(40,193,160,0.35)';
// Top accent bar: solid emerald stripe
const ACCENT_BAR = EMERALD;

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction, CATEGORIES, theme } = useFinance();
  const isLight = theme === 'light';

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Groceries',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addTransaction({
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
    });
    setForm({ title: '', amount: '', category: 'Groceries', type: 'expense', date: new Date().toISOString().split('T')[0] });
    setErrors({});
    onClose();
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Theme-aware design tokens ──
  // Modal panel
  const modalBg = isLight ? '#FFFFFF' : '#030712';
  const modalBorder = isLight ? 'rgba(203,213,225,0.9)' : 'rgba(255,255,255,0.08)';
  const modalShadow = isLight
    ? '0 40px 80px rgba(0,0,0,0.12), 0 20px 40px rgba(0,0,0,0.08)'
    : '0 30px 80px rgba(0,0,0,0.75)';

  // Typography
  const headingColor = isLight ? '#0F172A' : '#e2e8f0';
  const subColor = isLight ? '#64748B' : '#64748b';
  const labelColor = isLight ? '#1E293B' : '#94a3b8';

  // Dividers & close button
  const headerBorder = isLight ? 'rgba(226,232,240,1)' : 'rgba(255,255,255,0.06)';
  const closeBg = isLight ? '#F1F5F9' : 'rgba(255,255,255,0.06)';
  const closeBorder = isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)';

  // Inputs
  const inputBg = isLight ? '#F8FAFC' : 'rgba(255,255,255,0.04)';
  const inputBorder = isLight ? '#CBD5E1' : 'rgba(255,255,255,0.08)';
  const inputText = isLight ? '#0F172A' : '#e2e8f0';
  const focusBorder = EMERALD;
  const focusRing = 'rgba(40,193,160,0.15)';
  const errorColor = '#e11d48';

  // Type toggle
  const toggleBg = isLight ? '#F1F5F9' : 'rgba(255,255,255,0.04)';
  const toggleBorder = isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)';
  const inactiveTog = isLight ? '#64748B' : '#475569';
  const expenseActive = { background: isLight ? 'rgba(244,63,94,0.10)' : 'rgba(244,63,94,0.12)', color: isLight ? '#be123c' : '#f43f5e', border: '1px solid rgba(244,63,94,0.25)' };
  const incomeActive = { background: isLight ? 'rgba(40,193,160,0.10)' : 'rgba(40,193,160,0.12)', color: isLight ? '#209d82' : '#28c1a0', border: '1px solid rgba(40,193,160,0.25)' };

  const inputStyle = (fieldErr) => ({
    background: inputBg,
    border: `1px solid ${fieldErr ? errorColor : inputBorder}`,
    color: inputText,
    width: '100%',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          /* ── OVERLAY: always semi-transparent regardless of theme ── */
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: 'rgba(2,6,23,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          {/* Modal Panel — Scale-Up entrance */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: modalBg,
              border: `1px solid ${modalBorder}`,
              boxShadow: modalShadow,
            }}
          >
            {/* Top accent bar — solid emerald */}
            <div
              className="h-[3px] w-full"
              style={{ background: ACCENT_BAR }}
            />

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: `1px solid ${headerBorder}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: EMERALD, boxShadow: EMERALD_SHADOW }}
                >
                  <Plus className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight" style={{ color: headingColor }}>
                    Add Transaction
                  </h2>
                  <p className="text-[11px] font-medium" style={{ color: subColor }}>
                    Create a new transaction entry
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-60"
                style={{ background: closeBg, border: `1px solid ${closeBorder}` }}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" style={{ color: subColor }} strokeWidth={1.5} />
              </button>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Type Toggle — Expense / Income */}
              <div
                className="flex gap-2 p-1 rounded-xl"
                style={{ background: toggleBg, border: `1px solid ${toggleBorder}` }}
              >
                {[
                  { val: 'expense', label: 'Expense', Icon: ArrowUpRight, activeStyle: expenseActive },
                  { val: 'income', label: 'Income', Icon: ArrowDownLeft, activeStyle: incomeActive },
                ].map(({ val, label, Icon, activeStyle }) => {
                  const active = form.type === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => updateField('type', val)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={active ? activeStyle : { color: inactiveTog, border: '1px solid transparent' }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Title */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: labelColor }}>
                  <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Grocery Shopping"
                  style={inputStyle(errors.title)}
                  onFocus={(e) => { e.target.style.borderColor = focusBorder; e.target.style.boxShadow = `0 0 0 3px ${focusRing}`; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.title ? errorColor : inputBorder; e.target.style.boxShadow = 'none'; }}
                />
                {errors.title && <p className="text-[11px] mt-1 font-medium" style={{ color: errorColor }}>{errors.title}</p>}
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: labelColor }}>
                    <DollarSign className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => updateField('amount', e.target.value)}
                    placeholder="0"
                    min="1"
                    style={inputStyle(errors.amount)}
                    onFocus={(e) => { e.target.style.borderColor = focusBorder; e.target.style.boxShadow = `0 0 0 3px ${focusRing}`; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.amount ? errorColor : inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                  {errors.amount && <p className="text-[11px] mt-1 font-medium" style={{ color: errorColor }}>{errors.amount}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: labelColor }}>
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    style={{ ...inputStyle(errors.date), colorScheme: isLight ? 'light' : 'dark' }}
                    onFocus={(e) => { e.target.style.borderColor = focusBorder; e.target.style.boxShadow = `0 0 0 3px ${focusRing}`; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.date ? errorColor : inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: labelColor }}>
                  <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  style={{
                    ...inputStyle(false),
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = focusBorder; e.target.style.boxShadow = `0 0 0 3px ${focusRing}`; }}
                  onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ background: isLight ? '#fff' : '#0f172a', color: inputText }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit — Solid Emerald */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 bg-[#28c1a0] hover:bg-[#209d82]"
                style={{ boxShadow: '0 4px 16px rgba(40,193,160,0.35)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = EMERALD_HOVER; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = EMERALD; }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add Transaction
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
