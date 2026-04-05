import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import GlassCard from '../ui/GlassCard';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Flame,
  Target,
  ArrowRight,
  BarChart3,
  Sparkles,
} from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ── Zorvyn AI Badge ──
function ZorvynBadge({ onClick }) {
  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex-shrink-0 bg-[#805ed9]/10 border border-[#805ed9]/20 text-[#805ed9] ${onClick ? 'cursor-pointer hover:bg-[#805ed9]/20 transition-colors' : 'cursor-default'}`}
    >
      <Sparkles className="w-2.5 h-2.5 no-transition" strokeWidth={1.5} />
      Zorvyn AI
    </button>
  );
}

export default function InsightsPage() {
  const { insights, transactions, theme, setIsChatOpen } = useFinance();
  const isLight = theme === 'light';
  const {
    totalIncome,
    totalExpenses,
    savingsRate,
    netBalance,
    highestCategory,
    monthlyTrend,
    currentMonthExpenses,
    prevMonthExpenses,
    categorySpending,
  } = insights;

  const avgTransaction = transactions.length > 0
    ? Math.round(transactions.reduce((s, t) => s + t.amount, 0) / transactions.length)
    : 0;

  const categoryRanking = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const totalCatSpending = categoryRanking.reduce((s, [, v]) => s + v, 0);

  // High-contrast text token
  const primaryText  = isLight ? '#0F172A' : '#e2e8f0';
  const mutedText    = isLight ? '#475569'  : '#64748b';
  const cardRowBg    = isLight ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.025)';
  const cardRowBd    = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';
  const trackBg      = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const dividerColor = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)';

  const insightCards = [
    {
      title: 'Net Balance',
      value: formatCurrency(netBalance),
      desc: netBalance >= 0 ? 'You are in the green! 💚' : 'Expenses exceed income ⚠️',
      icon: PiggyBank,
      color: netBalance >= 0 ? '#10B981' : '#f43f5e',
      bgColor: netBalance >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
    },
    {
      title: 'Monthly Trend',
      value: `${monthlyTrend > 0 ? '+' : ''}${monthlyTrend}%`,
      desc: monthlyTrend > 0 ? 'Spending increased from last month' : 'Spending decreased — great job!',
      icon: monthlyTrend > 0 ? TrendingUp : TrendingDown,
      color: monthlyTrend > 0 ? '#f43f5e' : '#10B981',
      bgColor: monthlyTrend > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
    },
    {
      title: 'Top Expense',
      value: highestCategory ? highestCategory.name : '—',
      desc: highestCategory ? formatCurrency(highestCategory.amount) + ' total' : 'No expenses yet',
      icon: Flame,
      color: '#f59e0b',
      bgColor: 'rgba(245,158,11,0.1)',
    },
    {
      title: 'Avg. Transaction',
      value: formatCurrency(avgTransaction),
      desc: `Across ${transactions.length} transactions`,
      icon: BarChart3,
      color: '#0EA5E9',
      bgColor: 'rgba(14,165,233,0.1)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: primaryText }}>
            Financial Insights
          </h2>
          <p className="text-sm font-medium mt-1" style={{ color: mutedText }}>
            AI-powered analysis of your financial health
          </p>
        </div>
        <ZorvynBadge onClick={() => setIsChatOpen(true)} />
      </motion.div>

      {/* ── Key Insights Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {insightCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <GlassCard key={card.title} delay={i * 0.08}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                style={{ background: card.bgColor }}
              >
                <Icon className="w-5 h-5 no-transition" strokeWidth={1.5} style={{ color: card.color }} />
              </div>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-1"
                style={{ color: mutedText }}
              >
                {card.title}
              </p>
              {/* ── Large, airy key value ── */}
              <p
                className="text-2xl font-bold tracking-tighter mt-1"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              <p className="text-xs font-medium mt-2" style={{ color: mutedText }}>
                {card.desc}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* ── Detailed Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Savings Analysis */}
        <GlassCard delay={0.4} hover={false}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold tracking-tight" style={{ color: primaryText }}>
                  Savings Analysis
                </h3>
                <ZorvynBadge onClick={() => setIsChatOpen(true)} />
              </div>
              <p className="text-xs font-medium" style={{ color: mutedText }}>
                Income vs Expenditure health check
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" style={{ color: '#8B5CF6' }} strokeWidth={1.5} />
              <span
                className="text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #437CEF 0%, #805ED9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {savingsRate}%
              </span>
            </div>
          </div>

          {/* Savings Rate Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: mutedText }}>
              <span>Savings Rate</span>
              <span>{savingsRate}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(savingsRate, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #437CEF 0%, #805ED9 100%)',
                  boxShadow: '0 0 12px rgba(128,94,217,0.35)',
                }}
              />
            </div>
          </div>

          {/* Income / Expense / Net rows */}
          <div className="space-y-2.5">
            {[
              { label: 'Total Income',   value: formatCurrency(totalIncome),   color: '#10B981', bgColor: 'rgba(16,185,129,0.08)' },
              { label: 'Total Expenses', value: formatCurrency(totalExpenses),  color: '#f43f5e', bgColor: 'rgba(244,63,94,0.08)' },
            ].map(({ label, value, color, bgColor }) => (
              <div
                key={label}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: cardRowBg, border: `1px solid ${cardRowBd}` }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bgColor }}>
                    <ArrowRight className="w-3.5 h-3.5 no-transition" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: mutedText }}>{label}</span>
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}</span>
              </div>
            ))}
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <PiggyBank className="w-3.5 h-3.5 no-transition" style={{ color: '#8B5CF6' }} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold" style={{ color: primaryText }}>Net Savings</span>
              </div>
              <span
                className="text-sm font-bold tabular-nums"
                style={{
                  background: 'linear-gradient(135deg, #437CEF 0%, #805ED9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatCurrency(netBalance)}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Category Rankings */}
        <GlassCard delay={0.5} hover={false}>
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold tracking-tight" style={{ color: primaryText }}>
                Category Rankings
              </h3>
              <ZorvynBadge onClick={() => setIsChatOpen(true)} />
            </div>
            <p className="text-xs font-medium" style={{ color: mutedText }}>
              Where your money goes the most
            </p>
          </div>

          <div className="space-y-4">
            {categoryRanking.map(([name, amount], idx) => {
              const percentage = totalCatSpending > 0 ? ((amount / totalCatSpending) * 100).toFixed(1) : 0;
              const color = insights.donutData.find((d) => d.name === name)?.color || '#94a3b8';
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.07 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tabular-nums w-4" style={{ color: mutedText }}>{idx + 1}.</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                      />
                      <span className="text-sm font-semibold" style={{ color: primaryText }}>{name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium tabular-nums" style={{ color: mutedText }}>{percentage}%</span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: primaryText }}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden ml-6" style={{ background: trackBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}50` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Monthly Comparison */}
          <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${dividerColor}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: mutedText }}>
                  This Month vs Last Month
                </p>
                <p className="text-sm font-semibold mt-0.5 tabular-nums" style={{ color: primaryText }}>
                  {formatCurrency(currentMonthExpenses)} vs {formatCurrency(prevMonthExpenses)}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: monthlyTrend > 0 ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)',
                  border: `1px solid ${monthlyTrend > 0 ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)'}`,
                }}
              >
                {monthlyTrend > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 no-transition" style={{ color: '#f43f5e' }} strokeWidth={1.5} />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 no-transition" style={{ color: '#10B981' }} strokeWidth={1.5} />
                )}
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: monthlyTrend > 0 ? '#f43f5e' : '#10B981' }}
                >
                  {monthlyTrend > 0 ? '+' : ''}{monthlyTrend}%
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
