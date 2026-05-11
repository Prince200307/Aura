import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ReceiptText, Target, Sparkles, History, Wallet, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/expenses', icon: ReceiptText, label: 'Expenses' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/insights', icon: Sparkles, label: 'Insights' },
    { to: '/history', icon: History, label: 'History' },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="fixed top-0 w-full h-[64px] z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant hidden md:block">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter text-primary font-headline">Aura</span>
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-on-surface-variant" /> : <Sun className="w-5 h-5 text-on-surface-variant" />}
            </button>
            <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
              <Wallet className="w-5 h-5 text-primary" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcAJwJme4U5ufre3625SbCLs31mdOWRjyb2ykjEq1J0tjzBAbiWICxVc6QfltIo14q8OKYd5PLiZICNEDEd7IdfmujHYV2yITMDwGEs82S4nNh_CU8bpr4W8PIQaZYf0YFdaWA6t2sJ91xgNdAPUzaLITRUDb9Q7n5I0s8-jE5zq7D5Ptlw85yrZEHWVqzqdldspubFrROgrDQMPZBm7ajS094odlKXVZ5UjYWxSB-dsOPzdBjo4ia3DZ_3MFQ5MjOWMvgHMOmkyA" 
                alt="Profile"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-[60]">
        <button 
          onClick={toggleTheme}
          className="p-3 bg-background/80 backdrop-blur-lg border border-outline-variant rounded-full shadow-lg transition-all active:scale-90"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 text-on-surface-variant" /> : <Sun className="w-5 h-5 text-on-surface-variant" />}
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full h-[64px] bg-background/90 backdrop-blur-md border-t border-outline-variant md:hidden z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-full px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-on-surface-variant"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
