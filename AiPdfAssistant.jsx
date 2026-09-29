import React, { useState } from 'react';
import { 
  FileText, Brain, Sparkles, BookOpen, Layers, HelpCircle, 
  ChevronRight, ArrowRight, RotateCw, Check, Copy, Send, 
  Award, Zap, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export default function AiPdfAssistant({
  documents,
  selectedDoc,
  setSelectedDoc,
  onNavigate
}) {
  const currentDoc = selectedDoc || documents.find(d => d.id === 'doc-os') || documents[0];
  const [activeTab, setActiveTab] = useState('explain'); // 'explain', 'summary', 'questions', 'flashcards', 'qa'
  const [customQuestion, setCustomQuestion] = useState('Explain deadlock from my OS notes');
  const [qaHistory, setQaHistory] = useState([
    {
      q: 'Explain deadlock from my OS notes',
      a: `### 🔒 Deadlock Explanation (Extracted from ${currentDoc?.name || 'Operating Systems.pdf'})

#### 1. What is a Deadlock?
A deadlock occurs when a set of concurrent processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process in the set.

#### 2. The Four Necessary Coffman Conditions:
1. **Mutual Exclusion:** Resources cannot be shared simultaneously.
2. **Hold and Wait:** Process holds resource $R_1$ while waiting for $R_2$.
3. **No Preemption:** Resources can only be released voluntarily.
4. **Circular Wait:** Closed chain $P_0 \\rightarrow P_1 \\rightarrow P_2 \\dots \\rightarrow P_0$.

#### 3. Handling in Operating Systems:
* **Prevention:** Eliminate circular wait by global resource ordering.
* **Avoidance:** Banker's Algorithm ensures safe states before allocation.
* **Detection & Recovery:** Resource Allocation Graph cycle detection.`
    }
  ]);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  const flashcards = currentDoc?.flashcards || [
    { q: 'What is the primary topic of this document?', a: 'Extracted directly from uploaded lecture material.' }
  ];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIdx((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIdx((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleCustomQa = (e) => {
    e.preventDefault();
    if (!customQuestion.trim() || isAnswering) return;

    soundEngine.playChime('subtle');
    setIsAnswering(true);
    const qText = customQuestion.trim();
    setCustomQuestion('');

    setTimeout(() => {
      let answer = '';
      const lower = qText.toLowerCase();

      if (lower.includes('deadlock')) {
        answer = `### 🔒 Deadlock Analysis for ${currentDoc.name}
Extracted from Unit 3 of your notes:
* **Definition:** Permanent block when processes mutually hold and wait for resources.
* **The 4 Conditions:** Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
* **Solution:** Banker's Algorithm prevents unsafe states; ordered resource acquisition eliminates circular wait.`;
      } else if (lower.includes('banker')) {
        answer = `### 🏦 Banker's Algorithm (Avoidance Mechanism)
* **Goal:** Test whether granting a resource request keeps the system in a **Safe State**.
* **Formula:** Need Matrix = Max - Allocation.
* If Available >= Need, execute process, release its allocation back to Available. If a full sequence finishes, the state is safe.`;
      } else if (lower.includes('summary') || lower.includes('summarize')) {
        answer = `### 📑 Document Summary: ${currentDoc.name}
${currentDoc.summary}
Key concepts covered include foundational architecture, memory/storage allocation, and algorithm guarantees.`;
      } else {
        answer = `### 📖 AI Answer from ${currentDoc.name}
Regarding *"**${qText}**"*:
Based on the sections in **${currentDoc.name}**, this topic is essential for conceptual clarity and exam numericals. The notes emphasize understanding time/space trade-offs and structural invariants.`;
      }

      setQaHistory(prev => [{ q: qText, a: answer }, ...prev]);
      setIsAnswering(false);
      soundEngine.playChime('success');
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> AI Document Copilot
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            AI PDF Assistant
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mt-1">
            Deep interrogation of uploaded lecture notes, resume, or plans. Generate flashcards, explain deadlocks, and solve past exam questions.
          </p>
        </div>

        {/* Document Selector Dropdown */}
        <div className="glass-panel-subtle p-3 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Document</div>
            <select
              value={currentDoc?.id}
              onChange={(e) => {
                const found = documents.find(d => d.id === e.target.value);
                if (found) setSelectedDoc(found);
              }}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer pr-4"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {d.name} ({d.folder})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 glass-panel rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
        {[
          { id: 'explain', label: 'Explain Difficult Topic', icon: Zap },
          { id: 'summary', label: 'Chapter Summary', icon: BookOpen },
          { id: 'questions', label: 'Exam Questions', icon: HelpCircle },
          { id: 'flashcards', label: 'Smart Flashcards', icon: Layers },
          { id: 'qa', label: 'Ask Anything', icon: Brain },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Explain Difficult Topic */}
      {activeTab === 'explain' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Deep Conceptual Explanations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Select a core topic from {currentDoc.name} for high-yield simplification</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {currentDoc.tags?.join(' · ')}
              </span>
            </div>
          </div>

          {/* Quick topic buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'Deadlock & Coffman 4 Conditions', tag: 'OS Core' },
              { title: 'Banker\'s Algorithm Safe Sequence', tag: 'Avoidance' },
              { title: 'Critical Section & Semaphores', tag: 'Concurrency' },
              { title: 'Virtual Memory Paging & TLB', tag: 'Memory' },
            ].map((topic, i) => (
              <button
                key={i}
                onClick={() => {
                  setCustomQuestion(`Explain ${topic.title} from my ${currentDoc.name}`);
                  setActiveTab('qa');
                }}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/40 text-left transition-all group hover:bg-slate-800/60"
              >
                <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase">{topic.tag}</div>
                <div className="text-xs font-semibold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {topic.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explain now <ChevronRight className="w-3 h-3 text-emerald-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Detailed explanation card */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Coffman Deadlock Conditions Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300">1. Mutual Exclusion</span>
                <p className="text-slate-400">At least one resource must be non-shareable. Only one process can use it at any instant.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300">2. Hold & Wait</span>
                <p className="text-slate-400">A process holds allocated resources while waiting for another unavailable resource.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300">3. No Preemption</span>
                <p className="text-slate-400">Resources cannot be forcibly seized from a holding process; only released willingly.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300">4. Circular Wait</span>
                <p className="text-slate-400">Closed cycle of dependency exists where P0 waits for P1, and P1 waits for P0.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Chapter Summary */}
      {activeTab === 'summary' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" /> Executive Document Summary
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentDoc.name} · {currentDoc.pages} Pages Analyzed</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentDoc.content);
                soundEngine.playChime('success');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Summary
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-slate-200 text-sm leading-relaxed">
            <h3 className="font-bold text-cyan-300 mb-2">High-Density Overview:</h3>
            <p>{currentDoc.summary}</p>
          </div>

          {/* Chapter Outline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chapter & Section Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Unit 1: Process Architecture & Scheduling', pts: 'PCB, Context Switching, FCFS vs SJF vs Round Robin' },
                { title: 'Unit 2: Critical Section & Concurrency', pts: 'Mutual Exclusion, Progress, Bounded Waiting, Semaphores' },
                { title: 'Unit 3: Deadlock Mechanics & Banker\'s', pts: '4 Coffman Conditions, Resource Allocation Graph, Safe States' },
                { title: 'Unit 4: Virtual Memory Management', pts: 'Paging, Translation Lookaside Buffer (TLB), LRU Page Faults' }
              ].map((ch, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-xs font-bold text-white">{ch.title}</div>
                  <div className="text-[11px] text-slate-400">{ch.pts}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Exam Questions */}
      {activeTab === 'questions' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" /> High-Yield University Exam Questions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Predicted exam and interview questions with solution hints</p>
          </div>

          <div className="space-y-4">
            {(currentDoc.examQuestions || []).map((q, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/20 transition-all space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">Question #{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[10px]">
                    {q.marks || 10} Marks
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white leading-snug">{q.question}</h4>
                {q.hint && (
                  <div className="p-3 rounded-xl bg-slate-800/60 text-xs text-slate-400 border border-white/5 flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">💡 Solution Approach:</span>
                    <span>{q.hint}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> Active Recall Flashcards
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Spaced repetition for long-term memory retention</p>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400">
              Card {flashcardIdx + 1} of {flashcards.length}
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div className="max-w-xl mx-auto">
            <div
              onClick={() => {
                soundEngine.playChime('subtle');
                setIsFlipped(!isFlipped);
              }}
              className={`w-full min-h-[260px] p-8 rounded-3xl cursor-pointer border transition-all duration-500 flex flex-col justify-between shadow-2xl relative select-none ${
                isFlipped
                  ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500/50 shadow-emerald-900/30'
                  : 'bg-gradient-to-br from-slate-900 to-cyan-950/70 border-cyan-500/40 shadow-cyan-900/30'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className={isFlipped ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                  {isFlipped ? 'ANSWER' : 'QUESTION'}
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <RotateCw className="w-3 h-3" /> Click to flip
                </span>
              </div>

              <div className="my-auto py-4 text-center">
                <p className={`text-base sm:text-lg font-semibold leading-relaxed ${isFlipped ? 'text-emerald-200' : 'text-white'}`}>
                  {isFlipped ? flashcards[flashcardIdx]?.a : flashcards[flashcardIdx]?.q}
                </p>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-mono">
                {isFlipped ? 'Great job! Hit next when ready.' : 'Think of your answer before flipping!'}
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => {
                  confetti({
                    particleCount: 25,
                    spread: 45,
                    origin: { y: 0.6 }
                  });
                  soundEngine.playChime('success');
                  handleNextCard();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <span>Mastered & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Ask Anything (Q&A) */}
      {activeTab === 'qa' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" /> Interrogate {currentDoc.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask any specific question directly against this document's text
            </p>
          </div>

          {/* Ask Form */}
          <form onSubmit={handleCustomQa} className="flex gap-2">
            <input
              type="text"
              placeholder={`Ask a question (e.g. "Explain deadlock from my OS notes")...`}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isAnswering}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-40"
            >
              <span>{isAnswering ? 'Searching...' : 'Ask Doc'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Q&A History */}
          <div className="space-y-4">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
                <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <span className="p-1 rounded bg-cyan-500/20">Q:</span>
                  <span className="font-bold text-white text-sm">{item.q}</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-cyan-500/30">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
