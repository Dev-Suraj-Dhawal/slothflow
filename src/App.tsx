import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Utensils, 
  Mail, 
  Moon, 
  FileText, 
  Sparkles, 
  Heart,
  Volume2,
  CheckCircle,
  HelpCircle,
  Coffee
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
    setTimeout(() => setMascotStatus(''), 4000);
  };

  const navItems = [
    {
      id: 'chat-tidier' as SlothMode,
      label: 'Chat & Inbox Tidier',
      icon: MessageSquare,
      badge: 'Popular'
    },
    {
      id: 'voice-ramble' as SlothMode,
      label: 'Lazy Voice Ramble',
      icon: Mic,
      badge: 'Audio'
    },
    {
      id: 'fridge-chef' as SlothMode,
      label: 'Fridge-to-Feast',
      icon: Utensils,
      badge: '10 Mins'
    },
    {
      id: 'dreaded-reply' as SlothMode,
      label: 'Procrastination Breaker',
      icon: Mail,
      badge: 'Zero Guilt'
    },
    {
      id: 'wind-down' as SlothMode,
      label: 'Wind-Down & Snooze',
      icon: Moon,
      badge: 'Offline'
    },
    {
      id: 'why-open' as SlothMode,
      label: 'Why Open AI Matters',
      icon: FileText,
      badge: 'Manifesto'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentProvider={provider}
        stats={stats}
        isSoundActive={isSoundBarOpen}
        onToggleSoundBar={() => setIsSoundBarOpen(!isSoundBarOpen)}
        onOpenEngineModal={() => setIsEngineModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Sloth Mascot Banner */}
        <SlothMascot 
          statusText={mascotStatus}
          onPoked={() => handleEffortSaved(5, 10)}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-200' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tool View */}
        <div className="min-h-[420px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
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

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 px-4 sm:px-8 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🦥</span>
            <div>
              <p className="text-slate-300 font-semibold">
                SlothFlow AI — Hacktoberfest Open-Source AI Challenge Week 3: Slow and Steady
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Built in honor of International Sloth Day & Sloan the Sloth. Powered by open-weight models, Transformers.js & Ollama.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Client-Side Ready
            </span>
            <span>•</span>
            <a 
              href="https://github.com/Dev-Suraj-Dhawal/slothflow" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a 
              href="https://dev.to/challenges/hacktoberfest-week3-2026-10-19" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition-colors"
            >
              Challenge Page
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
