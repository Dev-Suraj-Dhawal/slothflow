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
  Terminal 
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
    setProgressMsg('SCANNING UNREAD MESSAGE STREAM...');
    setResult(null);

    try {
      const res = await openAiService.tidyChat(inputText, currentProvider, (msg) => {
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
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Input */}
      <div className="bg-[#141916] border border-[#222b26] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 corner-crosshairs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5 sm:mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] sm:text-[10px] font-mono text-[#526359] tracking-wider uppercase">
                TOOL // MODULE_01
              </span>
              <span className="text-[#323f38] font-mono">•</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#8edba6]">FILTER_CHAOS</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#edf2ee] flex items-center gap-2">
              <span className="p-1 sm:p-1.5 rounded-lg bg-[#1a2820] text-[#4eb374] border border-[#273d30] shrink-0">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <span>Chaos to 2-Line Clarity</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#84948b] mt-1 max-w-2xl leading-relaxed">
              Dump unread messages from group chats or noisy threads. Sloan filters the 5% that matters, drafts 1-click polite replies, and flags real blockers.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 font-mono w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[9px] sm:text-[10px] text-[#5c6e64] mr-1 hidden sm:inline">DATASET:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p.content)}
                className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded bg-[#19201c] hover:bg-[#202924] text-[#9aa8a0] hover:text-[#edf2ee] border border-[#26312a] transition-colors cursor-pointer tactile-btn whitespace-nowrap"
              >
                {p.name.split(' ')[0]} Sample
              </button>
            ))}
          </div>
        </div>

        {/* Input Area with Hairline Grid Framing */}
        <div className="relative mb-3">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw message stream here..."
            className="w-full bg-[#0c0f0d] border border-[#202723] rounded-xl p-3 sm:p-4 text-xs text-[#edf2ee] placeholder:text-[#435249] focus:outline-none focus:border-[#334d3d] transition-colors font-mono leading-relaxed resize-y min-h-[90px]"
          />
          <div className="flex justify-end mt-1 text-[9px] sm:text-[10px] font-mono text-[#607067]">
            <span>{inputText.length} BYTES</span>
          </div>
        </div>

        {/* Action Button & Telemetry */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <span className="text-[10px] sm:text-xs font-mono text-[#76877e] flex items-center gap-1.5 justify-center sm:justify-start">
            <ZapOff className="w-3.5 h-3.5 text-[#4eb374] shrink-0" />
            CONSERVES ~25 MIN DECISION LATENCY
          </span>

          <button
            onClick={handleTidy}
            disabled={loading || !inputText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#295738] hover:bg-[#326b45] text-white font-mono font-bold text-xs border border-[#3b7a50] transition-colors disabled:opacity-50 cursor-pointer tactile-btn"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{progressMsg || 'DECODING...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>EXECUTE SLOTH BRIEF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-[#141916] border border-[#27382e] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#202723]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-bold tracking-wider text-[#8edba6] flex items-center gap-1.5">
                SLOAN_BRIEF //
              </span>
              <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded border ${
                result.urgencyLevel === 'One Quick Action Needed'
                  ? 'bg-[#261717] border-[#422525] text-[#db8f8f]'
                  : result.urgencyLevel === 'Low Effort'
                    ? 'bg-[#261e14] border-[#3d2e1f] text-[#deb992]'
                    : 'bg-[#17241c] border-[#253d2d] text-[#8edba6]'
              }`}>
                URGENCY: {result.urgencyLevel.toUpperCase()}
              </span>
            </div>

            <span className="text-[10px] sm:text-xs font-mono text-[#76877e] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#4eb374]" />
              TIME SAVED: <strong className="text-[#edf2ee]">25M</strong>
            </span>
          </div>

          {/* 2-Line Brief Callout */}
          <div className="bg-[#101412] border-l-4 border-l-[#4eb374] border-r border-t border-b border-[#1f2923] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-[#d4ede0] font-sans font-medium leading-relaxed">
            {result.twoLineBrief}
          </div>

          {/* Quick 1-Click Replies */}
          <div>
            <h4 className="text-[10px] sm:text-[11px] font-mono font-bold text-[#84948b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Send className="w-3 h-3 text-[#4eb374]" />
              READY DISPATCH (ONE CLICK BUFFER COPY):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5">
              {result.suggestedReplies.map((reply, idx) => (
                <div
                  key={idx}
                  onClick={() => copyReply(reply, idx)}
                  className="group cursor-pointer bg-[#18201c] border border-[#222c26] hover:border-[#324538] rounded-xl p-3 sm:p-3.5 text-xs text-[#cbd6cf] transition-colors flex items-center justify-between gap-2 tactile-btn"
                >
                  <span className="italic font-sans text-xs">"{reply}"</span>
                  <button
                    className="p-1 rounded bg-[#1f2923] text-[#718279] group-hover:text-[#8edba6] shrink-0 transition-colors cursor-pointer"
                    title="Copy to buffer"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#4eb374]" />
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
            <div className="pt-2 border-t border-[#202723]">
              <h4 className="text-[10px] sm:text-[11px] font-mono font-bold text-[#76877e] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#4eb374]" />
                ACTION REGISTER:
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs text-[#cbd6cf]">
                {result.extractedTasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-2.5 bg-[#18201c] px-3 py-1.5 sm:py-2 rounded-xl border border-[#222c26] font-mono text-[10px] sm:text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4eb374] shrink-0" />
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
