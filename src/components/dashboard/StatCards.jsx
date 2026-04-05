import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import GlassCard from '../ui/GlassCard';
import { TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, Percent, Sparkles } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

function MiniSparkline({ data, color, gradientId }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 opacity-40 pointer-events-none z-0 overflow-hidden rounded-b-[32px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function StatCards() {
  const { insights, setIsChatOpen } = useFinance();
  const {
    totalIncome, totalExpenses, savingsRate,
    monthlyTrend, incomeSparkline, expenseSparkline, savingsSparkline,
  } = insights;

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      change: '+12.5%',
      changeType: 'positive',
      icon: ArrowDownLeft,
      sparkData: incomeSparkline,
      sparkColor: '#10B981',        // Emerald
      gradientId: 'sparkIncome',
      glow: 'emerald',
      iconBg: 'rgba(16,185,129,0.1)',
      iconColor: '#10B981',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      change: `${monthlyTrend > 0 ? '+' : ''}${monthlyTrend}%`,
      changeType: monthlyTrend > 0 ? 'negative' : 'positive',
      icon: ArrowUpRight,
      sparkData: expenseSparkline,
      sparkColor: '#f43f5e',        // Rose
      gradientId: 'sparkExpense',
      glow: '',
      iconBg: 'rgba(244,63,94,0.1)',
      iconColor: '#f43f5e',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      subtitle: formatCurrency(totalIncome - totalExpenses) + ' saved',
      icon: Percent,
      sparkData: savingsSparkline,
      sparkColor: '#0EA5E9',        // Cyan (was purple)
      gradientId: 'sparkSavings',
      glow: 'cyan',
      iconBg: 'rgba(14,165,233,0.1)',
      iconColor: '#0EA5E9',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <GlassCard key={card.title} delay={index * 0.1} glow={card.glow} className="relative overflow-hidden">
            {/* Sparkline pinned to bottom */}
            <MiniSparkline data={card.sparkData} color={card.sparkColor} gradientId={card.gradientId} />

            {/* Content above sparkline */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: card.iconColor }} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted font-semibold uppercase tracking-widest">{card.title}</p>
                    {card.change && (
                      <div className="flex items-center gap-1 mt-1">
                        {card.changeType === 'positive'
                          ? <TrendingUp   className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: '#10B981' }} />
                          : <TrendingDown className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: '#f43f5e' }} />
                        }
                        <span
                          className="text-xs font-bold"
                          style={{ color: card.changeType === 'positive' ? '#10B981' : '#f43f5e' }}
                        >
                          {card.change}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {card.title === 'Savings Rate' && (
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    title="Zorvyn AI has analyzed this trend. Click for details."
                    className="bg-[#805ed9]/10 text-[#805ed9] px-2 py-1 rounded-full text-[10px] font-bold border border-[#805ed9]/20 flex items-center gap-1 transition-all hover:bg-[#805ed9]/20 hover:scale-[1.03]"
                  >
                    <Sparkles className="w-3 h-3" strokeWidth={2} />
                    AI: OPTIMIZED
                  </button>
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary tracking-tighter">{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm text-text-muted mt-1.5 font-medium">{card.subtitle}</p>
                )}
              </div>
            </div>
          </GlassCard>
        );
      })}
    </motion.div>
  );
}
