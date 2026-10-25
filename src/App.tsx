import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Utensils, 
  Mail, 
  Moon, 
  FileText, 
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
    setMascotStatus(`Conserved ${minutes}m of effort`);
    setTimeout(() => setMascotStatus(''), 4500);
  };

  const navItems = [
    {
      id: 'chat-tidier' as SlothMode,
      label: 'Chat & Inbox Tidier',
      icon: MessageSquare,
      badge: 'Popular',
      badgeColor: 'bg-[#1e2d24] text-[#9ed4b0] border-[#2e4738]'
    },
    {
      id: 'voice-ramble' as SlothMode,
      label: 'Lazy Voice Ramble',
      icon: Mic,
      badge: 'Audio',
      badgeColor: 'bg-[#1a2629] text-[#96cfd9] border-[#2a3f44]'
    },
    {
      id: 'fridge-chef' as SlothMode,
      label: 'Fridge-to-Feast',
      icon: Utensils,
      badge: '10 Mins',
      badgeColor: 'bg-[#29221a] text-[#deb687] border-[#423425]'
    },
    {
      id: 'dreaded-reply' as SlothMode,
      label: 'Procrastination Breaker',
      icon: Mail,
      badge: 'Zero Guilt',
      badgeColor: 'bg-[#251f30] text-[#c3b4de] border-[#3e3252]'
    },
    {
      id: 'wind-down' as SlothMode,
      label: 'Wind-Down & Snooze',
      icon: Moon,
      badge: 'Offline',
      badgeColor: 'bg-[#1b2523] text-[#97c7b8] border-[#293d39]'
    },
    {
      id: 'why-open' as SlothMode,
      label: 'Why Open AI Matters',
      icon: FileText,
      badge: 'Manifesto',
      badgeColor: 'bg-[#1c2420] text-[#a0ada6] border-[#2c3833]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#101413] text-[#edf1ef] flex flex-col font-sans selection:bg-[#2c633d] selection:text-white antialiased">
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

        {/* Tab Navigation Segmented Bar */}
        <div className="p-1.5 rounded-2xl bg-[#161b19] border border-[#242d29] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#223027] text-[#f0f3f1] border border-[#354c3e]'
                    : 'text-[#8e9c95] hover:text-[#f0f3f1] hover:bg-[#1b221f] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#55b376]' : 'text-[#73827b]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono border ${
                    isActive 
                      ? item.badgeColor 
                      : 'bg-[#1b211f] text-[#73827b] border-[#26312c]'
                  }`}>
                    {item.badge}
                  </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fade-in">
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

      {/* Solid Natural Footer */}
      <footer className="border-t border-[#242d29] bg-[#131715] px-4 sm:px-8 py-8 text-xs text-[#73827b] mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🦥</span>
            <div>
              <p className="text-[#d8deda] font-semibold flex items-center gap-2 justify-center md:justify-start">
                SlothFlow AI <span className="text-[10px] text-[#d9ba96] font-mono bg-[#282119] px-1.5 py-0.5 rounded border border-[#3d3124]">Slow & Steady</span>
              </p>
              <p className="text-[11px] text-[#73827b] mt-0.5">
                International Sloth Day Hackathon build for DEV & Hacktoberfest 2026. Built with open-weight models, Transformers.js & Ollama.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8e9c95]">
            <span className="flex items-center gap-1.5 text-[#55b376] font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Client-Side WebGPU
            </span>
            <span className="text-[#2c3631] hidden sm:inline">•</span>
            <a 
              href="https://github.com/Dev-Suraj-Dhawal/slothflow" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#f0f3f1] transition-colors flex items-center gap-1"
            >
              GitHub Source <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <span className="text-[#2c3631] hidden sm:inline">•</span>
            <a 
              href="https://dev.to/challenges/hacktoberfest-week3-2026-10-19" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#9ed4b0] transition-colors flex items-center gap-1"
            >
              DEV Challenge <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
