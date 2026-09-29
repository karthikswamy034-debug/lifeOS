import React, { useState } from 'react';
import { 
  Flame, CheckCircle2, Circle, Plus, Award, TrendingUp, 
  Calendar, Code, Dumbbell, BookOpen, Smile, Moon, Sparkles, Trash2, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';

export default function HabitTracker({ habits, setHabits }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Growth');
  const [newHabitTarget, setNewHabitTarget] = useState('Daily');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Toggle habit completion for today
  const handleToggleHabit = (id) => {
    soundEngine.playChime('success');
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextDone = !h.completedToday;
        if (nextDone) {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#10b981', '#06b6d4']
          });
        }
        // Update weekly history for Sunday (today)
        const updatedWeek = [...h.weekHistory];
        updatedWeek[updatedWeek.length - 1] = nextDone;

        return {
          ...h,
          completedToday: nextDone,
          streak: nextDone ? h.streak + 1 : Math.max(0, h.streak - 1),
          weekHistory: updatedWeek
        };
      }
      return h;
    }));
  };

  // Toggle a specific day in the week matrix
  const handleToggleDay = (habitId, dayIdx) => {
    soundEngine.playChime('subtle');
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const updatedWeek = [...h.weekHistory];
        updatedWeek[dayIdx] = !updatedWeek[dayIdx];
        const isToday = dayIdx === updatedWeek.length - 1;
        return {
          ...h,
          weekHistory: updatedWeek,
          completedToday: isToday ? updatedWeek[dayIdx] : h.completedToday
        };
      }
      return h;
    }));
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: 'habit-' + Date.now(),
      name: newHabitName.trim(),
      category: newHabitCategory,
      streak: 1,
      completedToday: true,
      weekHistory: [true, true, false, true, true, false, true],
      monthlyCompletion: 82
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setShowAddModal(false);
    soundEngine.playChime('success');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleDeleteHabit = (id) => {
    if (confirm('Delete this habit tracker?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  // Monthly stats
  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
  const avgMonthlyRate = Math.round(habits.reduce((acc, h) => acc + (h.monthlyCompletion || 80), 0) / habits.length);
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);

  // Habit category icon lookup
  const getIcon = (name) => {
    const l = name.toLowerCase();
    if (l.includes('code') || l.includes('java') || l.includes('dsa')) return <Code className="w-5 h-5 text-emerald-400" />;
    if (l.includes('workout') || l.includes('gym')) return <Dumbbell className="w-5 h-5 text-amber-400" />;
    if (l.includes('read') || l.includes('book')) return <BookOpen className="w-5 h-5 text-cyan-400" />;
    if (l.includes('meditation') || l.includes('breath')) return <Smile className="w-5 h-5 text-purple-400" />;
    if (l.includes('sleep')) return <Moon className="w-5 h-5 text-indigo-400" />;
    return <Sparkles className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* HUD Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" /> High-Performance Consistency
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Habit Discipline Tracker
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mt-1">
            Build unbreakable neural streaks for coding, fitness, deep sleep, and mindfulness in your peaceful nature workspace.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Habit
        </button>
      </div>

      {/* Monthly Analysis Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Streak</span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" /> {maxStreak} Days
            </div>
            <p className="text-xs text-slate-400 mt-1">Consistent daily execution</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Success Rate</span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" /> {avgMonthlyRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Based on 30-day tracking history</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Discipline Status</span>
            <div className="text-2xl font-extrabold text-emerald-300 mt-1">
              Diamond Tier 💎
            </div>
            <p className="text-xs text-slate-400 mt-1">All {habits.length} habits active</p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Habits List with Weekly Progress Heat Matrix */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> Weekly & Daily Progress Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click today's checkmark to log, or toggle individual days</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" /> Done
            <span className="w-3 h-3 rounded-md bg-slate-800 border border-white/10 inline-block ml-2" /> Pending
          </div>
        </div>

        {/* Habit Rows */}
        <div className="space-y-4">
          {habits.map(habit => (
            <div
              key={habit.id}
              className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
            >
              {/* Left: Habit Info & Today's Check */}
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                    habit.completedToday
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  title="Check in for Today"
                >
                  {habit.completedToday ? <Check className="w-5 h-5 stroke-[3]" /> : <Circle className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {getIcon(habit.name)}
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {habit.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {habit.category}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 font-mono text-xs">
                      <Flame className="w-3.5 h-3.5" /> {habit.streak} Day Streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Weekly Days Heat Grid */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                {daysOfWeek.map((day, idx) => {
                  const isDone = habit.weekHistory?.[idx];
                  const isToday = idx === daysOfWeek.length - 1;
                  return (
                    <button
                      key={day}
                      onClick={() => handleToggleDay(habit.id, idx)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                        isToday ? 'ring-1 ring-emerald-400/50' : ''
                      }`}
                      title={`${day}: ${isDone ? 'Completed' : 'Missed'} (Click to toggle)`}
                    >
                      <span className={`text-[10px] font-mono ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                        {day}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                            : 'bg-slate-800/80 border border-white/5 text-transparent hover:border-emerald-500/40'
                        }`}
                      >
                        ✓
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: Monthly Success Rate & Delete */}
              <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Monthly Rate</div>
                  <div className="text-sm font-bold text-white font-mono">{habit.monthlyCompletion || 85}%</div>
                </div>

                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAddHabit} className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Create Habit Routine
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Habit Name</label>
              <input
                type="text"
                placeholder="e.g. 50 LeetCode Practice, Cold Shower, 10k Steps"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Category</label>
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Coding">Coding</option>
                <option value="Workout">Workout</option>
                <option value="Reading">Reading</option>
                <option value="Meditation">Meditation</option>
                <option value="Sleep">Sleep</option>
                <option value="Learning">Learning Goals</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Start Habit Streak
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
