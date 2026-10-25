import React, { useState, useEffect } from 'react';
import { Coffee, Moon, Sun, Sparkles, RefreshCw, Feather } from 'lucide-react';
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
    setTimeout(() => setShowPokeFeedback(false), 2000);

    soundEngine.playGentleChime();
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.65 },
      colors: ['#2e6f40', '#8f6036', '#4a6b5d']
    });
    onPoked?.();
  };

  return (
    <div className="relative bg-[#161b19] border border-[#242d29] rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Sloth SVG Illustration - Flat, Clean, Natural */}
        <div 
          onClick={handlePoke}
          className="relative cursor-pointer select-none transition-transform active:scale-95 shrink-0"
          title="Click to gently poke Sloan the Sloth!"
        >
          {/* Branch & Sloth SVG */}
          <div className="w-36 h-36 relative flex items-center justify-center">
            <svg viewBox="0 0 140 140" className="w-32 h-32">
              {/* Natural Branch */}
              <path 
                d="M 5,28 Q 70,38 135,22" 
                stroke="#473322" 
                strokeWidth="6" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Natural Flat Leaves */}
              <path d="M 28,30 C 22,14 38,16 38,28 Z" fill="#2d5e39" />
              <path d="M 32,30 C 26,18 42,20 42,32 Z" fill="#3b7549" />
              <path d="M 98,24 C 110,10 118,22 106,26 Z" fill="#244d2f" />
              <path d="M 64,34 C 58,46 72,44 70,33 Z" fill="#428052" />

              {/* Sloth Body */}
              <ellipse 
                cx="70" 
                cy="76" 
                rx="30" 
                ry="24" 
                fill="#735b43" 
                className={isProcessing ? 'animate-bounce' : 'animate-sloth-breathe'} 
              />
              
              {/* Belly patch */}
              <ellipse cx="70" cy="80" rx="18" ry="14" fill="#8c7155" />

              {/* Arms */}
              <path d="M 50,64 Q 44,40 36,31" stroke="#735b43" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 90,64 Q 96,40 104,31" stroke="#735b43" strokeWidth="8" strokeLinecap="round" fill="none" />
              
              {/* Claws */}
              <path d="M 32,29 L 34,34 M 36,28 L 37,33 M 40,29 L 40,34" stroke="#d5ddd8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 100,29 L 101,34 M 104,28 L 105,33 M 108,29 L 107,34" stroke="#d5ddd8" strokeWidth="2" strokeLinecap="round" />

              {/* Hanging Back Feet */}
              <ellipse cx="57" cy="94" rx="7" ry="5.5" fill="#594430" />
              <ellipse cx="83" cy="94" rx="7" ry="5.5" fill="#594430" />
              <path d="M 55,97 L 55,100 M 58,98 L 58,101" stroke="#d5ddd8" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 82,98 L 82,101 M 85,97 L 85,100" stroke="#d5ddd8" strokeWidth="1.8" strokeLinecap="round" />

              {/* Head */}
              <circle cx="70" cy="62" r="18" fill="#735b43" />
              
              {/* Sloth Eye Patches */}
              <ellipse cx="62" cy="62" rx="6" ry="3.5" fill="#4d3b2b" transform="rotate(-15 62 62)" />
              <ellipse cx="78" cy="62" rx="6" ry="3.5" fill="#4d3b2b" transform="rotate(15 78 62)" />

              {/* Eyes */}
              {isAsleep ? (
                <>
                  <path d="M 59,62 Q 62,65 65,62" stroke="#1d2420" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M 75,62 Q 78,65 81,62" stroke="#1d2420" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="62" cy="62" r="2.2" fill="#1d2420" />
                  <circle cx="61.5" cy="61.3" r="0.8" fill="#ffffff" />
                  <circle cx="78" cy="62" r="2.2" fill="#1d2420" />
                  <circle cx="77.5" cy="61.3" r="0.8" fill="#ffffff" />
                </>
              )}

              {/* Snout */}
              <ellipse cx="70" cy="69" rx="7.5" ry="5" fill="#e0c9b1" />
              <ellipse cx="70" cy="67.5" rx="3" ry="1.8" fill="#2b1f14" />
              <path d="M 67.5,70 Q 70,72.5 72.5,70" stroke="#2b1f14" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>

            {/* Float Poke Feedback */}
            {showPokeFeedback && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded bg-[#2b613b] text-[#e8f5ec] text-[10px] font-bold border border-[#3c7d50]">
                +5 Chill Points
              </div>
            )}

            {/* Status indicator */}
            {isProcessing ? (
              <span className="absolute top-2 right-2 text-xs font-bold text-[#55b376] animate-spin">
                ⚙️
              </span>
            ) : (
              <span className="absolute top-2 right-2 text-xs font-semibold text-[#c79b6d]">
                {isAsleep ? 'Zzz...' : '•'}
              </span>
            )}
          </div>

          <div className="text-center mt-1">
            <span className="text-[11px] font-semibold text-[#a0ada6] px-2.5 py-0.5 rounded bg-[#1e2622] border border-[#2b3731]">
              Sloan the Sloth
            </span>
          </div>
        </div>

        {/* Thought Box */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9ed4b0] bg-[#1a2820] px-2 py-0.5 rounded border border-[#294233]">
                <Sparkles className="w-3 h-3 text-[#55b376]" /> Sloan's Chill Manifesto
              </span>
              {statusText && (
                <span className="text-xs text-[#d9ba96] font-medium bg-[#2a2219] px-2 py-0.5 rounded border border-[#3d3123]">
                  {statusText}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsAsleep(!isAsleep)}
                className="text-[#8e9c95] hover:text-[#f0f3f1] p-1 rounded hover:bg-[#202724] transition-colors cursor-pointer"
                title={isAsleep ? "Wake up Sloan" : "Put Sloan to sleep"}
              >
                {isAsleep ? <Sun className="w-3.5 h-3.5 text-[#c79b6d]" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setThoughtIndex((prev) => (prev + 1) % SLOTH_THOUGHTS.length)}
                className="text-[#8e9c95] hover:text-[#f0f3f1] p-1 rounded hover:bg-[#202724] transition-colors cursor-pointer"
                title="Next sloth tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thought Box - Plain, Clean, Natural */}
          <div className="bg-[#111413] border border-[#242d29] rounded-xl p-4 text-sm text-[#d6deda] min-h-[68px] flex items-center">
            <p className="italic text-[#d6deda] font-sans tracking-tight leading-relaxed">
              "{SLOTH_THOUGHTS[thoughtIndex]}"
            </p>
          </div>

          {/* Metrics under mascot */}
          <div className="flex flex-wrap items-center gap-3.5 mt-3 text-xs text-[#7e8c85]">
            <span className="flex items-center gap-1 text-[#a0ada6]">
              <Coffee className="w-3.5 h-3.5 text-[#c79b6d]" />
              Yawns enjoyed: <strong className="text-[#f0f3f1] tabular-nums">{yawnCount}</strong>
            </span>
            <span className="text-[#2a3630]">•</span>
            <span className="flex items-center gap-1 text-[#8ab89b]">
              <Feather className="w-3 h-3 text-[#55b376]" />
              Energy state: <strong className="text-[#9ed4b0]">Peak Conservation</strong>
            </span>
            <span className="text-[#2a3630]">•</span>
            <span>
              Telemetry: <strong className="text-[#8e9c95]">0 KB off-device</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
