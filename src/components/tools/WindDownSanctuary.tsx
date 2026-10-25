import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sparkles, 
  Volume2, 
  Pause, 
  Play, 
  ZapOff, 
  BookOpen, 
  Compass 
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
    setProgressMsg('WEAVING NOCTURNAL PROSE...');
    try {
      const res = await openAiService.generateBedtimeStory(theme, currentProvider, (msg) => {
        setProgressMsg(msg.toUpperCase());
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
      {/* 4-7-8 Sloth Breathing Guide - Horological & Tactile */}
      <div className="bg-[#141916] border border-[#222b26] rounded-2xl p-6 sm:p-8 text-center relative corner-crosshairs">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="text-xs font-mono text-[#9aa8a0] hover:text-[#edf2ee] flex items-center gap-1.5 bg-[#19201c] hover:bg-[#202924] px-3 py-1.5 rounded-lg border border-[#26312a] transition-colors cursor-pointer tactile-btn"
          >
            {isBreathingActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isBreathingActive ? 'PAUSE' : 'RESUME'}</span>
          </button>
        </div>

        <span className="text-[10px] font-mono font-bold tracking-wider text-[#8ec7b3] uppercase bg-[#182320] px-3 py-1 rounded border border-[#263b36] mb-2 inline-block">
          HOROLOGY // 4-7-8 PARASYMPATHETIC PACER
        </span>

        {/* Breathing Dial with Degrees and Concentric Rings */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Degree Marks */}
            <span className="absolute top-0 text-[8px] font-mono text-[#384a40]">000°</span>
            <span className="absolute right-0 text-[8px] font-mono text-[#384a40]">090°</span>
            <span className="absolute bottom-0 text-[8px] font-mono text-[#384a40]">180°</span>
            <span className="absolute left-0 text-[8px] font-mono text-[#384a40]">270°</span>

            {/* Outermost Ring */}
            <div 
              className={`absolute inset-3 rounded-full border border-[#25362c] transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-115 opacity-80' 
                  : breathPhase === 'Hold'
                    ? 'scale-110 opacity-60'
                    : 'scale-90 opacity-25'
              }`}
            />
            {/* Mid Ring */}
            <div 
              className={`absolute inset-7 rounded-full border border-[#2e4337] transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'scale-105 bg-[#1a2920]' 
                  : breathPhase === 'Hold'
                    ? 'scale-100 bg-[#231b2e]'
                    : 'scale-95 bg-[#101412]'
              }`}
            />
            {/* Inner solid mechanical core */}
            <div 
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'bg-[#1f3829] scale-105 border border-[#356145]'
                  : breathPhase === 'Hold'
                    ? 'bg-[#2f2240] scale-105 border border-[#483463]'
                    : 'bg-[#161c19] scale-90 border border-[#242e29]'
              }`}
            >
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#b2c4ba]">{breathPhase}</span>
              <span className="text-3xl font-mono font-bold mt-0.5 tabular-nums text-[#edf2ee]">{secondsLeft}s</span>
            </div>
          </div>
          <p className="text-xs font-mono text-[#76877e] mt-3 max-w-sm">
            CALIBRATED TO SLOAN'S RESTING METABOLIC FREQUENCY (0.12 HZ)
          </p>
        </div>
      </div>

      {/* Bedtime Micro-Story Generator */}
      <div className="bg-[#141916] border border-[#222b26] rounded-2xl p-5 sm:p-6 corner-crosshairs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#526359] tracking-wider uppercase">
                TOOL // MODULE_05
              </span>
              <span className="text-[#323f38] font-mono">•</span>
              <span className="text-[10px] font-mono text-[#8ec7b3]">SOMNOLENCE</span>
            </div>
            <h2 className="text-base font-bold text-[#edf2ee] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#231b2e] text-[#cbbfe8] border border-[#382b4c]">
                <Moon className="w-4 h-4" />
              </span>
              Offline Wind-Down & Bedtime Companion
            </h2>
            <p className="text-xs text-[#84948b] mt-1 max-w-2xl leading-relaxed">
              De-escalate cognitive noise before sleep. Open models synthesize tranquil micro-stories at a soothing rhythm, executing 100% locally on your machine.
            </p>
          </div>

          <button
            onClick={onOpenSoundBar}
            className="flex items-center gap-1.5 text-xs font-mono text-[#8edba6] px-3 py-1.5 rounded-lg bg-[#1a2820] border border-[#294232] hover:bg-[#203328] self-end sm:self-auto transition-colors cursor-pointer tactile-btn"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#4eb374]" />
            <span>OPEN_SYNTHESIZER</span>
          </button>
        </div>

        <div className="mb-3.5">
          <label className="block text-xs font-mono text-[#9aa8a0] mb-1.5 uppercase">
            // NOCTURNAL PROMPT OR LOCATION
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-[#0c0f0d] border border-[#202723] rounded-xl p-3.5 text-xs text-[#edf2ee] placeholder:text-[#435249] focus:outline-none focus:border-[#334d3d] font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs font-mono text-[#76877e] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#cbbfe8]" />
            AIR-GAPPED COMPLIANT · BEDROOM SAFE
          </span>

          <button
            onClick={handleGenerateStory}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#392e4d] hover:bg-[#46395e] text-white font-mono font-bold text-xs border border-[#544470] transition-colors disabled:opacity-50 cursor-pointer tactile-btn"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'WEAVING...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>SYNTHESIZE BEDTIME REFLECTION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Story Display with Letterpress Styling */}
      {result && (
        <div className="bg-[#111613] border border-[#25332a] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#202723]">
            <h3 className="text-base font-bold text-[#edf2ee] flex items-center gap-2 font-serif-letterpress">
              <BookOpen className="w-4 h-4 text-[#8edba6]" /> {result.title}
            </h3>
            <span className="text-[10px] text-[#8edba6] font-mono bg-[#1a2820] px-2.5 py-0.5 rounded border border-[#294232]">
              {result.ambientRecommendation}
            </span>
          </div>

          {/* Letterpress Serif Body */}
          <div className="font-serif-letterpress text-[#cfded4] text-base leading-relaxed space-y-4 max-w-3xl">
            {result.storyMarkdown.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#cfded4] first-letter:text-3xl first-letter:font-bold first-letter:text-[#8edba6] first-letter:float-left first-letter:mr-2.5 first-letter:font-mono">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
