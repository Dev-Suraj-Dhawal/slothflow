import React, { useState, useEffect } from 'react';
import { Coffee, Moon, Sun, Sparkles, Smile, RefreshCw, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';

interface SlothMascotProps {
  onPoked?: () => void;
  statusText?: string;
  isProcessing?: boolean;
}

const SLOTH_THOUGHTS = [
  "Why write a 3-paragraph reply when 12 words do the trick?",
  "Open weights mean nobody is selling your messy drafts to advertisers.",
  "Moving at 0.15 mph keeps stress at absolute zero.",
  "International Sloth Day reminder: conserving energy is peak efficiency.",
  "Running models locally: zero subscription fees, zero cloud outages.",
  "Never stand staring into the open fridge again. Delegate it to me.",
  "Your unread group chats are 95% noise. Let me filter the 5%."
];

export const SlothMascot: React.FC<SlothMascotProps> = ({
  onPoked,
  statusText,
  isProcessing = false
}) => {
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [isAsleep, setIsAsleep] = useState(false);
  const [yawnCount, setYawnCount] = useState(0);
  const [showPokeFeedback, setShowPokeFeedback] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % SLOTH_THOUGHTS.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  const handlePoke = () => {
    setYawnCount((c) => c + 1);
    setIsAsleep(false);
    setShowPokeFeedback(true);
    setTimeout(() => setShowPokeFeedback(false), 2200);

    soundEngine.playGentleChime();
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.65 },
      colors: ['#10b981', '#f59e0b', '#06b6d4']
    });
    onPoked?.();
  };

  return (
    <div className="relative group bg-gradient-to-b from-[#0d121b]/90 via-[#0a0e16]/80 to-[#07090e]/95 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden glass-card-interactive">
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Bioluminescent Floating Fireflies */}
      <div className="absolute top-6 left-1/4 w-1.5 h-1.5 rounded-full bg-emerald-400/60 shadow-lg shadow-emerald-400 blur-[0.5px] animate-firefly-1 pointer-events-none" />
      <div className="absolute bottom-8 right-1/3 w-1 h-1 rounded-full bg-amber-300/60 shadow-lg shadow-amber-300 blur-[0.5px] animate-firefly-2 pointer-events-none" />
      <div className="absolute top-12 right-20 w-1.5 h-1.5 rounded-full bg-teal-300/50 shadow-lg shadow-teal-300 blur-[0.5px] animate-firefly-3 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Sloth SVG Illustration */}
        <div 
          onClick={handlePoke}
          className="relative cursor-pointer select-none transition-transform active:scale-95 hover:scale-105 shrink-0"
          title="Click to gently poke Sloan the Sloth!"
        >
          {/* Hanging Branch SVG */}
          <div className="w-36 h-36 relative flex items-center justify-center">
            <svg viewBox="0 0 140 140" className="w-32 h-32 drop-shadow-xl animate-branch-sway">
              {/* Curved Rainforest Branch with organic texture */}
              <path 
                d="M 5,28 Q 70,42 135,22" 
                stroke="#5c4028" 
                strokeWidth="7" 
                strokeLinecap="round" 
                fill="none" 
              />
              <path 
                d="M 12,29 Q 70,40 130,23" 
                stroke="#432c1b" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
                opacity="0.6"
              />

              {/* Hanging Rainforest Leaves */}
              <path d="M 28,30 C 22,12 38,14 38,28 Z" fill="#059669" />
              <path d="M 32,30 C 26,16 42,18 42,32 Z" fill="#10b981" opacity="0.8" />
              <path d="M 98,24 C 110,8 118,20 106,26 Z" fill="#047857" />
              <path d="M 64,34 C 58,48 72,46 70,33 Z" fill="#34d399" />
              <path d="M 112,22 C 122,10 130,22 120,24 Z" fill="#10b981" />

              {/* Sloth Body with organic radial gradient */}
              <defs>
                <radialGradient id="slothFur" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#967e63" />
                  <stop offset="85%" stopColor="#7a6248" />
                  <stop offset="100%" stopColor="#634e38" />
                </radialGradient>
                <radialGradient id="slothFace" cx="50%" cy="45%" r="50%">
                  <stop offset="0%" stopColor="#f3e6d5" />
                  <stop offset="100%" stopColor="#d8c2a7" />
                </radialGradient>
              </defs>

              {/* Body */}
              <ellipse 
                cx="70" 
                cy="76" 
                rx="30" 
                ry="24" 
                fill="url(#slothFur)" 
                className={isProcessing ? 'animate-bounce' : 'animate-sloth-breathe'} 
              />
              
              {/* Fur texture belly patch */}
              <ellipse cx="70" cy="80" rx="18" ry="14" fill="#a48c71" opacity="0.45" />

              {/* Arms clinging to branch */}
              <path d="M 50,64 Q 44,40 36,31" stroke="#7a6248" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 90,64 Q 96,40 104,31" stroke="#7a6248" strokeWidth="8" strokeLinecap="round" fill="none" />
              
              {/* Claws */}
              <path d="M 32,29 L 34,34 M 36,28 L 37,33 M 40,29 L 40,34" stroke="#e2e8f0" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 100,29 L 101,34 M 104,28 L 105,33 M 108,29 L 107,34" stroke="#e2e8f0" strokeWidth="2.2" strokeLinecap="round" />

              {/* Hanging Back Feet */}
              <ellipse cx="57" cy="94" rx="7" ry="5.5" fill="#634e38" />
              <ellipse cx="83" cy="94" rx="7" ry="5.5" fill="#634e38" />
              <path d="M 55,97 L 55,100 M 58,98 L 58,101" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 82,98 L 82,101 M 85,97 L 85,100" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />

              {/* Head */}
              <circle cx="70" cy="62" r="18" fill="url(#slothFur)" />
              
              {/* Sloth Mask Patches */}
              <ellipse cx="62" cy="62" rx="6" ry="3.5" fill="#523d29" transform="rotate(-15 62 62)" />
              <ellipse cx="78" cy="62" rx="6" ry="3.5" fill="#523d29" transform="rotate(15 78 62)" />

              {/* Eyes */}
              {isAsleep ? (
                <>
                  <path d="M 59,62 Q 62,65 65,62" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M 75,62 Q 78,65 81,62" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="62" cy="62" r="2.2" fill="#0f172a" />
                  <circle cx="61.5" cy="61.2" r="0.8" fill="#ffffff" />
                  <circle cx="78" cy="62" r="2.2" fill="#0f172a" />
                  <circle cx="77.5" cy="61.2" r="0.8" fill="#ffffff" />
                </>
              )}

              {/* Snout & Smile */}
              <ellipse cx="70" cy="69" rx="7.5" ry="5" fill="url(#slothFace)" />
              <ellipse cx="70" cy="67.5" rx="3" ry="1.8" fill="#2d1c10" />
              <path d="M 67.5,70 Q 70,72.5 72.5,70" stroke="#2d1c10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>

            {/* Float Poke Feedback */}
            {showPokeFeedback && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold shadow-lg animate-bounce z-20">
                +5 Chill Points! 🦥
              </div>
            )}

            {/* Processing Gear or Zzz indicator */}
            {isProcessing ? (
              <span className="absolute top-2 right-2 text-xs font-bold text-emerald-400 animate-spin">
                ⚙️
              </span>
            ) : (
              <span className="absolute top-2 right-2 text-xs font-semibold text-amber-400 animate-pulse">
                {isAsleep ? 'Zzz...' : '✨'}
              </span>
            )}
          </div>

          <div className="text-center mt-1">
            <span className="text-[11px] font-bold text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-white/10 shadow-sm">
              Sloan the Sloth
            </span>
          </div>
        </div>

        {/* Thought Bubble / Sloth Wisdom */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Sloan's Chill Manifesto
              </span>
              {statusText && (
                <span className="text-xs text-amber-300 font-semibold animate-pulse bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {statusText}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsAsleep(!isAsleep)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title={isAsleep ? "Wake up Sloan" : "Put Sloan to sleep"}
              >
                {isAsleep ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setThoughtIndex((prev) => (prev + 1) % SLOTH_THOUGHTS.length)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next sloth tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thought Box with Refined Typography */}
          <div className="relative bg-[#07090e]/75 border border-white/[0.08] rounded-xl p-4 text-sm text-slate-200 min-h-[70px] flex items-center shadow-inner">
            <span className="text-2xl text-emerald-500/30 font-serif leading-none mr-2 select-none self-start">“</span>
            <p className="italic text-slate-200 font-sans tracking-tight leading-relaxed">
              {SLOTH_THOUGHTS[thoughtIndex]}
            </p>
            <span className="text-2xl text-emerald-500/30 font-serif leading-none ml-2 select-none self-end">”</span>
          </div>

          {/* Micro-metrics under mascot */}
          <div className="flex flex-wrap items-center gap-3.5 mt-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-300">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              Yawns enjoyed: <strong className="text-amber-300 tabular-nums">{yawnCount}</strong>
            </span>
            <span className="text-white/10">•</span>
            <span className="flex items-center gap-1 text-emerald-300/90">
              <Feather className="w-3 h-3 text-emerald-400" />
              Energy state: <strong className="text-emerald-400">Peak Conservation</strong>
            </span>
            <span className="text-white/10">•</span>
            <span className="text-cyan-300/90">
              Telemetry: <strong className="text-cyan-400">0 KB off-device</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
