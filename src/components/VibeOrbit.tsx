import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../types';
import { Sparkles, Radio } from 'lucide-react';

interface ActiveLink {
  fromId: string;
  toId: string;
  label?: string;
  color?: string;
}

interface VibeOrbitProps {
  centerTitle: string;
  centerSubtitle?: string;
  centerIcon?: React.ReactNode | string;
  centerColor?: string;
  participants: Participant[];
  selectedParticipantId?: string | null;
  onSelectParticipant?: (participant: Participant) => void;
  size?: 'sm' | 'md' | 'lg';
  activeLinks?: ActiveLink[];
  showLabels?: boolean;
  interactive?: boolean;
  isLive?: boolean;
  className?: string;
}

export const VibeOrbit: React.FC<VibeOrbitProps> = ({
  centerTitle,
  centerSubtitle,
  centerIcon,
  centerColor = '#8B5CF6',
  participants,
  selectedParticipantId,
  onSelectParticipant,
  size = 'lg',
  activeLinks = [],
  showLabels = true,
  interactive = true,
  isLive = true,
  className = '',
}) => {
  // Dimensions and radiuses based on size
  const config = {
    sm: {
      dimension: 280,
      centerRadius: 36,
      orbitRadii: [70, 115],
      avatarSize: 32,
      strokeWidth: 1,
    },
    md: {
      dimension: 440,
      centerRadius: 52,
      orbitRadii: [100, 155, 195],
      avatarSize: 42,
      strokeWidth: 1.2,
    },
    lg: {
      dimension: 580,
      centerRadius: 68,
      orbitRadii: [130, 200, 260],
      avatarSize: 52,
      strokeWidth: 1.5,
    },
  }[size];

  const centerPos = config.dimension / 2;

  // Track dynamic simulated interaction links between random participants over time to keep orbit alive
  const [ambientLinks, setAmbientLinks] = useState<ActiveLink[]>([]);

  useEffect(() => {
    if (participants.length < 2 || size === 'sm') return;

    const interval = setInterval(() => {
      // randomly pick 2 participants to show a temporary spark connection line
      const p1 = participants[Math.floor(Math.random() * participants.length)];
      const p2 = participants[Math.floor(Math.random() * participants.length)];
      if (p1 && p2 && p1.id !== p2.id) {
        const link: ActiveLink = {
          fromId: p1.id,
          toId: p2.id,
          label: 'Shared Resonance',
          color: '#A855F7',
        };
        setAmbientLinks([link]);
        setTimeout(() => setAmbientLinks([]), 4500);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [participants, size]);

  const allLinks = [...activeLinks, ...ambientLinks];

  // Calculate coordinates for participants
  // We place participants evenly around their respective orbit radius
  const participantCoords = participants.map((p, index) => {
    const orbitTier = (p.orbitRadius || (index % config.orbitRadii.length) + 1) - 1;
    const radius = config.orbitRadii[Math.min(orbitTier, config.orbitRadii.length - 1)];

    // Distribute angles evenly with initial angle offset
    const totalInTier = participants.filter(
      (_, i) => ((i % config.orbitRadii.length) === (index % config.orbitRadii.length))
    ).length || 1;
    const tierIndex = participants
      .filter((_, i) => ((i % config.orbitRadii.length) === (index % config.orbitRadii.length)))
      .indexOf(p);

    const baseAngle = p.initialAngle !== undefined 
      ? p.initialAngle 
      : (tierIndex / Math.max(1, totalInTier)) * 360 + (orbitTier * 45);

    const rad = (baseAngle * Math.PI) / 180;
    const x = centerPos + radius * Math.cos(rad);
    const y = centerPos + radius * Math.sin(rad);

    return {
      participant: p,
      radius,
      angle: baseAngle,
      x,
      y,
      tier: orbitTier,
    };
  });

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-visible ${className}`}
      style={{
        width: config.dimension,
        height: config.dimension,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute rounded-full pointer-events-none filter blur-2xl opacity-25 animate-pulse-glow"
        style={{
          width: config.dimension * 0.75,
          height: config.dimension * 0.75,
          background: `radial-gradient(circle, ${centerColor} 0%, rgba(139,92,246,0.1) 60%, transparent 80%)`,
        }}
      />

      {/* SVG Canvas for Orbital Rings and Soft Connection Lines */}
      <svg
        viewBox={`0 0 ${config.dimension} ${config.dimension}`}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${centerColor}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={centerColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbital Concentric Paths */}
        {config.orbitRadii.map((r, i) => (
          <g key={`orbit-${r}-${i}`}>
            <circle
              cx={centerPos}
              cy={centerPos}
              r={r}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={config.strokeWidth}
              strokeDasharray={i % 2 === 0 ? '4 7' : '2 5'}
              className="origin-center animate-spin-slow"
              style={{
                animationDuration: `${50 + i * 25}s`,
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
              }}
            />
            {/* Subtle orbital node dot */}
            <circle
              cx={centerPos + r * Math.cos((i * 70 * Math.PI) / 180)}
              cy={centerPos + r * Math.sin((i * 70 * Math.PI) / 180)}
              r={2}
              fill="rgba(255, 255, 255, 0.3)"
            />
          </g>
        ))}

        {/* Radiating Intention rays from center to participants */}
        {participantCoords.map(({ participant, x, y }) => (
          <line
            key={`ray-${participant.id}`}
            x1={centerPos}
            y1={centerPos}
            x2={x}
            y2={y}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}

        {/* Temporary Animated Connection Lines Between Interacting Participants */}
        {allLinks.map((link, idx) => {
          const c1 = participantCoords.find((c) => c.participant.id === link.fromId);
          const c2 = participantCoords.find((c) => c.participant.id === link.toId);
          if (!c1 || !c2) return null;

          return (
            <g key={`link-${link.fromId}-${link.toId}-${idx}`}>
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0.5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke={link.color || '#C084FC'}
                strokeWidth="2"
                filter="url(#glow)"
              />
              {/* Floating resonance particle along the line */}
              <circle
                cx={(c1.x + c2.x) / 2}
                cy={(c1.y + c2.y) / 2}
                r={3}
                fill="#F472B6"
                className="animate-pulse"
              />
            </g>
          );
        })}
      </svg>

      {/* Center Intention Orb */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="relative z-20 flex flex-col items-center justify-center rounded-full text-center cursor-default group"
        style={{
          width: config.centerRadius * 2,
          height: config.centerRadius * 2,
          background: `radial-gradient(120% 120% at 30% 30%, #1E1B4B 0%, #0F172A 70%, #05060A 100%)`,
          boxShadow: `0 0 35px -5px ${centerColor}66, inset 0 0 20px rgba(255,255,255,0.12)`,
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Pulsing outer aura ring */}
        <div
          className="absolute -inset-2.5 rounded-full border border-violet-500/20 pointer-events-none animate-ping"
          style={{ animationDuration: '4s' }}
        />

        {/* Live Indicator Pill */}
        {isLive && (
          <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-black/80 border border-violet-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-semibold tracking-wider text-slate-200 uppercase">
              ORBIT
            </span>
          </div>
        )}

        {/* Center Content */}
        {centerIcon && (
          <div className="text-xl mb-0.5 text-violet-300 group-hover:scale-110 transition-transform">
            {typeof centerIcon === 'string' ? centerIcon : centerIcon}
          </div>
        )}

        <h3
          className={`font-bold tracking-tight text-white px-2 leading-tight ${
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          }`}
        >
          {centerTitle}
        </h3>

        {centerSubtitle && size !== 'sm' && (
          <p className="text-[10px] text-slate-400 max-w-[85%] truncate mt-0.5 font-medium">
            {centerSubtitle}
          </p>
        )}
      </motion.div>

      {/* Orbiting Participant Avatars */}
      {participantCoords.map(({ participant, x, y }) => {
        const isSelected = selectedParticipantId === participant.id;

        return (
          <div
            key={participant.id}
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.15, zIndex: 40 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (interactive && onSelectParticipant) {
                  onSelectParticipant(participant);
                }
              }}
              className={`relative rounded-full transition-all group ${
                interactive ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Online aura pulse ring */}
              <span
                className={`absolute -inset-1 rounded-full pointer-events-none transition-opacity ${
                  participant.onlineStatus === 'focus'
                    ? 'border border-amber-400/40 group-hover:opacity-100 opacity-60'
                    : 'border border-emerald-400/50 group-hover:opacity-100 opacity-70'
                } ${isSelected ? 'ring-2 ring-violet-400 opacity-100' : ''}`}
              />

              {/* Circular Avatar image */}
              <div
                style={{
                  width: config.avatarSize,
                  height: config.avatarSize,
                }}
                className={`rounded-full overflow-hidden border-2 bg-slate-900 transition-shadow ${
                  isSelected
                    ? 'border-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.6)]'
                    : 'border-slate-700/80 group-hover:border-violet-300 shadow-md'
                }`}
              >
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Small Status indicator dot */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#07080D] ${
                  participant.onlineStatus === 'focus'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                title={participant.onlineStatus === 'focus' ? 'Focus Mode' : 'Active'}
              />

              {/* Floating User Info Card on Hover / Selection */}
              {showLabels && size !== 'sm' && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 pointer-events-none whitespace-nowrap z-50">
                  <div className="px-2.5 py-1 rounded-lg bg-[#0C0E17]/95 border border-white/10 backdrop-blur-md shadow-xl text-center flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-100 leading-tight">
                      {participant.name}
                    </span>
                    <span className="text-[10px] text-violet-300 font-medium leading-tight">
                      {participant.activity}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
