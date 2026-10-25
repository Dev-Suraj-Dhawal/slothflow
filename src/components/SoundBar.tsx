import React, { useState } from 'react';
import { 
  CloudRain, 
  Zap, 
  Trees, 
  Waves, 
  VolumeX, 
  BellRing,
  Sliders
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
    <div className="fixed bottom-2 left-2 right-2 sm:left-auto sm:bottom-4 sm:right-6 z-50 sm:w-[410px] max-h-[88vh] overflow-y-auto bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-none p-3.5 sm:p-5 shadow-2xl animate-fade-in relative">
      <span className="hidden sm:inline absolute -top-1 -left-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
      <span className="hidden sm:inline absolute -top-1 -right-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
      <span className="hidden sm:inline absolute -bottom-1 -left-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
      <span className="hidden sm:inline absolute -bottom-1 -right-1 text-[9px] font-mono text-[#38483f] select-none">+</span>

      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1f2722] mb-3">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-[#101413] border border-[#222b26] text-[9px] sm:text-[10px] font-mono text-[#55b376]">
            [SYNTH // 0528Hz]
          </span>
          <div>
            <h3 className="text-xs font-mono font-bold text-[#f0f3f1] tracking-wide uppercase">
              Procedural Soundscape
            </h3>
            <p className="text-[9px] sm:text-[10px] text-[#62776c] font-mono">
              Web Audio API · 0 MP3s · Algorithmic
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#62776c] hover:text-[#f0f3f1] text-[11px] font-mono px-2 py-0.5 rounded bg-[#101413] border border-[#222b26] hover:bg-[#1a211d] transition-colors cursor-pointer"
        >
          [ESC]
        </button>
      </div>

      {/* Preset Pills - Solid Natural Flat */}
      <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto pb-1 text-[10px] font-mono scrollbar-none">
        <button
          onClick={() => setPreset('zen-canopy')}
          className="tactile-btn px-2.5 py-1 rounded bg-[#101413] border border-[#222b26] text-[#9ed4b0] hover:bg-[#17221b] whitespace-nowrap transition-colors cursor-pointer"
        >
          🌿 Zen Canopy
        </button>
        <button
          onClick={() => setPreset('rainy-tent')}
          className="tactile-btn px-2.5 py-1 rounded bg-[#101413] border border-[#222b26] text-[#96cfd9] hover:bg-[#162124] whitespace-nowrap transition-colors cursor-pointer"
        >
          🌧️ Rainforest Tent
        </button>
        <button
          onClick={() => setPreset('deep-sleep')}
          className="tactile-btn px-2.5 py-1 rounded bg-[#101413] border border-[#222b26] text-[#deb687] hover:bg-[#211a14] whitespace-nowrap transition-colors cursor-pointer"
        >
          ☕ Brown Noise
        </button>
      </div>

      {/* Individual Sliders */}
      <div className="space-y-2.5">
        {/* Rain */}
        <div className="bg-[#101413] border border-[#1f2722] p-2.5 rounded">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-[#c7d1cc] font-mono text-[11px]">
              <CloudRain className="w-3.5 h-3.5 text-[#96cfd9]" /> Rain (1200Hz BPF)
              {volumes.rain > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#52a1b0] ml-0.5" />}
            </span>
            <span className="text-[10px] text-[#62776c] font-mono">
              {Math.round(volumes.rain * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.rain}
            onChange={(e) => handleVolumeChange('rain', parseFloat(e.target.value))}
            className="w-full accent-[#2b613b] h-1.5 bg-[#171d1a] rounded cursor-pointer"
          />
        </div>

        {/* Thunder */}
        <div className="bg-[#101413] border border-[#1f2722] p-2.5 rounded">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-[#c7d1cc] font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5 text-[#deb687]" /> Thunder (45Hz Sub-Sweep)
              {volumes.thunder > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#c79b6d] ml-0.5" />}
            </span>
            <span className="text-[10px] text-[#62776c] font-mono">
              {Math.round(volumes.thunder * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.thunder}
            onChange={(e) => handleVolumeChange('thunder', parseFloat(e.target.value))}
            className="w-full accent-[#7a4d26] h-1.5 bg-[#171d1a] rounded cursor-pointer"
          />
        </div>

        {/* Forest */}
        <div className="bg-[#101413] border border-[#1f2722] p-2.5 rounded">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-[#c7d1cc] font-mono text-[11px]">
              <Trees className="w-3.5 h-3.5 text-[#55b376]" /> Forest (0.15Hz LFO Breeze)
              {volumes.forest > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#55b376] ml-0.5" />}
            </span>
            <span className="text-[10px] text-[#62776c] font-mono">
              {Math.round(volumes.forest * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.forest}
            onChange={(e) => handleVolumeChange('forest', parseFloat(e.target.value))}
            className="w-full accent-[#2b613b] h-1.5 bg-[#171d1a] rounded cursor-pointer"
          />
        </div>

        {/* Brown Noise */}
        <div className="bg-[#101413] border border-[#1f2722] p-2.5 rounded">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-[#c7d1cc] font-mono text-[11px]">
              <Waves className="w-3.5 h-3.5 text-[#c3b4de]" /> Brown Noise (1/f² Slope)
              {volumes['brown-noise'] > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#9882c4] ml-0.5" />}
            </span>
            <span className="text-[10px] text-[#62776c] font-mono">
              {Math.round(volumes['brown-noise'] * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes['brown-noise']}
            onChange={(e) => handleVolumeChange('brown-noise', parseFloat(e.target.value))}
            className="w-full accent-[#483861] h-1.5 bg-[#171d1a] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1f2722] text-xs">
        <button
          onClick={handleChime}
          className="tactile-btn text-[#a0ada6] hover:text-[#f0f3f1] flex items-center gap-1.5 bg-[#101413] hover:bg-[#1a211d] px-2.5 py-1.5 rounded border border-[#222b26] transition-colors cursor-pointer text-[11px] font-mono"
          title="Play 528Hz calming completion tone"
        >
          <BellRing className="w-3.5 h-3.5 text-[#deb687]" />
          <span>528Hz Solfeggio</span>
        </button>

        <button
          onClick={handleMuteAll}
          className="tactile-btn text-[#cf8e8e] hover:text-[#e8aaaa] flex items-center gap-1 px-2 py-1 rounded bg-[#101413] border border-[#222b26] transition-colors cursor-pointer text-[11px] font-mono"
        >
          <VolumeX className="w-3 h-3" />
          <span>Mute All</span>
        </button>
      </div>
    </div>
  );
};
