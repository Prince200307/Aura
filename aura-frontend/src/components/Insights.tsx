import React from 'react';
import { TrendingUp, AlertCircle, Laptop, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useModals } from '../context/ModalContext';
import { mockGoals } from '../data/mockData';

export function Insights() {
  const { openModal } = useModals();
  const macbookGoal = mockGoals.find(g => g.name === 'MacBook Pro') || mockGoals[0];

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline">Smart Insights</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <p className="text-on-surface-variant font-medium">Based on your spending patterns</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Health Score */}
        <section className="lg:col-span-5 flex flex-col gap-8">
          <div className="glass-card rounded-[32px] p-8 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle className="text-surface-container-high" cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" />
                <motion.circle 
                  initial={{ strokeDashoffset: 552.92 }}
                  animate={{ strokeDashoffset: 154.81 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary" 
                  cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="552.92" strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-5xl font-extrabold font-headline text-primary">72<span className="text-xl text-on-surface-variant font-normal">/100</span></span>
                <span className="text-lg font-bold text-tertiary tracking-wide uppercase">Fair</span>
              </div>
            </div>

            <div className="mt-12 w-full space-y-6">
              {[
                { label: 'Needs covered', value: 100, color: 'bg-primary' },
                { label: 'Wants under 40%', value: 52, color: 'bg-error' },
                { label: 'Savings rate >10%', value: 14, color: 'bg-tertiary' },
                { label: 'Goal on track', value: 88, color: 'bg-primary' },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{metric.label}</span>
                    <span className="text-sm font-bold">{metric.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn("h-full rounded-full", metric.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low rounded-[32px] p-8">
            <h3 className="text-lg font-bold font-headline mb-4">Monthly Forecast</h3>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl shadow-sm">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-on-surface-variant text-sm">Estimated end-of-month balance</p>
                <p className="text-2xl font-extrabold font-headline">₹42,850</p>
              </div>
            </div>
          </div>
        </section>

        {/* Actionable Insights */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold font-headline">Actionable Insights</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-secondary-container/20 rounded-full">3 New</span>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-[32px] p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-tertiary/10 flex items-center justify-center rounded-2xl shrink-0">
                  <AlertCircle className="w-6 h-6 text-tertiary" />
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Warning</span>
                    <span className="text-xs text-on-surface-variant">2h ago</span>
                  </div>
                  <h4 className="text-lg font-bold leading-tight">Food spending for 3 months straight</h4>
                  <p className="mt-2 text-on-surface-variant leading-relaxed">Your dining out expenses have increased by 22% month-over-month. Consider setting a daily limit of ₹400 for meals.</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-6 hover:scale-[1.01] transition-transform duration-300 border-l-4 border-error">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-error/10 flex items-center justify-center rounded-2xl shrink-0">
                  <AlertCircle className="w-6 h-6 text-error" />
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-error">Critical</span>
                    <span className="text-xs text-on-surface-variant">Today</span>
                  </div>
                  <h4 className="text-lg font-bold leading-tight">Wants are 52% of your income</h4>
                  <p className="mt-2 text-on-surface-variant leading-relaxed">You've exceeded the recommended 30% limit for non-essential spending. This may delay your Home Deposit goal by 4 months.</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-2xl shrink-0">
                  <Laptop className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Goal Update</span>
                    <span className="text-xs text-on-surface-variant">Yesterday</span>
                  </div>
                  <h4 className="text-lg font-bold leading-tight">₹833 short of MacBook goal target</h4>
                  <p className="mt-2 text-on-surface-variant leading-relaxed">You're slightly behind your monthly pace. A small adjustment now keeps your June purchase date on track.</p>
                  <button 
                    onClick={() => openModal('goal-details', macbookGoal)}
                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
                  >
                    Add ₹833 now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-secondary-container/20 rounded-2xl border border-secondary-container/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Aura Insights: Reducing subscription overlap could save you ₹1,200/mo.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
