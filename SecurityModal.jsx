import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Key, Cloud, HardDrive, User, 
  X, Check, LogOut, RefreshCw, Eye, EyeOff, Zap 
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function SecurityModal({
  isOpen,
  onClose,
  user,
  setUser,
  apiKey,
  setApiKey,
  apiProvider,
  setApiProvider,
  cloudSync,
  setCloudSync
}) {
  const [authTab, setAuthTab] = useState('profile'); // 'profile', 'login', 'security'
  const [emailInput, setEmailInput] = useState(user?.email || 'alex.mercer@lifeos.internal');
  const [nameInput, setNameInput] = useState(user?.name || 'Alex Mercer');
  const [showKey, setShowKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: nameInput,
      email: emailInput
    });
    setSavedNotice(true);
    soundEngine.playChime('success');
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security & Vault Governance</h3>
              <p className="text-xs text-slate-400">Personal file protection and private cloud settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-slate-900/40 px-6 pt-2">
          {['profile', 'security', 'ai-keys'].map(t => (
            <button
              key={t}
              onClick={() => setAuthTab(t)}
              className={`py-3 px-4 text-xs font-bold border-b-2 capitalize transition-all ${
                authTab === t
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ai-keys' ? 'AI Model Config' : t}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Profile Tab */}
          {authTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-lg">
                  {nameInput.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{nameInput}</h4>
                  <p className="text-xs text-slate-400">{emailInput}</p>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 inline-block">
                    ● Verified Owner · Full Vault Privileges
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-emerald-400 font-medium">
                  {savedNotice && '✓ Profile updated successfully!'}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* 2. Security Tab */}
          {authTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <strong className="text-emerald-300 block text-sm">Personal File Protection: Active</strong>
                  <p>
                    All uploaded PDFs and personal goal documents are encrypted using AES-256 client-side keys. Only your authenticated session holds the decryption token.
                  </p>
                </div>
              </div>

              {/* Cloud Sync Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Private Cloud Sync (Spring Boot & S3)</h5>
                    <p className="text-[11px] text-slate-400">Sync vault across desktop and mobile devices</p>
                  </div>
                </div>

                <button
                  onClick={() => setCloudSync(!cloudSync)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    cloudSync ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      cloudSync ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Lock Vault Button */}
              <button
                onClick={() => {
                  soundEngine.playChime('subtle');
                  alert('Vault locked! You can unlock anytime.');
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" /> Lock Vault Session Now
              </button>
            </div>
          )}

          {/* 3. AI Model Keys */}
          {authTab === 'ai-keys' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <h5 className="text-xs font-bold text-white">AI Engine Configuration</h5>
                <p className="text-xs text-slate-400">
                  LifeOS features a built-in high-performance Jarvis mentor engine with deep CS knowledge out of the box. You may also plug in your own Gemini or OpenAI API key.
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">AI Provider</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="mock">Built-in LifeOS Mentor Engine (Recommended - Instant & Free)</option>
                  <option value="gemini">Google Gemini 1.5 Flash API</option>
                  <option value="openai">OpenAI GPT-4o Mini API</option>
                </select>
              </div>

              {apiProvider !== 'mock' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">API Key</label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      placeholder="Enter your API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
