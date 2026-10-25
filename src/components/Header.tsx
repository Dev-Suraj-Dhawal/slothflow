import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ZapOff,
  Flame,
  ChevronDown,
  Terminal,
  Activity
} from 'lucide-react';
import { AIProvider, SlothStats } from '../types';

interface HeaderProps {
  currentProvider: AIProvider;
  stats: SlothStats;
  isSoundActive: boolean;
  onToggleSoundBar: () => void;
  onOpenEngineModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProvider,
  stats,
  isSoundActive,
  onToggleSoundBar,
  onOpenEngineModal
}) => {
  const getProviderBadge = () => {
    switch (currentProvider) {
      case 'browser-transformers':
        return {
          code: 'WEBGPU/ONNX',
          label: 'Client Open-Weights',
          tech: 'Qwen2.5-0.5B / WASM',
          bg: 'bg-[#15241b]',
          border: 'border-[#294232]',
          text: 'text-[#8edba6]',
          led: 'bg-[#4eb374]'
        };
      case 'local-ollama':
        return {
          code: 'OLLAMA:11434',
          label: 'Local GPU Daemon',
          tech: 'localhost:11434',
          bg: 'bg-[#152326]',
          border: 'border-[#263e42]',
          text: 'text-[#88c9d4]',
          led: 'bg-[#4aa1af]'
        };
      case 'distilled-sloth':
        return {
          code: 'DISTILLED',
          label: 'Instant Heuristics',
          tech: '50ms Micro-Engine',
          bg: 'bg-[#291f14]',
          border: 'border-[#453221]',
          text: 'text-[#deb992]',
          led: 'bg-[#bd8748]'
        };
      case 'huggingface-api':
        return {
          code: 'HF_HUB',
          label: 'Remote Open Hub',
          tech: 'Hugging Face API',
          bg: 'bg-[#20192b]',
          border: 'border-[#382b4c]',
          text: 'text-[#cbbfe8]',
          led: 'bg-[#8f75b8]'
        };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 border-b border-[#222b26] bg-[#141916] px-4 sm:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Technical Schema */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenEngineModal}
            className="w-9 h-9 rounded-lg bg-[#1b221e] border border-[#2c3832] flex items-center justify-center text-lg hover:bg-[#232c27] hover:border-[#38473f] transition-all tactile-btn cursor-pointer select-none"
            title="Inspect Machine Engine & Schema"
          >
            🦥
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#556960] tracking-widest uppercase">
                SPEC // OS-03
              </span>
              <span className="w-1 h-1 rounded-full bg-[#36493f]" />
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#edf2ee] flex items-center gap-1.5 font-sans">
                SlothFlow
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#1c2820] text-[#8edba6] border border-[#2b4033]">
                  v1.0
                </span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-[#76877e] tracking-tight">
              AUTONOMOUS ANTI-EFFORT FRAMEWORK · INTERNATIONAL SLOTH DAY
            </p>
          </div>
        </div>

        {/* Center: Analog Laboratory Telemetry */}
        <div className="hidden lg:flex items-center gap-4 bg-[#101412] border border-[#202924] rounded-lg px-4 py-1 text-xs text-[#9aa8a0] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4eb374]" />
            <span className="text-[10px] text-[#5f7368] uppercase">EFFORT SAVED:</span>
            <span className="font-bold tabular-nums text-[#edf2ee]">{stats.timeSavedMinutes}m</span>
          </div>
          <div className="w-px h-3 bg-[#222b26]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#5f7368] uppercase">STORED:</span>
            <span className="font-bold tabular-nums text-[#edf2ee]">{stats.caloriesConserved} kcal</span>
          </div>
          <div className="w-px h-3 bg-[#222b26]" />
          <div className="flex items-center gap-1.5 text-[#88bfa2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4eb374]" />
            <span className="text-[10px] uppercase">100% PRIVATE · 0 KB EGRESS</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Active Provider Selector Button */}
          <button
            onClick={onOpenEngineModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors tactile-btn cursor-pointer ${badge.bg} ${badge.border} ${badge.text}`}
            title="Inspect Machine Engine & Schema"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.led} animate-led-blink`} />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold tracking-wider leading-tight">[{badge.code}]</div>
              <div className="text-[8px] text-[#718279] tracking-tight leading-none">{badge.tech}</div>
            </div>
            <ChevronDown className="w-3 h-3 opacity-50 hidden sm:block" />
          </button>

          {/* Ambient Procedural Soundscape Toggle */}
          <button
            onClick={onToggleSoundBar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors tactile-btn cursor-pointer ${
              isSoundActive 
                ? 'bg-[#18261e] text-[#8edba6] border-[#294232]' 
                : 'bg-[#19201c] text-[#7d8e85] border-[#26312a] hover:text-[#edf2ee] hover:bg-[#202924]'
            }`}
            title="Offline Procedural Acoustic Synthesizer"
          >
            {isSoundActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#4eb374]" />
                <span className="hidden sm:inline text-[11px]">ACOUSTIC [ON]</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline text-[11px]">ACOUSTIC</span>
              </>
            )}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/Dev-Suraj-Dhawal/slothflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#26312a] bg-[#19201c] text-[#9aa8a0] hover:text-[#edf2ee] hover:bg-[#202924] text-xs font-mono transition-colors tactile-btn"
            title="Source Code & Schema"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden md:inline text-[11px]">GIT</span>
          </a>
        </div>
      </div>
    </header>
  );
};
