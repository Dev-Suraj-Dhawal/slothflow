import React from 'react';
import { 
  Cpu, 
  WifiOff, 
  Coins, 
  Layers, 
  Lock, 
  Sparkles, 
  Check, 
  X,
  Terminal,
  ShieldCheck,
  Feather
} from 'lucide-react';

export const WhyOpenAi: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="why-open">
      {/* Hero Manifesto */}
      <div className="bg-gradient-to-br from-[#0d121b]/90 via-[#0a0e16]/85 to-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-4 inline-flex">
          <Sparkles className="w-3.5 h-3.5" /> Hacktoberfest 2026 • Open-Source AI Manifesto
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 font-sans">
          Why Open Innovation is the Soul of <span className="text-emerald-400">SlothFlow AI</span>
        </h2>
        
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          The challenge asked: <em>"Tell us where your open-based approach worked better than a closed one."</em> 
          Here is our design conviction: <strong>true laziness requires absolute peace of mind</strong>. You cannot relax if every lazy voice ramble, family text thread, and late-night thought is funneled into a proprietary cloud server with a ticking meter.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
            1. Zero-Cost Energy Conservation ($0/Month)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Closed proprietary APIs charge per token and demand ongoing credit cards. If an application is designed to help you be lazy and automate low-stakes tasks, incurring recurring SaaS debt contradicts the entire philosophy. With open-weight models (SmolLM, Qwen2.5, DistilBART), inference happens locally for free forever.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
            2. Bedside Privacy & Raw Personal Thoughts
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            SlothFlow ingests raw, unedited personal data: messy family arguments, half-asleep mumblings, and awkward draft messages. By running models client-side in the browser via WebGPU/WASM or local Ollama, not a single byte leaves the user's machine. Zero data breaches, zero corporate training telemetry.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 hover:border-amber-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
            <WifiOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
            3. Offline Sanctuary (Works with No Internet)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real relaxation doesn't depend on high-speed fiber or 5G coverage. When cached in the browser's Cache API or loaded into local Ollama, SlothFlow functions on an airplane, in a remote cabin, or in a bedroom with Wi-Fi switched off. The procedural sound engine generates rain and wind directly via the Web Audio API without streaming MP3s.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 hover:border-purple-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
            4. Modularity & Freedom from Deprecation
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Closed models get deprecated on a corporate whim, their output styles drift, and guardrails change overnight. With open weights, you can run whatever architecture fits your hardware — swap from in-browser Transformers.js to a quantized 4-bit Llama 3.2 on local desktop with a single toggle.
          </p>
        </div>
      </div>

      {/* Head-to-Head Comparison Table */}
      <div className="bg-[#0d121b]/90 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
          <Cpu className="w-4 h-4 text-emerald-400" />
          Head-to-Head: Closed Cloud APIs vs SlothFlow Open Weights
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400">
                <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">Evaluation Criteria</th>
                <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-rose-400">Closed Cloud APIs (OpenAI / Anthropic)</th>
                <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-emerald-400">SlothFlow (WebGPU / Ollama)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
              <tr>
                <td className="py-3.5 font-bold text-white">Inference Cost</td>
                <td className="py-3.5 text-rose-300/90">Pay-per-token API metering ($$$/mo)</td>
                <td className="py-3.5 text-emerald-300 font-bold">$0.00 forever (Client Compute)</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-white">Data Privacy</td>
                <td className="py-3.5 text-rose-300/90">Transmitted over network to remote servers</td>
                <td className="py-3.5 text-emerald-300 font-bold">100% Local (Never leaves device RAM)</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-white">Offline Capability</td>
                <td className="py-3.5 text-rose-300/90 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400" /> Fails completely without internet
                </td>
                <td className="py-3.5 text-emerald-300 font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> 100% Offline (PWA & Cache API)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-white">Model Swappability</td>
                <td className="py-3.5 text-rose-300/90">Locked to vendor API endpoints</td>
                <td className="py-3.5 text-emerald-300 font-bold">Any ONNX or GGUF open-weight model</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-white">Deprecation Risk</td>
                <td className="py-3.5 text-rose-300/90">High (API versions sunset on vendor schedule)</td>
                <td className="py-3.5 text-emerald-300 font-bold">Zero (Weights are immutable files)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <div className="bg-[#05070a] border border-white/[0.08] rounded-2xl p-6 font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
          <span className="text-emerald-400 font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4" /> System Topology & Open AI Pipeline
          </span>
          <span className="text-slate-500 text-[10px]">v1.0.0 • WebGPU & Ollama</span>
        </div>

        <pre className="text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
{`+--------------------------------------------------------------------------+
|                           CLIENT ENVIRONMENT                             |
|                                                                          |
|  +--------------------+   +---------------------+   +-----------------+  |
|  |  Chat Clutter Dump |   |  Voice Mumble Stream|   | Leftover Scraps |  |
|  +---------+----------+   +----------+----------+   +--------+--------+  |
|            |                         |                       |           |
|            v                         v                       v           |
|  +--------------------------------------------------------------------+  |
|  |                 SLOTHFLOW UNIFIED INFERENCE DISPATCHER             |  |
|  +------------------------------------+-------------------------------+  |
|                                       |                                  |
|         +-----------------------------+-----------------------------+    |
|         |                                                           |    |
|         v                                                           v    |
|  [ ENGINE A: WebGPU / WASM ]                             [ ENGINE B: Local ]  |
|  Transformers.js v3 Runtime                             Ollama Daemon    |
|  Models: Qwen2.5-0.5B / DistilBART                       Port: 11434      |
|  Cache: Browser Cache API                                Models: Llama 3.2|
|  Network: ZERO EXTERNAL REQUESTS                         SmolLM2 / Mistral|
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |               PROCEDURAL AUDIO SYNTHESIZER (Web Audio API)          |  |
|  |    Rain Simulator • Forest LFO Breeze • 528Hz Completion Chime    |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+`}
        </pre>
      </div>
    </div>
  );
};
