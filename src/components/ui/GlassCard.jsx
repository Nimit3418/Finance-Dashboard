import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useFinance } from '../../context/FinanceContext';

export default function GlassCard({ children, className = '', hover = true, glow = '', delay = 0, ...props }) {
  const { theme } = useFinance();
  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -5, transition: { duration: 0.25, ease: 'easeOut' } } : {}}
      className={twMerge(
        'rounded-[32px] p-8',
        isLight ? '' : 'glass',
        hover && !isLight ? 'glass-hover cursor-default' : '',
        glow === 'cyan'    && 'glow-cyan',
        glow === 'emerald' && 'glow-emerald',
        glow === 'purple'  && 'glow-purple',  // real purple glow
        glow === 'blue'    && 'glow-cyan',
        className
      )}
      style={isLight ? {
        // Elite-Light: pure white card floats over #F1F5F9 background
        background:           '#ffffff',
        backdropFilter:       'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border:               '1px solid #E2E8F0',    /* crisp slate-200 */
        boxShadow:            '0 40px 80px -15px rgba(0,0,0,0.12), 0 10px 30px -5px rgba(0,0,0,0.06)',
      } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}
