import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Utensils, 
  Mail, 
  Moon, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { AIProvider, SlothMode, SlothStats } from './types';
import { Header } from './components/Header';
import { SlothMascot } from './components/SlothMascot';
import { EngineSelector } from './components/EngineSelector';
import { SoundBar } from './components/SoundBar';
import { ChatTidier } from './components/tools/ChatTidier';
import { VoiceRamble } from './components/tools/VoiceRamble';
import { FridgeChef } from './components/tools/FridgeChef';
import { DreadedReply } from './components/tools/DreadedReply';
import { WindDownSanctuary } from './components/tools/WindDownSanctuary';
import { WhyOpenAi } from './components/tools/WhyOpenAi';

export const App: React.FC = () => {
  const [provider, setProvider] = useState<AIProvider>('browser-transformers');
  const [activeTab, setActiveTab] = useState<SlothMode>('chat-tidier');
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);
  const [isSoundBarOpen, setIsSoundBarOpen] = useState(false);
  const [mascotStatus, setMascotStatus] = useState<string>('');

  const [stats, setStats] = useState<SlothStats>({
    timeSavedMinutes: 65,
    caloriesConserved: 135,
    tasksEliminated: 8,
    chillLevel: 94
  });

  const handleEffortSaved = (minutes: number, calories: number) => {
    setStats((prev) => ({
      timeSavedMinutes: prev.timeSavedMinutes + minutes,
      caloriesConserved: prev.caloriesConserved + calories,
      tasksEliminated: prev.tasksEliminated + 1,
      chillLevel: Math.min(100, prev.chillLevel + 2)
    }));
    setMascotStatus(`Conserved ${minutes}m of effort!`);
    setTimeout(() => setMascotStatus(''), 4500);
  };

  const navItems = [
    {
      id: 'chat-tidier' as SlothMode,
      label: 'Chat & Inbox Tidier',
      icon: MessageSquare,
      badge: 'Popular',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'voice-ramble' as SlothMode,
      label: 'Lazy Voice Ramble',
      icon: Mic,
      badge: 'Audio',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'fridge-chef' as SlothMode,
      label: 'Fridge-to-Feast',
      icon: Utensils,
      badge: '10 Mins',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'dreaded-reply' as SlothMode,
      label: 'Procrastination Breaker',
      icon: Mail,
      badge: 'Zero Guilt',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'wind-down' as SlothMode,
      label: 'Wind-Down & Snooze',
      icon: Moon,
      badge: 'Offline',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'why-open' as SlothMode,
      label: 'Why Open AI Matters',
      icon: FileText,
      badge: 'Manifesto',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black antialiased relative">
      {/* Top subtle biophilic glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-emerald-500/10 via-teal-900/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <Header
        currentProvider={provider}
        stats={stats}
        isSoundActive={isSoundBarOpen}
        onToggleSoundBar={() => setIsSoundBarOpen(!isSoundBarOpen)}
        onOpenEngineModal={() => setIsEngineModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 relative z-10">
        {/* Sloth Mascot Banner */}
        <SlothMascot 
          statusText={mascotStatus}
          onPoked={() => handleEffortSaved(5, 10)}
        />

        {/* Tab Navigation Segmented Bar */}
        <div className="p-1.5 rounded-2xl bg-[#0d121b]/80 border border-white/[0.08] backdrop-blur-md shadow-inner flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/10 text-white border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono border ${
                    isActive 
                      ? item.badgeColor 
                      : 'bg-slate-800/80 text-slate-400 border-white/5'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tool View */}
        <div className="min-h-[440px]">
          {activeTab === 'chat-tidier' && (
            <ChatTidier
              currentProvider={provider}
              onEffortSaved={handleEffortSaved}
            />
          )}

          {activeTab === 'voice-ramble' && (
            <VoiceRamble
              currentProvider={provider}
              onEffortSaved={handleEffortSaved}
            />
          )}

          {activeTab === 'fridge-chef' && (
            <FridgeChef
              currentProvider={provider}
              onEffortSaved={handleEffortSaved}
            />
          )}

          {activeTab === 'dreaded-reply' && (
            <DreadedReply
              currentProvider={provider}
              onEffortSaved={handleEffortSaved}
            />
          )}

          {activeTab === 'wind-down' && (
            <WindDownSanctuary
              currentProvider={provider}
              onOpenSoundBar={() => setIsSoundBarOpen(true)}
              onEffortSaved={handleEffortSaved}
            />
          )}

          {activeTab === 'why-open' && (
            <WhyOpenAi />
          )}
        </div>
      </main>

      {/* Floating Soundbar Widget */}
      <SoundBar
        isOpen={isSoundBarOpen}
        onClose={() => setIsSoundBarOpen(false)}
      />

      {/* AI Engine Modal */}
      {isEngineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <EngineSelector
            currentProvider={provider}
            onSelectProvider={(p) => {
              setProvider(p);
              setIsEngineModalOpen(false);
            }}
            onClose={() => setIsEngineModalOpen(false)}
          />
        </div>
      )}

      {/* Masterfully Styled Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05070a]/90 px-4 sm:px-8 py-8 text-xs text-slate-500 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🦥</span>
            <div>
              <p className="text-slate-300 font-semibold flex items-center gap-2 justify-center md:justify-start">
                SlothFlow AI <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Slow & Steady</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                International Sloth Day Hackathon build for DEV & Hacktoberfest 2026. Built with open-weight models, Transformers.js & Ollama.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Client-Side WebGPU
            </span>
            <span className="text-white/10 hidden sm:inline">•</span>
            <a 
              href="https://github.com/Dev-Suraj-Dhawal/slothflow" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub Source <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <span className="text-white/10 hidden sm:inline">•</span>
            <a 
              href="https://dev.to/challenges/hacktoberfest-week3-2026-10-19" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              DEV Challenge <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
