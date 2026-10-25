import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck, 
  ZapOff, 
  Clock, 
  ThumbsUp, 
  UserCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIProvider, DreadedReplyResult } from '../../types';
import { openAiService } from '../../services/openAiService';
import { soundEngine } from '../../services/soundEngine';

interface DreadedReplyProps {
  currentProvider: AIProvider;
  onEffortSaved: (minutes: number, calories: number) => void;
}

const DREADED_PRESETS = [
  {
    label: 'Awkward 2-Week Old Email',
    text: `Hi Suraj, following up on our email from 2 weeks ago regarding the volunteer committee proposal. We really need your feedback by tomorrow morning to finalize the slides. Can you please review the 30-page draft and let us know your thoughts?`
  },
  {
    label: 'Unwanted Weekend Request',
    text: `Hey! Are you free this Saturday morning at 8am to help move some heavy furniture across town? We could really use an extra pair of hands!`
  }
];

export const DreadedReply: React.FC<DreadedReplyProps> = ({ currentProvider, onEffortSaved }) => {
  const [dreadedMsg, setDreadedMsg] = useState(DREADED_PRESETS[0].text);
  const [tone, setTone] = useState<'ultra-brief' | 'polite-delay' | 'warm-decline' | 'enthusiastic-delegate'>('polite-delay');
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<DreadedReplyResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDraft = async () => {
    if (!dreadedMsg.trim()) return;
    setLoading(true);
    setProgressMsg('ELIMINATING GUILT VECTOR WITH OPEN MODEL...');
    setResult(null);

    try {
      const res = await openAiService.draftDreadedReply(dreadedMsg, tone, currentProvider, (msg) => {
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
      onEffortSaved(45, 90);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to draft reply');
    } finally {
      setLoading(false);
    }
  };

  const copyReply = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141916] border border-[#222b26] rounded-2xl p-5 sm:p-6 corner-crosshairs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#526359] tracking-wider uppercase">
                TOOL // MODULE_04
              </span>
              <span className="text-[#323f38] font-mono">•</span>
              <span className="text-[10px] font-mono text-[#cbbfe8]">PROCRASTINATION_BREAKER</span>
            </div>
            <h2 className="text-base font-bold text-[#edf2ee] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#231b2e] text-[#cbbfe8] border border-[#382b4c]">
                <Mail className="w-4 h-4" />
              </span>
              The Procrastination Breaker (Dreaded Reply)
            </h2>
            <p className="text-xs text-[#84948b] mt-1 max-w-2xl leading-relaxed">
              Have an email, Slack DM, or invite you've delayed answering for 2 weeks? Sloan writes an immaculate, guilt-free response so you can stop stressing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 font-mono">
            <span className="text-[10px] text-[#5c6e64] mr-1 hidden sm:inline">SAMPLE:</span>
            {DREADED_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setDreadedMsg(p.text)}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-[#19201c] hover:bg-[#202924] text-[#9aa8a0] hover:text-[#edf2ee] border border-[#26312a] transition-colors cursor-pointer tactile-btn"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mb-4">
          <label className="block text-xs font-mono text-[#9aa8a0] mb-2 uppercase">
            // SELECT DEFENSE DOCTRINE
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'polite-delay', label: 'Polite Delay', desc: 'Buys 5 days of peace', icon: Clock },
              { id: 'warm-decline', label: 'Warm Decline', desc: 'Firm, no awkward follow-up', icon: ShieldCheck },
              { id: 'ultra-brief', label: 'Ultra-Brief', desc: '12 words, zero mental load', icon: ThumbsUp },
              { id: 'enthusiastic-delegate', label: 'Delegate', desc: 'Hands off task smoothly', icon: UserCheck }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id as typeof tone)}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer tactile-btn ${
                    tone === t.id
                      ? 'bg-[#231b2e] border-[#44355e] text-[#edf2ee]'
                      : 'bg-[#19201c] border-[#222b26] text-[#84948b] hover:border-[#2d3a33] hover:text-[#edf2ee]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#edf2ee] mb-0.5 font-sans">
                    <Icon className="w-3.5 h-3.5 text-[#cbbfe8]" />
                    <span>{t.label}</span>
                  </div>
                  <div className="text-[10px] text-[#718279] leading-snug font-mono">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative mb-3.5">
          <textarea
            rows={4}
            value={dreadedMsg}
            onChange={(e) => setDreadedMsg(e.target.value)}
            placeholder="Paste the message you have been procrastinating answering..."
            className="w-full bg-[#0c0f0d] border border-[#202723] rounded-xl p-4 text-xs text-[#edf2ee] placeholder:text-[#435249] focus:outline-none focus:border-[#382b4c] transition-colors font-mono leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs font-mono text-[#76877e] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#cbbfe8]" />
            CONSERVES ~45 MINS SUBCONSCIOUS DREAD
          </span>

          <button
            onClick={handleDraft}
            disabled={loading || !dreadedMsg.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#392e4d] hover:bg-[#46395e] text-white font-mono font-bold text-xs border border-[#544470] transition-colors disabled:opacity-50 cursor-pointer tactile-btn"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'DRAFTING...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE RELIEF DISPATCH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#141916] border border-[#2f243d] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#202723]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#cbbfe8] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8edba6]" /> DISPATCH_PAYLOAD // READY
            </span>

            <button
              onClick={copyReply}
              className="flex items-center gap-1.5 text-xs font-mono text-[#9aa8a0] hover:text-[#edf2ee] bg-[#19201c] hover:bg-[#202924] px-3.5 py-1.5 rounded-lg border border-[#26312a] transition-colors cursor-pointer tactile-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4eb374]" />
                  <span className="text-[#8edba6]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY_PAYLOAD</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#0c0f0d] border border-[#202723] rounded-xl p-4 text-xs text-[#edf2ee] font-mono leading-relaxed select-all">
            {result.draftReply}
          </div>

          <div className="p-3.5 rounded-xl bg-[#231b2e] border border-[#382b4c] text-xs text-[#cbbfe8] font-mono">
            <strong className="block mb-0.5 text-[#e5ddf5] font-bold uppercase text-[10px] tracking-wider">
              PSYCHOLOGICAL_JUSTIFICATION //
            </strong>
            <p className="leading-relaxed text-[#cbbfe8] font-sans text-xs">{result.whyItRelievesStress}</p>
          </div>
        </div>
      )}
    </div>
  );
};
