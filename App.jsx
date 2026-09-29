import React, { useState, useEffect } from 'react';
import NatureBackground from './components/NatureBackground';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AiAssistant from './components/AiAssistant';
import KnowledgeVault from './components/KnowledgeVault';
import AiPdfAssistant from './components/AiPdfAssistant';
import StudyPlanner from './components/StudyPlanner';
import HabitTracker from './components/HabitTracker';
import SecurityModal from './components/SecurityModal';
import { INITIAL_DOCUMENTS, INITIAL_FOLDERS } from './services/vaultData';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('twilight'); // 'twilight', 'aurora', 'sunset'
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  // User Profile State
  const [user, setUser] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@lifeos.internal',
    title: 'Software Engineer & Scholar'
  });

  // AI API configuration
  const [apiKey, setApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState('mock'); // 'mock', 'gemini', 'openai'
  const [cloudSync, setCloudSync] = useState(false);

  // 1. Tasks State (Pre-populated with user's requested tasks)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lifeos_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 't1', text: 'Complete Java practice', category: 'Java', priority: 'urgent', completed: false, date: 'Today' },
      { id: 't2', text: 'Solve DSA problems', category: 'DSA', priority: 'high', completed: false, date: 'Today' },
      { id: 't3', text: 'Workout', category: 'Health', priority: 'high', completed: true, date: 'Today' },
      { id: 't4', text: 'Revise college notes', category: 'College', priority: 'high', completed: false, date: 'Today' },
      { id: 't5', text: 'Review Operating Systems Deadlock chapter', category: 'College', priority: 'normal', completed: true, date: 'Today' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 2. Habits State (Pre-populated with Coding, Workout, Reading, Meditation, Sleep, Learning)
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('lifeos_habits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'h1', name: 'Coding', category: 'Engineering', streak: 14, completedToday: true, weekHistory: [true, true, true, true, true, true, true], monthlyCompletion: 92 },
      { id: 'h2', name: 'Workout', category: 'Fitness', streak: 8, completedToday: true, weekHistory: [true, false, true, true, true, false, true], monthlyCompletion: 80 },
      { id: 'h3', name: 'Reading', category: 'Mindset', streak: 21, completedToday: false, weekHistory: [true, true, true, true, false, true, false], monthlyCompletion: 86 },
      { id: 'h4', name: 'Meditation', category: 'Mental Health', streak: 12, completedToday: true, weekHistory: [true, true, true, true, true, true, true], monthlyCompletion: 94 },
      { id: 'h5', name: 'Sleep (7.5h+)', category: 'Recovery', streak: 9, completedToday: true, weekHistory: [true, true, false, true, true, true, true], monthlyCompletion: 84 },
      { id: 'h6', name: 'Learning Goals', category: 'Academics', streak: 18, completedToday: false, weekHistory: [true, true, true, true, true, true, false], monthlyCompletion: 88 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('lifeos_habits', JSON.stringify(habits));
  }, [habits]);

  // 3. Documents & Knowledge Vault State
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('lifeos_docs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DOCUMENTS;
  });

  useEffect(() => {
    localStorage.setItem('lifeos_docs', JSON.stringify(documents));
  }, [documents]);

  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);

  // 4. Subjects & Study Planner State
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('lifeos_subjects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'sub-dsa',
        name: 'Data Structures & Algorithms',
        examDaysLeft: 30,
        progress: 65,
        targetHours: 40,
        modules: [
          { id: 'm1', name: 'Arrays, Two Pointers & Sliding Window', completed: true },
          { id: 'm2', name: 'Linked Lists & Floyd\'s Cycle Detection', completed: true },
          { id: 'm3', name: 'Binary Trees, BSTs & Traversals', completed: false },
          { id: 'm4', name: 'Graphs: BFS, DFS & Dijkstra\'s Shortest Path', completed: false },
          { id: 'm5', name: 'Dynamic Programming: Knapsack & Subsequences', completed: false }
        ],
        aiSchedule: [
          { phase: 'Day 1–5', topic: 'Arrays and Strings (Sliding Window & Two Pointers)', status: 'Done' },
          { phase: 'Day 6–10', topic: 'Linked Lists (Reverse in O(1) space & fast/slow pointers)', status: 'Active' },
          { phase: 'Day 11–15', topic: 'Trees (BST, Inorder, Preorder, Postorder, AVL)', status: 'Upcoming' },
          { phase: 'Day 16–20', topic: 'Graphs (BFS, DFS, Dijkstra, Topological Sort)', status: 'Upcoming' },
          { phase: 'Day 21–25', topic: 'Dynamic Programming (0/1 Knapsack, LCS, LIS)', status: 'Upcoming' },
          { phase: 'Day 26–30', topic: 'Full-length Mock Exams & Timed Revision', status: 'Upcoming' }
        ]
      },
      {
        id: 'sub-os',
        name: 'Operating Systems',
        examDaysLeft: 22,
        progress: 50,
        targetHours: 30,
        modules: [
          { id: 'os-m1', name: 'Process Scheduling (FCFS, SJF, Round Robin)', completed: true },
          { id: 'os-m2', name: 'Process Synchronization & Semaphores', completed: true },
          { id: 'os-m3', name: 'Deadlocks (4 Coffman Conditions & Banker\'s Algorithm)', completed: false },
          { id: 'os-m4', name: 'Memory Management (Paging, TLB & Virtual Memory)', completed: false }
        ],
        aiSchedule: [
          { phase: 'Day 1–5', topic: 'Process Management, PCB & CPU Scheduling', status: 'Done' },
          { phase: 'Day 6–10', topic: 'Process Synchronization, Critical Section & Semaphores', status: 'Done' },
          { phase: 'Day 11–15', topic: 'Deadlocks: 4 Conditions, Banker\'s Algorithm & RAG', status: 'Active' },
          { phase: 'Day 16–20', topic: 'Memory Paging, TLB, Page Replacement (LRU, Clock)', status: 'Upcoming' },
          { phase: 'Day 21–22', topic: 'Past Exam Numerical Drills & Flashcard Recall', status: 'Upcoming' }
        ]
      },
      {
        id: 'sub-sec',
        name: 'Cyber Security',
        examDaysLeft: 42,
        progress: 35,
        targetHours: 25,
        modules: [
          { id: 'sec-m1', name: 'The CIA Triad & Cryptographic Hash Functions', completed: true },
          { id: 'sec-m2', name: 'Symmetric (AES) vs Asymmetric (RSA) Encryption', completed: false },
          { id: 'sec-m3', name: 'OWASP Top 10 Web Vulnerabilities (SQLi, XSS, CSRF)', completed: false }
        ],
        aiSchedule: [
          { phase: 'Day 1–10', topic: 'Security Architecture & CIA Triad Fundamentals', status: 'Done' },
          { phase: 'Day 11–22', topic: 'Modern Cryptography: RSA, AES & Diffie-Hellman', status: 'Active' },
          { phase: 'Day 23–35', topic: 'Network Security Protocols & OWASP Top 10', status: 'Upcoming' },
          { phase: 'Day 36–42', topic: 'Penetration Testing Case Studies & Final Mocks', status: 'Upcoming' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('lifeos_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleOpenAiForDoc = (doc) => {
    setSelectedDoc(doc);
    setCurrentTab('pdf-ai');
  };

  const handleAddTaskFromStudy = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* 1. Cinematic Nature & Wind Atmosphere Background */}
      <NatureBackground theme={theme} windSpeed={1.0} />

      {/* 2. Glassmorphism Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        setTheme={setTheme}
        onOpenSecurity={() => setSecurityModalOpen(true)}
        user={user}
      />

      {/* 3. Main Workspace Views */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 pt-4 pb-20 lg:pb-12">
        {currentTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            setTasks={setTasks}
            habits={habits}
            setHabits={setHabits}
            documents={documents}
            onNavigate={setCurrentTab}
            onSelectDocument={setSelectedDoc}
          />
        )}

        {currentTab === 'assistant' && (
          <AiAssistant
            tasks={tasks}
            habits={habits}
            documents={documents}
            currentDoc={selectedDoc}
            apiKey={apiKey}
            apiProvider={apiProvider}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'vault' && (
          <KnowledgeVault
            documents={documents}
            setDocuments={setDocuments}
            folders={folders}
            setFolders={setFolders}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            onOpenAiForDoc={handleOpenAiForDoc}
          />
        )}

        {currentTab === 'pdf-ai' && (
          <AiPdfAssistant
            documents={documents}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'study' && (
          <StudyPlanner
            subjects={subjects}
            setSubjects={setSubjects}
            onAddTaskToDashboard={handleAddTaskFromStudy}
          />
        )}

        {currentTab === 'habits' && (
          <HabitTracker
            habits={habits}
            setHabits={setHabits}
          />
        )}
      </main>

      {/* 4. Security & Vault Governance Modal */}
      <SecurityModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
        user={user}
        setUser={setUser}
        apiKey={apiKey}
        setApiKey={setApiKey}
        apiProvider={apiProvider}
        setApiProvider={setApiProvider}
        cloudSync={cloudSync}
        setCloudSync={setCloudSync}
      />
    </div>
  );
}
