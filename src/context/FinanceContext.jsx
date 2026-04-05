import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { mockTransactions, CATEGORIES, CATEGORY_COLORS } from '../utils/mockData';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'zorvyn_finance_data';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.transactions || null;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions }));
  } catch {
    // ignore storage errors
  }
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    return loadFromStorage() || mockTransactions;
  });
  const [userRole, setUserRole] = useState('admin'); // 'admin' | 'viewer'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'income' | 'expense'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Persist transactions to localStorage
  useEffect(() => {
    saveToStorage(transactions);
  }, [transactions]);

  // ─── Filtered Transactions ───
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        const matchesType = selectedType === 'All' || t.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, selectedCategory, selectedType]);

  // ─── Paginated Transactions ───
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // ─── Computed Insights ───
  const insights = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0;

    const netBalance = totalIncome - totalExpenses;

    // Category-wise spending
    const categorySpending = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    // Highest spending category
    const highestCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];

    // Monthly breakdown (current vs previous)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    // Use March 2026 as "current" month since our data is in that range
    const dataCurrentMonth = 2; // March (0-indexed)
    const dataCurrentYear = 2026;

    const currentMonthExpenses = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === dataCurrentMonth && d.getFullYear() === dataCurrentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const prevMonthExpenses = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === dataCurrentMonth - 1 && d.getFullYear() === dataCurrentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyTrend = prevMonthExpenses > 0
      ? (((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100).toFixed(1)
      : 0;

    // Balance over time (for area chart)
    const sortedByDate = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;
    const balanceOverTime = sortedByDate.map((t) => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
      return {
        date: t.date,
        balance: runningBalance,
        title: t.title,
      };
    });

    // Donut chart data
    const donutData = Object.entries(categorySpending)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || '#94a3b8',
      }))
      .sort((a, b) => b.value - a.value);

    // Sparkline data (last 7 data points per metric)
    const incomeByDate = {};
    const expenseByDate = {};
    transactions.forEach((t) => {
      if (t.type === 'income') {
        incomeByDate[t.date] = (incomeByDate[t.date] || 0) + t.amount;
      } else {
        expenseByDate[t.date] = (expenseByDate[t.date] || 0) + t.amount;
      }
    });

    const incomeSparkline = Object.entries(incomeByDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([, val]) => ({ value: val }));

    const expenseSparkline = Object.entries(expenseByDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([, val]) => ({ value: val }));

    const savingsSparkline = balanceOverTime
      .slice(-7)
      .map((p) => ({ value: p.balance }));

    return {
      totalIncome,
      totalExpenses,
      savingsRate: Number(savingsRate),
      netBalance,
      categorySpending,
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null,
      currentMonthExpenses,
      prevMonthExpenses,
      monthlyTrend: Number(monthlyTrend),
      balanceOverTime,
      donutData,
      incomeSparkline,
      expenseSparkline,
      savingsSparkline,
    };
  }, [transactions]);

  // ─── Actions ───
  const addTransaction = useCallback((transaction) => {
    setTransactions((prev) => [
      { ...transaction, id: Date.now() },
      ...prev,
    ]);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const toggleRole = useCallback(() => {
    setUserRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedType('All');
    setCurrentPage(1);
  }, []);

  const value = {
    // State
    transactions,
    theme,
    isChatOpen,
    userRole,
    searchTerm,
    selectedCategory,
    selectedType,
    currentPage,
    itemsPerPage,
    totalPages,
    // Derived
    filteredTransactions,
    paginatedTransactions,
    insights,
    // Constants
    CATEGORIES,
    CATEGORY_COLORS,
    // Setters
    setSearchTerm,
    setSelectedCategory,
    setSelectedType,
    setCurrentPage,
    // Actions
    addTransaction,
    deleteTransaction,
    editTransaction,
    toggleRole,
    toggleTheme,
    setIsChatOpen,
    resetFilters,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export default FinanceContext;
