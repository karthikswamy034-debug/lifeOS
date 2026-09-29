import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Bot, User, Mic, MicOff, Volume2, 
  VolumeX, Copy, Check, RotateCcw, ArrowRight, Shield, Zap, BookOpen 
} from 'lucide-react';
import { askLifeOsAssistant } from '../services/aiService';
import { soundEngine } from '../services/soundEngine';

export default function AiAssistant({
  tasks,
  habits,
  documents,
  currentDoc,
  apiKey,
  apiProvider,
  onNavigate
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      time: 'Just now',
      text: `### 🌿 Greetings, Alex. I am LifeOS Mentor.
I am your personal AI productivity co-pilot and academic mentor. 

I have full contextual awareness of your **Knowledge Vault (${documents.length} documents)**, your **active habit streaks**, and your **study targets**.

How would you like to advance today? Choose a prompt below or type anything you wish:`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    { title: 'Create my study plan', prompt: 'Create my study plan for the next 30 days.' },
    { title: 'Explain deadlock from notes', prompt: 'Explain deadlock from my OS notes.' },
    { title: 'Summarize this PDF', prompt: 'Summarize this PDF and give me core takeaways.' },
    { title: 'What should I do today?', prompt: 'What should I do today to maximize my productivity?' },
    { title: 'Help me prepare for exams', prompt: 'Help me prepare for exams with high-yield questions.' }
  ];

  // Text to Speech
  const speakText = (text) => {
    if (!voiceSpeechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Clean markdown headings/symbols for speech
    const cleanText = text.replace(/[*#`$\-_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 400));
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    soundEngine.playChime('subtle');
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await askLifeOsAssistant({
        prompt: textToSend,
        history: messages,
        context: { tasks, habits, documents, currentDoc },
        apiKey,
        apiProvider
      });

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(response);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'ai',
          time: 'Now',
          text: '⚠️ I encountered an interruption in our cognitive link. Please try your request again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header HUD Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Holographic Glowing Orb */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/30 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <Brain className="w-7 h-7 text-cyan-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">LifeOS Jarvis Mentor</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                Cognitive Core 2.0
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Empowering study planning, PDF document interrogation, and sovereign daily prioritization.
            </p>
          </div>
        </div>

        {/* Audio / Voice Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
              voiceSpeechEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Voice Speech Readout"
          >
            {voiceSpeechEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] hidden sm:inline">{voiceSpeechEnabled ? 'Voice Mode ON' : 'Voice Mode OFF'}</span>
          </button>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white transition-all text-xs"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Prompt Shortcuts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm group"
          >
            <span>{qp.title}</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel rounded-3xl border border-white/10 p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4 shadow-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-300 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 relative group ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg'
                  : 'bg-slate-900/80 border border-white/10 text-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[11px] text-slate-400 font-mono">
                <span>{msg.sender === 'user' ? 'You' : 'LifeOS Mentor'}</span>
                <div className="flex items-center gap-2">
                  <span>{msg.time}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Formatted Text Content */}
              <div className="text-sm leading-relaxed space-y-2 whitespace-pre-wrap selection:bg-cyan-500/30">
                {msg.text}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-300 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 items-center">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-300">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 ml-2 font-mono">Synthesizing mentor advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="glass-panel p-2 sm:p-3 rounded-2xl border border-white/10 flex items-center gap-2 shadow-xl">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Voice Input (Speech-to-text)"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          placeholder="Ask LifeOS anything (e.g. 'Explain deadlock from my OS notes', 'Create study plan')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none px-2"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
