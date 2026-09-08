import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VibeRoom, Participant, Moment, MomentType, ActiveConnection } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { VibeOrbit } from './VibeOrbit';
import { 
  Sparkles, 
  Users, 
  Clock, 
  Send, 
  Plus, 
  Flame, 
  MessageCircle, 
  Radio, 
  Eye, 
  Handshake, 
  UserPlus, 
  Check,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { audioService } from '../utils/audio';

interface VibeRoomViewProps {
  room: VibeRoom;
  onBackToRadar: () => void;
  onOpenConnectModal: (participant: Participant) => void;
  onTriggerSpark: (e: React.MouseEvent, color?: string) => void;
  activeConnections: ActiveConnection[];
}

export const VibeRoomView: React.FC<VibeRoomViewProps> = ({
  room,
  onBackToRadar,
  onOpenConnectModal,
  onTriggerSpark,
  activeConnections,
}) => {
  const [participants, setParticipants] = useState<Participant[]>(room.participants);
  const [isUserInOrbit, setIsUserInOrbit] = useState(false);
  const [userActivity, setUserActivity] = useState(CURRENT_USER.activity);

  // Live Moments state
  const [moments, setMoments] = useState<Moment[]>([
    {
      id: 'm-live-1',
      vibeId: room.id,
      authorId: 'user_riya',
      authorName: 'Riya Sharma',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      type: '🚀 Build',
      content: 'Shared an orbital prototype for the agent canvas. Testing radial touch ergonomics!',
      timestamp: '12 sec ago',
      sparkCount: 14,
      sparkedByMe: false,
      activeCollaboratorsCount: 3,
    },
    {
      id: 'm-live-2',
      vibeId: room.id,
      authorId: 'user_aarav',
      authorName: 'Aarav Patel',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      type: '🎯 Goal',
      content: 'Started a 25 min focus sprint: wiring streaming tool invocation hooks.',
      timestamp: '1 min ago',
      sparkCount: 9,
      sparkedByMe: true,
      activeCollaboratorsCount: 2,
    },
    {
      id: 'm-live-3',
      vibeId: room.id,
      authorId: 'user_kabir',
      authorName: 'Kabir Mehta',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      type: '🤝 Collaborate',
      content: 'Looking for a React collaborator to test real-time WebRTC datachannel syncing.',
      timestamp: '2 min ago',
      sparkCount: 18,
      sparkedByMe: false,
      activeCollaboratorsCount: 1,
    },
    {
      id: 'm-live-4',
      vibeId: room.id,
      authorId: 'user_meera',
      authorName: 'Meera Sen',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      type: '🧠 Learn',
      content: 'Discovered a paper on how synchronous presence improves collective cognitive stamina.',
      timestamp: '4 min ago',
      sparkCount: 21,
      sparkedByMe: false,
      activeCollaboratorsCount: 4,
    },
  ]);

  // Temporary Whisper modal / conversation drawer
  const [whisperTarget, setWhisperTarget] = useState<Moment | null>(null);
  const [whisperText, setWhisperText] = useState('');
  const [whisperSent, setWhisperSent] = useState(false);

  // New Moment creation
  const [isComposing, setIsComposing] = useState(false);
  const [momentType, setMomentType] = useState<MomentType>('🚀 Build');
  const [momentContent, setMomentContent] = useState('');

  // Countdown timer for room remaining time
  const [remainingTimeSeconds, setRemainingTimeSeconds] = useState(47 * 60 + 32);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTimeSeconds((prev) => (prev > 0 ? prev - 1 : 45 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle user entering or leaving the orbit
  const handleToggleOrbit = (e: React.MouseEvent) => {
    if (!isUserInOrbit) {
      // Enter orbit
      const userParticipant: Participant = {
        ...CURRENT_USER,
        activity: userActivity,
        orbitRadius: 1,
        initialAngle: 270,
        onlineStatus: 'active',
      };
      setParticipants([userParticipant, ...participants]);
      setIsUserInOrbit(true);
      audioService.playConnectTone();
      onTriggerSpark(e, '#38BDF8');

      // Add entrance moment
      const joinMoment: Moment = {
        id: `m-join-${Date.now()}`,
        vibeId: room.id,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        authorAvatar: CURRENT_USER.avatar,
        type: '🌙 Presence',
        content: `Entered the orbit: “${userActivity}”`,
        timestamp: 'Just now',
        sparkCount: 1,
      };
      setMoments([joinMoment, ...moments]);
    } else {
      // Leave orbit
      setParticipants(participants.filter((p) => p.id !== CURRENT_USER.id));
      setIsUserInOrbit(false);
    }
  };

  // Spark reaction handler
  const handleSparkMoment = (momentId: string, e: React.MouseEvent) => {
    audioService.playSparkTone();
    onTriggerSpark(e, '#EC4899');
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === momentId) {
          const nextCount = m.sparkedByMe ? m.sparkCount - 1 : m.sparkCount + 1;
          return {
            ...m,
            sparkCount: nextCount,
            sparkedByMe: !m.sparkedByMe,
          };
        }
        return m;
      })
    );
  };

  // Join activity handler
  const handleJoinActivity = (moment: Moment, e: React.MouseEvent) => {
    audioService.playConnectTone();
    onTriggerSpark(e, '#10B981');
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === moment.id) {
          return {
            ...m,
            activeCollaboratorsCount: (m.activeCollaboratorsCount || 0) + 1,
          };
        }
        return m;
      })
    );
  };

  // Publish new moment
  const handlePublishMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentContent.trim()) return;

    audioService.playSparkTone();
    const newM: Moment = {
      id: `m-${Date.now()}`,
      vibeId: room.id,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      type: momentType,
      content: momentContent.trim(),
      timestamp: 'Just now',
      sparkCount: 1,
      sparkedByMe: true,
      activeCollaboratorsCount: 1,
    };

    setMoments([newM, ...moments]);
    setMomentContent('');
    setIsComposing(false);
  };

  // Send momentary whisper
  const handleSendWhisper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whisperText.trim() || !whisperTarget) return;

    audioService.playConnectTone();
    setWhisperSent(true);
    setTimeout(() => {
      setWhisperSent(false);
      setWhisperTarget(null);
      setWhisperText('');
    }, 1200);
  };

  const momentTypes: MomentType[] = [
    '🚀 Build',
    '🎯 Goal',
    '💡 Thought',
    '🧠 Learn',
    '🎨 Create',
    '🤝 Collaborate',
    '🌙 Presence',
  ];

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
      {/* Top Bar: Room Status & Orbit Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRadar}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Social Radar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>LIVE</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {room.name}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              “{room.tagline}”
            </p>
          </div>
        </div>

        {/* Room metrics & Join Orbit action */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>{participants.length} in orbit</span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(remainingTimeSeconds)} remaining</span>
          </div>

          <button
            onClick={handleToggleOrbit}
            className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              isUserInOrbit
                ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isUserInOrbit ? (
              <span>Leave Orbit</span>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Orbit as Tanya</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Dual Stage: Center Social Constellation (WOW visual) + Right/Bottom Live Moments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
        {/* Left/Center: Signature WOW Visual - Social Constellation */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[500px] sm:min-h-[580px] rounded-3xl bg-[#090A12]/80 border border-white/8 backdrop-blur-xl p-4 sm:p-6 overflow-hidden shadow-2xl">
          {/* Subtle cosmic background ambient particles */}
          <div className="absolute inset-0 bg-radial from-violet-950/20 via-transparent to-transparent pointer-events-none" />

          {/* Living VibeOrbit Constellation */}
          <VibeOrbit
            centerTitle={room.name}
            centerSubtitle="Shared Moment Center"
            centerIcon={room.icon}
            centerColor={room.color}
            participants={participants}
            size="lg"
            interactive={true}
            onSelectParticipant={onOpenConnectModal}
            className="my-auto"
          />

          {/* Bottom helper prompt */}
          <div className="mt-4 px-4 py-2 rounded-full bg-black/40 border border-white/10 text-center">
            <span className="text-[11px] text-slate-400">
              Click any participant avatar to <strong className="text-violet-300">Connect for a Moment</strong>
            </span>
          </div>
        </div>

        {/* Right: LIVE MOMENTS (NOT a chat window!) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Section Header with "Share a Moment" CTA */}
          <div className="flex items-center justify-between px-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  LIVE MOMENTS
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Moments, not posts. Short-lived social sparks.
              </p>
            </div>

            <button
              onClick={() => setIsComposing(!isComposing)}
              className="px-3 py-1.5 rounded-full bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Moment</span>
            </button>
          </div>

          {/* Moment Composer Drawer */}
          <AnimatePresence>
            {isComposing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePublishMoment}
                className="p-4 rounded-2xl bg-[#0F111E] border border-violet-500/30 shadow-xl overflow-hidden flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                    Compose Live Moment
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                {/* Type chips */}
                <div className="flex flex-wrap gap-1.5">
                  {momentTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMomentType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        momentType === t
                          ? 'bg-violet-600 text-white font-bold'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <textarea
                  value={momentContent}
                  onChange={(e) => setMomentContent(e.target.value)}
                  placeholder="What is your active moment right now? (e.g. Trying to finish my UI prototype...)"
                  rows={2}
                  maxLength={180}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {180 - momentContent.length} chars left · short-lived
                  </span>
                  <button
                    type="submit"
                    disabled={!momentContent.trim()}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    Publish Moment
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Floating Live Moment Bubbles List */}
          <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
            {moments.map((moment) => {
              const hasActiveConnection = activeConnections.some(
                (c) => c.targetUser.id === moment.authorId
              );

              return (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-[#0C0E18]/90 border border-white/8 hover:border-white/15 transition-all backdrop-blur-md shadow-lg flex flex-col gap-3 group"
                >
                  {/* Author Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={moment.authorAvatar}
                          alt={moment.authorName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0C0E18]" />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">
                            {moment.authorName}
                          </span>
                          {hasActiveConnection && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-300 font-extrabold">
                              LINKED
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {moment.timestamp}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-violet-300">
                      {moment.type}
                    </span>
                  </div>

                  {/* Moment content */}
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {moment.content}
                  </p>

                  {/* Micro-Actions (✨ React with Spark, 🤝 Join activity, 💬 Whisper, 👀 Observe) */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      {/* Spark reaction */}
                      <button
                        onClick={(e) => handleSparkMoment(moment.id, e)}
                        className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                          moment.sparkedByMe
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm shadow-pink-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                        title="React with a lightweight spark"
                      >
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span>{moment.sparkCount}</span>
                      </button>

                      {/* Join Activity */}
                      <button
                        onClick={(e) => handleJoinActivity(moment, e)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-transparent hover:border-emerald-500/30 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Join this person's activity"
                      >
                        <Handshake className="w-3 h-3 text-emerald-400" />
                        <span>Join</span>
                        {moment.activeCollaboratorsCount ? (
                          <span className="text-[10px] text-emerald-400">({moment.activeCollaboratorsCount})</span>
                        ) : null}
                      </button>

                      {/* Start Temporary Whisper */}
                      <button
                        onClick={() => setWhisperTarget(moment)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 border border-transparent hover:border-indigo-500/30 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Start a temporary conversation"
                      >
                        <MessageCircle className="w-3 h-3 text-indigo-400" />
                        <span>Whisper</span>
                      </button>
                    </div>

                    {/* Observe button */}
                    <button
                      onClick={(e) => onTriggerSpark(e, '#38BDF8')}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Observe</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Temporary Conversation / Whisper Dialog */}
      <AnimatePresence>
        {whisperTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#0E101D] border border-white/15 p-6 shadow-2xl text-slate-100 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-violet-400" />
                  <h4 className="text-sm font-bold text-white">
                    Temporary Whisper with {whisperTarget.authorName}
                  </h4>
                </div>
                <button
                  onClick={() => setWhisperTarget(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 italic">
                “{whisperTarget.content}”
              </div>

              {whisperSent ? (
                <div className="py-6 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Whisper sent! Ephemeral window open for 15 minutes.</span>
                </div>
              ) : (
                <form onSubmit={handleSendWhisper} className="flex flex-col gap-3">
                  <textarea
                    value={whisperText}
                    onChange={(e) => setWhisperText(e.target.value)}
                    placeholder="Send a brief, focused resonance thought..."
                    rows={3}
                    autoFocus
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setWhisperTarget(null)}
                      className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!whisperText.trim()}
                      className="px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Whisper</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
