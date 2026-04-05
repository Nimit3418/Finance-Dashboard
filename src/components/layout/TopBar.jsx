import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { Search, Download, Menu, Sparkles, Shield, Eye } from 'lucide-react';
import { exportAsCSV, exportAsJSON } from '../../utils/exportUtils';
import { useState } from 'react';

// ── Fintech-Safe Solid Colors ──
const EMERALD        = '#10B981';
const INDIGO         = '#6366F1';   // Download button
const INDIGO_HOVER   = '#4F46E5';
const CYAN           = '#0EA5E9';   // AI Copilot button
const CYAN_HOVER     = '#0284C7';
const SLATE_ACTIVE   = '#334155';   // Role toggle active

export default function TopBar({ onMenuClick }) {
  const {
    searchTerm, setSearchTerm,
    filteredTransactions,
    theme,
    userRole, toggleRole,
    isChatOpen, setIsChatOpen,
  } = useFinance();

  const [showExport, setShowExport] = useState(false);
  const isLight = theme === 'light';

  // ── Context-sensitive chrome tokens ──
  const headerBg     = isLight ? 'rgba(241,245,249,0.97)' : 'rgba(2,6,23,0.92)';
  const headerBorder = isLight ? 'rgba(203,213,225,0.8)'  : 'rgba(16,185,129,0.10)';
  const inputBg      = isLight ? 'rgba(255,255,255,0.9)'  : 'rgba(255,255,255,0.03)';
  const inputBorder  = isLight ? '#CBD5E1'                : 'rgba(255,255,255,0.07)';
  const inputText    = isLight ? '#0F172A'                : '#e2e8f0';
  const btnBg        = isLight ? 'rgba(0,0,0,0.05)'       : 'rgba(255,255,255,0.05)';
  const btnBorder    = isLight ? 'rgba(0,0,0,0.10)'       : 'rgba(255,255,255,0.08)';
  const mutedColor   = isLight ? '#64748B'                : '#6B7280';

  // Segmented control (Admin / Viewer) - Slate active in both modes
  const segActiveBg     = SLATE_ACTIVE;
  const segActiveShadow = '0 2px 8px rgba(51,65,85,0.4)';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 px-6 py-3"
      style={{
        background:             headerBg,
        backdropFilter:         'blur(24px)',
        WebkitBackdropFilter:   'blur(24px)',
        borderBottom:           `1px solid ${headerBorder}`,
      }}
    >
      {/*
        3-column layout:
          [mobile-btn] | [search — flex-1] | [right-group — FIXED 420px]
        The fixed right group prevents layout shift on search / role-toggle.
      */}
      <div className="flex items-center gap-4">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className={`md:hidden w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            isLight 
              ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200' 
              : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
          }`}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Search — flex-1 */}
        <div className="flex-1 relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? 'text-slate-500' : 'text-white/50'}`}
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none transition-all ${
              isLight
                ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20'
                : 'bg-white/10 text-white border border-white/10 hover:bg-white/20 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20'
            }`}
          />
        </div>

        {/* Right group — 420px fixed, no layout shift */}
        <div className="flex items-center gap-3 flex-shrink-0" style={{ width: '420px' }}>

          {/* ── Admin / Viewer Segmented Control — 195px ── */}
          <div
            className="flex items-center p-1 rounded-xl gap-0.5 flex-shrink-0"
            style={{
              background: btnBg,
              border:     `1px solid ${btnBorder}`,
              width:      '195px',
            }}
          >
            {[
              { label: 'Admin',  value: 'admin',  Icon: Shield },
              { label: 'Viewer', value: 'viewer', Icon: Eye    },
            ].map(({ label, value, Icon }) => {
              const isActive = userRole === value;
              return (
                <button
                  key={value}
                  onClick={() => !isActive && toggleRole()}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#437cef] text-white shadow-[0_0_15px_rgba(67,124,239,0.3)]' 
                      : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Download — Neutral Utility Action, fixed 136px h-11 ── */}
          <div className="relative flex-shrink-0" style={{ width: '136px', height: '44px' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowExport(!showExport)}
              className={`w-full h-full rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                isLight 
                  ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200' 
                  : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
              }`}
              aria-label="Download data"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span>Download</span>
            </motion.button>

            <AnimatePresence>
              {showExport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{   opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[calc(100%+8px)] w-full rounded-2xl overflow-hidden shadow-2xl z-50"
                  style={{
                    background:   isLight ? 'rgba(255,255,255,0.99)' : 'rgba(10,15,30,0.98)',
                    border:       `1px solid ${isLight ? 'rgba(203,213,225,0.8)' : 'rgba(99,102,241,0.14)'}`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <button
                    onClick={() => { exportAsCSV(filteredTransactions); setShowExport(false); }}
                    className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2.5 transition-colors"
                    style={{ color: isLight ? '#475569' : '#94a3b8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? '#F8FAFC' : 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ color: EMERALD }} className="font-bold">CSV</span>
                    <span className="opacity-60 text-xs">Export as .csv</span>
                  </button>
                  <div style={{ height: '1px', background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)' }} />
                  <button
                    onClick={() => { exportAsJSON(filteredTransactions); setShowExport(false); }}
                    className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2.5 transition-colors"
                    style={{ color: isLight ? '#475569' : '#94a3b8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? '#F8FAFC' : 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ color: CYAN }} className="font-bold">JSON</span>
                    <span className="opacity-60 text-xs">Export as .json</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── AI Copilot — Solid Cyan, animate-pulse dot ── */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-[44px] h-[44px] rounded-xl flex items-center justify-center relative flex-shrink-0 bg-[#805ED9] text-white shadow-[0_0_15px_rgba(128,94,217,0.4)] animate-pulse transition-all hover:opacity-90"
            aria-label="Open Zorvyn AI"
          >
            <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
          </motion.button>

        </div>
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes ai-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0; transform: scale(2.6); }
        }
      `}</style>
    </motion.header>
  );
}
