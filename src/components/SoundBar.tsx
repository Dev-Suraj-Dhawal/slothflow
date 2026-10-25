import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Zap, 
  Trees, 
  Waves, 
  VolumeX, 
  Volume2,
  BellRing,
  Activity,
  X,
  Sparkles,
  Sliders,
  Radio
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface SoundBarProps {
  isOpen: boolean;
  onClose: () => void;
}

type TrackId = 'rain' | 'thunder' | 'forest' | 'brown-noise';
type PresetId = 'zen-canopy' | 'rainy-tent' | 'deep-sleep';

interface TrackConfig {
  id: TrackId;
  name: string;
  spec: string;
  icon: typeof CloudRain;
  color: string;
  glowColor: string;
  bgLight: string;
}

const TRACKS: TrackConfig[] = [
  {
    id: 'rain',
    name: 'Rain',
    spec: '1200Hz Bandpass Filter',
    icon: CloudRain,
    color: '#88c9d4',
    glowColor: 'rgba(136, 201, 212, 0.35)',
    bgLight: '#182426'
  },
  {
    id: 'thunder',
    name: 'Thunder',
    spec: '45Hz Low-Pass Sub-Sweep',
    icon: Zap,
    color: '#deb992',
    glowColor: 'rgba(222, 185, 146, 0.35)',
    bgLight: '#261e16'
  },
  {
    id: 'forest',
    name: 'Forest Canopy',
    spec: '0.18Hz LFO Breeze Modulation',
    icon: Trees,
    color: '#8edba6',
    glowColor: 'rgba(142, 219, 166, 0.35)',
    bgLight: '#18261e'
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    spec: '1/f² Deep Pink-Brown Falloff',
    icon: Waves,
    color: '#cbbfe8',
    glowColor: 'rgba(203, 191, 232, 0.35)',
    bgLight: '#211a2d'
  }
];

