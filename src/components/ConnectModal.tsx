import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant, ConnectionDuration, ActiveConnection } from '../types';
import { Clock, Sparkles, Check, X, Shield, ArrowRight } from 'lucide-react';
import { audioService } from '../utils/audio';

interface ConnectModalProps {
  participant: Participant | null;
  vibeContext: string;
  onClose: () => void;
  onConnect: (connection: ActiveConnection) => void;
  onTriggerSpark?: (e: React.MouseEvent) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  participant,
  vibeContext,
  onClose,
  onConnect,
  onTriggerSpark,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<ConnectionDuration>('30 MIN');

  if (!participant) return null;

  const durationOptions: { id: ConnectionDuration; label: string; seconds: number; desc: string }[] = [
    { id: '15 MIN', label: '15 MIN', seconds: 15 * 60, desc: 'Quick sounding board or rapid sanity check' },
    { id: '30 MIN', label: '30 MIN', seconds: 30 * 60, desc: 'Focused co-working sprint or pair feedback' },
    { id: '1 HOUR', label: '1 HOUR', seconds: 60 * 60, desc: 'Deep collaborative session & build sprint' },
    { id: 'TODAY', label: 'TODAY', seconds: 8 * 3600, desc: 'Day-long ambient presence & async resonance' },
    { id: 'KEEP CONNECTED', label: 'KEEP CONNECTED', seconds: 24 * 3600 * 30, desc: 'Durable creative sync across spaces' },
  ];

  const currentOption = durationOptions.find((d) => d.id === selectedDuration) || durationOptions[1];

  const handleConfirm = () => {
    audioService.playConnectTone();
    const newConnection: ActiveConnection = {
      id: `conn_${Date.now()}`,
      targetUser: participant,
      duration: selectedDuration,
      totalSeconds: currentOption.seconds,
      remainingSeconds: currentOption.seconds,
      connectedAt: new Date(),
      vibeContext,
    };
    onConnect(newConnection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-lg rounded-3xl bg-[#0E101D] border border-white/15 p-6 sm:p-8 shadow-2xl shadow-violet-950/40 text-slate-100 overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: User Profile in Moment */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-violet-400 shadow-lg shadow-violet-500/25">
              <img
                src={participant.avatar}
                alt={participant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0E101D]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">
                {participant.name}
              </h3>
              {participant.role && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">
                  {participant.role}
                </span>
              )}
            </div>
            <p className="text-xs text-violet-300 font-semibold mt-0.5">
              Current: {participant.activity}
            </p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              {participant.bio}
            </p>
          </div>
        </div>

        {/* Philosophy Core: Not "Follow", but "Connect for a Moment" */}
        <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 mb-6">
          <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>CONNECT FOR A MOMENT</span>
          </div>
          <p className="text-sm font-semibold text-white">
            “Social is not a feed. Social is a moment.”
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Connections exist intentionally for this shared window, free from follower counts and vanity metrics.
          </p>
        </div>

        {/* Duration selector buttons */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Choose Moment Duration
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {durationOptions.map((opt) => {
              const isSelected = selectedDuration === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDuration(opt.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all text-center border cursor-pointer ${
                    isSelected
                      ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30 scale-[1.03]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 italic mt-3 text-center">
            {currentOption.desc}
          </p>
        </div>

        {/* Subtle Confirmation banner */}
        <div className="text-center py-2 px-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 mb-6">
          <span>This connection will exist for </span>
          <span className="font-bold text-violet-300">{selectedDuration.toLowerCase()}</span>.
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-2 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/40 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <span>Connect for {selectedDuration}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
