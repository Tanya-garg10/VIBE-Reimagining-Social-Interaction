import React, { useState } from 'react';
import { motion } from 'motion/react';
import { INTENTION_ENVIRONMENTS, MOCK_PARTICIPANTS } from '../data/mockData';
import { IntentionType, Participant } from '../types';
import { VibeOrbit } from './VibeOrbit';
import { Sparkles, ArrowUpRight, Users, Zap } from 'lucide-react';
import { audioService } from '../utils/audio';

interface HomeIntentionGridProps {
  onSelectIntention: (intention: IntentionType, vibeId?: string) => void;
  onSelectParticipant?: (participant: Participant) => void;
}

export const HomeIntentionGrid: React.FC<HomeIntentionGridProps> = ({
  onSelectIntention,
  onSelectParticipant,
}) => {
  const [hoveredType, setHoveredType] = useState<IntentionType | null>('BUILD');

  const activeEnv = INTENTION_ENVIRONMENTS.find((e) => e.type === hoveredType) || INTENTION_ENVIRONMENTS[0];

  // Map participants relevant to the hovered environment
  const displayedParticipants = MOCK_PARTICIPANTS.filter((p) => {
    if (hoveredType === 'BUILD') return ['user_riya', 'user_aarav', 'user_kabir', 'user_arjun'].includes(p.id);
    if (hoveredType === 'LEARN') return ['user_aarav', 'user_leo', 'user_meera'].includes(p.id);
    if (hoveredType === 'CREATE') return ['user_devika', 'user_riya', 'user_chloe'].includes(p.id);
    if (hoveredType === 'CONNECT') return ['user_kabir', 'user_meera', 'user_riya'].includes(p.id);
    if (hoveredType === 'EXPLORE') return ['user_leo', 'user_devika', 'user_arjun'].includes(p.id);
    return ['user_chloe', 'user_meera', 'user_devika'].includes(p.id);
  });

  const handleCardHover = (type: IntentionType) => {
    if (hoveredType !== type) {
      setHoveredType(type);
      audioService.playOrbitHoverTone();
    }
  };

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Top Headline Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Synchronous Social Space</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-3"
        >
          What do you want to experience?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 font-medium max-w-xl mx-auto"
        >
          VIBE will find the right people for this moment.
        </motion.p>
      </div>

      {/* Main split interactive stage: Living Orbit Preview + 6 Environments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 6 Immersive Environments */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INTENTION_ENVIRONMENTS.map((env, index) => {
            const isHovered = hoveredType === env.type;

            return (
              <motion.div
                key={env.type}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                onMouseEnter={() => handleCardHover(env.type)}
                onClick={() => {
                  audioService.playConnectTone();
                  onSelectIntention(env.type, env.activeVibeId);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 overflow-hidden border ${
                  isHovered
                    ? 'border-white/25 shadow-[0_0_30px_rgba(139,92,246,0.25)] bg-[#0F111E]/90'
                    : 'border-white/8 bg-[#0B0D16]/60 hover:bg-[#0E101B]/80'
                }`}
              >
                {/* Ambient dynamic gradient behind card */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${env.gradient} opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`}
                />

                {/* Top row: Icon + Live badge */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                  <span className="text-2xl filter drop-shadow-md">{env.icon}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{env.activeCount} here now</span>
                  </div>
                </div>

                {/* Title and Subtitle */}
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors">
                      {env.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    “{env.subtitle}”
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {env.description}
                  </p>
                </div>

                {/* Hover Reveal: Live Activity snippet & participants */}
                <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex -space-x-2 overflow-hidden">
                    {env.previewAvatars.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Participant"
                        referrerPolicy="no-referrer"
                        className="inline-block w-6 h-6 rounded-full ring-2 ring-[#0B0D16] object-cover"
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-semibold text-violet-300 flex items-center gap-1">
                    <span>Enter Vibe</span>
                    <Zap className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Signature VibeOrbit Living Constellation */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full flex items-center justify-center p-4">
            <VibeOrbit
              centerTitle={activeEnv.title}
              centerSubtitle={`${activeEnv.activeCount} in orbit`}
              centerIcon={activeEnv.icon}
              centerColor={activeEnv.accentColor}
              participants={displayedParticipants}
              size="md"
              interactive={true}
              onSelectParticipant={onSelectParticipant}
            />
          </div>

          {/* Live resonance note below constellation */}
          <motion.div
            key={activeEnv.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-2.5 rounded-xl bg-[#0D0F1A]/80 border border-white/10 backdrop-blur-md text-center max-w-sm"
          >
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-violet-300 uppercase tracking-wider mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>Live Moment Resonance</span>
            </div>
            <p className="text-xs text-slate-300 italic">
              “{activeEnv.liveMomentSnippet}”
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
