import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Copy, 
  Check, 
  ListChecks, 
  ShoppingCart, 
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
    setProgressMsg('Parsing lazy voice stream...');
    setResult(null);

    try {
      const res = await openAiService.processVoiceRamble(transcript, currentProvider, (msg) => {
        setProgressMsg(msg);
      });
      setResult(res);
      soundEngine.playGentleChime();
      confetti({
        particleCount: 15,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#2e6f40', '#8f6036', '#4a6b5d']
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
      <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#f0f3f1] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#192426] text-[#96cfd9] border border-[#273d42]">
                <Mic className="w-4 h-4" />
              </span>
              Lazy Voice Ramble to Clean Roadmap
            </h2>
            <p className="text-xs text-[#8e9c95] mt-1 max-w-2xl leading-relaxed">
              Speak or mumble while lying down. The open model extracts clean groceries, action items, or notes without requiring you to organize anything.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <span className="text-[11px] text-[#73827b] mr-1 hidden sm:inline">Try preset:</span>
            {VOICE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setTranscript(p.text)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#1c2320] hover:bg-[#232c28] text-[#a0ada6] border border-[#28332e] transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text / Speech Area */}
        <div className="relative mb-3.5">
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Click the microphone and speak lazily, or type your incoherent thoughts..."
            className="w-full bg-[#101413] border border-[#242d29] rounded-xl p-4 text-xs text-[#edf1ef] placeholder:text-[#525f58] focus:outline-none focus:border-[#385954] transition-colors font-mono leading-relaxed"
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-[#472222] text-[#f2adad] border-[#6b3535]'
                  : 'bg-[#1c2320] text-[#a0ada6] border-[#28332e] hover:text-[#f0f3f1] hover:bg-[#232c28]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#96cfd9]" />
                  <span>Record Voice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[#8e9c95] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#96cfd9]" />
            Zero friction note taking for exhausted brains
          </span>

          <button
            onClick={handleProcess}
            disabled={loading || !transcript.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#23505c] hover:bg-[#2b6170] text-white font-semibold text-xs border border-[#357587] transition-colors disabled:opacity-50 cursor-pointer"
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
        <div className="bg-[#161b19] border border-[#26373b] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#242d29]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#96cfd9] flex items-center gap-1.5">
                {result.category === 'Groceries' ? (
                  <ShoppingCart className="w-4 h-4 text-[#55b376]" />
                ) : (
                  <ListChecks className="w-4 h-4 text-[#96cfd9]" />
                )}
                Category: {result.category}
              </span>
            </div>

            <button
              onClick={copyBullets}
              className="flex items-center gap-1.5 text-xs text-[#a0ada6] hover:text-[#f0f3f1] bg-[#1c2320] hover:bg-[#232c28] px-3 py-1.5 rounded-xl border border-[#28332e] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#55b376]" />
                  <span className="text-[#9ed4b0] font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-[#8e9c95] bg-[#101413] px-4 py-2.5 rounded-xl border border-[#242d29]">
            Core intent: <strong className="text-[#edf1ef] font-medium">{result.cleansedIntent}</strong>
          </div>

          <div className="space-y-2 pt-1">
            {result.bulletItems.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 bg-[#1b221f] border border-[#26312c] rounded-xl px-4 py-3 text-xs text-[#d6deda]"
              >
                <span className="w-2 h-2 rounded-full bg-[#52a1b0] shrink-0" />
                <span className="font-medium">{item.replace(/^•\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
