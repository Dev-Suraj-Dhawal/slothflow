import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  Globe, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Terminal
} from 'lucide-react';
import { AIProvider } from '../types';
import { openAiService } from '../services/openAiService';

interface EngineSelectorProps {
  currentProvider: AIProvider;
  onSelectProvider: (provider: AIProvider) => void;
  onClose?: () => void;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  currentProvider,
  onSelectProvider,
  onClose
}) => {
  const [ollamaUrl, setOllamaUrl] = useState(openAiService.getOllamaEndpoint());
  const [ollamaStatus, setOllamaStatus] = useState<{
    tested: boolean;
    online: boolean;
    models: string[];
    error?: string;
  }>({
    tested: false,
    online: false,
    models: []
  });
  const [testingOllama, setTestingOllama] = useState(false);
  const [selectedModel, setSelectedModel] = useState(openAiService.getSelectedOllamaModel());
  const [hfKey, setHfKey] = useState('');

  const handleTestOllama = async () => {
    setTestingOllama(true);
    openAiService.setOllamaEndpoint(ollamaUrl);
    const result = await openAiService.probeOllama();
    setOllamaStatus({
      tested: true,
      online: result.online,
      models: result.models,
      error: result.error
    });
    if (result.models.length > 0) {
      setSelectedModel(result.models[0]);
      openAiService.setSelectedOllamaModel(result.models[0]);
    }
    setTestingOllama(false);
  };

  const handleSelectModel = (m: string) => {
    setSelectedModel(m);
    openAiService.setSelectedOllamaModel(m);
  };

  return (
    <div className="bg-[#0a0e16]/95 border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl max-w-2xl w-full mx-auto backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Select Open-Source AI Engine
            </h2>
            <p className="text-xs text-slate-400">
              Pick where and how the open-weight models execute. 100% transparent.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-slate-900 border border-white/[0.08] hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
      </div>

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {/* 1. Browser Transformers */}
        <div
          onClick={() => onSelectProvider('browser-transformers')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            currentProvider === 'browser-transformers'
              ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/40'
              : 'bg-[#07090e]/70 border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              In-Browser WebGPU Open Weights
            </span>
            {currentProvider === 'browser-transformers' && (
              <span className="p-0.5 rounded-full bg-emerald-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Runs client-side via Transformers.js v3 + ONNX Runtime Web. Zero server calls, zero data leaves your browser.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
            <Shield className="w-3 h-3" /> 100% In-Browser Privacy
          </div>
        </div>

        {/* 2. Local Desktop Ollama */}
        <div
          onClick={() => onSelectProvider('local-ollama')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            currentProvider === 'local-ollama'
              ? 'bg-cyan-500/15 border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
              : 'bg-[#07090e]/70 border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-white">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              Local Desktop (Ollama)
            </span>
            {currentProvider === 'local-ollama' && (
              <span className="p-0.5 rounded-full bg-cyan-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Connect to your local Ollama daemon (<code className="text-cyan-300 font-mono">localhost:11434</code>) for Llama 3.2, SmolLM, or Mistral.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
            <Layers className="w-3 h-3" /> Full Local GPU Acceleration
          </div>
        </div>

        {/* 3. Distilled Sloth */}
        <div
          onClick={() => onSelectProvider('distilled-sloth')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            currentProvider === 'distilled-sloth'
              ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/40'
              : 'bg-[#07090e]/70 border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              Distilled Sloth (Instant)
            </span>
            {currentProvider === 'distilled-sloth' && (
              <span className="p-0.5 rounded-full bg-amber-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Zero model download, 0ms latency. Pure client heuristics distilled from open models for slow/low-spec devices.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
            ⚡ Instant Response (<span className="font-mono">50ms</span>)
          </div>
        </div>

        {/* 4. Hugging Face Hub API */}
        <div
          onClick={() => onSelectProvider('huggingface-api')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            currentProvider === 'huggingface-api'
              ? 'bg-purple-500/15 border-purple-500/60 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/40'
              : 'bg-[#07090e]/70 border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-white">
              <Globe className="w-4 h-4 text-purple-400" />
              Hugging Face Hub API
            </span>
            {currentProvider === 'huggingface-api' && (
              <span className="p-0.5 rounded-full bg-purple-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Cloud open inference with your Hugging Face User Access Token for 70B+ open models.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
            🌐 Remote Open Weights
          </div>
        </div>
      </div>

      {/* Ollama Configuration Panel when active */}
      {currentProvider === 'local-ollama' && (
        <div className="bg-[#07090e]/90 border border-cyan-500/30 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" /> Ollama Endpoint Settings
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="flex-1 bg-slate-900 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-3.5 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {testingOllama ? 'Probing...' : 'Test Connection'}
            </button>
          </div>

          {ollamaStatus.tested && (
            <div className={`p-3 rounded-xl text-xs border ${
              ollamaStatus.online 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {ollamaStatus.online ? (
                <div>
                  <p className="font-bold mb-1">✓ Ollama connected successfully!</p>
                  {ollamaStatus.models.length > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400">Available models:</span>
                      <select
                        value={selectedModel}
                        onChange={(e) => handleSelectModel(e.target.value)}
                        className="bg-slate-900 border border-white/20 rounded-lg px-2.5 py-1 text-slate-200 font-mono text-xs"
                      >
                        {ollamaStatus.models.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">No models found yet. Run <code className="text-cyan-300 font-mono">ollama run llama3.2</code> in your terminal.</p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-bold">Ollama is not running at this address.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Install from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline text-cyan-400">ollama.com</a> or use the <strong>In-Browser WebGPU</strong> engine above for zero-install open AI!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hugging Face Key Panel when active */}
      {currentProvider === 'huggingface-api' && (
        <div className="bg-[#07090e]/90 border border-purple-500/30 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Hugging Face User Access Token (Optional)
          </h3>
          <input
            type="password"
            value={hfKey}
            onChange={(e) => {
              setHfKey(e.target.value);
              openAiService.setHfApiKey(e.target.value);
            }}
            placeholder="hf_..."
            className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500 mb-1.5"
          />
          <p className="text-[11px] text-slate-400">
            Get your free token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="underline text-purple-400">huggingface.co/settings/tokens</a>.
          </p>
        </div>
      )}

      {/* Bottom callout */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Every option is strictly built on open weights with no proprietary walled gardens.</span>
        </span>
        <a 
          href="#why-open" 
          onClick={onClose}
          className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-3 font-semibold"
        >
          Read manifesto <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
