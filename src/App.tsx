/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation, NavTab } from './components/Navigation';
import { HomeIntentionGrid } from './components/HomeIntentionGrid';
import { SocialRadar } from './components/SocialRadar';
import { VibeRoomView } from './components/VibeRoomView';
import { AIMatchingView } from './components/AIMatchingView';
import { SocialPulseView } from './components/SocialPulseView';
import { ProfileConstellation } from './components/ProfileConstellation';
import { ActiveConnectionsView } from './components/ActiveConnectionsView';
import { ConnectModal } from './components/ConnectModal';
import { SparkBurstOverlay } from './components/SparkParticles';
import { GamificationSystem } from './components/Gamification';
import { VoiceAssistant } from './components/VoiceAssistant';
import { RealTimePresence } from './components/RealTimePresence';
import { MOCK_VIBE_ROOMS, MOCK_PARTICIPANTS } from './data/mockData';
import { VibeRoom, Participant, ActiveConnection, IntentionType } from './types';
import { audioService } from './utils/audio';
import { CONNECTION_CONFIG } from './utils/constants';
import { handleError, logError } from './utils/errorHandler';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedRoom, setSelectedRoom] = useState<VibeRoom>(MOCK_VIBE_ROOMS[0]);

  // Temporary Moment Connections state with lively initial connections (Active + Idle)
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([
    {
      id: 'init_conn_riya',
      targetUser: { ...MOCK_PARTICIPANTS[0], onlineStatus: 'active' },
      duration: '30 MIN',
      totalSeconds: CONNECTION_CONFIG.defaultDuration,
      remainingSeconds: 27 * 60 + 45,
      connectedAt: new Date(),
      vibeContext: 'AI Builders',
    },
    {
      id: 'init_conn_kabir',
      targetUser: { ...MOCK_PARTICIPANTS[2], onlineStatus: 'idle' },
      duration: '1 HOUR',
      totalSeconds: 60 * 60,
      remainingSeconds: 48 * 60 + 12,
      connectedAt: new Date(),
      vibeContext: 'Startup Ideas',
    },
  ]);

  // Connect Modal state
  const [modalParticipant, setModalParticipant] = useState<Participant | null>(null);
  const [modalVibeContext, setModalVibeContext] = useState<string>('Shared Moment');

  // Spark burst particles
  const [sparkBursts, setSparkBursts] = useState<
    { id: string; x: number; y: number; color?: string }[]
  >([]);

  // Audio status
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Ticking countdown for active connections
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveConnections((prev) =>
        prev
          .map((c) => ({
            ...c,
            remainingSeconds: Math.max(0, c.remainingSeconds - 1),
          }))
          .filter((c) => c.remainingSeconds > 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerSparkBurst = useCallback((e: React.MouseEvent, color?: string) => {
    try {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX || rect.left + rect.width / 2;
      const y = e.clientY || rect.top + rect.height / 2;

      const newBurst = {
        id: `burst_${Date.now()}_${Math.random()}`,
        x,
        y,
        color: color || '#C084FC',
      };
      setSparkBursts((prev) => [...prev, newBurst]);
    } catch (error) {
      const appError = handleError(error, 'triggerSparkBurst');
      logError(appError);
    }
  }, []);

  const removeSparkBurst = useCallback((id: string) => {
    try {
      setSparkBursts((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      const appError = handleError(error, 'removeSparkBurst');
      logError(appError);
    }
  }, []);

  const handleToggleAmbient = useCallback(() => {
    try {
      const playing = audioService.toggleAmbientPresence();
      setIsAmbientPlaying(playing);
    } catch (error) {
      const appError = handleError(error, 'handleToggleAmbient');
      logError(appError);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    try {
      const muted = audioService.toggleMute();
      setIsMuted(muted);
    } catch (error) {
      const appError = handleError(error, 'handleToggleMute');
      logError(appError);
    }
  }, []);

  const handleSelectIntention = useCallback((intention: IntentionType, vibeId?: string) => {
    try {
      const targetRoom = MOCK_VIBE_ROOMS.find((v) => v.id === vibeId) || MOCK_VIBE_ROOMS[0];
      setSelectedRoom(targetRoom);
      setCurrentTab('room');
    } catch (error) {
      const appError = handleError(error, 'handleSelectIntention');
      logError(appError);
    }
  }, []);

  const handleEnterVibe = useCallback((room: VibeRoom) => {
    try {
      setSelectedRoom(room);
      setCurrentTab('room');
    } catch (error) {
      const appError = handleError(error, 'handleEnterVibe');
      logError(appError);
    }
  }, []);

  const handleOpenConnectModal = useCallback((participant: Participant, context?: string) => {
    try {
      setModalParticipant(participant);
      setModalVibeContext(context || selectedRoom.name);
    } catch (error) {
      const appError = handleError(error, 'handleOpenConnectModal');
      logError(appError);
    }
  }, [selectedRoom.name]);

  const handleAddConnection = useCallback((newConn: ActiveConnection) => {
    try {
      setActiveConnections((prev) => [
        newConn,
        ...prev.filter((c) => c.targetUser.id !== newConn.targetUser.id),
      ]);
    } catch (error) {
      const appError = handleError(error, 'handleAddConnection');
      logError(appError);
    }
  }, []);

  const handleRemoveConnection = useCallback((id: string) => {
    try {
      setActiveConnections((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      const appError = handleError(error, 'handleRemoveConnection');
      logError(appError);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 relative overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      {/* Subtle Atmospheric Background Space Particles & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-600/5 blur-[160px]" />
        
        {/* Subtle decorative starry node dots */}
        <div className="absolute top-24 left-[15%] w-1 h-1 rounded-full bg-white/20 animate-pulse" />
        <div className="absolute top-48 right-[20%] w-1.5 h-1.5 rounded-full bg-violet-400/30 animate-pulse" />
        <div className="absolute bottom-36 left-[30%] w-1 h-1 rounded-full bg-cyan-400/20 animate-pulse" />
        <div className="absolute top-[60%] right-[10%] w-1 h-1 rounded-full bg-white/30 animate-pulse" />
      </div>

      {/* Global Particle Burst Overlay */}
      <SparkBurstOverlay
        bursts={sparkBursts}
        onBurstComplete={removeSparkBurst}
      />

      {/* Persistent Navigation (Desktop Dock & Mobile Bottom Bar) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          audioService.playOrbitHoverTone();
          setCurrentTab(tab);
        }}
        activeConnections={activeConnections}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Stage with Cinematic Page Transitions */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <HomeIntentionGrid
                onSelectIntention={handleSelectIntention}
                onSelectParticipant={(p) => handleOpenConnectModal(p, 'Home Discovery')}
              />
            </motion.div>
          )}

          {currentTab === 'radar' && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <SocialRadar onEnterVibe={handleEnterVibe} />
            </motion.div>
          )}

          {currentTab === 'room' && (
            <motion.div
              key="room"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <VibeRoomView
                room={selectedRoom}
                onBackToRadar={() => setCurrentTab('radar')}
                onOpenConnectModal={(p) => handleOpenConnectModal(p, selectedRoom.name)}
                onTriggerSpark={triggerSparkBurst}
                activeConnections={activeConnections}
              />
            </motion.div>
          )}

          {currentTab === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <AIMatchingView
                onOpenConnectModal={(p) => handleOpenConnectModal(p, 'Synchrony Match')}
              />
            </motion.div>
          )}

          {currentTab === 'connections' && (
            <motion.div
              key="connections"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ActiveConnectionsView
                connections={activeConnections}
                onDisconnect={handleRemoveConnection}
                onOpenConnectModal={(p) => handleOpenConnectModal(p, 'Moment Extension')}
                onTriggerSpark={triggerSparkBurst}
                onExploreVibes={() => setCurrentTab('radar')}
              />
            </motion.div>
          )}

          {currentTab === 'pulse' && (
            <motion.div
              key="pulse"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <SocialPulseView />
            </motion.div>
          )}

          {currentTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ProfileConstellation
                onSelectParticipant={(p) => handleOpenConnectModal(p, 'Identity Resonance')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Temporary Connection Modal */}
      <ConnectModal
        participant={modalParticipant}
        vibeContext={modalVibeContext}
        onClose={() => setModalParticipant(null)}
        onConnect={handleAddConnection}
        onTriggerSpark={triggerSparkBurst}
      />

      {/* Gamification System */}
      <GamificationSystem />

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Real-time Presence */}
      <RealTimePresence />
    </div>
  );
}
