import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Copy, 
  Check, 
  ListChecks, 
  ShoppingCart, 
  ZapOff,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIProvider, VoiceRambleResult } from '../../types';
import { openAiService } from '../../services/openAiService';
import { soundEngine } from '../../services/soundEngine';

interface VoiceRambleProps {
  currentProvider: AIProvider;
  onEffortSaved: (minutes: number, calories: number) => void;
}

const VOICE_PRESETS = [
  {
    label: 'Morning Grocery Mumble',
    text: `Uhh so we definitely ran out of oat milk this morning, and the coffee beans are basically dust in the grinder... oh and also eggs if they have the brown ones, plus some sourdough bread and maybe some dark chocolate if I deserve a treat, and paper towels because the kitchen counter is a disaster.`
  },
  {
    label: 'Bedside Work Thoughts',
    text: `Need to remember tomorrow morning to tell Alex that the pull request is fine to ship, but check the database migration first... oh and reschedule that 2pm sync with marketing because I want to take a nap, and reply to client email about the launch date.`
  }
];

export const VoiceRamble: React.FC<VoiceRambleProps> = ({ currentProvider, onEffortSaved }) => {
  const [transcript, setTranscript] = useState(VOICE_PRESETS[0].text);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<VoiceRambleResult | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleRecording = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not directly supported in this browser. You can type or paste your ramble directly!');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setTranscript(current);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setProgressMsg('STRUCTURING ACOUSTIC STREAM...');
    setResult(null);

    try {
      const res = await openAiService.processVoiceRamble(transcript, currentProvider, (msg) => {
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
      onEffortSaved(15, 30);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to process voice ramble');
    } finally {
      setLoading(false);
    }
  };

  const copyBullets = () => {
    if (!result) return;
    const text = `${result.cleansedIntent}\n\n` + result.bulletItems.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 corner-crosshairs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5 sm:mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] sm:text-[10px] font-mono text-[#526359] tracking-wider uppercase">
                TOOL // MODULE_02
              </span>
              <span className="text-[#323f38] font-mono">•</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#88c9d4]">VOICE_HARVEST</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#edf2ee] flex items-center gap-2">
              <span className="p-1 sm:p-1.5 rounded-lg bg-[#152326] text-[#88c9d4] border border-[#263e42] shrink-0">
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <span>Lazy Voice Ramble to Clean Roadmap</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#84948b] mt-1 max-w-2xl leading-relaxed">
              Mumble while half-asleep. The open-source model extracts clean groceries, action items, or notes without requiring you to organize or structure anything.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 font-mono w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[9px] sm:text-[10px] text-[#5c6e64] mr-1 hidden sm:inline">PRESET:</span>
            {VOICE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setTranscript(p.text)}
                className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded bg-[#19201c] hover:bg-[#202924] text-[#9aa8a0] hover:text-[#edf2ee] border border-[#26312a] transition-colors cursor-pointer tactile-btn whitespace-nowrap"
              >
                {p.label.split(' ')[0]} Preset
              </button>
            ))}
          </div>
        </div>

        {/* Text / Speech Area */}
        <div className="space-y-2 mb-3">
          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Click the microphone or type rambling stream-of-consciousness..."
            className="w-full bg-[#0c0f0d] border border-[#202723] rounded-xl p-3 sm:p-4 text-xs text-[#edf2ee] placeholder:text-[#435249] focus:outline-none focus:border-[#2f4f4f] transition-colors font-mono leading-relaxed resize-y min-h-[90px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              {isRecording ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#101412] rounded border border-[#422525] text-[10px] text-[#db8f8f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#db8f8f] animate-ping" />
                  <span>REC // STREAMING</span>
                </div>
              ) : (
                <span className="text-[10px] text-[#607067]">
                  {transcript.length} BYTES INPUT
                </span>
              )}
            </div>

            <button
              onClick={toggleRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer tactile-btn ${
                isRecording
                  ? 'bg-[#3d1e1e] text-[#f0afaf] border-[#592d2d]'
                  : 'bg-[#19201c] text-[#9aa8a0] border-[#26312a] hover:text-[#edf2ee] hover:bg-[#202924]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>HALT_MIC</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#88c9d4]" />
                  <span>RECORD_VOICE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <span className="text-[10px] sm:text-xs font-mono text-[#76877e] flex items-center gap-1.5 justify-center sm:justify-start">
            <ZapOff className="w-3.5 h-3.5 text-[#88c9d4] shrink-0" />
            ZERO SYNTAX OVERHEAD FOR TIRED BRAINS
          </span>

          <button
            onClick={handleProcess}
            disabled={loading || !transcript.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#22444d] hover:bg-[#2c5561] text-white font-mono font-bold text-xs border border-[#376978] transition-colors disabled:opacity-50 cursor-pointer tactile-btn"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'EXTRACTING...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>CLEANSE & CATEGORIZE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-[#141916] border border-[#233538] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#202723]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#88c9d4] flex items-center gap-1.5">
                {result.category === 'Groceries' ? (
                  <ShoppingCart className="w-4 h-4 text-[#4eb374]" />
                ) : (
                  <ListChecks className="w-4 h-4 text-[#88c9d4]" />
                )}
                CATEGORY // {result.category.toUpperCase()}
              </span>
            </div>

            <button
              onClick={copyBullets}
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
                  <span>EXPORT_BUFFER</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] sm:text-xs font-mono text-[#76877e] bg-[#0c0f0d] px-3.5 py-2.5 rounded-xl border border-[#202723]">
            INTENT // <strong className="text-[#cbd6cf] font-medium">{result.cleansedIntent}</strong>
          </div>

          <div className="space-y-1.5 sm:space-y-2 pt-1 font-mono text-xs">
            {result.bulletItems.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2.5 sm:gap-3 bg-[#18201c] border border-[#222c26] rounded-xl px-3.5 py-2.5 sm:py-3 text-[#cbd6cf] text-[11px] sm:text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4aa1af] shrink-0" />
                <span className="font-medium">{item.replace(/^•\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
