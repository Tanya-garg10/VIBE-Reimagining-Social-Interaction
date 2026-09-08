import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  size: number;
}

interface SparkBurstProps {
  bursts: { id: string; x: number; y: number; color?: string }[];
  onBurstComplete: (id: string) => void;
}

export const SparkBurstOverlay: React.FC<SparkBurstProps> = ({ bursts, onBurstComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <BurstEffect
            key={burst.id}
            x={burst.x}
            y={burst.y}
            color={burst.color || '#A855F7'}
            onComplete={() => onBurstComplete(burst.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const BurstEffect: React.FC<{
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}> = ({ x, y, color, onComplete }) => {
  const [particles] = useState(() => {
    const pCount = 14;
    return Array.from({ length: pCount }).map((_, i) => {
      const angle = (i / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 35 + Math.random() * 55;
      const colors = [color, '#38BDF8', '#F472B6', '#FBBF24', '#C084FC'];
      return {
        id: `p-${i}`,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  });

  useEffect(() => {
    const timer = setTimeout(onComplete, 750);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{ left: x, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      {/* Central light flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ backgroundColor: color }}
        className="w-8 h-8 rounded-full blur-md absolute -left-4 -top-4"
      />

      {/* Radiating sparkle particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
          }}
          className="absolute rounded-full"
        />
      ))}
    </div>
  );
};
