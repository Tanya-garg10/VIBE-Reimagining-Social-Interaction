import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_VIBE_ROOMS, CURRENT_USER } from '../data/mockData';
import { VibeRoom } from '../types';
import { Radio, Users, Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { audioService } from '../utils/audio';

interface SocialRadarProps {
  onEnterVibe: (vibe: VibeRoom) => void;
}

export const SocialRadar: React.FC<SocialRadarProps> = ({ onEnterVibe }) => {
  const [selectedVibe, setSelectedVibe] = useState<VibeRoom | null>(MOCK_VIBE_ROOMS[0]);
  const [hoveredVibeId, setHoveredVibeId] = useState<string | null>(null);

  // Radar radial positions for 6 active vibes around center
  // Distance from center (radius) & angle
  const radarPositions = [
    { vibeId: 'ai-builders', angle: -50, distance: 195 }, // Top-Right
    { vibeId: 'design-jam', angle: -140, distance: 180 }, // Top-Left
    { vibeId: 'study-sprint', angle: -95, distance: 230 }, // High-Center
    { vibeId: 'startup-ideas', angle: 40, distance: 215 }, // Bottom-Right
    { vibeId: 'ambient-presence', angle: 130, distance: 200 }, // Bottom-Left
    { vibeId: 'gaming-chill', angle: 90, distance: 250 }, // Bottom-Center
  ];

  const radarDimension = 620;
  const centerCoord = radarDimension / 2;

  const activeVibe = hoveredVibeId 
    ? MOCK_VIBE_ROOMS.find((v) => v.id === hoveredVibeId) || selectedVibe 
    : selectedVibe;

  const handleHover = (vibe: VibeRoom) => {
    if (hoveredVibeId !== vibe.id) {
      setHoveredVibeId(vibe.id);
      audioService.playOrbitHoverTone();
    }
  };

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
          <Radio className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span>Real-Time Social Radar</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
          Social Radar
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Floating living vibes orbiting around your current creative presence.
        </p>
      </div>

      {/* Radar Canvas Stage */}
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Radar Circular Stage Container */}
        <div
          className="relative flex items-center justify-center select-none"
          style={{
            width: radarDimension,
            height: radarDimension,
            maxWidth: '96vw',
            maxHeight: '96vw',
          }}
        >
          {/* Pulsing background glow */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-violet-900/15 via-indigo-900/10 to-cyan-900/15 blur-3xl pointer-events-none" />

          {/* SVG Radar grid & sweeping scanner */}
          <svg
            viewBox={`0 0 ${radarDimension} ${radarDimension}`}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            <defs>
              <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Radar concentric rings */}
            {[100, 170, 240, 290].map((radius, i) => (
              <circle
                key={radius}
                cx={centerCoord}
                cy={centerCoord}
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="1.2"
                strokeDasharray={i === 2 ? '4 6' : 'none'}
              />
            ))}

            {/* Crosshair axes */}
            <line
              x1={centerCoord}
              y1={20}
              x2={centerCoord}
              y2={radarDimension - 20}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            <line
              x1={20}
              y1={centerCoord}
              x2={radarDimension - 20}
              y2={centerCoord}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />

            {/* Rotating Radar Sweep Beam */}
            <g className="origin-center animate-spin-slow">
              <line
                x1={centerCoord}
                y1={centerCoord}
                x2={centerCoord + 285}
                y2={centerCoord}
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="2"
              />
              <path
                d={`M ${centerCoord} ${centerCoord} L ${centerCoord + 285} ${centerCoord} A 285 285 0 0 1 ${centerCoord + 200} ${centerCoord + 200} Z`}
                fill="url(#radarSweep)"
                opacity="0.3"
              />
            </g>

            {/* Dynamic Connection lines from center to nodes */}
            {radarPositions.map((pos) => {
              const rad = (pos.angle * Math.PI) / 180;
              const nx = centerCoord + pos.distance * Math.cos(rad);
              const ny = centerCoord + pos.distance * Math.sin(rad);
              const isTargeted = activeVibe?.id === pos.vibeId;

              return (
                <line
                  key={`line-${pos.vibeId}`}
                  x1={centerCoord}
                  y1={centerCoord}
                  x2={nx}
                  y2={ny}
                  stroke={isTargeted ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255, 255, 255, 0.09)'}
                  strokeWidth={isTargeted ? '2' : '1'}
                  strokeDasharray="3 5"
                />
              );
            })}
          </svg>

          {/* Center: YOUR VIBE (◎ YOU) */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center rounded-full text-center"
            style={{
              width: 106,
              height: 106,
              background: 'radial-gradient(circle at 30% 30%, #2E1065 0%, #111827 75%, #07080D 100%)',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 0 28px rgba(139, 92, 246, 0.5), inset 0 0 14px rgba(255,255,255,0.2)',
            }}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 mb-1">
              <img
                src={CURRENT_USER.avatar}
                alt="You"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[9px] font-bold tracking-widest text-violet-300 uppercase">
              ◎ YOU
            </span>
            <span className="text-[11px] font-extrabold text-white leading-tight">
              YOUR VIBE
            </span>
          </div>

          {/* Floating Vibe Nodes around the Center */}
          {radarPositions.map((pos) => {
            const vibe = MOCK_VIBE_ROOMS.find((v) => v.id === pos.vibeId);
            if (!vibe) return null;

            const rad = (pos.angle * Math.PI) / 180;
            const nx = centerCoord + pos.distance * Math.cos(rad);
            const ny = centerCoord + pos.distance * Math.sin(rad);

            // Node size varies based on active count and match percentage
            const nodeSize = 58 + (vibe.activeCount / 35) * 24;
            const isHovered = hoveredVibeId === vibe.id;
            const isSelected = selectedVibe?.id === vibe.id;

            return (
              <div
                key={vibe.id}
                style={{
                  left: nx,
                  top: ny,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-30"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.94 }}
                  onMouseEnter={() => handleHover(vibe)}
                  onClick={() => {
                    setSelectedVibe(vibe);
                    audioService.playConnectTone();
                  }}
                  className={`relative rounded-full cursor-pointer flex flex-col items-center justify-center transition-all ${
                    isSelected || isHovered
                      ? 'ring-2 ring-violet-400 shadow-[0_0_24px_rgba(139,92,246,0.6)]'
                      : 'hover:ring-1 hover:ring-white/40'
                  }`}
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    background: `radial-gradient(circle, #1E1B4B 0%, #0F172A 80%, #080A12 100%)`,
                    border: `1.5px solid ${vibe.color}77`,
                  }}
                >
                  {/* Subtle pulsing beacon around the node */}
                  <span
                    className="absolute -inset-2 rounded-full border border-violet-500/20 pointer-events-none animate-ping"
                    style={{ animationDuration: '3.5s' }}
                  />

                  {/* Icon */}
                  <span className="text-xl filter drop-shadow">{vibe.icon}</span>

                  {/* Small match badge */}
                  <span className="text-[9px] font-bold text-violet-300 tracking-tighter">
                    {vibe.matchScore}%
                  </span>

                  {/* Node label */}
                  <div className="absolute top-full mt-1.5 whitespace-nowrap pointer-events-none">
                    <span className="text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                      {vibe.name}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Floating Glass Panel for Hovered / Selected Vibe */}
        <AnimatePresence mode="wait">
          {activeVibe && (
            <motion.div
              key={activeVibe.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 w-full max-w-md p-6 rounded-2xl bg-[#0F111E]/90 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/80 flex flex-col gap-4 relative z-40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-2xl">
                    {activeVibe.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {activeVibe.name}
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {activeVibe.activeCount} people active
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold tracking-tight">
                  {activeVibe.matchScore}% match
                </div>
              </div>

              <p className="text-sm text-slate-300 italic">
                “{activeVibe.description}”
              </p>

              {/* Active Participants preview */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {activeVibe.participants.map((p) => (
                      <img
                        key={p.id}
                        src={p.avatar}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full border-2 border-[#0F111E] object-cover"
                        title={`${p.name} (${p.activity})`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    in orbit right now
                  </span>
                </div>

                <button
                  onClick={() => {
                    audioService.playConnectTone();
                    onEnterVibe(activeVibe);
                  }}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span>Enter Vibe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
