import React, { useState } from 'react';
import { 
  Compass, LayoutDashboard, Brain, BookOpen, Layers, 
  Calendar, Flame, Shield, Sparkles, Moon, Sun, 
  Menu, X, Sliders, Volume2, HardDrive
} from 'lucide-react';
import SoundscapeController from './SoundscapeController';

export default function Navbar({
  currentTab,
  setCurrentTab,
  theme,
  setTheme,
  onOpenSecurity,
  user
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundMixerOpen, setSoundMixerOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: Brain },
    { id: 'vault', label: 'PDF Vault', icon: BookOpen },
    { id: 'pdf-ai', label: 'AI PDF Analyst', icon: Sparkles },
    { id: 'study', label: 'Study Planner', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: Flame },
  ];

  const themes = [
    { id: 'twilight', name: 'Twilight Valley' },
    { id: 'aurora', name: 'Starry Aurora' },
    { id: 'sunset', name: 'Sunset Glow' },
  ];

  return (
    <>
      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto glass-panel px-4 sm:px-6 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-mono">LifeOS</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
                Nature Sanctuary · Jarvis Co-pilot
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-white/5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Soundscape Mixer, Theme Switcher, User Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Soundscape Mixer Pill */}
            <SoundscapeController
              isExpanded={soundMixerOpen}
              setIsExpanded={setSoundMixerOpen}
            />

            {/* Atmosphere Theme Switcher */}
            <div className="hidden sm:flex items-center bg-slate-900/60 rounded-full border border-white/5 p-1">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                    theme === t.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={t.name}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* User Profile / Security Trigger */}
            <button
              onClick={onOpenSecurity}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/40 transition-all text-xs text-slate-200"
              title="Vault Security & Profile"
            >
              <span className="hidden md:inline font-medium text-xs text-slate-300">{user?.name?.split(' ')[0]}</span>
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-[11px] flex items-center justify-center">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-2 animate-in fade-in duration-200">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for quick thumb navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/85 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex justify-around">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
