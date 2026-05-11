import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ShoppingBag, Stars, ArrowRight, Calendar, Sparkles, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useModals } from '../context/ModalContext';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { openModal } = useModals();

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Auras */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary fill-current" />
          <span className="font-headline font-extrabold tracking-tighter text-xl text-primary">Aura</span>
        </div>
        <button onClick={() => navigate('/')} className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors">
          Skip
        </button>
      </header>

      <main className="w-full max-w-2xl z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-tertiary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Concept One</span>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
                Understand your money <br /> in <span className="text-primary">3 buckets</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                {[
                  { title: 'Needs', desc: 'Non-negotiable essentials — rent, groceries, bills', icon: Home, color: 'bg-primary/10 text-primary' },
                  { title: 'Wants', desc: 'Discretionary spending — dining, subscriptions, shopping', icon: ShoppingBag, color: 'bg-secondary-container/20 text-primary' },
                  { title: 'Goals', desc: "Big-ticket items you're saving toward — ₹5,000+", icon: Stars, color: 'bg-tertiary/10 text-tertiary' },
                ].map((bucket) => (
                  <div key={bucket.title} className="glass-card p-8 rounded-3xl flex flex-col items-start text-left gap-4 transition-all hover:scale-[1.02]">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", bucket.color)}>
                      <bucket.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-xl mb-1">{bucket.title}</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{bucket.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Step 2 of 3</span>
              <div className="flex items-center gap-2 py-2 px-4 bg-surface-container-low rounded-full mb-8">
                <Calendar className="w-4 h-4 text-tertiary" />
                <span className="font-headline font-semibold tracking-tight">April 2026</span>
              </div>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
                What's your budget <br /> this month?
              </h1>
              
              <div className="relative group mb-16">
                <div className="flex items-center justify-center text-6xl md:text-8xl font-headline font-extrabold tracking-tighter">
                  <span className="text-on-surface-variant/20 mr-4">₹</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="bg-transparent border-none text-center focus:ring-0 w-[240px] md:w-[400px] p-0 placeholder:text-on-surface-variant/10"
                    autoFocus
                  />
                </div>
                <div className="h-[1px] w-32 mx-auto mt-4 bg-outline-variant group-focus-within:w-64 group-focus-within:bg-primary transition-all duration-700" />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Step 3: Action</span>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Add your first expense or goal
              </h1>
              <p className="text-on-surface-variant text-lg mb-12 max-w-md">
                Let's start populating your ledger. Choose an action to begin your financial journey.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <button 
                  onClick={() => openModal('add-expense')} 
                  className="group relative text-left p-8 glass-card rounded-[32px] transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-12">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline mb-2">Log an expense</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Record a recent purchase, bill, or daily spending.</p>
                </button>
                <button 
                  onClick={() => openModal('add-goal')} 
                  className="group relative text-left p-8 glass-card rounded-[32px] transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all duration-500 mb-12">
                    <Stars className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline mb-2">Create a goal</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Set a target for a new car, vacation, or emergency fund.</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-8 mt-12">
          <button 
            onClick={nextStep}
            className="bg-gradient-to-br from-primary to-primary-container text-white py-5 px-12 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 group"
          >
            {step === 3 ? "Go to Dashboard" : "Continue"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("h-2 rounded-full transition-all duration-500", step === i ? "w-8 bg-primary" : "w-2 bg-surface-dim")} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
