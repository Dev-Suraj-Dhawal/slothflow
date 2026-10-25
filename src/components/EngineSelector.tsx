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
    <div className="relative bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-none p-4 sm:p-7 max-w-2xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
      <span className="hidden sm:inline absolute -top-1 -left-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
      <span className="hidden sm:inline absolute -top-1 -right-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
      <span className="hidden sm:inline absolute -bottom-1 -left-1 text-[9px] font-mono text-[#38483f] select-none">+</span>
      <span className="hidden sm:inline absolute -bottom-1 -right-1 text-[9px] font-mono text-[#38483f] select-none">+</span>

      <div className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-[#1f2722] mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="p-1.5 rounded bg-[#101413] text-[#55b376] border border-[#222b26]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-[#101413] border border-[#222b26] text-[9px] sm:text-[10px] font-mono text-[#62776c]">
                SYSTEM // ENGINE_ROUTER
              </span>
            </div>
            <h2 className="font-serif-letterpress text-sm sm:text-lg font-normal text-[#f0f3f1] mt-0.5">
              Select Open-Source AI Backend
            </h2>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[#62776c] hover:text-[#f0f3f1] text-[11px] font-mono px-2 py-0.5 rounded bg-[#101413] border border-[#222b26] hover:bg-[#1a211d] transition-colors cursor-pointer"
          >
            [CLOSE]
          </button>
        )}
      </div>

      {/* Grid of Providers - Clean Flat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {/* 1. Browser Transformers */}
        <div
          onClick={() => onSelectProvider('browser-transformers')}
          className={`cursor-pointer rounded p-3.5 border transition-all ${
            currentProvider === 'browser-transformers'
              ? 'bg-[#18241d] border-[#345941] text-[#f0f3f1]'
              : 'bg-[#101413] border-[#222b26] hover:border-[#2d3a33] text-[#c7d1cc]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f0f3f1]">
              <Sparkles className="w-3.5 h-3.5 text-[#55b376]" />
              In-Browser WebGPU
            </span>
            {currentProvider === 'browser-transformers' && (
              <span className="px-1.5 py-0.2 rounded bg-[#295738] text-[#9ed4b0] text-[9px] font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Runs client-side via Transformers.js v3 + ONNX Runtime Web. Zero server calls, zero data leaves browser.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#9ed4b0] font-mono uppercase">
            <Shield className="w-3 h-3" /> 100% In-Browser Privacy
          </div>
        </div>

        {/* 2. Local Desktop Ollama */}
        <div
          onClick={() => onSelectProvider('local-ollama')}
          className={`cursor-pointer rounded p-3.5 border transition-all ${
            currentProvider === 'local-ollama'
              ? 'bg-[#152326] border-[#2d4e56] text-[#f0f3f1]'
              : 'bg-[#101413] border-[#222b26] hover:border-[#2d3a33] text-[#c7d1cc]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f0f3f1]">
              <HardDrive className="w-3.5 h-3.5 text-[#96cfd9]" />
              Local Desktop (Ollama)
            </span>
            {currentProvider === 'local-ollama' && (
              <span className="px-1.5 py-0.2 rounded bg-[#22444c] text-[#96cfd9] text-[9px] font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Connect to local Ollama daemon (<code className="text-[#96cfd9] font-mono">localhost:11434</code>) for Llama 3.2, SmolLM2, or Mistral.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#96cfd9] font-mono uppercase">
            <Layers className="w-3 h-3" /> Full GPU Acceleration
          </div>
        </div>

        {/* 3. Distilled Sloth */}
        <div
          onClick={() => onSelectProvider('distilled-sloth')}
          className={`cursor-pointer rounded p-3.5 border transition-all ${
            currentProvider === 'distilled-sloth'
              ? 'bg-[#241e16] border-[#4f3b25] text-[#f0f3f1]'
              : 'bg-[#101413] border-[#222b26] hover:border-[#2d3a33] text-[#c7d1cc]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f0f3f1]">
              <Zap className="w-3.5 h-3.5 text-[#deb687]" />
              Distilled Sloth (Instant)
            </span>
            {currentProvider === 'distilled-sloth' && (
              <span className="px-1.5 py-0.2 rounded bg-[#4a341b] text-[#deb687] text-[9px] font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Zero model download, 0ms download time. Pure client heuristics distilled from open models for ultra-low-spec hardware.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#deb687] font-mono uppercase">
            ⚡ Instant Response (50ms)
          </div>
        </div>

        {/* 4. Hugging Face Hub API */}
        <div
          onClick={() => onSelectProvider('huggingface-api')}
          className={`cursor-pointer rounded p-3.5 border transition-all ${
            currentProvider === 'huggingface-api'
              ? 'bg-[#211a2c] border-[#44335c] text-[#f0f3f1]'
              : 'bg-[#101413] border-[#222b26] hover:border-[#2d3a33] text-[#c7d1cc]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f0f3f1]">
              <Globe className="w-3.5 h-3.5 text-[#c3b4de]" />
              Hugging Face Hub API
            </span>
            {currentProvider === 'huggingface-api' && (
              <span className="px-1.5 py-0.2 rounded bg-[#3c2a54] text-[#c3b4de] text-[9px] font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8e9c95] mb-2 leading-relaxed">
            Cloud open inference with your Hugging Face User Access Token for 70B+ open models without local RAM limits.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#c3b4de] font-mono uppercase">
            🌐 Remote Open Weights
          </div>
        </div>
      </div>

      {/* Ollama Configuration Panel when active */}
      {currentProvider === 'local-ollama' && (
        <div className="bg-[#101413] border border-[#222b26] rounded p-4 mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#96cfd9] mb-2 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" /> Ollama Endpoint Settings
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="flex-1 bg-[#141916] border border-[#222b26] rounded px-3 py-2 text-xs text-[#edf1ef] font-mono focus:outline-none focus:border-[#385954]"
            />
            <button
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="tactile-btn bg-[#23505c] hover:bg-[#2b6170] text-white font-mono font-bold text-xs px-3.5 py-2 rounded border border-[#357587] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {testingOllama ? 'Probing...' : 'Test Link'}
            </button>
          </div>

          {ollamaStatus.tested && (
            <div className={`p-3 rounded text-xs border font-mono ${
              ollamaStatus.online 
                ? 'bg-[#15231c] border-[#294a36] text-[#9ed4b0]' 
                : 'bg-[#2b1f14] border-[#4a341b] text-[#deb687]'
            }`}>
              {ollamaStatus.online ? (
                <div>
                  <p className="font-bold mb-1">✓ Ollama daemon responsive</p>
                  {ollamaStatus.models.length > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#8e9c95]">Detected models:</span>
                      <select
                        value={selectedModel}
                        onChange={(e) => handleSelectModel(e.target.value)}
                        className="bg-[#101413] border border-[#222b26] rounded px-2.5 py-1 text-[#f0f3f1] font-mono text-xs"
                      >
                        {ollamaStatus.models.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8e9c95]">No models loaded yet. Run <code className="text-[#96cfd9] font-mono">ollama run llama3.2</code> in your terminal.</p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#deb687] mt-0.5" />
                  <div>
                    <p className="font-bold">Ollama not detected at this address.</p>
                    <p className="text-[11px] text-[#8e9c95] mt-0.5">
                      Install from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline text-[#96cfd9]">ollama.com</a> or toggle to <strong>In-Browser WebGPU</strong> for instant zero-install local inference!
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
        <div className="bg-[#101413] border border-[#222b26] rounded p-4 mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c3b4de] mb-2 flex items-center gap-1.5">
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
            className="w-full bg-[#141916] border border-[#222b26] rounded px-3 py-2 text-xs text-[#edf1ef] font-mono focus:outline-none focus:border-[#483c5e] mb-1.5"
          />
          <p className="text-[11px] text-[#8e9c95] font-mono">
            Acquire free read token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="underline text-[#c3b4de]">huggingface.co/settings/tokens</a>.
          </p>
        </div>
      )}

      {/* Bottom callout */}
      <div className="p-3 rounded bg-[#101413] border border-[#222b26] text-xs text-[#8e9c95] flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[11px]">
          <Shield className="w-3.5 h-3.5 text-[#55b376] shrink-0" />
          <span>Strictly open weights. 0 KB corporate telemetry.</span>
        </span>
        <a 
          href="#why-open" 
          onClick={onClose}
          className="text-[#9ed4b0] hover:underline flex items-center gap-1 shrink-0 ml-3 font-mono text-[11px]"
        >
          View Specs <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
