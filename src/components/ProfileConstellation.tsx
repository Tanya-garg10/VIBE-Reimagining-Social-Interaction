import React from 'react';
import { motion } from 'motion/react';
import { CURRENT_USER, MOCK_PARTICIPANTS } from '../data/mockData';
import { Participant } from '../types';
import { VibeOrbit } from './VibeOrbit';
import { Sparkles, Users, Layers, MessageSquare, Compass, ArrowUpRight } from 'lucide-react';
import { audioService } from '../utils/audio';

interface ProfileConstellationProps {
  onSelectParticipant: (participant: Participant) => void;
}

export const ProfileConstellation: React.FC<ProfileConstellationProps> = ({
  onSelectParticipant,
}) => {
  const profileStats = [
    { label: 'MOMENTS', value: '24', icon: MessageSquare },
    { label: 'CONNECTIONS', value: '18', icon: Users },
    { label: 'COMMUNITIES', value: '7', icon: Layers },
  ];

  // People shared moments with
  const sharedPeople = [
    {
      participant: MOCK_PARTICIPANTS[0], // Riya
      lastMoment: 'Pair designed orbital navigation canvas',
      timeShared: '1h 15m',
      vibe: 'AI Builders',
    },
    {
      participant: MOCK_PARTICIPANTS[1], // Aarav
      lastMoment: 'Tested streaming tool execution pipelines',
      timeShared: '45m',
      vibe: 'AI Builders',
    },
    {
      participant: MOCK_PARTICIPANTS[2], // Kabir
      lastMoment: 'Benchmarked WebSocket distributed latency',
      timeShared: '30m',
      vibe: 'Startup Ideas',
    },
    {
      participant: MOCK_PARTICIPANTS[3], // Meera
      lastMoment: 'Explored cognitive stamina in synchronous UI',
      timeShared: '1h 00m',
      vibe: 'Design Jam',
    },
    {
      participant: MOCK_PARTICIPANTS[4], // Arjun
      lastMoment: 'Fine-tuned LoRA weights for on-device models',
      timeShared: '2h 10m',
      vibe: 'AI Builders',
    },
  ];

  // Convert shared people into orbit participants for Tanya's Identity Constellation
  const identityOrbitParticipants: Participant[] = sharedPeople.map((item, index) => ({
    ...item.participant,
    orbitRadius: (index % 2) + 1,
    initialAngle: index * 72,
    onlineStatus: 'active',
  }));

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center">
      {/* Top Identity Constellation Canvas */}
      <div className="w-full flex flex-col items-center relative mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Identity Constellation</span>
        </div>

        {/* Constellation with Tanya at Center and Shared People Orbiting */}
        <div className="relative my-4 flex items-center justify-center">
          <VibeOrbit
            centerTitle={CURRENT_USER.name}
            centerSubtitle="Creative Technologist"
            centerIcon="✨"
            centerColor="#A855F7"
            participants={identityOrbitParticipants}
            size="lg"
            interactive={true}
            onSelectParticipant={onSelectParticipant}
          />
        </div>

        {/* Profile Bio & Title */}
        <div className="text-center max-w-xl mx-auto mt-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {CURRENT_USER.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium italic mt-1.5">
            “{CURRENT_USER.bio}”
          </p>

          {/* Floating Interest Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {CURRENT_USER.interests.map((interest, i) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-bold text-violet-200 shadow-sm"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Anti-Slop Stats: Moments, Connections, Communities (NO followers, following, likes) */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-8">
          {profileStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#0E101D] border border-white/10 flex flex-col items-center text-center shadow-lg"
              >
                <span className="text-2xl sm:text-3xl font-black text-white mb-0.5">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: People I've shared moments with */}
      <div className="w-full flex flex-col gap-4 mt-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            People I’ve shared moments with
          </h2>
          <span className="text-xs text-slate-400">
            Resonance history
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedPeople.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => {
                audioService.playConnectTone();
                onSelectParticipant(item.participant);
              }}
              className="p-5 rounded-2xl bg-[#0D0F1A]/80 border border-white/8 hover:border-violet-500/40 transition-all backdrop-blur-md flex items-start justify-between gap-4 cursor-pointer group shadow-lg"
            >
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <img
                    src={item.participant.avatar}
                    alt={item.participant.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/15 group-hover:border-violet-400 transition-colors"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0D0F1A]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-200 transition-colors">
                      {item.participant.name}
                    </h4>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/10 text-slate-300">
                      {item.vibe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {item.lastMoment}
                  </p>
                  <p className="text-[11px] text-violet-300 font-medium mt-1">
                    {item.timeShared} shared in orbit
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-full bg-white/5 group-hover:bg-violet-600/30 text-slate-400 group-hover:text-violet-200 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
