import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface UserPresence {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  lastSeen: Date;
}

export const RealTimePresence: React.FC = () => {
  const [presence, setPresence] = useState<UserPresence[]>([
    {
      id: '1',
      name: 'Riya Sharma',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isActive: true,
      lastSeen: new Date(),
    },
    {
      id: '2',
      name: 'Aarav Patel',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isActive: true,
      lastSeen: new Date(),
    },
    {
      id: '3',
      name: 'Kabir Mehta',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isActive: false,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPresence(prev =>
        prev.map(user => ({
          ...user,
          isActive: Math.random() > 0.3,
          lastSeen: new Date(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeUsers = presence.filter(u => u.isActive);
  const totalUsers = presence.length;

  return (
    <div className="fixed top-20 left-4 z-40">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#0E101D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className="text-xs font-semibold text-slate-300">
            {activeUsers.length}/{totalUsers} Active
          </span>
        </div>

        <div className="flex -space-x-2">
          {presence.slice(0, 5).map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className="relative"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-[#0E101D]"
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0E101D] ${
                  user.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
            </motion.div>
          ))}
          {totalUsers > 5 && (
            <div className="w-8 h-8 rounded-full bg-violet-600 border-2 border-[#0E101D] flex items-center justify-center text-xs font-bold text-white">
              +{totalUsers - 5}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-3 h-3" />
          <span>Live presence tracking</span>
        </div>
      </motion.div>
    </div>
  );
};
