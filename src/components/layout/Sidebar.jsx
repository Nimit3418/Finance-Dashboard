import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
];

// ── Fintech-Safe Brand Colors (solid, no gradients) ──
const CYAN_ACCENT = '#0EA5E9';

// ── Deep Sea Navy Sidebar (always dark, even in light mode) ──
const SIDEBAR_BG = 'rgba(2,6,23,0.92)';
const SIDEBAR_DIVIDER = 'rgba(255,255,255,0.05)';
const MUTED_COLOR = '#4B5563';
const ICON_COLOR = 'rgba(255, 255, 255, 0.7)';
const ICON_ACTIVE = '#FFFFFF';

export default function Sidebar({ activePage, setActivePage }) {
  const { theme, toggleTheme } = useFinance();
  const [collapsed, setCollapsed] = useState(false);
  const isLight = theme === 'light';

  return (
    /*
      h-screen sticky top-0 overflw-hidden:
      • Sidebar never scrolls — it is strictly locked in place.
      • position: relative on the aside allows the floating chevron to be
        placed absolute'ly on its right edge and remain always visible.
    */
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: 0, width: collapsed ? 72 : 288 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-screen sticky top-0 overflow-hidden flex flex-col relative flex-shrink-0"
      style={{
        backgroundColor: isLight ? '#020617' : SIDEBAR_BG,
        borderRight: `1px solid rgba(255,255,255,0.05)`,
        minWidth: collapsed ? 72 : 288,
        backgroundImage: `
          radial-gradient(circle at 85% 8%,  rgba(128,94,217,0.04)  0%, transparent 50%),
          radial-gradient(circle at 15% 92%, rgba(67,124,239,0.03)  0%, transparent 50%)
        `,
        boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
      }}
    >

      {/* ══ Floating Chevron Toggle — always visible on right edge ══
          absolute positioned at top-12 -right-4 so it overlaps the sidebar edge
          even when collapsed, making it trivially easy to click at all times. */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.1 }}
        className="absolute top-12 z-[60] hidden md:flex items-center justify-center"
        style={{
          right: '-14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #111f3b 0%, #222748 100%)',
          border: `1.5px solid rgba(255,255,255,0.1)`,
          boxShadow: `0 2px 12px rgba(0,0,0,0.5)`,
          cursor: 'pointer',
        }}
        aria-label="Toggle sidebar"
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5 no-transition" style={{ color: 'rgba(255,255,255,0.8)' }} strokeWidth={2.5} />
          : <ChevronLeft className="w-3.5 h-3.5 no-transition" style={{ color: 'rgba(255,255,255,0.8)' }} strokeWidth={2.5} />
        }
      </motion.button>

      {/* ── Logo Area ── */}
      <div
        className="flex items-center px-4 py-5 flex-shrink-0"
        style={{ borderBottom: `1px solid ${SIDEBAR_DIVIDER}`, minHeight: '72px' }}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            /* ── EXPANDED: Full logo (icon + wordmark) ── */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              {/* Mark: the real Zorvyn SVG asset (always white on dark sidebar) */}
              <img
                src="/logo-mark-white.svg"
                alt="Zorvyn mark"
                className="w-16 h-10 object-contain flex-shrink-0"
                style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.25))' }}
              />
              {/* Wordmark — shown only if SVG doesn't already include text */}
              <div className="leading-[1.1] flex flex-col justify-center gap-1 ">
                <h1 className="text-[24px] tracking-wider font-black text-[#a7a9ac]">zorvyn</h1>
                <span
                  className="inline-block self-start text-[9px] text-wider font-semibold uppercase tracking-[0.22em] px-2 py-0.5 rounded-full mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #111f3b 0%, #222748 100%)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  fintech
                </span>
              </div>
            </motion.div>
          ) : (
            /* ── COLLAPSED: Icon only ── */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              className="mx-auto"
            >
              <img
                src="/logo-mark-white.svg"
                alt="Zorvyn"
                className="w-10 h-7 object-contain"
                style={{ filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.3))' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              whileHover={{ x: collapsed ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold relative text-base"
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(67,124,239,0.15) 0%, rgba(128,94,217,0.15) 100%)',
                border: `1px solid rgba(128,94,217,0.25)`,
                boxShadow: '0 2px 12px rgba(128,94,217,0.1)',
                color: '#FFFFFF',
              } : {
                border: '1px solid transparent',
                color: ICON_COLOR,
              }}
            >
              {/* Active left accent bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full"
                  style={{ background: 'linear-gradient(135deg, #437CEF 0%, #805ED9 100%)', boxShadow: '0 0 12px rgba(128,94,217,0.4)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className="w-5 h-5 flex-shrink-0 no-transition"
                strokeWidth={isActive ? 2 : 1.5}
                style={{ color: isActive ? ICON_ACTIVE : ICON_COLOR }}
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* ── Bottom: Theme Toggle ── */}
      <div
        className="px-3 pb-5 flex-shrink-0"
        style={{ borderTop: `1px solid ${SIDEBAR_DIVIDER}`, paddingTop: '16px' }}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.p
              key="pref-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-1 mb-3 text-[10px] uppercase tracking-[0.18em] font-semibold flex items-center gap-1.5"
              style={{ color: MUTED_COLOR }}
            >
              <Sparkles className="w-3 h-3 no-transition" strokeWidth={1.5} />
              Preferences
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl relative overflow-hidden transition-all bg-white/10 text-white border border-white/10 hover:bg-white/20"
          aria-label="Toggle theme"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 flex-shrink-0"
          >
            {isLight
              ? <Sun className="w-5 h-5 text-amber-400 no-transition" strokeWidth={1.5} />
              : <Moon className="w-5 h-5 no-transition" style={{ color: '#8B5CF6' }} strokeWidth={1.5} />
            }
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="theme-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="text-left relative z-10"
              >
                <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                  {isLight ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p className="text-xs font-medium" style={{ color: MUTED_COLOR }}>
                  {isLight ? 'Electric light theme' : 'Deep obsidian theme'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
