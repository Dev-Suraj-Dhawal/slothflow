import React, { useState } from 'react';
import { 
  CloudRain, 
  Zap, 
  Trees, 
  Waves, 
  VolumeX, 
  Volume2, 
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
    <div className="fixed bottom-4 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-[#161b19] border border-[#242d29] rounded-2xl p-5 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#242d29] mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#1c2a22] text-[#55b376] border border-[#2b4234]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#f0f3f1] tracking-wide uppercase">
              Offline Procedural Soundscape
            </h3>
            <p className="text-[10px] text-[#8e9c95] font-mono">
              Web Audio API • 0 MP3s • Generative Synthesis
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#8e9c95] hover:text-[#f0f3f1] text-xs px-2 py-0.5 rounded-lg bg-[#1c2320] border border-[#28332e] hover:bg-[#232c28] transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Preset Pills - Solid Natural */}
      <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
        <button
          onClick={() => setPreset('zen-canopy')}
          className="px-2.5 py-1 rounded-lg bg-[#1c2a22] border border-[#2b4234] text-[#9ed4b0] hover:bg-[#23362b] whitespace-nowrap transition-colors cursor-pointer font-medium"
        >
          🌿 Zen Canopy
        </button>
        <button
          onClick={() => setPreset('rainy-tent')}
          className="px-2.5 py-1 rounded-lg bg-[#192426] border border-[#273d42] text-[#96cfd9] hover:bg-[#223336] whitespace-nowrap transition-colors cursor-pointer font-medium"
        >
          🌧️ Rainforest Tent
        </button>
        <button
          onClick={() => setPreset('deep-sleep')}
          className="px-2.5 py-1 rounded-lg bg-[#29221a] border border-[#423425] text-[#deb687] hover:bg-[#362b20] whitespace-nowrap transition-colors cursor-pointer font-medium"
        >
          ☕ Warm Brown Noise
        </button>
      </div>

      {/* Individual Sliders */}
      <div className="space-y-3">
        {/* Rain */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#c7d1cc] w-24 shrink-0 font-medium">
            <CloudRain className="w-3.5 h-3.5 text-[#96cfd9]" /> Rain
            {volumes.rain > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#52a1b0] ml-0.5" />}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.rain}
            onChange={(e) => handleVolumeChange('rain', parseFloat(e.target.value))}
            className="flex-1 accent-[#2b613b] h-1.5 bg-[#101413] rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-[#8e9c95] font-mono w-8 text-right">
            {Math.round(volumes.rain * 100)}%
          </span>
        </div>

        {/* Thunder */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#c7d1cc] w-24 shrink-0 font-medium">
            <Zap className="w-3.5 h-3.5 text-[#deb687]" /> Thunder
            {volumes.thunder > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#c79b6d] ml-0.5" />}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.thunder}
            onChange={(e) => handleVolumeChange('thunder', parseFloat(e.target.value))}
            className="flex-1 accent-[#7a4d26] h-1.5 bg-[#101413] rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-[#8e9c95] font-mono w-8 text-right">
            {Math.round(volumes.thunder * 100)}%
          </span>
        </div>

        {/* Forest */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#c7d1cc] w-24 shrink-0 font-medium">
            <Trees className="w-3.5 h-3.5 text-[#55b376]" /> Forest
            {volumes.forest > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#55b376] ml-0.5" />}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.forest}
            onChange={(e) => handleVolumeChange('forest', parseFloat(e.target.value))}
            className="flex-1 accent-[#2b613b] h-1.5 bg-[#101413] rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-[#8e9c95] font-mono w-8 text-right">
            {Math.round(volumes.forest * 100)}%
          </span>
        </div>

        {/* Brown Noise */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#c7d1cc] w-24 shrink-0 font-medium">
            <Waves className="w-3.5 h-3.5 text-[#c3b4de]" /> Brown Noise
            {volumes['brown-noise'] > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#9882c4] ml-0.5" />}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes['brown-noise']}
            onChange={(e) => handleVolumeChange('brown-noise', parseFloat(e.target.value))}
            className="flex-1 accent-[#483861] h-1.5 bg-[#101413] rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-[#8e9c95] font-mono w-8 text-right">
            {Math.round(volumes['brown-noise'] * 100)}%
          </span>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#242d29] text-xs">
        <button
          onClick={handleChime}
          className="text-[#a0ada6] hover:text-[#f0f3f1] flex items-center gap-1.5 bg-[#1c2320] hover:bg-[#232c28] px-3 py-1.5 rounded-xl border border-[#28332e] transition-colors cursor-pointer"
          title="Play 528Hz calming completion tone"
        >
          <BellRing className="w-3.5 h-3.5 text-[#deb687]" />
          <span>528Hz Chime</span>
        </button>

        <button
          onClick={handleMuteAll}
          className="text-[#cf8e8e] hover:text-[#e8aaaa] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#261c1c] transition-colors cursor-pointer"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Silence All</span>
        </button>
      </div>
    </div>
  );
};
