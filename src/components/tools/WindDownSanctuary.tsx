import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sparkles, 
  Heart, 
  Wind, 
  Volume2, 
  RefreshCw, 
  Pause, 
  Play,
  ZapOff 
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
      <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/30"
          >
            {isBreathingActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isBreathingActive ? 'Pause' : 'Resume'}</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 mb-3 inline-block">
          🦥 4-7-8 Sloth Breathing Cadence
        </span>

        {/* Breathing Orb */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer animated ring */}
            <div 
              className={`absolute inset-0 rounded-full border-2 border-indigo-500/40 transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-110 bg-indigo-500/10 shadow-lg shadow-indigo-500/20' 
                  : breathPhase === 'Hold'
                    ? 'scale-110 bg-purple-500/15'
                    : 'scale-90 bg-slate-950/60'
              }`}
            />
            {/* Inner pulsating circle */}
            <div 
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'bg-gradient-to-tr from-indigo-600 to-teal-600 shadow-xl shadow-teal-500/30 scale-105'
                  : breathPhase === 'Hold'
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-700 shadow-xl shadow-purple-500/30 scale-105'
                    : 'bg-gradient-to-tr from-slate-800 to-indigo-900 scale-95 opacity-80'
              }`}
            >
              <span className="text-sm font-bold tracking-wide">{breathPhase}</span>
              <span className="text-2xl font-extrabold mt-0.5">{secondsLeft}s</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Matches Sloan's resting respiratory rate: calms the vagus nerve in under 2 minutes.
          </p>
        </div>
      </div>

      {/* Bedtime Micro-Story Generator */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              Offline Wind-Down & Bedtime Companion
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Slow down mental chatter before sleep. Open-weight models synthesize tranquil micro-stories at a soothing rhythm, running entirely on your machine.
            </p>
          </div>

          <button
            onClick={onOpenSoundBar}
            className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 self-end sm:self-auto"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Open Ambient Sound Mixer</span>
          </button>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Story setting / sleepy theme:
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 font-medium"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-indigo-400" />
            100% offline — won't ping corporate servers in your bedroom
          </span>

          <button
            onClick={handleGenerateStory}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-950/50 disabled:opacity-50 cursor-pointer"
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

      {/* Generated Story Display */}
      {result && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-indigo-200 flex items-center gap-2">
              📖 {result.title}
            </h3>
            <span className="text-xs text-indigo-400 font-medium">
              Suggested: {result.ambientRecommendation}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-loose space-y-3 font-serif">
            {result.storyMarkdown.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
