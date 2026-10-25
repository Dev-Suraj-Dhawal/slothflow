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
    setProgressMsg('SLOTH CHEF EVALUATING PANTRY RESIDUE...');
    setResult(null);

    try {
      const res = await openAiService.generateFridgeMeal(ingredients, dietary, currentProvider, (msg) => {
        setProgressMsg(msg.toUpperCase());
      });
      setResult(res);
      soundEngine.playGentleChime();
      confetti({
        particleCount: 15,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#295738', '#785331', '#433959']
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
      <div className="bg-[#141916] border border-[#222b26] rounded-2xl p-5 sm:p-6 corner-crosshairs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#526359] tracking-wider uppercase">
                TOOL // MODULE_03
              </span>
              <span className="text-[#323f38] font-mono">•</span>
              <span className="text-[10px] font-mono text-[#deb992]">PANTRY_SYNTHESIS</span>
            </div>
            <h2 className="text-base font-bold text-[#edf2ee] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#271f16] text-[#deb992] border border-[#3d2e1f]">
                <Utensils className="w-4 h-4" />
              </span>
              Fridge-to-Feast (No-Brain Cooking)
            </h2>
            <p className="text-xs text-[#84948b] mt-1 max-w-2xl leading-relaxed">
              Stop standing in front of the open fridge door staring blankly. Type whatever scraps you see, and Sloan will devise a 3-step lazy feast requiring only 1 pan and minimal dishwashing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 font-mono">
            <span className="text-[10px] text-[#5c6e64] mr-1 hidden sm:inline">PANTRY:</span>
            {FRIDGE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setIngredients(p.ingredients);
                  setDietary(p.dietary);
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-[#19201c] hover:bg-[#202924] text-[#9aa8a0] hover:text-[#edf2ee] border border-[#26312a] transition-colors cursor-pointer tactile-btn"
              >
                PRESET_{i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-3.5">
          <div>
            <label className="block text-xs font-mono text-[#9aa8a0] mb-1.5 uppercase">
              // AVAILABLE INGREDIENTS OR SCRAPS
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. 2 eggs, leftover pasta, parmesan, tomato paste, butter"
              className="w-full bg-[#0c0f0d] border border-[#202723] rounded-xl p-3.5 text-xs text-[#edf2ee] placeholder:text-[#435249] focus:outline-none focus:border-[#423322] transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#9aa8a0] mb-1.5 uppercase">
              // DIETARY CONSTRAINTS (OPTIONAL)
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Under 10 mins, High Protein, Zero Dishes, Vegetarian"
              className="w-full bg-[#0c0f0d] border border-[#202723] rounded-xl p-3 text-xs text-[#edf2ee] placeholder:text-[#435249] focus:outline-none focus:border-[#423322] transition-colors font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs font-mono text-[#76877e] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#deb992]" />
            CONSERVES ~30 MIN DELIBERATION LATENCY
          </span>

          <button
            onClick={handleCook}
            disabled={loading || !ingredients.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#634020] hover:bg-[#784e27] text-white font-mono font-bold text-xs border border-[#8f5d30] transition-colors disabled:opacity-50 cursor-pointer tactile-btn"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'CHEFFING...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE 3-STEP FEAST</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#141916] border border-[#362a1c] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#202723]">
            <div>
              <h3 className="text-base font-bold text-[#edf2ee] flex items-center gap-2 font-sans">
                🍳 {result.recipeTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-[#deb992] mt-1">
                <Timer className="w-3.5 h-3.5" />
                <span>COOK TIME: ~{result.prepTimeMinutes} MIN</span>
                <span>•</span>
                <span>STEPS: {result.stepCount} MAX</span>
              </div>
            </div>

            <button
              onClick={copyRecipe}
              className="flex items-center gap-1.5 text-xs font-mono text-[#9aa8a0] hover:text-[#edf2ee] bg-[#19201c] hover:bg-[#202924] px-3 py-1.5 rounded-lg border border-[#26312a] transition-colors cursor-pointer tactile-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4eb374]" />
                  <span className="text-[#8edba6]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>EXPORT_RECIPE</span>
                </>
              )}
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {result.lazySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#19201c] border border-[#222b26] rounded-xl p-4 flex items-start gap-3.5 text-xs text-[#cbd6cf]"
              >
                <span className="font-mono text-[10px] text-[#deb992] bg-[#271f16] px-2 py-0.5 rounded border border-[#3d2e1f] shrink-0 mt-0.5">
                  PHASE_0{idx + 1}
                </span>
                <p className="leading-relaxed font-sans font-medium text-[#cbd6cf]">{step}</p>
              </div>
            ))}
          </div>

          {/* Sloth Dishwashing Saving Protocol */}
          <div className="p-4 rounded-xl bg-[#241c14] border border-[#3b2d20] text-xs text-[#deb992] flex items-start gap-3 font-mono">
            <span className="text-base select-none">🦥</span>
            <div>
              <strong className="font-bold text-[#edd2b6] block mb-0.5 uppercase tracking-wider text-[11px]">
                SLOAN_DISHWASHING_PROTOCOL //
              </strong>
              <p className="text-[#deb992] font-sans leading-relaxed text-xs">{result.slothChefsTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
