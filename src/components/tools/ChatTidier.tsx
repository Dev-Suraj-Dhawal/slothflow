import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Check, 
  Copy, 
  AlertCircle, 
  Send, 
  ZapOff,
  Flame,
  CheckCircle2
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
    name: 'Family Group Chat (Sunday Chaos)',
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
    name: 'Work Project Thread (Standup Noise)',
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
    setProgressMsg('Waking up Sloan to read unread clutter...');
    setResult(null);

    try {
      const res = await openAiService.tidyChat(inputText, currentProvider, (msg) => {
        setProgressMsg(msg);
      });
      setResult(res);
      soundEngine.playGentleChime();
      confetti({
        particleCount: 30,
        spread: 70,
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
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Chaos to 2-Line Clarity (Chat & Inbox Tidier)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dump dozens of unread messages from family or work. The open-weight model distills the 5% that actually matters and drafts polite 1-click replies.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Try preset:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p.content)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition-all"
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative mb-3">
          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw unread chat, Slack thread, Discord logs, or email messages here..."
            className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-all font-mono"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500">
            {inputText.length} characters
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ZapOff className="w-3.5 h-3.5 text-emerald-400" />
            Conserves ~25 mins of screen scrolling fatigue
          </span>

          <button
            onClick={handleTidy}
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50 cursor-pointer"
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
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                🦥 Sloan's Executive Brief
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                result.urgencyLevel === 'One Quick Action Needed'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : result.urgencyLevel === 'Low Effort'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                Urgency: {result.urgencyLevel}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Effort saved: <strong className="text-emerald-400">25m</strong>
            </span>
          </div>

          {/* 2-Line Brief Callout */}
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-100 font-medium leading-relaxed">
            {result.twoLineBrief}
          </div>

          {/* Quick 1-Click Replies */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              Zero-Brainpower 1-Click Replies (Copy & Send):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {result.suggestedReplies.map((reply, idx) => (
                <div
                  key={idx}
                  onClick={() => copyReply(reply, idx)}
                  className="group relative cursor-pointer bg-slate-950/70 border border-white/10 hover:border-emerald-500/40 rounded-xl p-3 text-xs text-slate-200 transition-all flex items-center justify-between gap-2"
                >
                  <span className="italic">"{reply}"</span>
                  <button
                    className="p-1 rounded bg-slate-800 text-slate-400 group-hover:text-emerald-300 shrink-0"
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
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                What's Actually on You:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.extractedTasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{t}</span>
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
