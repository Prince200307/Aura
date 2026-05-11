import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Expenses } from './components/Expenses';
import { Goals } from './components/Goals';
import { Insights } from './components/Insights';
import { History } from './components/History';

import { Onboarding } from './components/Onboarding';
import { ModalProvider } from './context/ModalContext';
import { GlobalModals } from './components/GlobalModals';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ModalProvider>
        <Router>
          <div className="min-h-screen bg-background pb-safe transition-colors duration-300">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/*" element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/history" element={<History />} />
                </Routes>
              </>
            } />
          </Routes>
          <GlobalModals />
        </div>
      </Router>
      </ModalProvider>
    </ThemeProvider>
  );
}
