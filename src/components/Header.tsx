import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
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
          bg: 'bg-[#18261e]',
          border: 'border-[#284232]',
          text: 'text-[#9ed4b0]',
          dot: 'bg-[#55b376]'
        };
      case 'local-ollama':
        return {
          label: 'Local Ollama',
          tech: 'localhost:11434',
          bg: 'bg-[#192426]',
          border: 'border-[#273d42]',
          text: 'text-[#96cfd9]',
          dot: 'bg-[#4faab8]'
        };
      case 'distilled-sloth':
        return {
          label: 'Distilled Heuristics',
          tech: '50ms Response',
          bg: 'bg-[#2b2218]',
          border: 'border-[#473624]',
          text: 'text-[#e0b889]',
          dot: 'bg-[#c28f53]'
        };
      case 'huggingface-api':
        return {
          label: 'Hugging Face Hub',
          tech: 'Remote Open Weights',
          bg: 'bg-[#231e2e]',
          border: 'border-[#3a304d]',
          text: 'text-[#beafdc]',
          dot: 'bg-[#9882c4]'
        };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 border-b border-[#242d29] bg-[#161b19] px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenEngineModal}
            className="w-10 h-10 rounded-xl bg-[#222b27] border border-[#2e3b35] flex items-center justify-center text-xl hover:bg-[#28332e] transition-colors cursor-pointer select-none"
            title="Inspect AI Engine"
          >
            🦥
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-[#f0f3f1] flex items-center gap-1.5 font-sans">
                SlothFlow
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#1c2a22] text-[#9ed4b0] border border-[#2b4234]">
                  AI
                </span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-[#d9ba96] uppercase px-2 py-0.5 rounded-full bg-[#2a221a] border border-[#423426]">
                <Sparkles className="w-2.5 h-2.5 text-[#c79b6d]" /> Slow & Steady
              </span>
            </div>
            <p className="text-[11px] text-[#8e9c95] font-medium">
              Open-source AI that does the dread work so you can relax.
            </p>
          </div>
        </div>

        {/* Center: Precision Telemetry / Laziness Metrics */}
        <div className="hidden lg:flex items-center gap-4 bg-[#1b221f] border border-[#26312c] rounded-xl px-4 py-1.5 text-xs text-[#a0ada6]">
          <div className="flex items-center gap-1.5 font-medium">
            <ZapOff className="w-3.5 h-3.5 text-[#55b376]" />
            <span className="font-bold tabular-nums text-[#f0f3f1]">{stats.timeSavedMinutes}m</span>
            <span className="text-[#7c8a83] text-[11px]">Effort Saved</span>
          </div>
          <div className="w-px h-3.5 bg-[#2a3630]" />
          <div className="flex items-center gap-1.5 font-medium">
            <Flame className="w-3.5 h-3.5 text-[#c79b6d]" />
            <span className="font-bold tabular-nums text-[#f0f3f1]">{stats.caloriesConserved}</span>
            <span className="text-[#7c8a83] text-[11px]">kcal Conserved</span>
          </div>
          <div className="w-px h-3.5 bg-[#2a3630]" />
          <div className="flex items-center gap-1.5 font-medium text-[#8ac7ab]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#55b376]" />
            <span className="text-[11px]">100% Private (WebGPU)</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Active Provider Selector Button */}
          <button
            onClick={onOpenEngineModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${badge.bg} ${badge.border} ${badge.text}`}
            title="Inspect or Switch Open-Source Engine"
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            <div className="text-left hidden sm:block">
              <div className="font-semibold leading-tight">{badge.label}</div>
              <div className="text-[9px] text-[#7d8b84] font-mono leading-none">{badge.tech}</div>
            </div>
            <ChevronDown className="w-3 h-3 opacity-60 hidden sm:block" />
          </button>

          {/* Ambient Procedural Soundscape Toggle */}
          <button
            onClick={onToggleSoundBar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isSoundActive 
                ? 'bg-[#1b2a22] text-[#9ed4b0] border-[#2f4939]' 
                : 'bg-[#1c2320] text-[#8e9c95] border-[#28332e] hover:text-[#f0f3f1] hover:bg-[#222b27]'
            }`}
            title="Offline Procedural Ambient Soundscape (Rain, Forest, Brown Noise)"
          >
            {isSoundActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#55b376]" />
                <span className="hidden sm:inline">Soundscape</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#55b376]" />
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-70" />
                <span className="hidden sm:inline">Ambient</span>
              </>
            )}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/Dev-Suraj-Dhawal/slothflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#28332e] bg-[#1c2320] text-[#a0ada6] hover:text-[#f0f3f1] hover:bg-[#222b27] text-xs font-medium transition-colors"
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
