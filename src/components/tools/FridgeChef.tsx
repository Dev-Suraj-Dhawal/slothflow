import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Timer, 
  Flame, 
  Copy, 
  Check, 
  ZapOff 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIProvider, FridgeChefResult } from '../../types';
import { openAiService } from '../../services/openAiService';
import { soundEngine } from '../../services/soundEngine';

interface FridgeChefProps {
  currentProvider: AIProvider;
  onEffortSaved: (minutes: number, calories: number) => void;
}

const FRIDGE_PRESETS = [
  {
    name: 'College Dorm / Late Night',
    ingredients: '2 eggs, stale bread crusts, slice of cheddar, hot sauce, butter',
    dietary: 'Vegetarian'
  },
  {
    name: 'Lazy Post-Work Pantry',
    ingredients: 'can of black beans, cold leftover rice, salsa, corn chips',
    dietary: 'Quick Comfort'
  }
];

export const FridgeChef: React.FC<FridgeChefProps> = ({ currentProvider, onEffortSaved }) => {
  const [ingredients, setIngredients] = useState(FRIDGE_PRESETS[0].ingredients);
  const [dietary, setDietary] = useState(FRIDGE_PRESETS[0].dietary);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<FridgeChefResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCook = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setProgressMsg('Sloan the Sloth Chef evaluating lazy leftovers...');
    setResult(null);

    try {
      const res = await openAiService.generateFridgeMeal(ingredients, dietary, currentProvider, (msg) => {
        setProgressMsg(msg);
      });
      setResult(res);
      soundEngine.playGentleChime();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#ec4899']
      });
      onEffortSaved(30, 60);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to generate meal');
    } finally {
      setLoading(false);
    }
  };

  const copyRecipe = () => {
    if (!result) return;
    const txt = `${result.recipeTitle} (${result.prepTimeMinutes} mins)\n\nSteps:\n${result.lazySteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nSloth Tip: ${result.slothChefsTip}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Utensils className="w-4 h-4" />
              </span>
              Fridge-to-Feast (No-Brain Cooking)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Stop standing in front of the open fridge staring blankly. Type whatever scraps you see, and Sloan will devise a 3-step lazy feast using 1 pan and minimal dishwashing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Try preset:</span>
            {FRIDGE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setIngredients(p.ingredients);
                  setDietary(p.dietary);
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.08] transition-all cursor-pointer"
              >
                Preset {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              What random items are inside your fridge/counter?
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. 2 eggs, leftover pasta, parmesan, tomato paste, butter"
              className="w-full bg-[#07090e]/85 border border-white/[0.08] rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Vibe / Dietary (Optional):
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Under 10 mins, High Protein, Zero Dishes, Vegetarian"
              className="w-full bg-[#07090e]/85 border border-white/[0.08] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-amber-400" />
            Conserves ~30 mins of meal pondering & grocery runs
          </span>

          <button
            onClick={handleCook}
            disabled={loading || !ingredients.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs transition-all shadow-lg shadow-amber-950/60 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'Cheffing lazily...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 3-Step Sloth Recipe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#0d121b]/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                🍳 {result.recipeTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mt-1">
                <Timer className="w-3.5 h-3.5" />
                <span>Cook Time: ~{result.prepTimeMinutes} mins</span>
                <span>•</span>
                <span>Max Steps: {result.stepCount}</span>
              </div>
            </div>

            <button
              onClick={copyRecipe}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-white/[0.08] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Recipe</span>
                </>
              )}
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {result.lazySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#07090e]/75 border border-white/[0.06] rounded-xl p-4 flex items-start gap-3.5 text-xs text-slate-200"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed font-medium text-slate-200">{step}</p>
              </div>
            ))}
          </div>

          {/* Sloth Dishwashing Saving Tip */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
            <span className="text-lg select-none">🦥</span>
            <div>
              <strong className="font-bold text-amber-300 block mb-0.5">Sloan's Dishwashing Shortcut:</strong>
              <p className="text-amber-100/90 leading-relaxed">{result.slothChefsTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
