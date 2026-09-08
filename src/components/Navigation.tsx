import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Users, 
  Activity, 
  User, 
  Volume2, 
  VolumeX, 
  Radio, 
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveConnection } from '../types';

export type NavTab = 'home' | 'radar' | 'room' | 'match' | 'pulse' | 'profile' | 'connections';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeConnections: ActiveConnection[];
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  activeConnections,
  isAmbientPlaying,
  onToggleAmbient,
  isMuted,
  onToggleMute,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Compass },
    { id: 'radar' as NavTab, label: 'Radar', icon: Radio },
    { id: 'room' as NavTab, label: 'Vibe Room', icon: Layers },
    { id: 'match' as NavTab, label: 'AI Match', icon: Sparkles },
    { id: 'connections' as NavTab, label: 'Momentum', icon: Users, badge: activeConnections.length },
    { id: 'pulse' as NavTab, label: 'Pulse', icon: Activity },
    { id: 'profile' as NavTab, label: 'Identity', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080D]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: VIBE Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#090A10] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-extrabold tracking-widest text-white leading-none">
                VIBE
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 hidden xl:inline">
                Social is a moment
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Top Navigation Pill Dock */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#0E101D]/90 border border-white/10 backdrop-blur-xl shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wide transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="topActiveDockIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.4)] -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-violet-900' : 'bg-violet-500/30 text-violet-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Sound Controls & Active Connection Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Moment Connections counter pill */}
          {activeConnections.length > 0 && (
            <button
              onClick={() => onSelectTab('connections')}
              className="px-2.5 py-1 rounded-full bg-violet-950/70 border border-violet-500/40 backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold text-violet-200 hover:bg-violet-900/60 transition-colors shadow-sm"
              title="View active temporary connections"
            >
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>{activeConnections.length} Link{activeConnections.length > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Ambient Presence Sound Toggle */}
          <button
            onClick={onToggleAmbient}
            className={`px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
              isAmbientPlaying
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-900/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
            title="Toggle ambient co-presence tone"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAmbientPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="hidden sm:inline">
              {isAmbientPlaying ? 'Ambient On' : 'Ambient'}
            </span>
          </button>

          {/* Mute micro-interaction audio */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all cursor-pointer"
            title={isMuted ? 'Unmute interactions' : 'Mute micro-tones'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Top Scrollable Sub-bar (Replaces awkward bottom bar) */}
      <div className="md:hidden px-3 py-1.5 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-violet-400 text-black text-[9px] font-black">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
