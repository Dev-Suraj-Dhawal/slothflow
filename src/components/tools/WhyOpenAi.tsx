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
  Database,
  ArrowRight
} from 'lucide-react';

export const WhyOpenAi: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto" id="why-open">
      {/* Hero Manifesto - Artisanal Blueprint Card */}
      <div className="relative bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
        <span className="absolute -top-1 -left-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
        <span className="absolute -top-1 -right-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
        <span className="absolute -bottom-1 -left-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
        <span className="absolute -bottom-1 -right-1 text-[9px] font-mono text-[#38483f] select-none">+</span>

        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 border-b border-[#1f2722] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#101413] border border-[#222b26] text-[9px] sm:text-[10px] font-mono text-[#62776c]">
              MODULE // 06
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#9ed4b0]">
              Open-Source AI Technical Doctrine
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#4b5b53] hidden xs:inline">
            SPEC: HACKTOBERFEST_WEEK_03 // SLOW_AND_STEADY
          </span>
        </div>

        <h2 className="font-serif-letterpress text-xl sm:text-2xl md:text-3xl font-normal text-[#f0f3f1] tracking-tight mb-2.5 sm:mb-3">
          Why Open Innovation is the Soul of <span className="text-[#9ed4b0] italic">SlothFlow</span>
        </h2>
        
        <p className="text-xs sm:text-sm text-[#9daea6] leading-relaxed max-w-3xl font-sans">
          The challenge asks: <em>"Tell us where your open-based approach worked better than a closed one."</em> 
          Here is our core engineering doctrine: <strong>true slothful relaxation requires absolute peace of mind</strong>. You cannot genuinely unwind if every lazy voice ramble, family text thread, and late-night thought is funneled into a remote corporate cloud server with a ticking token meter and surveillance telemetry.
        </p>
      </div>

      {/* 4 Pillars Grid - Flat Solid Natural Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Pillar 1 */}
        <div className="relative bg-[#141916] border border-[#222b26] rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#101413] text-[#55b376] border border-[#222b26] flex items-center justify-center shrink-0">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#62776c] block">PRINCIPLE // 01</span>
              <h3 className="text-xs sm:text-sm font-semibold text-[#f0f3f1]">
                Zero-Cost Energy Conservation ($0/mo)
              </h3>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-[#8e9c95] leading-relaxed">
            Closed proprietary APIs charge per input/output token and demand ongoing credit cards. If an application is designed to reward laziness and automate small low-stakes chores, incurring recurring SaaS invoices defeats the purpose. With open-weight models (SmolLM, Qwen2.5, DistilBART), inference happens locally on device silicon for free forever.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="relative bg-[#141916] border border-[#222b26] rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#101413] text-[#96cfd9] border border-[#222b26] flex items-center justify-center shrink-0">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#62776c] block">PRINCIPLE // 02</span>
              <h3 className="text-xs sm:text-sm font-semibold text-[#f0f3f1]">
                Bedside Privacy & Uncensored Thoughts
              </h3>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-[#8e9c95] leading-relaxed">
            SlothFlow ingests raw, unedited personal data: chaotic family group chats, tired half-asleep mumblings, and awkward draft messages. By executing models client-side in the browser via WebGPU/WASM or local Ollama, not a single byte leaves your machine. Zero corporate logging, zero training on your bedroom audio.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="relative bg-[#141916] border border-[#222b26] rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#101413] text-[#deb687] border border-[#222b26] flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#62776c] block">PRINCIPLE // 03</span>
              <h3 className="text-xs sm:text-sm font-semibold text-[#f0f3f1]">
                Offline Sanctuary (Airplane & Forest Mode)
              </h3>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-[#8e9c95] leading-relaxed">
            Real rest doesn't depend on a stable Wi-Fi connection. Cached in the browser's Cache API or served by local Ollama, SlothFlow works on an airplane, in a remote cabin, or in a bedroom with routers powered down. The procedural sound engine generates rain and wind directly via mathematical oscillators—no streaming audio streams.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="relative bg-[#141916] border border-[#222b26] rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#101413] text-[#c3b4de] border border-[#222b26] flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#62776c] block">PRINCIPLE // 04</span>
              <h3 className="text-xs sm:text-sm font-semibold text-[#f0f3f1]">
                Freedom from Vendor Deprecation
              </h3>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-[#8e9c95] leading-relaxed">
            Proprietary models are deprecated on corporate whim, their output styles drift, and system prompts are rewritten without your consent. With open weights, you hold the immutable model artifacts. Swap from browser Transformers.js to quantized 4-bit Llama 3.2 on local desktop with zero code rewrites.
          </p>
        </div>
      </div>

      {/* Head-to-Head Comparison Table - Clean Flat Hairline */}
      <div className="relative bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2722] mb-3 sm:mb-4">
          <h3 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#f0f3f1] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#55b376] shrink-0" />
            <span>EVALUATION MATRIX // CLOSED VS OPEN</span>
          </h3>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#62776c] hidden xs:inline">PARADIGM CHECK</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-[#222b26] text-[#73827b]">
                <th className="pb-2.5 font-mono font-normal uppercase tracking-wider text-[9px] sm:text-[10px]">Criterion</th>
                <th className="pb-2.5 font-mono font-normal uppercase tracking-wider text-[9px] sm:text-[10px] text-[#cf8e8e]">Closed Cloud (OpenAI / Claude)</th>
                <th className="pb-2.5 font-mono font-normal uppercase tracking-wider text-[9px] sm:text-[10px] text-[#9ed4b0]">SlothFlow (WebGPU / Ollama)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2722] text-[#c7d1cc]">
              <tr>
                <td className="py-2.5 font-medium text-[#f0f3f1]">Inference Cost</td>
                <td className="py-2.5 text-[#cf8e8e] font-mono">$0.003 - $0.06 per 1k tokens</td>
                <td className="py-2.5 text-[#9ed4b0] font-mono font-bold">$0.00 / month forever</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-[#f0f3f1]">Data Ingress/Egress</td>
                <td className="py-2.5 text-[#cf8e8e]">Shipped over internet to US data centers</td>
                <td className="py-2.5 text-[#9ed4b0] font-bold">0 KB egress · Strictly on-device RAM</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-[#f0f3f1]">Offline Capability</td>
                <td className="py-2.5 text-[#cf8e8e] flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-[#cf8e8e]" /> Inoperable without internet
                </td>
                <td className="py-2.5 text-[#9ed4b0] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#55b376] stroke-[3]" /> 100% Offline (Local Weights)
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-[#f0f3f1]">Model Governance</td>
                <td className="py-2.5 text-[#cf8e8e]">Vendor-controlled telemetry & filters</td>
                <td className="py-2.5 text-[#9ed4b0] font-bold">Full local control (ONNX / GGUF open formats)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-[#f0f3f1]">Deprecation Lifespan</td>
                <td className="py-2.5 text-[#cf8e8e]">6 - 12 month shutdown deadlines</td>
                <td className="py-2.5 text-[#9ed4b0] font-bold">Eternal (Weights remain on disk indefinitely)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Architecture Diagram */}
      <div className="relative bg-[#101413] border border-[#222b26] rounded-xl sm:rounded-2xl p-4 sm:p-5 font-mono text-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1f2722] mb-3">
          <span className="text-[#9ed4b0] text-[10px] sm:text-[11px] font-bold flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#55b376]" /> TOPOLOGY_MAP // CLIENT INFERENCE PIPELINE
          </span>
          <span className="text-[#4b5b53] text-[9px] sm:text-[10px]">REVISION 2026.10</span>
        </div>

        <div className="text-[10px] text-[#607067] mb-2 sm:hidden font-mono">
          [SWIPE TO INSPECT ARCHITECTURE SCHEMA]
        </div>

        <pre className="text-[#8e9c95] overflow-x-auto leading-relaxed text-[10px] sm:text-[11px] py-1 scrollbar-thin">
{`+--------------------------------------------------------------------------+
|                       LOCAL SANDBOX (YOUR MACHINE)                       |
|                                                                          |
|  [ Ingest Feeds ]                                                        |
|    • Group Chat Noise Dump    --> [ Text Buffer ]                        |
|    • Voice Stream Audio In    --> [ Real-Time VAD Meter ]                |
|    • Leftover Fridge Scraps   --> [ Ingredient Tokenizer ]               |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |                 SLOTHFLOW INFERENCE ORCHESTRATOR                   |  |
|  +------------------------------------+-------------------------------+  |
|                                       |                                  |
|         +-----------------------------+-----------------------------+    |
|         |                                                           |    |
|         v                                                           v    |
|  [ ENGINE A: WebGPU / WASM ]                             [ ENGINE B: Desktop ]|
|  Transformers.js v3 Runtime                              Ollama Daemon        |
|  ONNX Runtime Web (Wasm Threads)                         Localhost:11434      |
|  Cache: Browser Cache API                                Llama 3.2 / SmolLM   |
|  Egress: 0.00 KB                                         RAM: Isolated Local  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |             PROCEDURAL WEB AUDIO SYNTHESIZER (NO MP3s)             |  |
|  |  Bandpass Noise Rain • 0.2Hz LFO Wind • 528Hz Solfeggio Resonator  |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+`}
        </pre>
      </div>
    </div>
  );
};
