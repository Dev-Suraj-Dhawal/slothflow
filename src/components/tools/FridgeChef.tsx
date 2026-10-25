import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Timer, 
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
        particleCount: 15,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#2e6f40', '#8f6036', '#4a6b5d']
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
      <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#f0f3f1] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#29221a] text-[#deb687] border border-[#423425]">
                <Utensils className="w-4 h-4" />
              </span>
              Fridge-to-Feast (No-Brain Cooking)
            </h2>
            <p className="text-xs text-[#8e9c95] mt-1 max-w-2xl leading-relaxed">
              Stop standing in front of the open fridge staring blankly. Type whatever scraps you see, and Sloan will devise a 3-step lazy feast using 1 pan and minimal dishwashing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <span className="text-[11px] text-[#73827b] mr-1 hidden sm:inline">Try preset:</span>
            {FRIDGE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setIngredients(p.ingredients);
                  setDietary(p.dietary);
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#1c2320] hover:bg-[#232c28] text-[#a0ada6] border border-[#28332e] transition-colors cursor-pointer"
              >
                Preset {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#c7d1cc] mb-1.5">
              What random items are inside your fridge/counter?
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. 2 eggs, leftover pasta, parmesan, tomato paste, butter"
              className="w-full bg-[#101413] border border-[#242d29] rounded-xl p-3.5 text-xs text-[#edf1ef] placeholder:text-[#525f58] focus:outline-none focus:border-[#4d3c2a] transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c7d1cc] mb-1.5">
              Vibe / Dietary (Optional):
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Under 10 mins, High Protein, Zero Dishes, Vegetarian"
              className="w-full bg-[#101413] border border-[#242d29] rounded-xl p-3 text-xs text-[#edf1ef] placeholder:text-[#525f58] focus:outline-none focus:border-[#4d3c2a] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[#8e9c95] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#deb687]" />
            Conserves ~30 mins of meal pondering & grocery runs
          </span>

          <button
            onClick={handleCook}
            disabled={loading || !ingredients.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7a4d26] hover:bg-[#8f5b2e] text-white font-semibold text-xs border border-[#a36936] transition-colors disabled:opacity-50 cursor-pointer"
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
        <div className="bg-[#161b19] border border-[#3d3122] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#242d29]">
            <div>
              <h3 className="text-base font-bold text-[#f0f3f1] flex items-center gap-2">
                🍳 {result.recipeTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#deb687] font-semibold mt-1">
                <Timer className="w-3.5 h-3.5" />
                <span>Cook Time: ~{result.prepTimeMinutes} mins</span>
                <span>•</span>
                <span>Max Steps: {result.stepCount}</span>
              </div>
            </div>

            <button
              onClick={copyRecipe}
              className="flex items-center gap-1.5 text-xs text-[#a0ada6] hover:text-[#f0f3f1] bg-[#1c2320] hover:bg-[#232c28] px-3 py-1.5 rounded-xl border border-[#28332e] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#55b376]" />
                  <span className="text-[#9ed4b0] font-medium">Copied!</span>
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
                className="bg-[#1b221f] border border-[#26312c] rounded-xl p-4 flex items-start gap-3.5 text-xs text-[#d6deda]"
              >
                <span className="w-6 h-6 rounded-full bg-[#29221a] text-[#deb687] border border-[#423425] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed font-medium text-[#d6deda]">{step}</p>
              </div>
            ))}
          </div>

          {/* Sloth Dishwashing Saving Tip */}
          <div className="p-4 rounded-xl bg-[#29221a] border border-[#423425] text-xs text-[#deb687] flex items-start gap-3">
            <span className="text-lg select-none">🦥</span>
            <div>
              <strong className="font-bold text-[#f0d4b5] block mb-0.5">Sloan's Dishwashing Shortcut:</strong>
              <p className="text-[#deb687] leading-relaxed">{result.slothChefsTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
