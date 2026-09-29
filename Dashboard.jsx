import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, Flame, Sparkles, TrendingUp, 
  Calendar, ArrowUpRight, Plus, Trash2, Check, Star, ShieldCheck,
  BookOpen, Brain, Zap, Target, Award, PlayCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';

export default function Dashboard({
  tasks,
  setTasks,
  habits,
  setHabits,
  onNavigate,
  onSelectDocument,
  documents
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Java');
  const [taskFilter, setTaskFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Greeting based on time of day
  const hour = currentTime.getHours();
  let greeting = 'Good Morning';
  let greetingSub = 'Ready to conquer today\'s milestones?';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
    greetingSub = 'Keep up the focused momentum!';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good Evening';
    greetingSub = 'Time to reflect, revise, and unwind.';
  } else if (hour >= 22 || hour < 5) {
    greeting = 'Restful Night';
    greetingSub = 'Peaceful atmosphere for quiet reflection or deep rest.';
  }

  // Toggle task completion
  const handleToggleTask = (id) => {
    soundEngine.playChime('success');
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = !t.completed;
        if (nextDone) {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.7 },
            colors: ['#4ade80', '#38bdf8', '#fbbf24']
          });
        }
        return { ...t, completed: nextDone };
      }
      return t;
    }));
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: 'task-' + Date.now(),
      text: newTaskText.trim(),
      category: newTaskCategory,
      priority: 'high',
      completed: false,
      date: 'Today'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    soundEngine.playChime('subtle');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Quick toggle habit from dashboard
  const handleQuickHabit = (id) => {
    soundEngine.playChime('success');
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextDone = !h.completedToday;
        if (nextDone) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#06b6d4', '#f59e0b']
          });
        }
        return {
          ...h,
          completedToday: nextDone,
          streak: nextDone ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  // Productivity calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const habitPct = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const productivityScore = Math.min(100, Math.round(taskPct * 0.6 + habitPct * 0.4));

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Top Banner / Hero HUD Greeting */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-emerald-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LifeOS Jarvis Assistant Active
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {greeting} <span className="inline-block animate-waving-hand">👋</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              {greetingSub} All environmental systems, notes vaults, and study targets are synchronized.
            </p>
          </div>

          {/* Futuristic Clock & Live Weather HUD */}
          <div className="glass-panel-subtle p-4 sm:p-5 rounded-2xl flex items-center gap-5 border border-white/10 self-start md:self-auto">
            <div className="p-3 rounded-xl bg-slate-800/80 text-emerald-400 border border-white/5">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-emerald-400/80 font-medium">· 22°C Clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Morning Briefing / Suggestion Card */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">AI Suggestion of the Hour</span>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                "Optimal cognitive focus window detected. Revise your <strong className="text-emerald-300 font-semibold cursor-pointer underline" onClick={() => onNavigate('vault')}>Operating Systems Deadlock notes</strong> before your afternoon Java practice."
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('assistant')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all shrink-0"
          >
            <Brain className="w-4 h-4" /> Ask AI Mentor
          </button>
        </div>
      </div>

      {/* Grid: 3 Metric Cards (Productivity Score, Goals, Streaks) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Productivity Score Ring */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Productivity Score
            </span>
            <div className="text-4xl font-extrabold text-white mt-2 flex items-baseline gap-1">
              <span>{productivityScore}%</span>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12% today
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {completedTasks} of {totalTasks} tasks done · {completedHabits}/{totalHabits} habits
            </p>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${productivityScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* 2. Daily Goals Progress */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" /> Daily Target Goals
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{Math.round(taskPct)}%</span>
            </div>

            <div className="space-y-3 mt-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Task Execution</span>
                  <span className="text-slate-400">{completedTasks}/{totalTasks}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-700" 
                    style={{ width: `${taskPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Habit Routine</span>
                  <span className="text-slate-400">{completedHabits}/{totalHabits}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700" 
                    style={{ width: `${habitPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Complete 2 more tasks to hit 100% daily goal!
          </div>
        </div>

        {/* 3. Habit Streaks Preview */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Habit Streaks
            </span>
            <button 
              onClick={() => onNavigate('habits')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {habits.slice(0, 3).map(h => (
              <div 
                key={h.id}
                onClick={() => handleQuickHabit(h.id)}
                className={`p-2.5 rounded-2xl border cursor-pointer transition-all text-center ${
                  h.completedToday
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-900/30'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> {h.streak}d
                </div>
                <div className="text-[11px] font-medium truncate mt-0.5">{h.name}</div>
                <div className="mt-1 text-[10px] font-semibold">
                  {h.completedToday ? '✓ Done' : 'Tap to Log'}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            🔥 Highest Active: <strong>{Math.max(...habits.map(h => h.streak), 0)} Days Continuous</strong>
          </p>
        </div>
      </div>

      {/* Main Section: Today's Focus & Important Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Checklist */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Today's Focus & Critical Tasks
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">High-priority actionable items for today</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/5">
              {['all', 'pending', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    taskFilter === f
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Add Task Input */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Add new task (e.g. Solve 2 LeetCode questions, Read OS chapter 3)..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1 bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="bg-slate-900/70 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Java">Java</option>
              <option value="DSA">DSA</option>
              <option value="College">College</option>
              <option value="Health">Health</option>
              <option value="Career">Career</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No tasks found in this view.
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                    task.completed
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400'
                      : 'bg-slate-900/50 border-white/5 hover:border-emerald-500/30 text-slate-200'
                  }`}
                >
                  <div 
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className={`p-1 rounded-lg transition-colors ${
                      task.completed ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 group-hover:text-emerald-400'
                    }`}>
                      {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>

                    <div className="space-y-0.5">
                      <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-white/5">
                          {task.category}
                        </span>
                        {task.priority === 'urgent' && (
                          <span className="text-[10px] text-rose-400 font-bold">● Urgent</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 transition-all rounded-lg hover:bg-slate-800"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Weekly Productivity Charts & Document Quick Links */}
        <div className="space-y-6">
          {/* Animated Weekly Productivity Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Weekly Momentum
              </h3>
              <span className="text-[11px] text-emerald-400 font-medium">Avg 4.8 hrs/day</span>
            </div>

            {/* Interactive SVG Bar Chart */}
            <div className="h-36 flex items-end justify-between gap-2 pt-6">
              {[
                { day: 'Mon', hours: 4.2, pct: 70 },
                { day: 'Tue', hours: 5.5, pct: 90 },
                { day: 'Wed', hours: 3.8, pct: 62 },
                { day: 'Thu', hours: 6.0, pct: 98 },
                { day: 'Fri', hours: 4.8, pct: 80 },
                { day: 'Sat', hours: 5.2, pct: 86 },
                { day: 'Sun', hours: 4.0, pct: 68, active: true },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        item.active 
                          ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]' 
                          : 'bg-emerald-600/50 group-hover:bg-emerald-500'
                      }`}
                      style={{ height: `${item.pct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${item.active ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access to College & Career Documents */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Knowledge Vault Quick Open
              </h3>
              <button
                onClick={() => onNavigate('vault')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Vault →
              </button>
            </div>

            <div className="space-y-2">
              {documents.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(doc);
                    onNavigate('pdf-ai');
                  }}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{doc.pages} pages · {doc.folder}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 font-bold transition-all shrink-0">
                    Ask AI
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
