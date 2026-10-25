import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Check, 
  Copy, 
  Send, 
  ZapOff,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIProvider, ChatTidierResult } from '../../types';
import { openAiService } from '../../services/openAiService';
import { soundEngine } from '../../services/soundEngine';

interface ChatTidierProps {
  currentProvider: AIProvider;
  onEffortSaved: (minutes: number, calories: number) => void;
}

const PRESETS = [
  {
    name: 'Family Chat (Sunday Chaos)',
    content: `Mom (10:14 PM): Did everyone remember Aunt Brenda's birthday dinner on Wednesday?
Dave (10:16 PM): Wait I thought it was Thursday at 7??
Mom (10:18 PM): No Wednesday! Dave please check your calendar.
Sarah (10:21 PM): I can only make it if it's near downtown because of yoga.
Mom (10:25 PM): Dave are you bringing the gluten free cupcakes or should I order from the bakery?
Dave (10:29 PM): Bakery is safer haha
Dad (10:35 PM): [Photo of a lawnmower] Does anyone know how to change the oil filter on this?
Sarah (10:40 PM): Dad wrong chat!!
Dave (10:41 PM): Haha classic Dad
Mom (10:45 PM): Suraj are you coming to dinner? Let me know by tomorrow so I can reserve the table!`
  },
  {
    name: 'Work Standup (PR Thread Noise)',
    content: `Alex (9:02 AM): Morning team! Just merged the auth refactor branch.
Maya (9:05 AM): Looks like the CI pipeline on staging failed on unit tests.
Alex (9:07 AM): Looking into it now, seems like a jest mock issue.
Ken (9:12 AM): Coffee machine on 3rd floor is broken again btw.
Maya (9:15 AM): Dev-Suraj, did you get a chance to peek at the PR #412 when you have a free minute? No rush at all!
Alex (9:20 AM): CI fixed. PR #412 looks good to merge once Suraj gives a thumbs up.
Ken (9:30 AM): Lunch at the taco place today?`
  }
];

export const ChatTidier: React.FC<ChatTidierProps> = ({ currentProvider, onEffortSaved }) => {
  const [inputText, setInputText] = useState(PRESETS[0].content);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<ChatTidierResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTidy = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setProgressMsg('Waking up Sloan to read unread chatter...');
    setResult(null);

    try {
      const res = await openAiService.tidyChat(inputText, currentProvider, (msg) => {
        setProgressMsg(msg);
      });
      setResult(res);
      soundEngine.playGentleChime();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#f59e0b']
      });
      onEffortSaved(25, 45);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to process chat');
    } finally {
      setLoading(false);
    }
  };

  const copyReply = (reply: string, index: number) => {
    navigator.clipboard.writeText(reply);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Input */}
      <div className="bg-[#0d121b]/80 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="w-4 h-4" />
              </span>
              Chaos to 2-Line Clarity (Chat & Inbox Tidier)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Dump dozens of unread messages from noisy group chats or emails. The open-weight model distills the 5% that actually matters and drafts polite 1-click replies.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Try preset:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p.content)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.08] transition-all cursor-pointer"
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative mb-3.5">
          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw unread chat, Slack thread, Discord logs, or email messages here..."
            className="w-full bg-[#07090e]/85 border border-white/[0.08] rounded-xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-[#07090e]/80 px-2 py-0.5 rounded border border-white/5">
            {inputText.length} chars
          </div>
        </div>

        {/* Action Button & Telemetry */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-emerald-400" />
            Conserves ~25 mins of screen scrolling fatigue
          </span>

          <button
            onClick={handleTidy}
            disabled={loading || !inputText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/60 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'Reading lazily...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Distill to 2-Line Sloth Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-[#0d121b]/90 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl animate-fade-in space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                🦥 Sloan's Executive Brief
              </span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                result.urgencyLevel === 'One Quick Action Needed'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : result.urgencyLevel === 'Low Effort'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                Urgency: {result.urgencyLevel}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Effort saved: <strong className="text-emerald-400 font-bold">25m</strong>
            </span>
          </div>

          {/* 2-Line Brief Callout with vertical accent border */}
          <div className="bg-emerald-950/25 border-l-4 border-emerald-400 border-r border-t border-b border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-100 font-medium leading-relaxed shadow-inner">
            {result.twoLineBrief}
          </div>

          {/* Quick 1-Click Replies */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              Zero-Brainpower 1-Click Replies (Click to Copy):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {result.suggestedReplies.map((reply, idx) => (
                <div
                  key={idx}
                  onClick={() => copyReply(reply, idx)}
                  className="group relative cursor-pointer bg-[#07090e]/80 border border-white/[0.08] hover:border-emerald-500/50 rounded-xl p-3.5 text-xs text-slate-200 transition-all flex items-center justify-between gap-2 shadow-sm hover:shadow-emerald-950/30"
                >
                  <span className="italic font-sans">"{reply}"</span>
                  <button
                    className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-emerald-300 shrink-0 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Tasks (If any) */}
          {result.extractedTasks && result.extractedTasks.length > 0 && (
            <div className="pt-2 border-t border-white/[0.06]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                What's Actually on You:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.extractedTasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-2.5 bg-[#07090e]/60 px-3.5 py-2 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
