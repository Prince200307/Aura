import React, { useState } from 'react';
import { ChevronRight, TrendingUp, X, Download, FileText, Sparkles, ArrowUp, ArrowDown, ShoppingBag, Zap, Utensils, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { mockHistory } from '../data/mockData';

export function History() {
  const [selectedMonth, setSelectedMonth] = useState<typeof mockHistory[0] | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [exportRange, setExportRange] = useState({ start: 'January 2024', end: 'April 2024' });

  const months = [
    'January 2024', 'February 2024', 'March 2024', 'April 2024',
    'May 2024', 'June 2024', 'July 2024', 'August 2024',
    'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ];

  return (
    <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline">History</h1>
          <p className="text-on-surface-variant text-lg mt-2">Your past months at a glance</p>
        </div>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-xs font-bold tracking-widest uppercase text-primary transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 glass-card p-8 rounded-[32px] relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-outline mb-4 block">Current Streak</span>
            <div className="text-4xl font-headline font-bold mb-2">6 Months Healthy</div>
            <p className="text-on-surface-variant max-w-xs">You've consistently hit your saving goals since October last year.</p>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="bg-primary p-8 rounded-[32px] shadow-lg flex flex-col justify-between text-white">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Annual Savings</span>
          <div className="text-3xl font-headline font-bold">₹3,42,000</div>
          <div className="flex items-center gap-1 text-sm mt-4 opacity-80">
            <TrendingUp className="w-4 h-4" />
            <span>12% YoY</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockHistory.map((item) => (
          <div 
            key={`${item.month}-${item.year}`} 
            onClick={() => setSelectedMonth(item)}
            className="group relative bg-surface-container-low hover:bg-surface-container-lowest hover:shadow-md transition-all duration-300 rounded-[2.5rem] p-2 cursor-pointer border border-transparent"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-high flex items-center justify-center shadow-sm">
                  <span className="font-headline font-bold text-primary uppercase">{item.month.slice(0, 3)}</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold">{item.month} {item.year}</h3>
                  <p className="text-sm text-on-surface-variant tracking-tight">
                    ₹{item.income.toLocaleString()} spent · ₹{item.saved.toLocaleString()} saved
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/20 text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{item.healthScore} — {item.healthScore > 80 ? 'Excellent' : 'Fair'}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="px-8 py-4 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-2xl text-[10px] font-bold uppercase tracking-widest">
          Load older archives
        </button>
      </div>

      {/* Month Detail Modal */}
      <AnimatePresence>
        {selectedMonth && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMonth(null)}
              className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-background z-[70] shadow-2xl flex flex-col"
            >
              <div className="bg-tertiary-fixed text-on-tertiary-fixed py-2 px-6 flex items-center justify-center gap-2">
                <Eye className="w-3 h-3" />
                <span className="font-label text-[10px] font-bold tracking-widest uppercase">Viewing {selectedMonth.month} {selectedMonth.year} — Read Only</span>
              </div>

              <header className="p-8 flex justify-between items-start">
                <div>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-outline font-bold mb-2 block">Monthly Ledger</span>
                  <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">{selectedMonth.month} {selectedMonth.year}</h2>
                </div>
                <button 
                  onClick={() => setSelectedMonth(null)}
                  className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-3xl p-6 border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-headline font-bold">Comparison</h3>
                        <p className="font-label text-[10px] uppercase tracking-widest text-outline">vs Previous Month</p>
                      </div>
                      <span className="bg-surface-container-low px-2 py-0.5 rounded-full font-label text-[8px] font-bold text-primary">SYNCED</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider">Needs</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₹{(selectedMonth.income * 0.5).toLocaleString()}</span>
                          <div className="flex items-center text-error text-[10px] font-bold">
                            <ArrowUp className="w-3 h-3" />
                            4%
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider">Wants</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₹{(selectedMonth.income * 0.3).toLocaleString()}</span>
                          <div className="flex items-center text-emerald-600 text-[10px] font-bold">
                            <ArrowDown className="w-3 h-3" />
                            12%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary p-6 rounded-3xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md mb-4">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-label text-[8px] font-bold tracking-widest uppercase">Aura Insight</span>
                      </div>
                      <p className="font-headline font-bold leading-tight mb-2">Excellent discipline in March.</p>
                      <p className="text-xs opacity-80 italic">"You saved 8% more than your average."</p>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-end justify-between">
                    <h3 className="font-headline text-xl font-bold">Expense Log</h3>
                    <span className="font-label text-[10px] uppercase tracking-widest text-outline font-bold">Sample Activity</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Whole Foods', cat: 'Groceries', amount: 4250, icon: ShoppingBag, type: 'Essential' },
                      { name: 'Adobe Creative', cat: 'Subscription', amount: 2840, icon: Zap, type: 'Wants' },
                      { name: 'The Glen Kitchen', cat: 'Dining', amount: 3100, icon: Utensils, type: 'Wants' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                            <tx.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{tx.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{tx.cat}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{tx.amount.toLocaleString()}</p>
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                            tx.type === 'Essential' ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-surface-container-highest text-outline"
                          )}>{tx.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-surface-container-lowest rounded-[32px] shadow-2xl p-8 border border-outline-variant/20 z-[70] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 blur-[40px] rounded-full -mt-8 -mr-8" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="text-outline hover:text-on-surface transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Export your data</h2>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  Select the date range for your expense history export.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline px-1">Start Month</label>
                    <select 
                      value={exportRange.start}
                      onChange={(e) => setExportRange({ ...exportRange, start: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-surface-container-low border-none focus:ring-1 focus:ring-primary text-sm font-medium text-on-surface appearance-none cursor-pointer"
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline px-1">End Month</label>
                    <select 
                      value={exportRange.end}
                      onChange={(e) => setExportRange({ ...exportRange, end: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-surface-container-low border-none focus:ring-1 focus:ring-primary text-sm font-medium text-on-surface appearance-none cursor-pointer"
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-2xl p-5 mb-8 border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-container-lowest rounded-lg flex items-center justify-center shadow-sm">
                      <FileText className="w-5 h-5 text-stone-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[0.65rem] font-label uppercase tracking-widest text-outline mb-0.5">Filename</p>
                      <p className="text-sm font-medium text-on-surface truncate">aura-export-2026-04-09.csv</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-container/20 rounded-xl p-4 mb-8 flex items-start gap-3 border border-secondary-container/30">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-xs text-on-secondary-container leading-snug">
                    Your export is ready. It contains <span className="font-bold">142 transactions</span> spanning the last 12 months.
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="w-full bg-gradient-to-br from-primary to-primary-container text-white h-[56px] rounded-[16px] font-bold tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download CSV
                  </button>
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="w-full h-[56px] text-stone-500 font-semibold hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
