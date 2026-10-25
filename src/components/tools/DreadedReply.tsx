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
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#10b981', '#06b6d4']
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
      <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Mail className="w-4 h-4" />
              </span>
              The Procrastination Breaker (Dreaded Reply)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Have an email, Slack DM, or invite you've delayed answering for 2 weeks? Sloan writes an immaculate, guilt-free response so you can stop stressing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Try preset:</span>
            {DREADED_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setDreadedMsg(p.text)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.08] transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30'
                      : 'bg-[#07090e]/70 border-white/[0.08] text-slate-400 hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-snug">{t.desc}</div>
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
            className="w-full bg-[#07090e]/85 border border-white/[0.08] rounded-xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-mono leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-purple-400" />
            Conserves ~45 mins of subconscious dread & rumination
          </span>

          <button
            onClick={handleDraft}
            disabled={loading || !dreadedMsg.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-950/60 disabled:opacity-50 cursor-pointer"
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
        <div className="bg-[#0d121b]/90 border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Guilt-Free Reply Ready to Send
            </span>

            <button
              onClick={copyReply}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-white/[0.08] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Reply</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#07090e]/85 border border-white/[0.08] rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed select-all">
            {result.draftReply}
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
            <strong className="block mb-0.5 text-purple-300 font-bold">Why this cures the procrastination:</strong>
            <p className="leading-relaxed text-purple-100/90">{result.whyItRelievesStress}</p>
          </div>
        </div>
      )}
    </div>
  );
};
