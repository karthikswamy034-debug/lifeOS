import React, { useState } from 'react';
import { 
  Calendar, BookOpen, Clock, Sparkles, CheckCircle2, Circle, 
  Plus, Trash2, ArrowRight, Zap, Target, Bell, AlertCircle, ChevronDown, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';

export default function StudyPlanner({
  subjects,
  setSubjects,
  onAddTaskToDashboard
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub-1');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubExamDays, setNewSubExamDays] = useState(30);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Toggle syllabus module completion
  const handleToggleModule = (subId, modId) => {
    soundEngine.playChime('success');
    setSubjects(prev => prev.map(s => {
      if (s.id === subId) {
        const updatedMods = s.modules.map(m => m.id === modId ? { ...m, completed: !m.completed } : m);
        const compCount = updatedMods.filter(m => m.completed).length;
        const progress = Math.round((compCount / updatedMods.length) * 100);
        return { ...s, modules: updatedMods, progress };
      }
      return s;
    }));
  };

  // Add new subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSub = {
      id: 'sub-' + Date.now(),
      name: newSubName.trim(),
      examDaysLeft: parseInt(newSubExamDays, 10) || 30,
      targetHours: 35,
      progress: 0,
      modules: [
        { id: 'm1', name: 'Module 1: Foundations & Core Theorems', completed: false },
        { id: 'm2', name: 'Module 2: Practical Problem Solving', completed: false },
        { id: 'm3', name: 'Module 3: Advanced Architectures', completed: false },
        { id: 'm4', name: 'Module 4: Past University Papers & Mocks', completed: false }
      ],
      aiSchedule: [
        { phase: 'Day 1–7', topic: 'Core Foundations & Definitions', status: 'Upcoming' },
        { phase: 'Day 8–15', topic: 'Intermediate Applications & Numericals', status: 'Upcoming' },
        { phase: 'Day 16–23', topic: 'Complex Problem Scenarios', status: 'Upcoming' },
        { phase: 'Day 24–30', topic: 'Timed Mocks & Spaced Repetition', status: 'Upcoming' }
      ]
    };

    setSubjects([...subjects, newSub]);
    setSelectedSubjectId(newSub.id);
    setNewSubName('');
    setShowAddSubject(false);
    soundEngine.playChime('success');
  };

  // Generate / Regenerate AI Study Schedule
  const handleGenerateAiSchedule = () => {
    setIsGeneratingSchedule(true);
    soundEngine.playChime('subtle');

    setTimeout(() => {
      let customSchedule = [];
      if (currentSubject.name.toLowerCase().includes('data structure') || currentSubject.name.toLowerCase().includes('dsa')) {
        customSchedule = [
          { phase: 'Day 1–5', topic: 'Arrays, Two Pointers, Strings & Sliding Window', status: 'Active' },
          { phase: 'Day 6–10', topic: 'Linked Lists (Reverse, Fast/Slow pointers) & Stacks/Queues', status: 'Upcoming' },
          { phase: 'Day 11–15', topic: 'Binary Trees, BST Traversals & LCA', status: 'Upcoming' },
          { phase: 'Day 16–20', topic: 'Graphs (BFS, DFS, Dijkstra, Kahn\'s Topological Sort)', status: 'Upcoming' },
          { phase: 'Day 21–25', topic: 'Dynamic Programming (Knapsack, LCS, LIS Patterns)', status: 'Upcoming' },
          { phase: 'Day 26–30', topic: 'Full LeetCode/Exam Mocks & Time Complexity Review', status: 'Upcoming' }
        ];
      } else if (currentSubject.name.toLowerCase().includes('operating system')) {
        customSchedule = [
          { phase: 'Day 1–5', topic: 'Process Management, PCB, Context Switching & CPU Scheduling', status: 'Active' },
          { phase: 'Day 6–10', topic: 'Process Synchronization, Critical Section & Semaphores', status: 'Upcoming' },
          { phase: 'Day 11–15', topic: 'Deadlocks: 4 Coffman Conditions, Banker\'s Algorithm & RAG', status: 'Upcoming' },
          { phase: 'Day 16–20', topic: 'Memory Management: Paging, TLB, Page Tables & Inverted Paging', status: 'Upcoming' },
          { phase: 'Day 21–25', topic: 'Virtual Memory, Thrashing & Page Replacement (FIFO, LRU, Clock)', status: 'Upcoming' },
          { phase: 'Day 26–30', topic: 'File Systems, Disk Scheduling (SCAN, C-LOOK) & Past Papers', status: 'Upcoming' }
        ];
      } else {
        customSchedule = [
          { phase: 'Day 1–6', topic: `Fundamental Architecture & Concepts of ${currentSubject.name}`, status: 'Active' },
          { phase: 'Day 7–13', topic: 'Deep Dive: Core Principles & Practical Exercises', status: 'Upcoming' },
          { phase: 'Day 14–20', topic: 'System Implementation & Complex Case Studies', status: 'Upcoming' },
          { phase: 'Day 21–25', topic: 'Past Exam Question Solving & Numerical Drills', status: 'Upcoming' },
          { phase: 'Day 26–30', topic: 'Speed Revision with Flashcards & Formula Sheets', status: 'Upcoming' }
        ];
      }

      setSubjects(prev => prev.map(s => s.id === currentSubject.id ? { ...s, aiSchedule: customSchedule } : s));
      setIsGeneratingSchedule(false);
      soundEngine.playChime('success');
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 700);
  };

  // Push target to dashboard
  const handlePushToTasks = (phaseTopic) => {
    onAddTaskToDashboard({
      id: 'task-' + Date.now(),
      text: `${currentSubject.name}: ${phaseTopic}`,
      category: 'College',
      priority: 'urgent',
      completed: false,
      date: 'Today'
    });
    soundEngine.playChime('success');
    alert(`Added "${phaseTopic}" to your Today's Focus checklist!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* HUD Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" /> Smart Study Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Study Planner & Exam Countdown
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mt-1">
            Automated syllabus tracking, spaced repetition schedules, and daily AI targets tailored to exam deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubject(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Subject Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(sub => {
          const isSelected = sub.id === currentSubject.id;
          return (
            <div
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel border-emerald-500/50 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                  : 'glass-panel-subtle border-white/5 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2 font-mono">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    sub.examDaysLeft <= 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {sub.examDaysLeft} Days to Exam
                  </span>
                  <span className="text-slate-400 font-bold">{sub.progress}%</span>
                </div>
                <h3 className="text-base font-bold text-white truncate">{sub.name}</h3>
              </div>

              <div className="mt-4">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Subject Workspace: Syllabus Modules & AI Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Syllabus Modules Checklist */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Syllabus Modules
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Click to check off completed units</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {currentSubject.modules?.filter(m => m.completed).length} / {currentSubject.modules?.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {currentSubject.modules?.map(mod => (
              <div
                key={mod.id}
                onClick={() => handleToggleModule(currentSubject.id, mod.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 group ${
                  mod.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                    : 'bg-slate-900/60 border-white/5 hover:border-emerald-500/30 text-slate-200'
                }`}
              >
                <div className={`mt-0.5 transition-colors ${
                  mod.completed ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'
                }`}>
                  {mod.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-medium leading-relaxed ${mod.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {mod.name}
                </span>
              </div>
            ))}
          </div>

          {/* Revision Reminders (Spaced Repetition) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 mt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Bell className="w-3.5 h-3.5" /> Spaced Repetition Alert
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Day 7 Review: Revise <strong>{currentSubject.name} Module 1 flashcards</strong> today for 15 mins to lock into long-term recall.
            </p>
          </div>
        </div>

        {/* Right 2 Cols: AI Master Study Schedule */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">AI Master Study Schedule</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {currentSubject.examDaysLeft}-Day AI Target
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: {currentSubject.name} · Optimized pace for top grades
              </p>
            </div>

            <button
              onClick={handleGenerateAiSchedule}
              disabled={isGeneratingSchedule}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingSchedule ? 'Calculating Optimal Schedule...' : 'Regenerate AI Schedule'}</span>
            </button>
          </div>

          {/* Schedule Breakdown Timeline Cards */}
          <div className="space-y-3">
            {currentSubject.aiSchedule?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5 text-emerald-400 font-mono text-xs font-bold shrink-0">
                    {item.phase}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {item.topic}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: 90 mins daily focus · 2 practice problems
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handlePushToTasks(item.topic)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
                  title="Push to Today's Tasks checklist"
                >
                  <Plus className="w-3.5 h-3.5" /> Push to Today
                </button>
              </div>
            ))}
          </div>

          {/* Daily Guidance Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <strong>Next Milestone:</strong> Finish <strong>Linked Lists cycle detection</strong> before Friday to stay 2 days ahead of schedule.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAddSubject} className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add Academic Subject
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Subject Title</label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems, Computer Architecture"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Days Until Exam</label>
              <input
                type="number"
                min="1"
                max="365"
                value={newSubExamDays}
                onChange={(e) => setNewSubExamDays(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSubject(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Save Subject
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