export const SoundBar: React.FC<SoundBarProps> = ({ isOpen, onClose }) => {
  const [volumes, setVolumes] = useState<Record<TrackId, number>>({
    rain: 0,
    thunder: 0,
    forest: 0,
    'brown-noise': 0
  });

  const [activePreset, setActivePreset] = useState<PresetId | 'custom' | null>(null);
  const [chimePlaying, setChimePlaying] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleVolumeChange = (track: TrackId, val: number) => {
    setVolumes((prev) => ({ ...prev, [track]: val }));
    soundEngine.setVolume(track, val);
    setActivePreset('custom');
  };

  const toggleMuteTrack = (track: TrackId) => {
    const current = volumes[track];
    const next = current > 0 ? 0 : 0.5;
    handleVolumeChange(track, next);
  };

  const handleMuteAll = () => {
    setVolumes({ rain: 0, thunder: 0, forest: 0, 'brown-noise': 0 });
    soundEngine.stopAll();
    setActivePreset(null);
  };

  const handleChime = () => {
    soundEngine.playGentleChime();
    setChimePlaying(true);
    setTimeout(() => setChimePlaying(false), 2400);
  };

  const setPreset = (preset: PresetId) => {
    setActivePreset(preset);
    if (preset === 'rainy-tent') {
      const vals = { rain: 0.65, thunder: 0.35, forest: 0, 'brown-noise': 0.2 };
      setVolumes(vals);
      soundEngine.setVolume('rain', 0.65);
      soundEngine.setVolume('thunder', 0.35);
      soundEngine.setVolume('forest', 0);
      soundEngine.setVolume('brown-noise', 0.2);
    } else if (preset === 'deep-sleep') {
      const vals = { rain: 0, thunder: 0, forest: 0, 'brown-noise': 0.7 };
      setVolumes(vals);
      soundEngine.setVolume('rain', 0);
      soundEngine.setVolume('thunder', 0);
      soundEngine.setVolume('forest', 0);
      soundEngine.setVolume('brown-noise', 0.7);
    } else if (preset === 'zen-canopy') {
      const vals = { rain: 0.3, thunder: 0, forest: 0.6, 'brown-noise': 0.15 };
      setVolumes(vals);
      soundEngine.setVolume('rain', 0.3);
      soundEngine.setVolume('thunder', 0);
      soundEngine.setVolume('forest', 0.6);
      soundEngine.setVolume('brown-noise', 0.15);
    }
  };

  if (!isOpen) return null;

  const activeStemsCount = Object.values(volumes).filter((v) => v > 0).length;
  const isAnyPlaying = activeStemsCount > 0;

  return (
    <div className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 sm:w-[430px] max-h-[88vh] overflow-y-auto bg-[#121714]/98 backdrop-blur-xl border border-[#25322a] rounded-2xl shadow-2xl animate-fade-in text-[#edf2ee] font-sans selection:bg-[#295738]">
      {/* Mobile Top Drag Indicator */}
      <div className="sm:hidden flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 bg-[#2c3a32] rounded-full" />
      </div>

      <div className="p-4 sm:p-5">
        {/* Header with Visualizer */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2923] mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
              isAnyPlaying 
                ? 'bg-[#18261e] border-[#294232] text-[#8edba6]' 
                : 'bg-[#161c18] border-[#222c26] text-[#62776c]'
            }`}>
              <Radio className={`w-4 h-4 ${isAnyPlaying ? 'animate-pulse text-[#4eb374]' : ''}`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#55b376] uppercase tracking-wider font-bold">
                  SYNTH // 0528Hz
                </span>
                <span className="w-1 h-1 rounded-full bg-[#36493f]" />
                <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border ${
                  isAnyPlaying
                    ? 'bg-[#18261e] text-[#8edba6] border-[#294232]'
                    : 'bg-[#161c18] text-[#607067] border-[#222b26]'
                }`}>
                  {isAnyPlaying ? `${activeStemsCount} STEMS ACTIVE` : 'STANDBY'}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#f0f3f1] tracking-tight flex items-center gap-1.5 font-sans truncate">
                Procedural Soundscape
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Dynamic Equalizer VU Spectrum */}
            <div className="flex items-end gap-0.5 h-5 px-2 py-1 rounded bg-[#0d1210] border border-[#1f2923]">
              {[0.4, 0.8, 0.3, 0.9, 0.6, 0.7, 0.2, 0.85, 0.5, 0.95].map((scale, i) => (
                <span
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-300 ${
                    isAnyPlaying
                      ? 'bg-gradient-to-t from-[#295738] to-[#8edba6]'
                      : 'bg-[#222c26]'
                  }`}
                  style={{
                    height: isAnyPlaying ? `${Math.max(15, scale * 100 * Math.min(1, activeStemsCount * 0.45))}%` : '20%',
                    animation: isAnyPlaying ? `vu-meter-tick ${0.6 + (i % 5) * 0.2}s ease-in-out infinite ${i * 0.08}s` : 'none'
                  }}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-[#161c18] border border-[#222c26] text-[#718279] hover:text-[#edf2ee] hover:bg-[#1e2621] transition-colors cursor-pointer"
              title="Close Synthesizer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Presets Dock */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#62776c] mb-1.5 uppercase">
            <span>// CURATED PRESETS</span>
            {activePreset && (
              <span className="text-[#8edba6]">
                DIALED: {activePreset.toUpperCase().replace('-', ' ')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            <button
              onClick={() => setPreset('zen-canopy')}
              className={`tactile-btn px-2 py-1.5 rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activePreset === 'zen-canopy'
                  ? 'bg-[#18261e] border-[#314f3c] text-[#8edba6] shadow-sm'
                  : 'bg-[#141916] border-[#222b26] text-[#9ed4b0] hover:bg-[#1a231d]'
              }`}
            >
              <span className="text-xs">🌿</span>
              <span className="font-medium truncate w-full">Zen Canopy</span>
            </button>

            <button
              onClick={() => setPreset('rainy-tent')}
              className={`tactile-btn px-2 py-1.5 rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activePreset === 'rainy-tent'
                  ? 'bg-[#152326] border-[#2a454d] text-[#88c9d4] shadow-sm'
                  : 'bg-[#141916] border-[#222b26] text-[#96cfd9] hover:bg-[#162124]'
              }`}
            >
              <span className="text-xs">🌧️</span>
              <span className="font-medium truncate w-full">Rain Tent</span>
            </button>

            <button
              onClick={() => setPreset('deep-sleep')}
              className={`tactile-btn px-2 py-1.5 rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activePreset === 'deep-sleep'
                  ? 'bg-[#241c14] border-[#473420] text-[#deb992] shadow-sm'
                  : 'bg-[#141916] border-[#222b26] text-[#deb687] hover:bg-[#201913]'
              }`}
            >
              <span className="text-xs">☕</span>
              <span className="font-medium truncate w-full">Deep Sleep</span>
            </button>
          </div>
        </div>

        {/* 4 Multi-Channel Audio Stems */}
        <div className="space-y-2.5 mb-4">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            const vol = volumes[track.id];
            const isPlaying = vol > 0;
            const pct = Math.round(vol * 100);

            return (
              <div 
                key={track.id}
                className={`border rounded-xl p-2.5 transition-colors ${
                  isPlaying
                    ? 'bg-[#141916] border-[#2a382f]'
                    : 'bg-[#101412] border-[#1d2621]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => toggleMuteTrack(track.id)}
                      className="p-1 rounded-md bg-[#18201c] border border-[#222c26] text-[#9aa8a0] hover:text-[#edf2ee] transition-colors cursor-pointer shrink-0"
                      title={isPlaying ? `Mute ${track.name}` : `Unmute ${track.name}`}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: isPlaying ? track.color : '#62776c' }} />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-[#edf2ee] truncate">
                          {track.name}
                        </span>
                        {isPlaying && (
                          <span 
                            className="w-1.5 h-1.5 rounded-full animate-pulse" 
                            style={{ backgroundColor: track.color }} 
                          />
                        )}
                      </div>
                      <p className="text-[9px] text-[#607067] font-mono leading-none truncate hidden xs:block">
                        {track.spec}
                      </p>
                    </div>
                  </div>

                  {/* Level readout + 4-LED meter */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
                        <span
                          key={idx}
                          className="w-1 h-2 rounded-xs transition-colors"
                          style={{
                            backgroundColor: vol >= step ? track.color : '#1a221d',
                            boxShadow: vol >= step ? `0 0 4px ${track.glowColor}` : 'none'
                          }}
                        />
                      ))}
                    </div>

                    <span 
                      className="font-mono text-[10px] tabular-nums font-bold min-w-[32px] text-right"
                      style={{ color: isPlaying ? track.color : '#607067' }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Precision Slider with Gradient Active Fill */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={vol}
                  onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                  className="synth-slider w-full"
                  style={{
                    background: `linear-gradient(to right, ${track.color} 0%, ${track.color} ${pct}%, #1a221d ${pct}%, #1a221d 100%)`
                  }}
                  aria-label={`${track.name} Volume`}
                />
              </div>
            );
          })}
        </div>

        {/* Solfeggio 528Hz Harmonic Resonator */}
        <div className="bg-[#101412] border border-[#222b26] rounded-xl p-3 mb-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#deb992]">
              <Sparkles className="w-3 h-3 text-[#deb992] shrink-0" />
              <span>SOLFEGGIO RESONATOR // 528Hz</span>
            </div>
            <p className="text-[10px] text-[#718279] font-sans mt-0.5 leading-snug truncate">
              Pure sine wave calibrated for vagal parasympathetic de-stressing.
            </p>
          </div>

          <button
            onClick={handleChime}
            disabled={chimePlaying}
            className={`tactile-btn shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              chimePlaying
                ? 'bg-[#3b2d1d] border-[#5e4529] text-[#ffd8aa] animate-pulse'
                : 'bg-[#1b221e] border-[#29362e] text-[#deb992] hover:bg-[#232d28] hover:text-[#f0f3f1]'
            }`}
            title="Play 528Hz calming completion tone"
          >
            <BellRing className={`w-3.5 h-3.5 ${chimePlaying ? 'animate-bounce' : ''}`} />
            <span>{chimePlaying ? '528Hz RESONATING...' : 'RING 528Hz'}</span>
          </button>
        </div>

        {/* Footer Hardware Info & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f2923] text-xs font-mono">
          <span className="text-[10px] text-[#607067] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4eb374]" />
            0 MP3s · Procedural Web Audio API
          </span>

          <button
            onClick={handleMuteAll}
            disabled={!isAnyPlaying}
            className="tactile-btn text-[#cf8e8e] hover:text-[#f0afaf] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#161c18] hover:bg-[#241a1a] border border-[#222c26] hover:border-[#422525] transition-colors cursor-pointer text-[10px] font-mono disabled:opacity-30 disabled:pointer-events-none"
          >
            <VolumeX className="w-3 h-3" />
            <span>MUTE ALL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
