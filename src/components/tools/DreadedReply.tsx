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
    setProgressMsg('Eliminating social guilt with open AI...');
    setResult(null);

    try {
      const res = await openAiService.draftDreadedReply(dreadedMsg, tone, currentProvider, (msg) => {
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
      <div className="bg-[#161b19] border border-[#242d29] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#f0f3f1] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#251f30] text-[#c3b4de] border border-[#3e3252]">
                <Mail className="w-4 h-4" />
              </span>
              The Procrastination Breaker (Dreaded Reply)
            </h2>
            <p className="text-xs text-[#8e9c95] mt-1 max-w-2xl leading-relaxed">
              Have an email, Slack DM, or invite you've delayed answering for 2 weeks? Sloan writes an immaculate, guilt-free response so you can stop stressing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <span className="text-[11px] text-[#73827b] mr-1 hidden sm:inline">Try preset:</span>
            {DREADED_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setDreadedMsg(p.text)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#1c2320] hover:bg-[#232c28] text-[#a0ada6] border border-[#28332e] transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#c7d1cc] mb-2">
            Pick your sloth defense strategy:
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
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    tone === t.id
                      ? 'bg-[#251f30] border-[#4e3c66] text-[#f0f3f1]'
                      : 'bg-[#1b221f] border-[#26312c] text-[#8e9c95] hover:border-[#33423b] hover:text-[#f0f3f1]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#f0f3f1] mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-[#c3b4de]" />
                    <span>{t.label}</span>
                  </div>
                  <div className="text-[10px] text-[#8e9c95] leading-snug">{t.desc}</div>
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
            placeholder="Paste the dreaded message here..."
            className="w-full bg-[#101413] border border-[#242d29] rounded-xl p-4 text-xs text-[#edf1ef] placeholder:text-[#525f58] focus:outline-none focus:border-[#483c5e] transition-colors font-mono leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[#8e9c95] flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-[#c3b4de]" />
            Conserves ~45 mins of subconscious dread & rumination
          </span>

          <button
            onClick={handleDraft}
            disabled={loading || !dreadedMsg.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#483861] hover:bg-[#574475] text-white font-semibold text-xs border border-[#634e85] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'Drafting relief...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Eliminate Dread & Draft Reply</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#161b19] border border-[#382d47] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#242d29]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c3b4de] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Guilt-Free Reply Ready to Send
            </span>

            <button
              onClick={copyReply}
              className="flex items-center gap-1.5 text-xs text-[#a0ada6] hover:text-[#f0f3f1] bg-[#1c2320] hover:bg-[#232c28] px-3.5 py-1.5 rounded-xl border border-[#28332e] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#55b376]" />
                  <span className="text-[#9ed4b0] font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Reply</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#101413] border border-[#242d29] rounded-xl p-4 text-xs text-[#edf1ef] font-mono leading-relaxed select-all">
            {result.draftReply}
          </div>

          <div className="p-3.5 rounded-xl bg-[#251f30] border border-[#3e3252] text-xs text-[#c3b4de]">
            <strong className="block mb-0.5 text-[#e1d9f0] font-bold">Why this cures the procrastination:</strong>
            <p className="leading-relaxed text-[#c3b4de]">{result.whyItRelievesStress}</p>
          </div>
        </div>
      )}
    </div>
  );
};
