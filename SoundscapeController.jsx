import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wind, Feather, CloudRain, Music, Sliders, Play, Pause, ChevronDown, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function SoundscapeController({ isExpanded, setIsExpanded }) {
  const [isPlaying, setIsPlaying] = useState(soundEngine.isPlaying);
  const [masterVol, setMasterVol] = useState(soundEngine.masterVolume);
  const [channels, setChannels] = useState({
    wind: { enabled: true, vol: 0.4 },
    birds: { enabled: true, vol: 0.35 },
    rain: { enabled: false, vol: 0.3 },
    ambient: { enabled: true, vol: 0.4 }
  });

  const togglePlay = () => {
    const nextState = soundEngine.toggleMaster();
    setIsPlaying(nextState);
  };

  const handleMasterVol = (e) => {
    const val = parseFloat(e.target.value);
    setMasterVol(val);
    soundEngine.setMasterVolume(val);
  };

  const handleChannelToggle = (ch) => {
    const next = soundEngine.toggleChannel(ch);
    setChannels(prev => ({
      ...prev,
      [ch]: { ...prev[ch], enabled: next }
    }));
  };

  const handleChannelVol = (ch, e) => {
    const val = parseFloat(e.target.value);
    soundEngine.setChannelVolume(ch, val);
    setChannels(prev => ({
      ...prev,
      [ch]: { ...prev[ch], vol: val }
    }));
  };

  const applyPreset = (preset) => {
    if (!isPlaying) {
      soundEngine.toggleMaster(true);
      setIsPlaying(true);
    }
    if (preset === 'rainy') {
      soundEngine.toggleChannel('wind', true);
      soundEngine.toggleChannel('birds', false);
      soundEngine.toggleChannel('rain', true);
      soundEngine.toggleChannel('ambient', true);
      soundEngine.setChannelVolume('rain', 0.5);
      soundEngine.setChannelVolume('wind', 0.25);
      setChannels({
        wind: { enabled: true, vol: 0.25 },
        birds: { enabled: false, vol: 0.35 },
        rain: { enabled: true, vol: 0.5 },
        ambient: { enabled: true, vol: 0.4 }
      });
    } else if (preset === 'zen') {
      soundEngine.toggleChannel('wind', true);
      soundEngine.toggleChannel('birds', true);
      soundEngine.toggleChannel('rain', false);
      soundEngine.toggleChannel('ambient', true);
      soundEngine.setChannelVolume('ambient', 0.6);
      soundEngine.setChannelVolume('wind', 0.2);
      setChannels({
        wind: { enabled: true, vol: 0.2 },
        birds: { enabled: true, vol: 0.4 },
        rain: { enabled: false, vol: 0.3 },
        ambient: { enabled: true, vol: 0.6 }
      });
    } else if (preset === 'forest') {
      soundEngine.toggleChannel('wind', true);
      soundEngine.toggleChannel('birds', true);
      soundEngine.toggleChannel('rain', false);
      soundEngine.toggleChannel('ambient', false);
      setChannels({
        wind: { enabled: true, vol: 0.4 },
        birds: { enabled: true, vol: 0.5 },
        rain: { enabled: false, vol: 0.3 },
        ambient: { enabled: false, vol: 0.4 }
      });
    }
  };

  return (
    <div className="relative">
      {/* Mini Toggle Pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
          isPlaying
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
            : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/80'
        }`}
        title="Atmospheric Soundscape Mixer"
      >
        {isPlaying ? (
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
        )}
        <span className="hidden sm:inline">{isPlaying ? 'Nature Audio ON' : 'Audio OFF'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded Sound Mixer Dropdown Panel */}
      {isExpanded && (
        <div className="absolute right-0 top-11 w-72 sm:w-80 p-4 rounded-2xl glass-panel border border-emerald-500/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Atmosphere Mixer</h4>
                <p className="text-[11px] text-slate-400">Realistic peaceful audio generators</p>
              </div>
            </div>

            <button
              onClick={togglePlay}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isPlaying ? 'Pause Nature Sounds' : 'Start Nature Sounds'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          {/* Master Volume Slider */}
          <div className="py-3 border-b border-white/10">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Master Volume
              </span>
              <span className="text-emerald-400 font-mono">{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={masterVol}
              onChange={handleMasterVol}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Presets */}
          <div className="py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Instant Soundscapes
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => applyPreset('zen')}
                className="py-1 px-2 rounded-lg text-[11px] bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 border border-white/5 transition-all text-slate-300"
              >
                Zen Peace
              </button>
              <button
                onClick={() => applyPreset('forest')}
                className="py-1 px-2 rounded-lg text-[11px] bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 border border-white/5 transition-all text-slate-300"
              >
                Meadow
              </button>
              <button
                onClick={() => applyPreset('rainy')}
                className="py-1 px-2 rounded-lg text-[11px] bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 border border-white/5 transition-all text-slate-300"
              >
                Soft Rain
              </button>
            </div>
          </div>

          {/* Individual Sound Channels */}
          <div className="space-y-3 pt-2">
            {/* Wind */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChannelToggle('wind')}
                className={`p-1.5 rounded-lg transition-colors ${
                  channels.wind.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500'
                }`}
                title="Toggle Wind"
              >
                <Wind className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Soft Wind</span>
                  <span className="text-[10px] text-slate-400">{channels.wind.enabled ? `${Math.round(channels.wind.vol * 100)}%` : 'Off'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!channels.wind.enabled}
                  value={channels.wind.vol}
                  onChange={(e) => handleChannelVol('wind', e)}
                  className="w-full h-1 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-30"
                />
              </div>
            </div>

            {/* Birds */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChannelToggle('birds')}
                className={`p-1.5 rounded-lg transition-colors ${
                  channels.birds.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500'
                }`}
                title="Toggle Birds"
              >
                <Feather className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Bird Song</span>
                  <span className="text-[10px] text-slate-400">{channels.birds.enabled ? `${Math.round(channels.birds.vol * 100)}%` : 'Off'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!channels.birds.enabled}
                  value={channels.birds.vol}
                  onChange={(e) => handleChannelVol('birds', e)}
                  className="w-full h-1 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-30"
                />
              </div>
            </div>

            {/* Rain */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChannelToggle('rain')}
                className={`p-1.5 rounded-lg transition-colors ${
                  channels.rain.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500'
                }`}
                title="Toggle Rain"
              >
                <CloudRain className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Gentle Rain</span>
                  <span className="text-[10px] text-slate-400">{channels.rain.enabled ? `${Math.round(channels.rain.vol * 100)}%` : 'Off'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!channels.rain.enabled}
                  value={channels.rain.vol}
                  onChange={(e) => handleChannelVol('rain', e)}
                  className="w-full h-1 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-30"
                />
              </div>
            </div>

            {/* Calm Ambient Music */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChannelToggle('ambient')}
                className={`p-1.5 rounded-lg transition-colors ${
                  channels.ambient.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500'
                }`}
                title="Toggle Ambient Chords"
              >
                <Music className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Calm Ambient Music</span>
                  <span className="text-[10px] text-slate-400">{channels.ambient.enabled ? `${Math.round(channels.ambient.vol * 100)}%` : 'Off'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!channels.ambient.enabled}
                  value={channels.ambient.vol}
                  onChange={(e) => handleChannelVol('ambient', e)}
                  className="w-full h-1 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
