import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Copy, 
  Check, 
  ListChecks, 
  ShoppingCart, 
  BrainCircuit, 
  ZapOff 
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
    label: 'Half-Asleep Grocery Mumble',
    text: `Uhh so we definitely ran out of oat milk this morning, and the coffee beans are basically dust in the grinder... oh and also eggs if they have the brown ones, plus some sourdough bread and maybe some dark chocolate if I deserve a treat, and paper towels because the kitchen counter is a disaster.`
  },
  {
    label: 'Lazy Bedside Work Ramble',
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

  // Toggle Web Speech Recognition if supported
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

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setProgressMsg('Parsing lazy voice stream...');
    setResult(null);

    try {
      const res = await openAiService.processVoiceRamble(transcript, currentProvider, (msg) => {
        setProgressMsg(msg);
      });
      setResult(res);
      soundEngine.playGentleChime();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#10b981', '#f59e0b']
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
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-cyan-400" />
              Lazy Voice Ramble to Clean Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Speak or mumble while lying down. The open model extracts clean groceries, action items, or notes without requiring you to organize anything.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Try preset:</span>
            {VOICE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setTranscript(p.text)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text / Speech Area */}
        <div className="relative mb-3">
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Click the microphone and speak lazily, or type your incoherent thoughts..."
            className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all font-mono"
          />

          <button
            onClick={toggleRecording}
            className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Record Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-cyan-400" />
            Zero friction note taking for exhausted brains
          </span>

          <button
            onClick={handleProcess}
            disabled={loading || !transcript.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'Organizing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Clean & Categorize Ramble</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                {result.category === 'Groceries' ? (
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ListChecks className="w-4 h-4 text-cyan-400" />
                )}
                Category: {result.category}
              </span>
            </div>

            <button
              onClick={copyBullets}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-400 italic">
            Core intent: <strong className="text-slate-200">{result.cleansedIntent}</strong>
          </div>

          <div className="space-y-2">
            {result.bulletItems.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-medium">{item.replace(/^•\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
