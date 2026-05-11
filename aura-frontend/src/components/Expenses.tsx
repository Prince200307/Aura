import React from 'react';
import { Search, Filter, ArrowUpDown, Home, Zap, ShoppingCart, Film, Utensils, ShoppingBag, Plus, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockTransactions } from '../data/mockData';
import { useModals } from '../context/ModalContext';

export function Expenses() {
  const { openModal } = useModals();
  const needs = mockTransactions.filter(t => t.type === 'need');
  const wants = mockTransactions.filter(t => t.type === 'want');

  const totalNeeds = needs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWants = wants.reduce((acc, curr) => acc + curr.amount, 0);

  const getIcon = (category: string) => {
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

  const getColor = (category: string) => {
    switch (category) {
      case 'Housing': return 'bg-blue-100 text-blue-600';
      case 'Utilities': return 'bg-orange-100 text-orange-600';
      case 'Food': return 'bg-green-100 text-green-600';
      case 'Entertainment': return 'bg-purple-100 text-purple-600';
      case 'Lifestyle': return 'bg-pink-100 text-pink-600';
      case 'Shopping': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <main className="pt-24 px-4 md:px-8 max-w-5xl mx-auto space-y-8 pb-32">
      <header className="md:hidden flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold tracking-tighter text-primary font-headline">Expenses</h1>
      </header>

      {/* Search & Filter */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input 
              type="text" 
              placeholder="Search expenses..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>
          <div className="flex gap-2 h-[52px]">
            <button className="flex items-center gap-2 px-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors text-sm font-semibold">
              <Filter className="w-4 h-4" />
              Category
            </button>
            <button className="flex items-center gap-2 px-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors text-sm font-semibold">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold tracking-widest border border-primary/20">
            THIS MONTH
            <X className="w-3 h-3 cursor-pointer" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-[10px] font-bold tracking-widest border border-tertiary/20">
            NEED
            <X className="w-3 h-3 cursor-pointer" />
          </div>
        </div>
      </section>

      {/* Needs Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-headline">Needs</h2>
            <span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold text-outline uppercase tracking-tighter">
              {needs.length} Items
            </span>
          </div>
          <span className="text-lg font-bold font-headline">₹{totalNeeds.toLocaleString()}</span>
        </div>
        
        <div className="space-y-1">
          {needs.map((tx) => {
            const Icon = getIcon(tx.category);
            return (
              <div key={tx.id} className="group flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl hover:bg-surface-container-lowest hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 flex items-center justify-center rounded-xl", getColor(tx.category))}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{tx.name}</p>
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">{tx.category}</span>
                  </div>
                </div>
                <span className="text-lg font-bold font-headline tabular-nums">₹{tx.amount.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-surface-container-high/30 rounded-xl flex justify-center">
          <p className="text-[10px] font-bold tracking-widest text-outline uppercase">Total Needs: ₹{totalNeeds.toLocaleString()}</p>
        </div>
      </section>

      {/* Wants Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-headline">Wants</h2>
            <span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold text-outline uppercase tracking-tighter">
              {wants.length} Items
            </span>
          </div>
          <span className="text-lg font-bold font-headline">₹{totalWants.toLocaleString()}</span>
        </div>
        
        <div className="space-y-1">
          {wants.map((tx) => {
            const Icon = getIcon(tx.category);
            return (
              <div key={tx.id} className="group flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl hover:bg-surface-container-lowest hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 flex items-center justify-center rounded-xl", getColor(tx.category))}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{tx.name}</p>
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">{tx.category}</span>
                  </div>
                </div>
                <span className="text-lg font-bold font-headline tabular-nums">₹{tx.amount.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-surface-container-high/30 rounded-xl flex justify-center">
          <p className="text-[10px] font-bold tracking-widest text-outline uppercase">Total Wants: ₹{totalWants.toLocaleString()}</p>
        </div>
      </section>

      {/* Aura Insight */}
      <div className="bg-secondary-container/20 border border-secondary-container/40 p-4 rounded-2xl flex items-start gap-4">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-1" />
        <div>
          <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-1">Aura Insight</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Your 'Wants' are up by 12% this week. Cutting back on dining could save you ₹3,000 for your "Japan Trip" goal.
          </p>
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => openModal('add-expense')}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-4 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold tracking-wider text-sm">Add Expense</span>
      </button>
    </main>
  );
}
