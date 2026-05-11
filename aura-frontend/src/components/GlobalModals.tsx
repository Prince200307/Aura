import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Sparkles, Home, Zap, ShoppingCart, Film, Utensils, ShoppingBag, Edit3, Plus, Target, ArrowLeft, Wallet, Star, Rocket, Trash2, Calendar, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useModals } from '../context/ModalContext';
import { cn } from '../lib/utils';

export function GlobalModals() {
  const { activeModal, modalData, closeModal, openModal } = useModals();
  
  // Expense State
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', type: 'need', category: 'Housing' });
  
  // Goal State
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', category: 'Technology' });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Housing': return Home;
      case 'Utilities': return Zap;
      case 'Food': return ShoppingCart;
      case 'Entertainment': return Film;
      case 'Lifestyle': return Utensils;
      case 'Shopping': return ShoppingBag;
      default: return ShoppingBag;
    }
  };

  return (
    <AnimatePresence>
      {activeModal === 'add-expense' && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-[10%] bg-surface-container-lowest z-[110] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden max-w-2xl mx-auto"
          >
            <div className="w-full flex flex-col items-center pt-3 pb-4">
              <div className="w-12 h-1 bg-surface-dim rounded-full mb-6" />
              <h1 className="font-headline font-bold text-xl tracking-tight text-on-surface">Log Expense</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-8">
              <div className="flex flex-col items-center justify-center py-6">
                <span className="font-label text-[10px] uppercase tracking-widest font-bold text-outline mb-2">Transaction Amount</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-3xl font-bold text-primary">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full max-w-[200px] text-center font-headline text-6xl font-extrabold bg-transparent border-none focus:ring-0 placeholder:text-surface-dim text-on-surface"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" 
                    id="expense_name"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    className="peer block w-full px-5 pt-7 pb-3 text-on-surface bg-surface-container-low border-none rounded-2xl focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                    placeholder=" "
                  />
                  <label 
                    htmlFor="expense_name"
                    className="absolute text-sm font-medium text-outline duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-primary"
                  >
                    Expense name (e.g. Monthly Rent)
                  </label>
                </div>

                <div className="space-y-3">
                  <span className="font-label text-[10px] uppercase tracking-widest font-bold text-outline px-1">Allocation Priority</span>
                  <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-2xl h-14 items-center">
                    <button 
                      onClick={() => setNewExpense({ ...newExpense, type: 'need' })}
                      className={cn(
                        "h-full flex items-center justify-center font-bold text-xs tracking-wide rounded-xl transition-all active:scale-95",
                        newExpense.type === 'need' ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
                      )}
                    >
                      NEED
                    </button>
                    <button 
                      onClick={() => setNewExpense({ ...newExpense, type: 'want' })}
                      className={cn(
                        "h-full flex items-center justify-center font-bold text-xs tracking-wide rounded-xl transition-all active:scale-95",
                        newExpense.type === 'want' ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
                      )}
                    >
                      WANT
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="font-label text-[10px] uppercase tracking-widest font-bold text-outline px-1">Category</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Housing', 'Utilities', 'Food', 'Entertainment', 'Lifestyle', 'Shopping'].map((cat) => {
                      const Icon = getCategoryIcon(cat);
                      return (
                        <button 
                          key={cat}
                          onClick={() => setNewExpense({ ...newExpense, category: cat })}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                            newExpense.category === cat ? "bg-primary/5 border-primary text-primary" : "bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-secondary-container/10 rounded-xl border border-secondary-container/20">
                    <Sparkles className="w-4 h-4 text-primary fill-current" />
                    <span className="text-[11px] font-medium text-on-secondary-container">Aura suggests this as a Fixed Cost.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-12 pt-4 bg-surface-container-lowest border-t border-outline-variant/10">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={closeModal}
                  className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  Log Expense
                </button>
                <button 
                  onClick={closeModal}
                  className="w-full h-14 bg-transparent text-outline font-semibold text-sm hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {activeModal === 'add-goal' && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[110] flex items-end justify-center"
          >
            <div className="w-full max-w-2xl bg-surface-container-lowest rounded-t-[32px] shadow-2xl border-t border-outline-variant/20 overflow-hidden">
              <div className="w-full flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-surface-container-highest rounded-full" />
              </div>

              <div className="px-8 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">New Goal</h2>
                    <p className="text-on-surface-variant text-sm font-medium">Set a target and Aura will help you get there.</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-8 pb-10 pt-4 space-y-8">
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant px-1">Goal name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      className="w-full h-14 px-5 rounded-xl bg-surface-container-low border-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline/50"
                      placeholder="e.g. MacBook Pro"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-outline/30">
                      <Edit3 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant px-1">Target amount</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 font-headline font-bold text-primary">₹</div>
                      <input 
                        type="number" 
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                        className="w-full h-14 pl-10 pr-5 rounded-xl bg-surface-container-low border-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-bold text-lg"
                        placeholder="5,000"
                      />
                    </div>
                    <p className="text-[11px] text-outline px-1">Min. ₹5,000</p>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant px-1">Deadline</label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        className="w-full h-14 px-5 rounded-xl bg-surface-container-low border-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-bold text-lg"
                        placeholder="e.g. 6"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">months</div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-container/20 rounded-2xl p-6 border border-secondary-container/30 flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl text-on-primary">
                    <Sparkles className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] font-bold text-primary block mb-0.5">Aura Insight</span>
                    <p className="text-on-surface font-semibold text-lg">
                      That's <span className="text-primary tracking-tight">₹{newGoal.target && newGoal.deadline ? Math.round(Number(newGoal.target) / Number(newGoal.deadline)).toLocaleString() : '0'}/month</span>
                    </p>
                  </div>
                </div>

                <div className="h-32 w-full rounded-2xl overflow-hidden relative group">
                  <img 
                    src="https://picsum.photos/seed/workspace/800/400" 
                    alt="Goal context"
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="font-headline font-bold text-on-surface">Dream big, save smart.</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={closeModal}
                    className="w-full h-14 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold tracking-tight text-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Create Goal
                  </button>
                  <button 
                    onClick={closeModal}
                    className="w-full h-12 rounded-xl text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {activeModal === 'goal-details' && modalData && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background z-[110] shadow-2xl flex flex-col overflow-hidden"
          >
            <header className="fixed top-0 w-full h-[64px] z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10">
              <div className="flex items-center justify-between px-6 h-full">
                <div className="flex items-center gap-3">
                  <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="font-headline font-bold text-lg">{modalData.name}</span>
                </div>
                <div className="px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-primary">On Track</span>
                </div>
              </div>
            </header>

            <main className="pt-20 pb-24 overflow-y-auto px-6">
              <div className="hidden md:block mb-12">
                <h1 className="text-3xl font-headline font-extrabold tracking-tight">{modalData.name}</h1>
                <p className="text-on-surface-variant text-sm">{modalData.category} Fund</p>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-center">
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-surface-container-high" cx="50%" cy="50%" fill="transparent" r="45%" stroke="currentColor" strokeWidth="10"></circle>
                      <motion.circle 
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${(modalData.currentAmount / modalData.targetAmount) * 283} 283` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-primary" 
                        cx="50%" cy="50%" fill="transparent" r="45%" stroke="currentColor" strokeWidth="12" strokeLinecap="round"
                      ></motion.circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">
                        {Math.round((modalData.currentAmount / modalData.targetAmount) * 100)}%
                      </span>
                      <div className="mt-2 flex flex-col items-center">
                        <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Saved so far</span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-lg font-bold">₹{modalData.currentAmount.toLocaleString()}</span>
                          <span className="text-on-surface-variant text-xs">of ₹{modalData.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between h-28">
                    <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Monthly Target</span>
                    <span className="text-xl font-bold text-on-surface">₹{modalData.monthlyTarget.toLocaleString()}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between h-28">
                    <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Est. Completion</span>
                    <span className="text-xl font-bold text-on-surface">Sep 2026</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between h-28">
                    <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Months Left</span>
                    <span className="text-xl font-bold text-on-surface">5</span>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-headline font-bold">This Month's Contribution</h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 text-error">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-white/40 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-xs mb-1">Status: Deposited</p>
                      <p className="text-xl font-bold text-on-surface">₹2,000 <span className="text-on-surface-variant font-normal text-sm">contributed this month</span></p>
                    </div>
                  </div>
                  <button className="hidden sm:block bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95">Add Extra</button>
                </div>
              </section>

              <div className="mb-12 bg-secondary-container/10 p-4 rounded-xl flex items-center gap-3 border border-secondary-container/20">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <p className="text-sm text-on-secondary-container font-medium">Aura Insight: At this rate, you'll reach your goal 2 months earlier than projected!</p>
              </div>

              <section className="mb-12">
                <h2 className="text-xl font-headline font-bold mb-6">Contribution History</h2>
                <div className="space-y-3">
                  {[
                    { month: 'August 2024', amount: 2000 },
                    { month: 'July 2024', amount: 2500 },
                    { month: 'June 2024', amount: 1800 },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl hover:bg-white transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                        <span className="font-medium text-on-surface-variant">{h.month}</span>
                      </div>
                      <span className="font-bold">₹{h.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-4 text-on-surface-variant font-label tracking-widest text-[10px] font-bold uppercase hover:text-primary transition-colors">View All History</button>
              </section>
            </main>
          </motion.div>
        </>
      )}

      {activeModal === 'milestone' && modalData && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[150]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit glass-card rounded-[32px] p-10 text-center shadow-2xl border border-white/50 z-[160]"
          >
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{modalData.milestone}%</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-tertiary-container rounded-full flex items-center justify-center border-4 border-white">
                <Star className="w-4 h-4 text-white fill-current" />
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                {modalData.milestone === 100 ? "Goal Achieved!" : `${modalData.milestone === 50 ? "Halfway" : modalData.milestone + "%"} to your ${modalData.goalName} goal`}
              </h2>
              <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
              <p className="text-on-surface-variant text-lg leading-relaxed px-4">
                ₹{modalData.saved.toLocaleString()} saved. <span className="text-on-surface font-semibold">₹{modalData.remaining.toLocaleString()} to go.</span> Keep going.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={closeModal}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25"
              >
                Keep going →
              </button>
              <button 
                onClick={() => {
                  closeModal();
                  // We would ideally open goal details here but for now just close
                }}
                className="w-full py-3 text-on-surface-variant font-semibold hover:text-primary transition-colors text-sm"
              >
                View full details
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-center gap-12">
              <div className="text-left">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Milestone</p>
                <p className="text-sm font-bold">{modalData.milestoneIndex} of 4 reached</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Pace</p>
                <p className="text-sm font-bold text-tertiary">+₹5,400/mo avg</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
