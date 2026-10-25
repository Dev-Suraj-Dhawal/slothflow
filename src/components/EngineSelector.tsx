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
  Sparkles
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
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Select Open-Source AI Engine
            </h2>
            <p className="text-xs text-slate-400">
              Pick where and how the open-weight models run. 100% transparent.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10"
          >
            Close
          </button>
        )}
      </div>

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
        {/* 1. Browser Transformers */}
        <div
          onClick={() => onSelectProvider('browser-transformers')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            currentProvider === 'browser-transformers'
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/60 border-white/5 hover:border-white/15'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              WebGPU Open-Weights
            </span>
            {currentProvider === 'browser-transformers' && (
              <span className="p-0.5 rounded-full bg-emerald-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            Runs client-side via Transformers.js v3 + ONNX Runtime Web. Zero server calls, zero data leaves browser.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
            <Shield className="w-3 h-3" /> 100% In-Browser Privacy
          </div>
        </div>

        {/* 2. Local Ollama Desktop */}
        <div
          onClick={() => onSelectProvider('local-ollama')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            currentProvider === 'local-ollama'
              ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
              : 'bg-slate-950/60 border-white/5 hover:border-white/15'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              Local Desktop (Ollama)
            </span>
            {currentProvider === 'local-ollama' && (
              <span className="p-0.5 rounded-full bg-cyan-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            Connect to your local Ollama daemon (<code className="text-cyan-300">localhost:11434</code>) for Llama 3.2, SmolLM, or Mistral.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 font-medium">
            <Layers className="w-3 h-3" /> Full GPU Acceleration
          </div>
        </div>

        {/* 3. Distilled Sloth */}
        <div
          onClick={() => onSelectProvider('distilled-sloth')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            currentProvider === 'distilled-sloth'
              ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/30'
              : 'bg-slate-950/60 border-white/5 hover:border-white/15'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              Distilled Sloth (Instant)
            </span>
            {currentProvider === 'distilled-sloth' && (
              <span className="p-0.5 rounded-full bg-amber-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            Zero model download, 0ms latency. Pure client heuristics distilled from open models for slow/low-spec devices.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
            ⚡ Instant Response
          </div>
        </div>

        {/* 4. Hugging Face Hub API */}
        <div
          onClick={() => onSelectProvider('huggingface-api')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            currentProvider === 'huggingface-api'
              ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30'
              : 'bg-slate-950/60 border-white/5 hover:border-white/15'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <Globe className="w-4 h-4 text-purple-400" />
              Hugging Face Hub API
            </span>
            {currentProvider === 'huggingface-api' && (
              <span className="p-0.5 rounded-full bg-purple-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            Cloud open inference with your Hugging Face User Access Token for 70B+ open models.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400/90 font-medium">
            🌐 Remote Open Weights
          </div>
        </div>
      </div>

      {/* Ollama Configuration Panel when active */}
      {currentProvider === 'local-ollama' && (
        <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-4 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" /> Ollama Endpoint Settings
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              {testingOllama ? 'Probing...' : 'Test Connection'}
            </button>
          </div>

          {ollamaStatus.tested && (
            <div className={`p-2.5 rounded-lg text-xs border ${
              ollamaStatus.online 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {ollamaStatus.online ? (
                <div>
                  <p className="font-semibold mb-1">✓ Ollama connected successfully!</p>
                  {ollamaStatus.models.length > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400">Available models:</span>
                      <select
                        value={selectedModel}
                        onChange={(e) => handleSelectModel(e.target.value)}
                        className="bg-slate-900 border border-white/20 rounded px-2 py-0.5 text-slate-200"
                      >
                        {ollamaStatus.models.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">No models found yet. Run <code className="text-cyan-300">ollama run llama3.2</code> in your terminal.</p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Ollama is not running at this address.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Install from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline text-cyan-400">ollama.com</a> or use the <strong>WebGPU Open-Weights</strong> engine above for zero-install open AI!
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
        <div className="bg-slate-950/80 border border-purple-500/20 rounded-xl p-4 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
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
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 mb-1.5"
          />
          <p className="text-[11px] text-slate-400">
            Get your free token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="underline text-purple-400">huggingface.co/settings/tokens</a>.
          </p>
        </div>
      )}

      {/* Why Open Innovation Callout */}
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Every option is strictly built on open weights with no proprietary walled gardens.</span>
        </span>
        <a 
          href="#why-open" 
          onClick={onClose}
          className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-3"
        >
          Read manifesto <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
