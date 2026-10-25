import React, { useState, useEffect } from 'react';
import { Coffee, Moon, Sun, Sparkles, Smile, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % SLOTH_THOUGHTS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handlePoke = () => {
    setYawnCount((c) => c + 1);
    setIsAsleep(false);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#f59e0b', '#06b6d4']
    });
    onPoked?.();
  };

  return (
    <div className="relative group bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/10 rounded-2xl p-5 shadow-xl overflow-hidden">
      {/* Background leafy glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Sloth SVG Illustration */}
        <div 
          onClick={handlePoke}
          className="relative cursor-pointer select-none transition-transform active:scale-95 hover:scale-105"
          title="Click Sloan the Sloth to poke him!"
        >
          {/* Hanging Branch */}
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
              {/* Branch */}
              <path 
                d="M 5,25 Q 60,35 115,20" 
                stroke="#6b4c35" 
                strokeWidth="6" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Leaves on branch */}
              <path d="M 25,25 C 20,10 35,12 35,24 Z" fill="#10b981" />
              <path d="M 85,22 C 95,8 102,18 92,23 Z" fill="#059669" />
              <path d="M 55,28 C 50,40 62,38 60,28 Z" fill="#34d399" />

              {/* Sloth Body */}
              <ellipse 
                cx="60" 
                cy="68" 
                rx="28" 
                ry="22" 
                fill="#8c7355" 
                className={isProcessing ? 'animate-bounce' : 'animate-sloth-breathe'} 
              />
              
              {/* Arms clinging to branch */}
              <path d="M 42,55 Q 36,32 30,26" stroke="#8c7355" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 78,55 Q 84,32 90,26" stroke="#8c7355" strokeWidth="7" strokeLinecap="round" fill="none" />
              
              {/* Claws */}
              <path d="M 26,24 L 28,29 M 30,23 L 31,28 M 34,24 L 34,29" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
              <path d="M 87,24 L 88,29 M 91,23 L 92,28 M 95,24 L 94,29" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

              {/* Feet */}
              <ellipse cx="48" cy="85" rx="6" ry="5" fill="#755e43" />
              <ellipse cx="72" cy="85" rx="6" ry="5" fill="#755e43" />

              {/* Head */}
              <circle cx="60" cy="56" r="16" fill="#baa386" />
              {/* Sloth Eye Patches */}
              <ellipse cx="53" cy="56" rx="5" ry="3" fill="#614a33" transform="rotate(-15 53 56)" />
              <ellipse cx="67" cy="56" rx="5" ry="3" fill="#614a33" transform="rotate(15 67 56)" />

              {/* Eyes */}
              {isAsleep ? (
                <>
                  <path d="M 51,56 Q 53,58 55,56" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M 65,56 Q 67,58 69,56" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="53" cy="56" r="1.8" fill="#1e293b" />
                  <circle cx="67" cy="56" r="1.8" fill="#1e293b" />
                </>
              )}

              {/* Snout & Smile */}
              <ellipse cx="60" cy="62" rx="6" ry="4" fill="#eedbc5" />
              <ellipse cx="60" cy="61" rx="2.5" ry="1.5" fill="#332415" />
              <path d="M 58,63 Q 60,65 62,63" stroke="#332415" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>

            {/* Zzz or Processing Indicator */}
            {isProcessing ? (
              <span className="absolute -top-1 -right-1 text-xs font-bold text-emerald-400 animate-spin">
                ⚙️
              </span>
            ) : (
              <span className="absolute top-0 right-2 text-xs font-bold text-amber-400 animate-pulse">
                {isAsleep ? 'Zzz...' : '✨'}
              </span>
            )}
          </div>

          <div className="text-center mt-1">
            <span className="text-[11px] font-semibold text-slate-300 px-2 py-0.5 rounded-full bg-slate-800 border border-white/10">
              Sloan the Sloth
            </span>
          </div>
        </div>

        {/* Thought Bubble / Sloth Wisdom */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> Sloan's Chill Wisdom
              </span>
              {statusText && (
                <span className="text-xs text-amber-300 font-medium animate-pulse">
                  {statusText}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button 
                onClick={() => setIsAsleep(!isAsleep)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title={isAsleep ? "Wake up Sloan" : "Put Sloan to sleep"}
              >
                {isAsleep ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setThoughtIndex((prev) => (prev + 1) % SLOTH_THOUGHTS.length)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Next sloth tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative bg-slate-950/70 border border-white/5 rounded-xl p-3.5 text-sm text-slate-200 min-h-[64px] flex items-center">
            <p className="italic text-slate-300">
              "{SLOTH_THOUGHTS[thoughtIndex]}"
            </p>
          </div>

          {/* Quick stats footer under mascot */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              Yawns enjoyed: <strong className="text-amber-400">{yawnCount}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-400/90">
              Optimal energy expenditure: <strong>Minimal</strong>
            </span>
            <span>•</span>
            <span className="text-cyan-400/90">
              Local privacy guarantee: <strong>100%</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
