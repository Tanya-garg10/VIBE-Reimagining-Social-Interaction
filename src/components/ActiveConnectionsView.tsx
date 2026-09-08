import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveConnection, Participant } from '../types';
import { 
  Clock, 
  Sparkles, 
  X, 
  Users, 
  MessageCircle, 
  Activity, 
  Radio, 
  Zap, 
  Flame, 
  ArrowRight,
  Send
} from 'lucide-react';
import { audioService } from '../utils/audio';

interface ConnectionActivityEvent {
  id: string;
  userName: string;
  userAvatar: string;
  userId: string;
  actionText: string;
  roomName: string;
  timestamp: string;
  type: 'join' | 'conversation' | 'focus' | 'spark';
}

interface ActiveConnectionsViewProps {
  connections: ActiveConnection[];
  onDisconnect: (id: string) => void;
  onOpenConnectModal: (participant: Participant) => void;
  onTriggerSpark: (e: React.MouseEvent, color?: string) => void;
  onExploreVibes: () => void;
}

export const ActiveConnectionsView: React.FC<ActiveConnectionsViewProps> = ({
  connections,
  onDisconnect,
  onOpenConnectModal,
  onTriggerSpark,
  onExploreVibes,
}) => {
  const [feedEvents, setFeedEvents] = useState<ConnectionActivityEvent[]>([
    {
      id: 'act-1',
      userName: 'Riya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      userId: 'user_riya',
      actionText: 'joined room',
      roomName: 'AI Builders',
      timestamp: 'just now',
      type: 'join',
    },
    {
      id: 'act-2',
      userName: 'Kabir Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      userId: 'user_kabir',
      actionText: 'started a conversation',
      roomName: 'Startup Ideas',
      timestamp: '2m ago',
      type: 'conversation',
    },
    {
      id: 'act-3',
      userName: 'Aarav Patel',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      userId: 'user_aarav',
      actionText: 'began a 25 min focus sprint',
      roomName: 'AI Builders',
      timestamp: '5m ago',
      type: 'focus',
    },
    {
      id: 'act-4',
      userName: 'Meera Sen',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      userId: 'user_meera',
      actionText: 'sparked an idea in',
      roomName: 'Design Jam',
      timestamp: '8m ago',
      type: 'spark',
    },
    {
      id: 'act-5',
      userName: 'Arjun Reddy',
      userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      userId: 'user_arjun',
      actionText: 'connected for a moment in',
      roomName: 'Study Sprint',
      timestamp: '14m ago',
      type: 'join',
    },
  ]);

  // Subtle periodic pulse simulation to create living presence
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedEvents((prev) => {
        const potentialUpdates: ConnectionActivityEvent[] = [
          {
            id: `act-${Date.now()}`,
            userName: 'Riya Sharma',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            userId: 'user_riya',
            actionText: 'shared an orbital prototype in',
            roomName: 'AI Builders',
            timestamp: 'just now',
            type: 'spark',
          },
          {
            id: `act-${Date.now()}`,
            userName: 'Kabir Mehta',
            userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            userId: 'user_kabir',
            actionText: 'sent a momentary resonance whisper in',
            roomName: 'Startup Ideas',
            timestamp: 'just now',
            type: 'conversation',
          },
        ];
        const randomItem = potentialUpdates[Math.floor(Math.random() * potentialUpdates.length)];
        return [randomItem, ...prev.slice(0, 5)];
      });
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getEventBadge = (type: ConnectionActivityEvent['type']) => {
    switch (type) {
      case 'conversation':
        return {
          icon: MessageCircle,
          label: 'Conversation',
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        };
      case 'focus':
        return {
          icon: Zap,
          label: 'Focus Sprint',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
      case 'spark':
        return {
          icon: Sparkles,
          label: 'Spark',
          color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
        };
      case 'join':
      default:
        return {
          icon: Activity,
          label: 'Joined',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
    }
  };

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span>Momentary Social Links</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
          Temporary Connections
        </h1>

        <p className="text-sm sm:text-base text-slate-400">
          Ephemerality is freedom. Connections exist intentionally for their chosen window.
        </p>
      </div>

      {/* Main Grid: Active Connections Cards + Live Activity Feed */}
      <div className="flex flex-col gap-10">
        {/* Active Connections Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Active Windows ({connections.length})
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs text-slate-400">
              Live countdowns
            </span>
          </div>

          {connections.length === 0 ? (
            <div className="py-16 px-6 rounded-3xl bg-[#0C0E18]/60 border border-white/8 backdrop-blur-xl text-center flex flex-col items-center max-w-md mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-violet-950/60 border border-violet-500/30 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-violet-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                “It's quiet here.”
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 mb-6 italic">
                “Maybe you're the first spark. Connect with someone in a Vibe Room or explore the Social Radar.”
              </p>

              <button
                onClick={onExploreVibes}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-violet-600/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Explore Active Vibes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((conn) => {
                const progressPercent = Math.max(
                  0,
                  Math.min(100, (conn.remainingSeconds / conn.totalSeconds) * 100)
                );
                const isIdle = conn.targetUser.onlineStatus === 'idle';
                const isActive = !isIdle;

                return (
                  <motion.div
                    key={conn.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-3xl bg-[#0E101D] border border-violet-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between gap-5 relative overflow-hidden"
                  >
                    {/* Background progress aura */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400"
                      style={{ width: `${progressPercent}%`, transition: 'width 1s linear' }}
                    />

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar with Live Status Indicator Dot */}
                        <div className="relative">
                          <img
                            src={conn.targetUser.avatar}
                            alt={conn.targetUser.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-full object-cover border-2 border-violet-400 shadow-md shadow-violet-500/30"
                          />
                          {/* Live status dot on avatar: Green pulsing dot for Active, Amber dot for Idle */}
                          <div className="absolute bottom-0 right-0 flex items-center justify-center">
                            {isActive ? (
                              <>
                                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-80" />
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#0E101D] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                              </>
                            ) : (
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-[#0E101D] shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-extrabold text-white">
                              {conn.targetUser.name}
                            </h4>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/10 text-slate-300">
                              {conn.duration}
                            </span>

                            {/* Live Status Badge */}
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                                </span>
                                <span>Active in Room</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                                <span className="inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                                <span>Idle in Room</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-violet-300 font-semibold mt-0.5">
                            {conn.targetUser.activity}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                            <span>Room: <strong className="text-slate-300">{conn.vibeContext}</strong></span>
                            <span className="text-slate-600">·</span>
                            <span className={isActive ? "text-emerald-400 font-medium" : "text-amber-400/90 font-medium"}>
                              {isActive ? 'Present & Active' : 'Currently Idle'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          audioService.playSparkTone();
                          onDisconnect(conn.id);
                        }}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Release momentary connection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ticking Countdown Ring & Timer display */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Time Remaining:</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black font-mono text-amber-300 tracking-wider">
                          {formatSeconds(conn.remainingSeconds)}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          audioService.playSparkTone();
                          onTriggerSpark(e, '#EC4899');
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>Send Spark</span>
                      </button>

                      <button
                        onClick={() => onOpenConnectModal(conn.targetUser)}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Extend Moment</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* New 'Activity Feed' Component: Recent Connection Events */}
        <div className="p-6 rounded-3xl bg-[#090A12]/90 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Live Presence Activity Feed</span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    Live
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time events and momentary pulses from your connected orbits
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Radio className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Auto-syncing</span>
            </div>
          </div>

          {/* Activity Events List */}
          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {feedEvents.map((event) => {
                const badge = getEventBadge(event.type);
                const BadgeIcon = badge.icon;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="p-3.5 rounded-2xl bg-[#0D0F1B]/70 border border-white/5 hover:border-violet-500/25 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={event.userAvatar}
                          alt={event.userName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-white/15"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0D0F1B]" />
                      </div>

                      <div className="text-xs text-slate-300 truncate">
                        <span className="font-extrabold text-white">
                          {event.userName}
                        </span>{' '}
                        <span className="text-slate-400">
                          {event.actionText}
                        </span>{' '}
                        <strong className="text-violet-300 font-semibold">
                          “{event.roomName}”
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Event Type Badge */}
                      <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.color}`}>
                        <BadgeIcon className="w-2.5 h-2.5" />
                        <span>{badge.label}</span>
                      </span>

                      {/* Timestamp */}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {event.timestamp}
                      </span>

                      {/* Micro Spark Reaction */}
                      <button
                        onClick={(e) => {
                          audioService.playSparkTone();
                          onTriggerSpark(e, '#A855F7');
                        }}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-300 transition-colors cursor-pointer"
                        title="Send micro spark"
                      >
                        <Sparkles className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

