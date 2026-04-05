// Seed transactions for the Finance Dashboard
// Covers a 3-month range with realistic Indian spending categories

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Groceries',
  'Rent',
  'Utilities',
  'Subscriptions',
  'Transport',
  'Food & Dining',
  'Shopping',
  'Healthcare',
  'Entertainment',
  'Education',
  'Investment',
  'Gifts',
  'Miscellaneous',
];

const CATEGORY_COLORS = {
  Salary: '#10b981',
  Freelance: '#34d399',
  Groceries: '#f59e0b',
  Rent: '#ef4444',
  Utilities: '#f97316',
  Subscriptions: '#8b5cf6',
  Transport: '#6366f1',
  'Food & Dining': '#ec4899',
  Shopping: '#f43f5e',
  Healthcare: '#14b8a6',
  Entertainment: '#a855f7',
  Education: '#3b82f6',
  Investment: '#22d3ee',
  Gifts: '#e879f9',
  Miscellaneous: '#94a3b8',
};

const mockTransactions = [
  // ---- March 2026 ----
  { id: 1,  date: '2026-03-01', title: 'Monthly Salary',            amount: 85000, category: 'Salary',         type: 'income'  },
  { id: 2,  date: '2026-03-02', title: 'House Rent',                amount: 18000, category: 'Rent',           type: 'expense' },
  { id: 3,  date: '2026-03-03', title: 'BigBasket Groceries',       amount: 3200,  category: 'Groceries',      type: 'expense' },
  { id: 4,  date: '2026-03-05', title: 'Electricity Bill',          amount: 1800,  category: 'Utilities',      type: 'expense' },
  { id: 5,  date: '2026-03-06', title: 'Netflix + Spotify',         amount: 799,   category: 'Subscriptions',  type: 'expense' },
  { id: 6,  date: '2026-03-08', title: 'Uber Rides',                amount: 1250,  category: 'Transport',      type: 'expense' },
  { id: 7,  date: '2026-03-10', title: 'Freelance UI Project',      amount: 25000, category: 'Freelance',      type: 'income'  },
  { id: 8,  date: '2026-03-11', title: 'Zomato Orders',             amount: 2100,  category: 'Food & Dining',  type: 'expense' },
  { id: 9,  date: '2026-03-14', title: 'Amazon Shopping',           amount: 4500,  category: 'Shopping',       type: 'expense' },
  { id: 10, date: '2026-03-16', title: 'Gym Membership',            amount: 1500,  category: 'Healthcare',     type: 'expense' },
  { id: 11, date: '2026-03-18', title: 'Movie Tickets',             amount: 800,   category: 'Entertainment',  type: 'expense' },
  { id: 12, date: '2026-03-20', title: 'Udemy Course',              amount: 499,   category: 'Education',      type: 'expense' },
  { id: 13, date: '2026-03-22', title: 'Mutual Fund SIP',           amount: 5000,  category: 'Investment',     type: 'expense' },
  { id: 14, date: '2026-03-25', title: 'Birthday Gift for Friend',  amount: 2000,  category: 'Gifts',          type: 'expense' },
  { id: 15, date: '2026-03-28', title: 'Internet Bill',             amount: 999,   category: 'Utilities',      type: 'expense' },

  // ---- February 2026 ----
  { id: 16, date: '2026-02-01', title: 'Monthly Salary',            amount: 85000, category: 'Salary',         type: 'income'  },
  { id: 17, date: '2026-02-02', title: 'House Rent',                amount: 18000, category: 'Rent',           type: 'expense' },
  { id: 18, date: '2026-02-04', title: 'Grocery Shopping',          amount: 2800,  category: 'Groceries',      type: 'expense' },
  { id: 19, date: '2026-02-06', title: 'Electricity + Water Bill',  amount: 2200,  category: 'Utilities',      type: 'expense' },
  { id: 20, date: '2026-02-08', title: 'YouTube Premium',           amount: 149,   category: 'Subscriptions',  type: 'expense' },
  { id: 21, date: '2026-02-10', title: 'Auto Rickshaw',             amount: 900,   category: 'Transport',      type: 'expense' },
  { id: 22, date: '2026-02-12', title: 'Swiggy Orders',             amount: 1800,  category: 'Food & Dining',  type: 'expense' },
  { id: 23, date: '2026-02-15', title: 'Freelance Logo Design',     amount: 12000, category: 'Freelance',      type: 'income'  },
  { id: 24, date: '2026-02-18', title: 'Myntra Shopping',           amount: 3500,  category: 'Shopping',       type: 'expense' },
  { id: 25, date: '2026-02-22', title: 'Doctor Visit',              amount: 1200,  category: 'Healthcare',     type: 'expense' },
  { id: 26, date: '2026-02-25', title: 'Mutual Fund SIP',           amount: 5000,  category: 'Investment',     type: 'expense' },

  // ---- January 2026 ----
  { id: 27, date: '2026-01-01', title: 'Monthly Salary',            amount: 80000, category: 'Salary',         type: 'income'  },
  { id: 28, date: '2026-01-03', title: 'House Rent',                amount: 18000, category: 'Rent',           type: 'expense' },
  { id: 29, date: '2026-01-05', title: 'DMart Groceries',           amount: 3600,  category: 'Groceries',      type: 'expense' },
  { id: 30, date: '2026-01-08', title: 'Gas + Electricity',         amount: 2400,  category: 'Utilities',      type: 'expense' },
  { id: 31, date: '2026-01-10', title: 'Hotstar + Prime',           amount: 599,   category: 'Subscriptions',  type: 'expense' },
  { id: 32, date: '2026-01-12', title: 'Metro Card Recharge',       amount: 500,   category: 'Transport',      type: 'expense' },
  { id: 33, date: '2026-01-15', title: 'Restaurant Dinner',         amount: 2800,  category: 'Food & Dining',  type: 'expense' },
  { id: 34, date: '2026-01-20', title: 'Flipkart Sale',             amount: 6200,  category: 'Shopping',       type: 'expense' },
  { id: 35, date: '2026-01-25', title: 'Mutual Fund SIP',           amount: 5000,  category: 'Investment',     type: 'expense' },
];

export { CATEGORIES, CATEGORY_COLORS, mockTransactions };
