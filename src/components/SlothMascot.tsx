import React, { useState, useEffect } from 'react';
import { Coffee, Moon, Sun, Sparkles, RefreshCw, Feather, Compass, ChevronDown, ChevronUp } from 'lucide-react';
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
  "Moving at 0.15 mph keeps metabolic stress at absolute zero.",
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
  const [isMinimized, setIsMinimized] = useState(false);
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
      colors: ['#295738', '#785331', '#433959']
    });
    onPoked?.();
  };

  // Minimized Compact Bar Mode (Maximizes workspace on small screens)
  if (isMinimized) {
    return (
      <div className="bg-[#141916] border border-[#222b26] rounded-xl px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={handlePoke}
            className="text-base select-none hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Poke Sloan (+5 Chill)"
          >
            🦥
          </button>
          <span className="text-[10px] text-[#8edba6] font-bold shrink-0 hidden xs:inline">
            SLOAN //
          </span>
          <p className="text-[#a0b0a7] truncate italic text-[11px] font-sans">
            "{SLOTH_THOUGHTS[thoughtIndex]}"
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePoke}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1d2621] hover:bg-[#25332c] text-[#8edba6] border border-[#2e4235] transition-colors cursor-pointer tactile-btn"
          >
            POKE +5
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded bg-[#101413] hover:bg-[#18201c] text-[#718279] hover:text-[#edf2ee] border border-[#222b26] transition-colors cursor-pointer"
            title="Expand Sloan Mascot & Field Notes"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 corner-crosshairs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6">
        {/* Sloth SVG Illustration - Hand-Etched Botanical Style */}
        <div 
          onClick={handlePoke}
          className="relative cursor-pointer select-none transition-transform active:scale-95 shrink-0"
          title="Click specimen to poke Sloan"
        >
          {/* Branch & Sloth SVG */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative flex items-center justify-center">
            <svg viewBox="0 0 140 140" className="w-full h-full">
              {/* Branch with etched botanical wood grain */}
              <path 
                d="M 5,28 Q 70,38 135,22" 
                stroke="#473322" 
                strokeWidth="6" 
                strokeLinecap="round" 
                fill="none" 
              />
              <path 
                d="M 12,28 Q 70,36 128,23" 
                stroke="#332417" 
                strokeWidth="1.5" 
                strokeDasharray="4 3" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* Hand-drawn Leaves with delicate inner vein ribs */}
              <g>
                <path d="M 28,30 C 22,14 38,16 38,28 Z" fill="#2d5e39" />
                <path d="M 33,28 L 30,20" stroke="#1d3d25" strokeWidth="0.8" />
                <path d="M 32,30 C 26,18 42,20 42,32 Z" fill="#387046" />
                <path d="M 37,30 L 33,22" stroke="#244a2e" strokeWidth="0.8" />
                
                <path d="M 98,24 C 110,10 118,22 106,26 Z" fill="#244d2f" />
                <path d="M 102,23 L 109,16" stroke="#17331f" strokeWidth="0.8" />
                
                <path d="M 64,34 C 58,46 72,44 70,33 Z" fill="#428052" />
                <path d="M 67,36 L 63,42" stroke="#2a5234" strokeWidth="0.8" />
              </g>

              {/* Sloth Body */}
              <ellipse 
                cx="70" 
                cy="76" 
                rx="30" 
                ry="24" 
                fill="#735b43" 
                className={isProcessing ? 'animate-bounce' : 'animate-sloth-breathe'} 
              />
              
              {/* Hand-etched belly contour */}
              <ellipse cx="70" cy="80" rx="18" ry="14" fill="#8c7155" />
              <path d="M 62,82 Q 70,86 78,82" stroke="#755e46" strokeWidth="1" fill="none" strokeDasharray="2 2" />

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
                  <circle cx="62" cy="62" r="2.2" fill="#141a16" />
                  <circle cx="61.5" cy="61.3" r="0.8" fill="#ffffff" />
                  <circle cx="78" cy="62" r="2.2" fill="#141a16" />
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
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-[#21472e] text-[#b8f0ca] text-[9px] font-mono border border-[#326944] animate-fade-in shadow-md">
                POKE // +5 CHILL
              </div>
            )}

            {/* State LED */}
            {isProcessing ? (
              <span className="absolute top-1 right-1 text-xs font-bold text-[#4eb374] animate-spin">
                ⚙️
              </span>
            ) : (
              <span className="absolute top-1 right-1 text-xs font-mono text-[#c79b6d]">
                {isAsleep ? 'Zzz' : '●'}
              </span>
            )}
          </div>

          <div className="text-center mt-0.5">
            <span className="text-[9px] font-mono text-[#8a9991] px-1.5 py-0.2 rounded bg-[#1b221e] border border-[#26312a]">
              SLOAN
            </span>
          </div>
        </div>

        {/* Thought Box & Field Log */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#8edba6] bg-[#1a2820] px-2 py-0.5 rounded border border-[#273d30] shrink-0">
                <Compass className="w-3 h-3 text-[#4eb374]" /> FIELD_LOG // 042
              </span>
              {statusText && (
                <span className="text-[10px] sm:text-xs text-[#deb992] font-mono bg-[#241c14] px-2 py-0.5 rounded border border-[#3b2d20] truncate">
                  {statusText}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => setIsAsleep(!isAsleep)}
                className="text-[#7d8e85] hover:text-[#edf2ee] p-1 rounded hover:bg-[#1f2723] transition-colors cursor-pointer"
                title={isAsleep ? "Wake up Sloan" : "Put Sloan to sleep"}
              >
                {isAsleep ? <Sun className="w-3.5 h-3.5 text-[#c79b6d]" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setThoughtIndex((prev) => (prev + 1) % SLOTH_THOUGHTS.length)}
                className="text-[#7d8e85] hover:text-[#edf2ee] p-1 rounded hover:bg-[#1f2723] transition-colors cursor-pointer"
                title="Next sloth tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-[#7d8e85] hover:text-[#edf2ee] p-1 rounded hover:bg-[#1f2723] transition-colors cursor-pointer ml-0.5"
                title="Minimize Sloan to save space"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thought Box - Field Notebook Style */}
          <div className="bg-[#0e1210] border border-[#222b26] rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-[#cbd6cf] min-h-[56px] sm:min-h-[64px] flex items-center relative">
            <span className="absolute top-1 right-2 text-[8px] font-mono text-[#435249] hidden xs:inline">DOCTRINE</span>
            <p className="italic text-[#d6deda] font-sans tracking-tight leading-relaxed">
              "{SLOTH_THOUGHTS[thoughtIndex]}"
            </p>
          </div>

          {/* Metrics under mascot */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-2.5 text-[10px] sm:text-xs text-[#718279] font-mono">
            <span className="flex items-center gap-1 text-[#9aa8a0]">
              <Coffee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#bd8748]" />
              YAWNS: <strong className="text-[#edf2ee] tabular-nums font-bold">{yawnCount}</strong>
            </span>
            <span className="text-[#252f29]">•</span>
            <span className="flex items-center gap-1 text-[#78aa8e]">
              <Feather className="w-3 h-3 text-[#4eb374]" />
              SPEED: <strong className="text-[#8edba6]">0.15 MPH</strong>
            </span>
            <span className="text-[#252f29] hidden xs:inline">•</span>
            <span className="hidden xs:inline">
              EGRESS: <strong className="text-[#8a9991]">0 KB</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
