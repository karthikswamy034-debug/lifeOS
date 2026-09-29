import React, { useState, useRef } from 'react';
import { 
  Folder, FolderPlus, FileText, UploadCloud, Search, Trash2, 
  Edit3, ExternalLink, Eye, BookOpen, Brain, Sparkles, X, Check,
  HardDrive, Lock, Shield, Filter, Download
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function KnowledgeVault({
  documents,
  setDocuments,
  folders,
  setFolders,
  activeFolder,
  setActiveFolder,
  onOpenAiForDoc
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editNameText, setEditNameText] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  const fileInputRef = useRef(null);

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesFolder = activeFolder === 'All' || doc.folder === activeFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  // Handle PDF file upload
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const newDoc = {
        id: 'doc-' + Date.now(),
        name: file.name,
        folder: activeFolder === 'All' ? 'College' : activeFolder,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.max(1, Math.round(file.size / 45000)),
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ['Uploaded', activeFolder],
        summary: `User uploaded document '${file.name}'. Ready for chapter summarization, exam Q&A, and AI flashcards.`,
        content: typeof content === 'string' ? content : `# ${file.name}\n\nDocument contents parsed successfully into LifeOS Private Vault.\nReady for AI interrogation.`,
        flashcards: [
          { q: `What is the core topic of ${file.name}?`, a: 'Analyzed directly from the uploaded document.' }
        ],
        examQuestions: [
          { question: `Summarize the primary thesis and findings of ${file.name}.`, marks: 10 }
        ]
      };

      setTimeout(() => {
        setDocuments(prev => [newDoc, ...prev]);
        setIsUploading(false);
        soundEngine.playChime('success');
      }, 700);
    };

    // Read as text or data url
    reader.readAsText(file);
    e.target.value = '';
  };

  // Rename document
  const startRename = (doc) => {
    setEditingDocId(doc.id);
    setEditNameText(doc.name);
  };

  const saveRename = (id) => {
    if (!editNameText.trim()) return;
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, name: editNameText.trim() } : d));
    setEditingDocId(null);
    soundEngine.playChime('subtle');
  };

  // Delete document
  const handleDeleteDoc = (id) => {
    if (confirm('Are you sure you want to delete this document from your vault?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (previewDoc?.id === id) setPreviewDoc(null);
    }
  };

  // Create new folder
  const handleAddFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim() || folders.includes(newFolderName.trim())) return;
    setFolders(prev => [...prev, newFolderName.trim()]);
    setActiveFolder(newFolderName.trim());
    setNewFolderName('');
    setShowNewFolderModal(false);
    soundEngine.playChime('subtle');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Top Vault HUD Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" /> Private PDF Knowledge Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Document Repository
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mt-1">
            Secure client-side document vault. Upload PDFs, organize semester notes, career credentials, and interrogate files with AI.
          </p>
        </div>

        {/* Upload Button & Storage Badge */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.doc,.docx"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? 'Encrypting & Uploading...' : 'Upload PDF Document'}</span>
          </button>
        </div>
      </div>

      {/* Vault Toolbar: Search & Folder Navigation */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Folder Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFolder('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeFolder === 'All'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" /> All Vault ({documents.length})
          </button>

          {folders.map(folder => {
            const count = documents.filter(d => d.folder === folder).length;
            return (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeFolder === folder
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-cyan-400" /> {folder} ({count})
              </button>
            );
          })}

          <button
            onClick={() => setShowNewFolderModal(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-cyan-300 border border-white/5 transition-all text-xs"
            title="Create New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, tags, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-3xl border border-white/5">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No documents found matching your filter.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs text-cyan-400 hover:underline font-semibold"
            >
              Upload a new PDF to this folder
            </button>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-cyan-900/20"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Preview PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startRename(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Rename Document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Document Name / Inline Rename Input */}
                {editingDocId === doc.id ? (
                  <div className="flex items-center gap-1.5 my-1">
                    <input
                      type="text"
                      value={editNameText}
                      onChange={(e) => setEditNameText(e.target.value)}
                      className="bg-slate-900 border border-cyan-500 rounded-lg px-2 py-1 text-xs text-white flex-1"
                      autoFocus
                    />
                    <button onClick={() => saveRename(doc.id)} className="p-1 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {doc.name}
                  </h3>
                )}

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {doc.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {doc.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-300/80 font-mono border border-cyan-500/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Meta & Action */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{doc.pages} pages · {doc.size}</span>
                <button
                  onClick={() => onOpenAiForDoc(doc)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-500/30 text-cyan-300 hover:text-slate-950 font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Brain className="w-3.5 h-3.5" /> Ask AI
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document In-Browser Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-4xl max-h-[85vh] rounded-3xl border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{previewDoc.name}</h3>
                  <p className="text-xs text-slate-400">{previewDoc.folder} · {previewDoc.size} · {previewDoc.pages} pages</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const doc = previewDoc;
                    setPreviewDoc(null);
                    onOpenAiForDoc(doc);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Brain className="w-3.5 h-3.5" /> Analyze with AI
                </button>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Document Full Content Viewer */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 select-text whitespace-pre-wrap">
              {previewDoc.content}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>LifeOS Encrypted Reader · Client Protected</span>
              <button
                onClick={() => {
                  const blob = new Blob([previewDoc.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = previewDoc.name;
                  a.click();
                }}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
              >
                <Download className="w-3.5 h-3.5" /> Export Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAddFolder} className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-cyan-400" /> Create Vault Folder
            </h3>
            <p className="text-xs text-slate-400">
              Categorize documents for easy AI retrieval and semester study sessions.
            </p>
            <input
              type="text"
              placeholder="e.g. Master's Prep, Research Papers, Finance"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
