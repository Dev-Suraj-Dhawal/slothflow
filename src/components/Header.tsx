import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Cpu, 
  ShieldCheck, 
  ZapOff,
  Flame,
  ChevronDown
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
          label: 'In-Browser WebGPU',
          tech: 'Qwen2.5 / ONNX Web',
          color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50',
          dot: 'bg-emerald-400'
        };
      case 'local-ollama':
        return {
          label: 'Local Ollama Daemon',
          tech: 'localhost:11434',
          color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:border-cyan-500/50',
          dot: 'bg-cyan-400'
        };
      case 'distilled-sloth':
        return {
          label: 'Distilled Heuristics',
          tech: '0ms Latency',
          color: 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:border-amber-500/50',
          dot: 'bg-amber-400'
        };
      case 'huggingface-api':
        return {
          label: 'Hugging Face Hub',
          tech: 'Open Model Router',
          color: 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:border-purple-500/50',
          dot: 'bg-purple-400'
        };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#07090e]/85 backdrop-blur-xl px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onOpenEngineModal}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/90 via-teal-700/80 to-slate-900 flex items-center justify-center text-xl shadow-lg shadow-emerald-950/60 border border-emerald-500/30 group-hover:scale-105 transition-all">
              🦥
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#07090e] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                SlothFlow
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-amber-300/90 uppercase px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Slow & Steady
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Open-weight AI that does the dread work so you can relax.
            </p>
          </div>
        </div>

        {/* Center: Precision Telemetry / Laziness Metrics */}
        <div className="hidden lg:flex items-center gap-3.5 bg-slate-900/60 border border-white/[0.08] rounded-xl px-4 py-1.5 text-xs text-slate-300 shadow-inner">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ZapOff className="w-3.5 h-3.5 text-emerald-400/90" />
            <span className="font-bold tabular-nums text-white">{stats.timeSavedMinutes}m</span>
            <span className="text-slate-400 text-[11px]">Effort Eliminated</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400/90" />
            <span className="font-bold tabular-nums text-white">{stats.caloriesConserved}</span>
            <span className="text-slate-400 text-[11px]">kcal Conserved</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-teal-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-300 text-[11px]">100% Private (WebGPU)</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Active Provider Selector Button */}
          <button
            onClick={onOpenEngineModal}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-sm ${badge.color}`}
            title="Inspect or Switch Open-Source Engine"
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            <div className="text-left hidden sm:block">
              <div className="font-semibold leading-tight">{badge.label}</div>
              <div className="text-[9px] text-slate-400 font-mono leading-none">{badge.tech}</div>
            </div>
            <ChevronDown className="w-3 h-3 opacity-60 hidden sm:block" />
          </button>

          {/* Ambient Procedural Soundscape Toggle */}
          <button
            onClick={onToggleSoundBar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              isSoundActive 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/50' 
                : 'bg-slate-900/80 text-slate-400 border-white/[0.08] hover:text-slate-200 hover:border-white/15'
            }`}
            title="Offline Procedural Ambient Soundscape (Rain, Forest, Brown Noise)"
          >
            {isSoundActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Soundscape</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-70" />
                <span className="hidden sm:inline text-slate-400">Ambient</span>
              </>
            )}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/Dev-Suraj-Dhawal/slothflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
            title="View Open-Source Repository on GitHub"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden md:inline font-mono text-[11px]">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
