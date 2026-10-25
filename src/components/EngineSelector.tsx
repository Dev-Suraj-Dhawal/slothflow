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
    <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-6 sm:p-7 max-w-2xl w-full mx-auto shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#242d29] mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1c2a22] text-[#55b376] border border-[#2b4234]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#f0f3f1] flex items-center gap-2">
              Select Open-Source AI Engine
            </h2>
            <p className="text-xs text-[#8e9c95]">
              Pick where and how the open-weight models execute. 100% transparent.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[#8e9c95] hover:text-[#f0f3f1] text-xs px-2.5 py-1 rounded-xl bg-[#1c2320] border border-[#28332e] hover:bg-[#232c28] transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
      </div>

      {/* Grid of Providers - Clean Flat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {/* 1. Browser Transformers */}
        <div
          onClick={() => onSelectProvider('browser-transformers')}
          className={`cursor-pointer rounded-xl p-4 border transition-colors ${
            currentProvider === 'browser-transformers'
              ? 'bg-[#1c2a22] border-[#3a5744]'
              : 'bg-[#1b221f] border-[#26312c] hover:border-[#33423b]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-[#f0f3f1]">
              <Sparkles className="w-4 h-4 text-[#55b376]" />
              In-Browser WebGPU Open Weights
            </span>
            {currentProvider === 'browser-transformers' && (
              <span className="p-0.5 rounded-full bg-[#55b376] text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Runs client-side via Transformers.js v3 + ONNX Runtime Web. Zero server calls, zero data leaves your browser.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#9ed4b0] font-semibold uppercase tracking-wider">
            <Shield className="w-3 h-3" /> 100% In-Browser Privacy
          </div>
        </div>

        {/* 2. Local Desktop Ollama */}
        <div
          onClick={() => onSelectProvider('local-ollama')}
          className={`cursor-pointer rounded-xl p-4 border transition-colors ${
            currentProvider === 'local-ollama'
              ? 'bg-[#192426] border-[#2c474d]'
              : 'bg-[#1b221f] border-[#26312c] hover:border-[#33423b]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-[#f0f3f1]">
              <HardDrive className="w-4 h-4 text-[#96cfd9]" />
              Local Desktop (Ollama)
            </span>
            {currentProvider === 'local-ollama' && (
              <span className="p-0.5 rounded-full bg-[#4faab8] text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Connect to your local Ollama daemon (<code className="text-[#96cfd9] font-mono">localhost:11434</code>) for Llama 3.2, SmolLM, or Mistral.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#96cfd9] font-semibold uppercase tracking-wider">
            <Layers className="w-3 h-3" /> Full Local GPU Acceleration
          </div>
        </div>

        {/* 3. Distilled Sloth */}
        <div
          onClick={() => onSelectProvider('distilled-sloth')}
          className={`cursor-pointer rounded-xl p-4 border transition-colors ${
            currentProvider === 'distilled-sloth'
              ? 'bg-[#29221a] border-[#473624]'
              : 'bg-[#1b221f] border-[#26312c] hover:border-[#33423b]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-[#f0f3f1]">
              <Zap className="w-4 h-4 text-[#deb687]" />
              Distilled Sloth (Instant)
            </span>
            {currentProvider === 'distilled-sloth' && (
              <span className="p-0.5 rounded-full bg-[#c28f53] text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Zero model download, 0ms latency. Pure client heuristics distilled from open models for slow/low-spec devices.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#deb687] font-semibold uppercase tracking-wider">
            ⚡ Instant Response (<span className="font-mono">50ms</span>)
          </div>
        </div>

        {/* 4. Hugging Face Hub API */}
        <div
          onClick={() => onSelectProvider('huggingface-api')}
          className={`cursor-pointer rounded-xl p-4 border transition-colors ${
            currentProvider === 'huggingface-api'
              ? 'bg-[#251f30] border-[#3f3054]'
              : 'bg-[#1b221f] border-[#26312c] hover:border-[#33423b]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold text-[#f0f3f1]">
              <Globe className="w-4 h-4 text-[#c3b4de]" />
              Hugging Face Hub API
            </span>
            {currentProvider === 'huggingface-api' && (
              <span className="p-0.5 rounded-full bg-[#9882c4] text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Cloud open inference with your Hugging Face User Access Token for 70B+ open models.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#c3b4de] font-semibold uppercase tracking-wider">
            🌐 Remote Open Weights
          </div>
        </div>
      </div>

      {/* Ollama Configuration Panel when active */}
      {currentProvider === 'local-ollama' && (
        <div className="bg-[#101413] border border-[#242d29] rounded-xl p-4 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#96cfd9] mb-2 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" /> Ollama Endpoint Settings
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="flex-1 bg-[#161b19] border border-[#26312c] rounded-xl px-3 py-2 text-xs text-[#edf1ef] font-mono focus:outline-none focus:border-[#385954]"
            />
            <button
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="bg-[#23505c] hover:bg-[#2b6170] text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-[#357587] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {testingOllama ? 'Probing...' : 'Test Connection'}
            </button>
          </div>

          {ollamaStatus.tested && (
            <div className={`p-3 rounded-xl text-xs border ${
              ollamaStatus.online 
                ? 'bg-[#18261e] border-[#2b4234] text-[#9ed4b0]' 
                : 'bg-[#2b2218] border-[#473624] text-[#deb687]'
            }`}>
              {ollamaStatus.online ? (
                <div>
                  <p className="font-bold mb-1">✓ Ollama connected successfully!</p>
                  {ollamaStatus.models.length > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#8e9c95]">Available models:</span>
                      <select
                        value={selectedModel}
                        onChange={(e) => handleSelectModel(e.target.value)}
                        className="bg-[#1b221f] border border-[#2a3630] rounded-lg px-2.5 py-1 text-[#f0f3f1] font-mono text-xs"
                      >
                        {ollamaStatus.models.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8e9c95]">No models found yet. Run <code className="text-[#96cfd9] font-mono">ollama run llama3.2</code> in your terminal.</p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#deb687] mt-0.5" />
                  <div>
                    <p className="font-bold">Ollama is not running at this address.</p>
                    <p className="text-[11px] text-[#8e9c95] mt-0.5">
                      Install from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline text-[#96cfd9]">ollama.com</a> or use the <strong>In-Browser WebGPU</strong> engine above for zero-install open AI!
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
        <div className="bg-[#101413] border border-[#242d29] rounded-xl p-4 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#c3b4de] mb-2 flex items-center gap-1.5">
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
            className="w-full bg-[#161b19] border border-[#26312c] rounded-xl px-3 py-2 text-xs text-[#edf1ef] font-mono focus:outline-none focus:border-[#483c5e] mb-1.5"
          />
          <p className="text-[11px] text-[#8e9c95]">
            Get your free token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="underline text-[#c3b4de]">huggingface.co/settings/tokens</a>.
          </p>
        </div>
      )}

      {/* Bottom callout */}
      <div className="p-3.5 rounded-xl bg-[#101413] border border-[#242d29] text-xs text-[#8e9c95] flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#55b376] shrink-0" />
          <span>Every option is strictly built on open weights with no proprietary walled gardens.</span>
        </span>
        <a 
          href="#why-open" 
          onClick={onClose}
          className="text-[#9ed4b0] hover:underline flex items-center gap-1 shrink-0 ml-3 font-semibold"
        >
          Read manifesto <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
