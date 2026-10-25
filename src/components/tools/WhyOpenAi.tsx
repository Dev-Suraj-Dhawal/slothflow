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
  Terminal
} from 'lucide-react';

export const WhyOpenAi: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="why-open">
      {/* Hero Manifesto - Solid Flat Natural Card */}
      <div className="bg-[#161b19] border border-[#2c3d33] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9ed4b0] bg-[#1a2820] px-3 py-1 rounded-full border border-[#294233] mb-4 inline-flex">
          <Sparkles className="w-3.5 h-3.5 text-[#55b376]" /> Hacktoberfest 2026 • Open-Source AI Manifesto
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f3f1] tracking-tight mb-3 font-sans">
          Why Open Innovation is the Soul of <span className="text-[#9ed4b0]">SlothFlow AI</span>
        </h2>
        
        <p className="text-sm text-[#c7d1cc] leading-relaxed max-w-3xl">
          The challenge asked: <em>"Tell us where your open-based approach worked better than a closed one."</em> 
          Here is our design conviction: <strong>true laziness requires absolute peace of mind</strong>. You cannot relax if every lazy voice ramble, family text thread, and late-night thought is funneled into a proprietary cloud server with a ticking meter.
        </p>
      </div>

      {/* 4 Pillars Grid - Flat Solid Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 hover:border-[#2e4738] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#1c2a22] text-[#55b376] border border-[#2b4234] flex items-center justify-center mb-3">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f0f3f1] mb-1.5 flex items-center gap-2">
            1. Zero-Cost Energy Conservation ($0/Month)
          </h3>
          <p className="text-xs text-[#8e9c95] leading-relaxed">
            Closed proprietary APIs charge per token and demand ongoing credit cards. If an application is designed to help you be lazy and automate low-stakes tasks, incurring recurring SaaS debt contradicts the entire philosophy. With open-weight models (SmolLM, Qwen2.5, DistilBART), inference happens locally for free forever.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 hover:border-[#294247] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#192426] text-[#96cfd9] border border-[#273d42] flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f0f3f1] mb-1.5 flex items-center gap-2">
            2. Bedside Privacy & Raw Personal Thoughts
          </h3>
          <p className="text-xs text-[#8e9c95] leading-relaxed">
            SlothFlow ingests raw, unedited personal data: messy family arguments, half-asleep mumblings, and awkward draft messages. By running models client-side in the browser via WebGPU/WASM or local Ollama, not a single byte leaves the user's machine. Zero data breaches, zero corporate training telemetry.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 hover:border-[#423425] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#29221a] text-[#deb687] border border-[#423425] flex items-center justify-center mb-3">
            <WifiOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f0f3f1] mb-1.5 flex items-center gap-2">
            3. Offline Sanctuary (Works with No Internet)
          </h3>
          <p className="text-xs text-[#8e9c95] leading-relaxed">
            Real relaxation doesn't depend on high-speed fiber or 5G coverage. When cached in the browser's Cache API or loaded into local Ollama, SlothFlow functions on an airplane, in a remote cabin, or in a bedroom with Wi-Fi switched off. The procedural sound engine generates rain and wind directly via the Web Audio API without streaming MP3s.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 hover:border-[#3e3252] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#251f30] text-[#c3b4de] border border-[#3e3252] flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f0f3f1] mb-1.5 flex items-center gap-2">
            4. Modularity & Freedom from Deprecation
          </h3>
          <p className="text-xs text-[#8e9c95] leading-relaxed">
            Closed models get deprecated on a corporate whim, their output styles drift, and guardrails change overnight. With open weights, you can run whatever architecture fits your hardware — swap from in-browser Transformers.js to a quantized 4-bit Llama 3.2 on local desktop with a single toggle.
          </p>
        </div>
      </div>

      {/* Head-to-Head Comparison Table - Clean Flat */}
      <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-6 sm:p-7">
        <h3 className="text-sm font-bold text-[#f0f3f1] uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
          <Cpu className="w-4 h-4 text-[#55b376]" />
          Head-to-Head: Closed Cloud APIs vs SlothFlow Open Weights
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#242d29] text-[#73827b]">
                <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">Evaluation Criteria</th>
                <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-[#cf8e8e]">Closed Cloud APIs (OpenAI / Anthropic)</th>
                <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-[#9ed4b0]">SlothFlow (WebGPU / Ollama)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242d29] text-[#c7d1cc]">
              <tr>
                <td className="py-3.5 font-bold text-[#f0f3f1]">Inference Cost</td>
                <td className="py-3.5 text-[#cf8e8e]">Pay-per-token API metering ($$$/mo)</td>
                <td className="py-3.5 text-[#9ed4b0] font-bold">$0.00 forever (Client Compute)</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-[#f0f3f1]">Data Privacy</td>
                <td className="py-3.5 text-[#cf8e8e]">Transmitted over network to remote servers</td>
                <td className="py-3.5 text-[#9ed4b0] font-bold">100% Local (Never leaves device RAM)</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-[#f0f3f1]">Offline Capability</td>
                <td className="py-3.5 text-[#cf8e8e] flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-[#cf8e8e]" /> Fails completely without internet
                </td>
                <td className="py-3.5 text-[#9ed4b0] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#55b376] stroke-[3]" /> 100% Offline (PWA & Cache API)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-[#f0f3f1]">Model Swappability</td>
                <td className="py-3.5 text-[#cf8e8e]">Locked to vendor API endpoints</td>
                <td className="py-3.5 text-[#9ed4b0] font-bold">Any ONNX or GGUF open-weight model</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-[#f0f3f1]">Deprecation Risk</td>
                <td className="py-3.5 text-[#cf8e8e]">High (API versions sunset on vendor schedule)</td>
                <td className="py-3.5 text-[#9ed4b0] font-bold">Zero (Weights are immutable files)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <div className="bg-[#101413] border border-[#242d29] rounded-2xl p-6 font-mono text-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#242d29] mb-4">
          <span className="text-[#9ed4b0] font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#55b376]" /> System Topology & Open AI Pipeline
          </span>
          <span className="text-[#64736c] text-[10px]">v1.0.0 • WebGPU & Ollama</span>
        </div>

        <pre className="text-[#b4c2bb] overflow-x-auto leading-relaxed text-[11px]">
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
