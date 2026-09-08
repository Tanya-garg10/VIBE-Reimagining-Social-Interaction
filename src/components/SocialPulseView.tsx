import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_SOCIAL_PULSE_TIMELINE } from '../data/mockData';
import { Activity, Heart, Clock, Users, Sparkles, Handshake, ChevronRight } from 'lucide-react';
import { audioService } from '../utils/audio';

export const SocialPulseView: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(4); // Default Friday

  const pulseStats = [
    { label: 'meaningful connections', value: '12', icon: Users, color: 'text-violet-400' },
    { label: 'collaborations', value: '4', icon: Handshake, color: 'text-emerald-400' },
    { label: 'shared moments', value: '7', icon: Sparkles, color: 'text-pink-400' },
    { label: 'together', value: '2h 48m', icon: Clock, color: 'text-cyan-400' },
  ];

  // SVG Heartbeat curve data points for Mon -> Sun
  const weekPoints = [
    { day: 'MON', x: 40, y: 70, intensity: 'High', title: 'Met Riya in AI Builders' },
    { day: 'TUE', x: 130, y: 95, intensity: 'Moderate', title: 'Joined Study Sprint' },
    { day: 'WED', x: 220, y: 40, intensity: 'Peak', title: 'Built with Arjun' },
    { day: 'THU', x: 310, y: 80, intensity: 'Moderate', title: 'Helped someone learn React' },
    { day: 'FRI', x: 400, y: 30, intensity: 'Deep Resonance', title: 'Started a new collaboration' },
    { day: 'SAT', x: 490, y: 60, intensity: 'Creative Jam', title: 'Co-designed with Meera' },
    { day: 'SUN', x: 570, y: 110, intensity: 'Quiet Presence', title: 'Reflective recharge' },
  ];

  // Generate SVG path through points with bezier curves
  const pathD = `M 20 100 
    Q 40 70, 70 75 
    T 130 95 
    Q 175 60, 220 40 
    T 310 80 
    Q 355 50, 400 30 
    T 490 60 
    Q 530 85, 570 110 
    L 600 115`;

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
          <Activity className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span>Personal Social Memory</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
          YOUR SOCIAL PULSE
        </h1>

        <p className="text-base sm:text-lg text-slate-400 font-medium italic">
          “The moments that mattered.”
        </p>
      </div>

      {/* Heartbeat Pulse Graph Visual */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0E18]/80 border border-white/10 backdrop-blur-xl shadow-2xl mb-12 flex flex-col gap-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              Social Heartbeat
            </h3>
            <p className="text-xs text-slate-400">
              Synchronous resonance frequency across the last 7 days.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-violet-300">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span>Living Pulse</span>
          </div>
        </div>

        {/* SVG Pulse Chart */}
        <div className="relative w-full h-44 sm:h-52 overflow-x-auto">
          <svg
            viewBox="0 0 620 150"
            className="w-full h-full overflow-visible min-w-[500px]"
          >
            <defs>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="35%" stopColor="#3B82F6" />
                <stop offset="70%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>

              <filter id="pulseGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle horizontal grid guide lines */}
            <line x1="20" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 6" />
            <line x1="20" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 6" />
            <line x1="20" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 6" />

            {/* Glowing Heartbeat Waveform Path */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              d={pathD}
              fill="none"
              stroke="url(#pulseGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#pulseGlowFilter)"
            />

            {/* Interactive Day Nodes */}
            {weekPoints.map((point, index) => {
              const isSelected = activeDayIndex === index;

              return (
                <g
                  key={point.day}
                  onClick={() => {
                    setActiveDayIndex(index);
                    audioService.playSparkTone();
                  }}
                  className="cursor-pointer group"
                >
                  {/* Subtle vertical indicator line */}
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={point.x}
                    y2="135"
                    stroke={isSelected ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255,255,255,0.06)'}
                    strokeDasharray="2 4"
                  />

                  {/* Pulsing halo ring on active */}
                  {isSelected && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="12"
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth="1.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isSelected ? '7' : '5'}
                    fill={isSelected ? '#F472B6' : '#8B5CF6'}
                    stroke="#0C0E18"
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Day label */}
                  <text
                    x={point.x}
                    y="145"
                    textAnchor="middle"
                    fill={isSelected ? '#F472B6' : '#94A3B8'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : '500'}
                  >
                    {point.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Highlighted Day Memory Preview */}
        {activeDayIndex !== null && (
          <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-violet-300">
                {weekPoints[activeDayIndex].day}:
              </span>
              <span>{weekPoints[activeDayIndex].title}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-950 border border-violet-500/30 text-violet-300 font-semibold">
              {weekPoints[activeDayIndex].intensity}
            </span>
          </div>
        )}

        {/* 4 Summary Metric Badges (from prompt: 12 meaningful connections, 4 collaborations, 7 shared moments, 2h 48m together) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          {pulseStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center"
              >
                <div className={`text-2xl sm:text-3xl font-extrabold ${stat.color} mb-0.5 tracking-tight`}>
                  {stat.value}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Timeline: THIS WEEK */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            THIS WEEK
          </h2>
          <span className="text-xs text-slate-400">
            Personal memory timeline
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_SOCIAL_PULSE_TIMELINE.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#0E101D]/70 border border-white/8 hover:border-white/20 transition-all backdrop-blur-md flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                {/* Day Badge */}
                <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-black text-violet-300">
                    {item.day}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.dateStr}
                  </span>
                </div>

                {/* Partner avatar if present */}
                {item.partnerAvatar && (
                  <img
                    src={item.partnerAvatar}
                    alt={item.partnerName || 'Partner'}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-white/20 hidden sm:inline-block"
                  />
                )}

                {/* Event details */}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-violet-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    in <strong className="text-slate-300">{item.vibeName}</strong>
                  </p>
                </div>
              </div>

              {/* Tag / Category */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold hidden sm:inline">
                  {item.impactTag}
                </span>
                <span className="text-xs font-extrabold text-violet-400 px-2 py-0.5 rounded-md bg-violet-500/10">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
