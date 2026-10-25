import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Cpu, 
  ShieldCheck, 
  ZapOff 
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
          label: 'WebGPU Open-Weights (In-Browser)',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'local-ollama':
        return {
          label: 'Local Ollama Engine',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400'
        };
      case 'distilled-sloth':
        return {
          label: 'Distilled Sloth (Instant Heuristics)',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'huggingface-api':
        return {
          label: 'Hugging Face Open Hub',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400'
        };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f17]/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-amber-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/50 border border-white/15 select-none animate-gentle-float">
              🦥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  SlothFlow <span className="text-emerald-400 font-extrabold text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">AI</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-amber-400/90 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Slow & Steady
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Open-source AI that does the work so you don't have to.
              </p>
            </div>
          </div>

          {/* Quick status pill on mobile */}
          <button 
            onClick={onOpenEngineModal}
            className="md:hidden flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border bg-slate-900 border-slate-800 text-slate-300"
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Center: Live Laziness / Effort Conserved Metrics */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-slate-300 shadow-inner">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ZapOff className="w-4 h-4 text-emerald-400" />
            <span>{stats.timeSavedMinutes}m</span>
            <span className="text-slate-400 font-normal">Effort Saved</span>
          </div>
          <div className="w-px h-3.5 bg-white/15" />
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span>{stats.caloriesConserved} kcal</span>
            <span className="text-slate-400 font-normal">Conserved</span>
          </div>
          <div className="w-px h-3.5 bg-white/15" />
          <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>100% Private</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Active Provider Selector Button */}
          <button
            onClick={onOpenEngineModal}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:brightness-110 cursor-pointer ${badge.color}`}
            title="Switch AI Runtime"
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            <Cpu className="w-3.5 h-3.5 opacity-80" />
            <span>{badge.label}</span>
          </button>

          {/* Ambient Soundscape Toggle */}
          <button
            onClick={onToggleSoundBar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isSoundActive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-900/40' 
                : 'bg-slate-900/90 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
            title="Toggle Ambient Offline Soundscape"
          >
            {isSoundActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Ambient Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ambient Off</span>
              </>
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Dev-Suraj-Dhawal/slothflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
