# Zorvyn Finance Dashboard

Zorvyn Finance Dashboard is a premium, professional-grade financial analytics and management web application built using **React, Vite, and Tailwind CSS**. It is designed to deliver a high-end Software-as-a-Service (SaaS) visual experience, featuring glassmorphism, dynamic mesh gradients, seamless light/dark themes, and powerful data visualization. 

## 🚀 Key Features

*   **Premium Visual Aesthetic:** Modern, breathable SaaS design utilizing "Plus Jakarta Sans" typography, glassmorphism (`GlassCard`), and interactive hover micro-animations. Theme context allows for effortless switching between Light and Dark mode.
*   **Comprehensive Layout:** A fully responsive shell consisting of a flexible Sidebar and a dynamic TopBar equipped with a Role Switcher and Download utilities.
*   **Three Main Views:**
    *   **Dashboard:** Highlights high-level metrics via `StatCards` and features an interactive main `ChartSection`.
    *   **Transactions:** A robust data grid utilizing `TransactionList` and an `AddTransactionModal` to allow filtering, viewing, and Mock-CRUD operations on financial transaction data.
    *   **Insights:** Deep-dive analytics provided by `InsightsPage`, leveraging Recharts to present varied financial breakdowns to the user.
*   **Role-Based Access Control:** Mock role switching (Admin vs Viewer) dynamically adapts UI access and features.
*   **Interactive Visualizations:** Built with `recharts` for polished and reactive financial data graphs.
*   **Smooth Animations:** Utilizes `framer-motion` for staggered entrance delays and seamless view transitions.
*   **Export Functionality:** Includes utility functions (`exportUtils.js`) to export mock transaction data.

## 🛠 Tech Stack

*   **Framework:** React 19
*   **Build Tool:** Vite 6
*   **Styling:** Tailwind CSS 4 (+ Custom Utilities in `index.css`)
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Animations:** Framer Motion

## 📁 Project Structure

```
src/
├── App.jsx                       # Main Application Routing and Context Provider Wrapper
├── main.jsx                      # Vite Entry Point
├── index.css                     # Global styles, Tailwind imports, Mesh Gradients, and Design System Tokens
├── components/
│   ├── dashboard/                # Main Landing Page components
│   │   ├── ChartSection.jsx
│   │   ├── InsightsPage.jsx
│   │   └── StatCards.jsx
│   ├── layout/                   # Structural app components
│   │   ├── Sidebar.jsx
│   │   └── TopBar.jsx
│   ├── transactions/             # Transaction management
│   │   ├── AddTransactionModal.jsx
│   │   └── TransactionList.jsx
│   └── ui/                       # Reusable visual containers and generic UI primitives
│       └── GlassCard.jsx         # Signature frosted-glass component wrapper
├── context/
│   └── FinanceContext.jsx        # Global State: Theme (Dark/Light), Transactions, Current Role
└── utils/
    ├── exportUtils.js            # Helpers for downloading data (e.g. CSV generation)
    └── mockData.js               # Initial seeding data for the dashboard
```

## 📜 Development History & Iterations

This project has evolved through several deliberate phases of refinement to reach its current “premium” state:

1.  **Initial Setup & Foundation (Building Modern Finance Dashboard):** 
    *   Started with a standard Vite + React template. 
    *   Focus was placed on core architectural structure: basic routing, standardizing raw Recharts, layout scaffolding (Sidebar/Topbar), and building out mock data layers in `mockData.js`.
2.  **Refining Dashboard UI:** 
    *   Began introducing Tailwind CSS heavily to restructure spacing and component hierarchy. The goal shifted from simple functionality to delivering a balanced and clean interface.
3.  **Fixing Application Structural Layout:** 
    *   Resolved structural rendering bugs (e.g., deprecated `Left.jsx` structure in favor of simplified and standardized `Sidebar.jsx`). Improved robustness of mobile-responsiveness patterns.
4.  **Implementing Premium SaaS Aesthetic (Planning Zorvyn Finance Dashboard):** 
    *   This phase radically overhauled the visuals. Introduced a permanent, fixed mesh gradient background behind the app.
    *   Added standard typography (migrating to Google Fonts). 
    *   Elevated individual UI sections utilizing glassmorphism and subtle gradient borders on critical interaction points.
5.  **High-End Dashboard Refactor (Phase 5 - Completed):**
    *   Scaled up the entire UI for a "Grand" SaaS feel: `text-3xl` headings, `p-8` padding, and `rounded-[32px]` cards.
    *   Rebuilt the Sidebar at a fixed `w-80` (320px) with a dark charcoal background (`#0a0a0a`).
    *   Stabilized the layout by fixing the "Download CSV" button dimensions (`min-w-[160px] h-14`) to prevent UI shifting.
    *   Integrated a unified `theme` and `userRole` system into `FinanceContext` for seamless Dark/Light transitions.
    *   Relocated the "+ Add Transaction" button inline with the Transactions list heading.

6.  **Principal UI/UX Finalization (Phase 6 - Completed):**
    *   **Zorvyn Brand Gradients:** Initially transitioned to Cyan/Emerald.
    *   **Apple-Style Light Mode:** Refined Light Mode with `#F8FAFC` backgrounds, deep float shadows, and separated dark sidebar.
    *   **TopBar Evolution:** Moved the Admin/Viewer toggle to the TopBar (fixed at 440px to prevent layout shift) and introduced the **Zorvyn AI Finance Copilot** with a dedicated chat drawer.
    *   **Ultimate Scaling:** Finalized ultra-bold `text-4xl` headers and `tracking-tighter` typography for a state-of-the-art fintech aesthetic.

7.  **Final Aesthetic Recovery & Layout Lockdown (Phase 7 - Completed):**
    *   **Layout Lockdown:** Refactored shell to `h-screen overflow-hidden flex`. Sidebar is now strictly `h-screen sticky top-0 overflow-hidden` (no scrolling), whilst only the Main column scrolls via `flex-1 h-screen overflow-y-auto`.
    *   **Neutral Obsidian Palette:** Transitioned dark mode from a blue-tinted navy to a pure Neutral Black (`#050505`). Set glass cards to a neutral slate-black (`rgba(15, 23, 42, 0.6)`) with strict white/opacity borders (no blue/color tints).
    *   **Triple-Glow "Zorvyn-Electric":** Re-introduced Purple forming a `Cyan → Purple → Emerald` gradient for buttons. Adjusted mesh background to a ghostly 10% opacity (Cyan/Emerald only) for premium depth.
    *   **Persistent Admin Flow:** Removed hover limitations on Admin actions in the transaction grid; edit (Cyan) and delete (Emerald) glass buttons are now persistently visible.
    *   **AI Drawer Integration:** Ensured the "Zorvyn AI" Copilot matches the Obsidian branding, triggering via a glowing "Sparkles" icon.

## 💻 Running Locally

1.  Ensure you have Node.js installed.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Visit `http://localhost:5173` in your browser.
