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
      {/* 4-7-8 Sloth Breathing Guide - Flat, Solid, Calming */}
      <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-6 sm:p-8 text-center relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="text-xs text-[#a0ada6] hover:text-[#f0f3f1] flex items-center gap-1.5 bg-[#1c2320] hover:bg-[#232c28] px-3 py-1.5 rounded-xl border border-[#28332e] transition-colors cursor-pointer"
          >
            {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isBreathingActive ? 'Pause' : 'Resume'}</span>
          </button>
        </div>

        <span className="text-[11px] font-bold tracking-wider text-[#97c7b8] uppercase bg-[#1b2523] px-3 py-1 rounded-full border border-[#293d39] mb-2 inline-block">
          🦥 4-7-8 Sloth Breathing Cadence
        </span>

        {/* Breathing Orb - Clean Solid Circles, No Gradients */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outermost Ring */}
            <div 
              className={`absolute inset-0 rounded-full border border-[#2c3d33] transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-125 opacity-70' 
                  : breathPhase === 'Hold'
                    ? 'scale-115 opacity-50'
                    : 'scale-90 opacity-20'
              }`}
            />
            {/* Mid Ring */}
            <div 
              className={`absolute inset-4 rounded-full border border-[#354c3e] transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-110 bg-[#1c2a22]' 
                  : breathPhase === 'Hold'
                    ? 'scale-105 bg-[#251f30]'
                    : 'scale-95 bg-[#121614]'
              }`}
            />
            {/* Inner solid circle */}
            <div 
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'bg-[#223d2d] scale-105 border border-[#3c6b4f]'
                  : breathPhase === 'Hold'
                    ? 'bg-[#352747] scale-105 border border-[#523d6e]'
                    : 'bg-[#18201d] scale-90 border border-[#283630]'
              }`}
            >
              <span className="text-xs font-bold tracking-wider uppercase text-[#c7d6ce]">{breathPhase}</span>
              <span className="text-3xl font-extrabold mt-0.5 tabular-nums text-[#f0f3f1]">{secondsLeft}s</span>
            </div>
          </div>
          <p className="text-xs text-[#8e9c95] mt-3 font-medium max-w-sm">
            Calibrated to Sloan's resting respiratory rate: activates the parasympathetic nervous system in 2 minutes.
          </p>
        </div>
      </div>

      {/* Bedtime Micro-Story Generator */}
      <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#f0f3f1] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#251f30] text-[#c3b4de] border border-[#3e3252]">
                <Moon className="w-4 h-4" />
              </span>
              Offline Wind-Down & Bedtime Companion
            </h2>
            <p className="text-xs text-[#8e9c95] mt-1 max-w-2xl leading-relaxed">
              Slow down mental chatter before sleep. Open-weight models synthesize tranquil micro-stories at a soothing rhythm, running entirely on your machine.
            </p>
          </div>

          <button
            onClick={onOpenSoundBar}
            className="flex items-center gap-1.5 text-xs text-[#9ed4b0] font-semibold px-3 py-1.5 rounded-xl bg-[#1c2a22] border border-[#2b4234] hover:bg-[#23362b] self-end sm:self-auto transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#55b376]" />
            <span>Open Ambient Sound Mixer</span>
          </button>
        </div>

        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-[#c7d1cc] mb-1.5">
            Story setting / sleepy nocturnal theme:
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-[#101413] border border-[#242d29] rounded-xl p-3.5 text-xs text-[#edf1ef] placeholder:text-[#525f58] focus:outline-none focus:border-[#413557] font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[#8e9c95] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#c3b4de]" />
            100% offline — won't ping corporate servers in your bedroom
          </span>

          <button
            onClick={handleGenerateStory}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#483861] hover:bg-[#574475] text-white font-semibold text-xs border border-[#634e85] transition-colors disabled:opacity-50 cursor-pointer"
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
        <div className="bg-[#131715] border border-[#2a3830] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#242d29]">
            <h3 className="text-lg font-bold text-[#f0f3f1] flex items-center gap-2 font-serif-reading">
              <BookOpen className="w-4 h-4 text-[#8e9c95]" /> {result.title}
            </h3>
            <span className="text-xs text-[#9ed4b0] font-mono bg-[#1c2a22] px-2.5 py-0.5 rounded-md border border-[#2b4234]">
              {result.ambientRecommendation}
            </span>
          </div>

          {/* Literary Serif Body */}
          <div className="font-serif-reading text-[#d6deda] text-base leading-loose space-y-4 max-w-3xl">
            {result.storyMarkdown.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#d6deda] first-letter:text-3xl first-letter:font-bold first-letter:text-[#9ed4b0] first-letter:float-left first-letter:mr-2">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
