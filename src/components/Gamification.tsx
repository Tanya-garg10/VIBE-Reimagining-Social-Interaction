import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Zap, Flame, Target } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export const GamificationSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_connection',
      title: 'First Spark',
      description: 'Make your first connection',
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Connect with 5 different people',
      icon: <Star className="w-6 h-6" />,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Stay connected past midnight',
      icon: <Flame className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'vibe_master',
      title: 'Vibe Master',
      description: 'Spend 10+ hours in vibe rooms',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },
  ]);

  const [showNotification, setShowNotification] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Simulate achievement unlock
  useEffect(() => {
    const checkAchievements = () => {
      achievements.forEach((achievement) => {
        if (!achievement.unlocked && achievement.progress >= achievement.maxProgress) {
          setCurrentAchievement(achievement);
          setShowNotification(true);
          setAchievements(prev =>
            prev.map(a =>
              a.id === achievement.id ? { ...a, unlocked: true } : a
            )
          );
        }
      });
    };

    checkAchievements();
  }, [achievements]);

  return (
    <>
      {/* Achievement Notification */}
      <AnimatePresence>
        {showNotification && currentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 right-4 z-50 bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-2xl shadow-2xl border border-violet-400/30 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-yellow-300">
                {currentAchievement.icon}
              </div>
              <div>
                <h4 className="font-bold text-white">Achievement Unlocked!</h4>
                <p className="text-sm text-violet-200">{currentAchievement.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Tracker */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-full shadow-lg"
          aria-label="View achievements"
        >
          <Trophy className="w-6 h-6" />
        </motion.button>
      </div>
    </>
  );
};
