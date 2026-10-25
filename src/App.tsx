import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Utensils, 
  Mail, 
  Moon, 
  FileText, 
  CheckCircle,
  ExternalLink,
  Layers
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
    setMascotStatus(`CONSERVED ${minutes}M`);
    setTimeout(() => setMascotStatus(''), 4500);
  };

  const navItems = [
    {
      id: 'chat-tidier' as SlothMode,
      num: '01',
      label: 'Chat & Inbox Tidier',
      shortLabel: 'Chat Tidier',
      icon: MessageSquare,
      badge: 'CLARITY',
      badgeColor: 'bg-[#1b2820] text-[#8edba6] border-[#294232]'
    },
    {
      id: 'voice-ramble' as SlothMode,
      label: 'Lazy Voice Ramble',
      shortLabel: 'Voice Ramble',
      num: '02',
      icon: Mic,
      badge: 'AUDIO',
      badgeColor: 'bg-[#182326] text-[#88c9d4] border-[#263e42]'
    },
    {
      id: 'fridge-chef' as SlothMode,
      label: 'Fridge-to-Feast',
      shortLabel: 'Fridge Chef',
      num: '03',
      icon: Utensils,
      badge: '10 MIN',
      badgeColor: 'bg-[#271f16] text-[#deb992] border-[#3d2e1f]'
    },
    {
      id: 'dreaded-reply' as SlothMode,
      label: 'Procrastination Breaker',
      shortLabel: 'Dreaded Reply',
      num: '04',
      icon: Mail,
      badge: 'ANTIDOTE',
      badgeColor: 'bg-[#231b2e] text-[#cbbfe8] border-[#382b4c]'
    },
    {
      id: 'wind-down' as SlothMode,
      label: 'Wind-Down & Snooze',
      shortLabel: 'Wind-Down',
      num: '05',
      icon: Moon,
      badge: 'OFFLINE',
      badgeColor: 'bg-[#182320] text-[#8ec7b3] border-[#263b36]'
    },
    {
      id: 'why-open' as SlothMode,
      label: 'Why Open AI Matters',
      shortLabel: 'Manifesto',
      num: '06',
      icon: FileText,
      badge: 'MANIFESTO',
      badgeColor: 'bg-[#1c221e] text-[#9aa8a0] border-[#29362f]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e1210] text-[#edf2ee] flex flex-col font-sans selection:bg-[#295738] selection:text-white antialiased blueprint-dots">
      {/* Top Header */}
      <Header
        currentProvider={provider}
        stats={stats}
        isSoundActive={isSoundBarOpen}
        onToggleSoundBar={() => setIsSoundBarOpen(!isSoundBarOpen)}
        onOpenEngineModal={() => setIsEngineModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6">
        {/* Sloth Mascot Banner */}
        <SlothMascot 
          statusText={mascotStatus}
          onPoked={() => handleEffortSaved(5, 10)}
        />

        {/* Tab Navigation Segmented Bar - Precision Responsive Tool Switcher */}
        <div className="relative">
          <div className="p-1 sm:p-1.5 rounded-xl bg-[#141916] border border-[#222b26] flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none shadow-sm overscroll-x-contain">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors tactile-btn cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#1d2621] text-[#edf2ee] border border-[#314237]'
                      : 'text-[#84948b] hover:text-[#edf2ee] hover:bg-[#181f1b] border border-transparent'
                  }`}
                >
                  <span className="text-[9px] sm:text-[10px] text-[#4d5f55] font-mono">{item.num}</span>
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#4eb374]' : 'text-[#6c7d74]'}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="inline sm:hidden">{item.shortLabel}</span>
                  {item.badge && (
                    <span className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded font-mono border hidden md:inline ${
                      isActive 
                        ? item.badgeColor 
                        : 'bg-[#18201c] text-[#6c7d74] border-[#222c26]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
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

      {/* Hand-Crafted Engineering Footer */}
      <footer className="border-t border-[#222b26] bg-[#111613] px-3 sm:px-6 md:px-8 py-6 sm:py-8 text-xs text-[#6e7d75] mt-10 sm:mt-16 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl select-none shrink-0">🦥</span>
            <div className="min-w-0">
              <p className="text-[#cbd6cf] font-bold flex items-center gap-2 justify-center md:justify-start">
                SLOTHFLOW_AI // <span className="text-[9px] sm:text-[10px] text-[#deb992] bg-[#241c14] px-1.5 py-0.5 rounded border border-[#3b2d20]">SLOW & STEADY · 2026</span>
              </p>
              <p className="text-[9px] sm:text-[10px] text-[#607068] mt-0.5">
                HAND-CRAFTED OPEN ARCHITECTURE · DEV CHALLENGE WEEK 3 · CELEBRATING INTERNATIONAL SLOTH DAY
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#84948b]">
            <span className="flex items-center gap-1.5 text-[#8edba6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4eb374]" /> CLIENT WEBGPU
            </span>
            <span className="text-[#252f29] hidden sm:inline">•</span>
            <a 
              href="https://github.com/Dev-Suraj-Dhawal/slothflow" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#edf2ee] transition-colors flex items-center gap-1"
            >
              REPOSITORY <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <span className="text-[#252f29] hidden sm:inline">•</span>
            <a 
              href="https://dev.to/challenges/hacktoberfest-week3-2026-10-19" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#8edba6] transition-colors flex items-center gap-1"
            >
              DEV_RUBRIC <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
