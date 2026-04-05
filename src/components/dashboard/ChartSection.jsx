import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import GlassCard from '../ui/GlassCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Premium dark-glass tooltip — looks sharp in BOTH light & dark modes
const tooltipStyle = {
  background: 'rgba(15,23,42,0.95)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(14,165,233,0.25)',
  borderRadius: '16px',
  padding: '14px 20px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
};

function CustomAreaTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={tooltipStyle}>
      <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em' }}>
        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(payload[0].value)}
      </p>
    </div>
  );
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div style={tooltipStyle}>
      <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', fontWeight: 600 }}>
        {data.name}
      </p>
      <p style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em' }}>
        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(data.value)}
      </p>
    </div>
  );
}

function formatYAxis(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  if (value >= 1000)   return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export default function ChartSection() {
  const { insights, theme } = useFinance();
  const isLight = theme === 'light';
  const { balanceOverTime, donutData, highestCategory } = insights;

  // Theme-aware grid + axis
  const gridColor    = isLight ? '#E2E8F0'  : 'rgba(14,165,233,0.06)';
  const axisColor    = isLight ? '#94A3B8'  : '#334155';

  const areaData = balanceOverTime.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

      {/* ── Balance Over Time ── */}
      <GlassCard className="lg:col-span-3 glow-blob-purple overflow-hidden" delay={0.3} hover={false}>
        <div className="flex items-center justify-between mb-7 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-text-primary tracking-tighter">Balance Over Time</h3>
            <p className="text-sm text-text-muted mt-1 font-medium">Running balance trend across all transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-base text-text-muted font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #437CEF, #805ED9)', boxShadow: '0 0 8px rgba(128,94,217,0.6)' }}
              />
              Balance
            </span>
          </div>
        </div>

        <div className="h-80 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                {/* Area fill: blue → violet fade */}
                <linearGradient id="balanceGradientFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#437CEF" stopOpacity={0.25} />
                  <stop offset="50%"  stopColor="#805ED9" stopOpacity={0.10} />
                  <stop offset="100%" stopColor="#805ED9" stopOpacity={0}    />
                </linearGradient>
                {/* Stroke: blue → violet left-to-right */}
                <linearGradient id="balanceStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#437CEF" />
                  <stop offset="100%" stopColor="#805ED9" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 6" stroke={gridColor} horizontal vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12, fontWeight: 500 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12, fontWeight: 500 }}
                tickFormatter={formatYAxis}
                width={52}
              />
              <Tooltip
                content={<CustomAreaTooltip />}
                cursor={{ stroke: 'rgba(14,165,233,0.2)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="url(#balanceStroke)"
                strokeWidth={4}
                fill="url(#balanceGradientFill)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#805ED9',
                  stroke: isLight ? '#F8FAFC' : '#020617',
                  strokeWidth: 3,
                  style: { filter: 'drop-shadow(0 0 6px rgba(128,94,217,0.7))' },
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* ── Spending by Category (Donut) ── */}
      <GlassCard className="lg:col-span-2 glow-blob-blue overflow-hidden" delay={0.4} hover={false}>
        <div className="mb-5 relative z-10">
          <h3 className="text-xl font-bold text-text-primary tracking-tighter">Spending by Category</h3>
          <p className="text-sm text-text-muted mt-1 font-medium">Expense distribution breakdown</p>
        </div>

        <div className="h-56 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
              >
                {donutData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Legend */}
        <div className="space-y-3 max-h-40 overflow-y-auto pr-1 relative z-10 mt-2">
          {donutData.slice(0, 5).map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}55` }}
                />
                <span className="text-base text-text-muted group-hover:text-text-secondary transition-colors font-medium">
                  {item.name}
                </span>
              </div>
              <span className="text-base text-text-primary font-bold tabular-nums tracking-tight">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(item.value)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Highest Spending callout */}
        {highestCategory && (
          <div
            className="mt-5 pt-4 relative z-10"
            style={{ borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(14,165,233,0.08)'}` }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: isLight ? '#94A3B8' : '#334155' }}>
              Highest Spending
            </p>
            <p className="text-base font-bold gradient-text mt-1">{highestCategory.name}</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
