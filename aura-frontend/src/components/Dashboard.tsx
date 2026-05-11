import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Edit3, ArrowUpRight, TrendingDown, ShoppingBag, Zap, Briefcase, Sparkles, Plus, Flag, LayoutGrid, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockTransactions } from '../data/mockData';
import { useModals } from '../context/ModalContext';

export function Dashboard() {
  const { openModal } = useModals();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
      {/* Month Selector */}
      <header className="flex flex-col items-center justify-center mb-12">
        <div className="flex items-center gap-6">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight">April 2026</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low opacity-40 cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-3">Current month</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Budget & Summary */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Budget Card */}
          <div className="bg-surface-container-low p-8 rounded-[32px] transition-all">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Monthly Budget</p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-headline font-extrabold text-primary">₹75,000</span>
              </div>
              <button className="p-4 bg-surface-container-lowest rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all">
                <Edit3 className="w-5 h-5 text-primary" />
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mt-4 italic">Tap to update</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { label: 'Income', value: '₹75,000', color: 'text-primary', bg: 'bg-primary/5' },
              { label: 'Needs', value: '₹32,000', color: 'text-on-surface', bg: 'bg-surface-container-low' },
              { label: 'Wants', value: '₹12,000', color: 'text-on-surface', bg: 'bg-surface-container-low' },
              { label: 'Goal Contrib.', value: '₹8,000', color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Remaining', value: '₹23,000', color: 'text-emerald-700', bg: 'bg-emerald-50', span: 'col-span-2 md:col-span-1' },
            ].map((stat) => (
              <div key={stat.label} className={cn("glass-card p-5 rounded-2xl transition-transform hover:scale-[1.02]", stat.bg, stat.span)}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">{stat.label}</p>
                <p className={cn("text-xl font-headline font-bold", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-tighter">Healthy</span>
              <p className="text-sm font-bold"><span className="text-emerald-600">84%</span> remaining</p>
            </div>
            <div className="h-[10px] w-full bg-surface-container-high rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '84%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Recent Activity (Mobile Only/Simplified) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold">Recent Ledger</h2>
              <button className="text-primary text-sm font-bold">View All</button>
            </div>
            <div className="space-y-4">
              {mockTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl flex items-center justify-center shadow-sm">
                      {tx.category === 'Groceries' && <ShoppingBag className="w-5 h-5 text-on-surface-variant" />}
                      {tx.category === 'Utilities' && <Zap className="w-5 h-5 text-on-surface-variant" />}
                      {tx.category === 'Work' && <Briefcase className="w-5 h-5 text-on-surface-variant" />}
                    </div>
                    <div>
                      <p className="font-semibold">{tx.name}</p>
                      <p className="text-xs text-on-surface-variant">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} • {tx.date}</p>
                    </div>
                  </div>
                  <p className={cn("font-bold", tx.type === 'income' ? "text-emerald-600" : "text-error")}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Report & Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low/60 dark:bg-surface-container-low rounded-[32px] p-8 space-y-8 border border-white/20 dark:border-white/5">
            <div className="space-y-6">
              {[
                { label: 'Total Spent', value: '₹52,000', icon: ArrowUpRight, color: 'text-primary' },
                { label: 'Top Category', value: 'Rent', icon: LayoutGrid, color: 'text-emerald-600', badge: true },
                { label: 'Saved', value: '₹23,000', icon: Wallet, color: 'text-tertiary' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest dark:bg-surface-container-high flex items-center justify-center shadow-sm">
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{item.label}</p>
                    {item.badge ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold mt-1">{item.value}</span>
                    ) : (
                      <p className="text-lg font-headline font-bold">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-outline-variant flex items-center justify-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">April 2026 Summary</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => openModal('add-expense')}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
            <button 
              onClick={() => openModal('add-goal')}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 border-primary/40 text-primary font-bold hover:bg-primary/5 transition-all active:scale-95"
            >
              <Flag className="w-5 h-5" />
              <span>Add Goal</span>
            </button>
          </div>

          {/* Aura Intelligence */}
          <div className="p-6 bg-secondary-container/20 rounded-3xl border border-secondary-container/30 flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Aura Intelligence</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                You're on track to save <span className="font-bold text-on-surface">₹4,000 more</span> than last month. Consider moving it to your 'Europe Trip' goal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
