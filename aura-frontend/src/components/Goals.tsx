import React from 'react';
import { Plane, Home, Laptop, Calendar, MoreHorizontal, Sparkles, ChevronDown, Plus, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { mockGoals } from '../data/mockData';
import { useModals } from '../context/ModalContext';

export function Goals() {
  const { openModal } = useModals();

  const getIcon = (category: string) => {
    switch (category) {
      case 'Travel': return Plane;
      case 'Housing': return Home;
      case 'Technology': return Laptop;
      default: return Target;
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'Travel': return 'bg-primary/10 text-primary';
      case 'Housing': return 'bg-tertiary/10 text-tertiary';
      case 'Technology': return 'bg-blue-100 text-blue-600';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">Financial Aspirations</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">Active Goals</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-background bg-surface-container-high flex items-center justify-center text-primary font-bold">
              {mockGoals.length}
            </div>
            <span className="text-on-surface-variant font-medium">ongoing objectives</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {mockGoals.map((goal) => {
            const Icon = getIcon(goal.category);
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            
            return (
              <div key={goal.id} className="glass-card rounded-[32px] p-8 transition-all hover:scale-[1.01] border border-white/20">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", getColor(goal.category))}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-headline">{goal.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider mt-1">
                        In Progress
                      </span>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-stone-300 hover:text-primary cursor-pointer transition-colors" />
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-semibold text-on-surface-variant">
                    <span>{Math.round(progress)}% Achieved</span>
                    <span>₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 py-3 px-4 bg-surface-container-low rounded-xl">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-xs font-medium text-on-surface-variant">
                      Save <span className="text-on-surface font-bold">₹{goal.monthlyTarget.toLocaleString()}/month</span> to reach on time
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-outline block">This month's contribution</label>
                    <button 
                      onClick={() => openModal('goal-details', goal)}
                      className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline underline-offset-4"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-8 pr-4 focus:ring-1 focus:ring-primary focus:bg-white transition-all font-bold outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        // Mock milestone trigger
                        const milestones = [25, 50, 75, 100];
                        const randomMilestone = milestones[Math.floor(Math.random() * milestones.length)];
                        openModal('milestone', {
                          milestone: randomMilestone,
                          goalName: goal.name,
                          saved: goal.currentAmount + 5000,
                          remaining: goal.targetAmount - (goal.currentAmount + 5000),
                          milestoneIndex: milestones.indexOf(randomMilestone) + 1
                        });
                      }}
                      className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-secondary-container/20 border border-secondary-container/30 p-6 rounded-[32px]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Aura Insights</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              Based on your spending patterns this week, you can increase your <span className="font-bold text-on-surface">Europe Trip</span> contribution by <span className="font-bold text-on-surface">₹1,500</span> without affecting your essentials.
            </p>
            <button className="mt-4 text-xs font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
              Optimize Strategy
            </button>
          </div>

          <div className="bg-surface-container-low p-6 rounded-[32px]">
            <h4 className="font-headline font-bold mb-6">Goal Performance</h4>
            <div className="space-y-6">
              {[
                { label: 'Total Value', value: '₹4,85,000' },
                { label: 'Saved so far', value: '₹2,18,250', color: 'text-emerald-600' },
                { label: 'Projected ETA', value: 'Oct 2025' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant">{stat.label}</span>
                  <span className={cn("text-lg font-bold", stat.color || "text-on-surface")}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-48 rounded-[32px] overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/savings/600/400" 
              alt="Savings"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-6">
              <p className="text-white text-sm font-bold">Invest your savings to reach goals 20% faster</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="bg-surface-container-high/40 rounded-[32px] p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-high/60 transition-colors group">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest dark:bg-surface-container-high flex items-center justify-center">
              <Target className="w-5 h-5 text-stone-400 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface-variant">Achieved Goals (2)</h3>
              <p className="text-xs text-on-surface-variant font-medium tracking-tight">MacBook Pro, Emergency Fund</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors pr-4" />
        </div>
      </section>

      <button 
        onClick={() => openModal('add-goal')}
        className="fixed right-6 bottom-24 md:bottom-12 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center active:scale-95 transition-all z-40 group"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </main>
  );
}
