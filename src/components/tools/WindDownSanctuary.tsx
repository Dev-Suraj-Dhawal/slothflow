import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sparkles, 
  Volume2, 
  Pause, 
  Play,
  ZapOff,
  BookOpen
} from 'lucide-react';
import { AIProvider, BedtimeStoryResult } from '../../types';
import { openAiService } from '../../services/openAiService';
import { soundEngine } from '../../services/soundEngine';

interface WindDownSanctuaryProps {
  currentProvider: AIProvider;
  onOpenSoundBar: () => void;
  onEffortSaved: (minutes: number, calories: number) => void;
}

export const WindDownSanctuary: React.FC<WindDownSanctuaryProps> = ({
  currentProvider,
  onOpenSoundBar,
  onEffortSaved
}) => {
  const [theme, setTheme] = useState('A sleepy sloth watching fireflies in the Costa Rican cloud forest');
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<BedtimeStoryResult | null>(null);

  // Breathing Guide State
  const [isBreathingActive, setIsBreathingActive] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Slow Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);

  // 4-7-8 Breathing Cycle
  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((sec) => {
        if (sec <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Slow Exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const handleGenerateStory = async () => {
    setLoading(true);
    setProgressMsg('Slowly weaving tranquil nocturnal prose...');
    try {
      const res = await openAiService.generateBedtimeStory(theme, currentProvider, (msg) => {
        setProgressMsg(msg);
      });
      setResult(res);
      soundEngine.playGentleChime();
      onEffortSaved(20, 30);
    } catch (e: unknown) {
      alert((e as Error).message || 'Failed to generate bedtime story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-7-8 Sloth Breathing Guide */}
      <div className="bg-gradient-to-b from-[#13172e]/60 via-[#0d121b]/80 to-[#07090e]/95 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/60 hover:bg-indigo-900/60 px-3 py-1.5 rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
          >
            {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isBreathingActive ? 'Pause' : 'Resume'}</span>
          </button>
        </div>

        <span className="text-[11px] font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30 mb-2 inline-block">
          🦥 4-7-8 Sloth Breathing Cadence
        </span>

        {/* Breathing Orb */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outermost Ripple */}
            <div 
              className={`absolute inset-0 rounded-full border border-indigo-500/20 transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-125 opacity-60' 
                  : breathPhase === 'Hold'
                    ? 'scale-120 opacity-90'
                    : 'scale-90 opacity-20'
              }`}
            />
            {/* Mid Ripple */}
            <div 
              className={`absolute inset-4 rounded-full border border-teal-500/30 transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-115 bg-teal-500/10' 
                  : breathPhase === 'Hold'
                    ? 'scale-110 bg-indigo-500/15'
                    : 'scale-95 bg-slate-950/60'
              }`}
            />
            {/* Inner pulsating circle */}
            <div 
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-2xl ${
                breathPhase === 'Inhale'
                  ? 'bg-gradient-to-tr from-teal-600 to-indigo-600 shadow-teal-500/40 scale-105'
                  : breathPhase === 'Hold'
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-purple-500/40 scale-105'
                    : 'bg-gradient-to-tr from-slate-800 to-indigo-950 scale-90 opacity-80'
              }`}
            >
              <span className="text-xs font-bold tracking-wider uppercase opacity-90">{breathPhase}</span>
              <span className="text-3xl font-extrabold mt-0.5 tabular-nums">{secondsLeft}s</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium max-w-sm">
            Calibrated to Sloan's resting respiratory rate: activates the parasympathetic nervous system in 2 minutes.
          </p>
        </div>
      </div>

      {/* Bedtime Micro-Story Generator */}
      <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Moon className="w-4 h-4" />
              </span>
              Offline Wind-Down & Bedtime Companion
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Slow down mental chatter before sleep. Open-weight models synthesize tranquil micro-stories at a soothing rhythm, running entirely on your machine.
            </p>
          </div>

          <button
            onClick={onOpenSoundBar}
            className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 self-end sm:self-auto transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Open Ambient Sound Mixer</span>
          </button>
        </div>

        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Story setting / sleepy nocturnal theme:
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-[#07090e]/85 border border-white/[0.08] rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-indigo-400" />
            100% offline — won't ping corporate servers in your bedroom
          </span>

          <button
            onClick={handleGenerateStory}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-950/60 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'Weaving story...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Bedtime Reflection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Story Display with Literary Serif Styling */}
      {result && (
        <div className="bg-[#0b0e1a]/90 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <h3 className="text-lg font-bold text-indigo-200 flex items-center gap-2 font-serif-reading">
              <BookOpen className="w-4 h-4 text-indigo-400" /> {result.title}
            </h3>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
              {result.ambientRecommendation}
            </span>
          </div>

          {/* Literary Serif Body */}
          <div className="font-serif-reading text-slate-200 text-base leading-loose space-y-4 max-w-3xl">
            {result.storyMarkdown.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-300 first-letter:text-3xl first-letter:font-bold first-letter:text-indigo-300 first-letter:float-left first-letter:mr-2">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
