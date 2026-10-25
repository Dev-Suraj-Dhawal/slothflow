import React, { useState } from 'react';
import { 
  CloudRain, 
  Zap, 
  Trees, 
  Waves, 
  VolumeX, 
  Volume2, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface SoundBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundBar: React.FC<SoundBarProps> = ({ isOpen, onClose }) => {
  const [volumes, setVolumes] = useState<{
    rain: number;
    thunder: number;
    forest: number;
    'brown-noise': number;
  }>({
    rain: 0,
    thunder: 0,
    forest: 0,
    'brown-noise': 0
  });

  const handleVolumeChange = (track: 'rain' | 'thunder' | 'forest' | 'brown-noise', val: number) => {
    setVolumes((prev) => ({ ...prev, [track]: val }));
    soundEngine.setVolume(track, val);
  };

  const handleMuteAll = () => {
    setVolumes({ rain: 0, thunder: 0, forest: 0, 'brown-noise': 0 });
    soundEngine.stopAll();
  };

  const handleChime = () => {
    soundEngine.playGentleChime();
  };

  const setPreset = (preset: 'rainy-tent' | 'deep-sleep' | 'zen-canopy') => {
    if (preset === 'rainy-tent') {
      handleVolumeChange('rain', 0.65);
      handleVolumeChange('thunder', 0.35);
      handleVolumeChange('forest', 0);
      handleVolumeChange('brown-noise', 0.2);
    } else if (preset === 'deep-sleep') {
      handleVolumeChange('rain', 0);
      handleVolumeChange('thunder', 0);
      handleVolumeChange('forest', 0);
      handleVolumeChange('brown-noise', 0.7);
    } else if (preset === 'zen-canopy') {
      handleVolumeChange('rain', 0.3);
      handleVolumeChange('thunder', 0);
      handleVolumeChange('forest', 0.6);
      handleVolumeChange('brown-noise', 0.15);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-slate-900/95 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Offline Procedural Soundscape
            </h3>
            <p className="text-[10px] text-slate-400">
              Web Audio API • 0 MP3 downloads • Zero bandwidth
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
        >
          ✕
        </button>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-[11px]">
        <button
          onClick={() => setPreset('zen-canopy')}
          className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 whitespace-nowrap"
        >
          🌿 Zen Canopy
        </button>
        <button
          onClick={() => setPreset('rainy-tent')}
          className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 whitespace-nowrap"
        >
          🌧️ Rainforest Tent
        </button>
        <button
          onClick={() => setPreset('deep-sleep')}
          className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 whitespace-nowrap"
        >
          ☕ Warm Brown Noise
        </button>
      </div>

      {/* Individual Sliders */}
      <div className="space-y-2.5">
        {/* Rain */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 w-24">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rain
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.rain}
            onChange={(e) => handleVolumeChange('rain', parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 w-8 text-right">
            {Math.round(volumes.rain * 100)}%
          </span>
        </div>

        {/* Thunder */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 w-24">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Thunder
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.thunder}
            onChange={(e) => handleVolumeChange('thunder', parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 w-8 text-right">
            {Math.round(volumes.thunder * 100)}%
          </span>
        </div>

        {/* Forest */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 w-24">
            <Trees className="w-3.5 h-3.5 text-emerald-400" /> Forest
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.forest}
            onChange={(e) => handleVolumeChange('forest', parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 w-8 text-right">
            {Math.round(volumes.forest * 100)}%
          </span>
        </div>

        {/* Brown Noise */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 w-24">
            <Waves className="w-3.5 h-3.5 text-purple-400" /> Brown Noise
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes['brown-noise']}
            onChange={(e) => handleVolumeChange('brown-noise', parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 w-8 text-right">
            {Math.round(volumes['brown-noise'] * 100)}%
          </span>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
        <button
          onClick={handleChime}
          className="text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg"
          title="Play 528Hz calming completion tone"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-400" />
          <span>Zen Chime</span>
        </button>

        <button
          onClick={handleMuteAll}
          className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Silence All</span>
        </button>
      </div>
    </div>
  );
};
