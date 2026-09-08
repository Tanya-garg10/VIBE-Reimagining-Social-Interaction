import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant, MatchCandidate } from '../types';
import { MOCK_PARTICIPANTS } from '../data/mockData';
import { VibeOrbit } from './VibeOrbit';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Clock, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { audioService } from '../utils/audio';

interface AIMatchingViewProps {
  onOpenConnectModal: (participant: Participant) => void;
}

export const AIMatchingView: React.FC<AIMatchingViewProps> = ({ onOpenConnectModal }) => {
  const [intentInput, setIntentInput] = useState(
    'I’m building a GenAI project and need someone strong in UI.'
  );
  const [isMatching, setIsMatching] = useState(false);
  const [animationStage, setAnimationStage] = useState<number>(0);
  const [matches, setMatches] = useState<MatchCandidate[] | null>(null);
  const [intentSummary, setIntentSummary] = useState<string>('');
  const [isPoweredByGroq, setIsPoweredByGroq] = useState(false);

  const samplePrompts = [
    'I’m building a GenAI project and need someone strong in UI.',
    'Looking for a silent Pomodoro co-working partner for 1 hour of deep coding.',
    'Need feedback on real-time WebRTC collaborative canvas architecture.',
    'Brainstorming minimal, anti-slop consumer social interaction models.',
  ];

  const matchingStages = [
    'SCANNING INTERESTS',
    'UNDERSTANDING INTENT',
    'FINDING ACTIVE PEOPLE',
    'MATCHING ENERGY',
  ];

  const handleStartMatching = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!intentInput.trim()) return;

    audioService.playConnectTone();
    setIsMatching(true);
    setMatches(null);
    setAnimationStage(0);

    // Sequence stages smoothly with sound
    const stageTimer1 = setTimeout(() => {
      setAnimationStage(1);
      audioService.playSparkTone();
    }, 700);

    const stageTimer2 = setTimeout(() => {
      setAnimationStage(2);
      audioService.playSparkTone();
    }, 1400);

    const stageTimer3 = setTimeout(() => {
      setAnimationStage(3);
      audioService.playSparkTone();
    }, 2100);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: intentInput,
          candidatePool: MOCK_PARTICIPANTS,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        setIsMatching(false);
        audioService.playConnectTone();

        if (data.matches && data.matches.length > 0) {
          const mapped: MatchCandidate[] = data.matches.map((m: any) => {
            const original = MOCK_PARTICIPANTS.find((p) => p.id === m.id) || MOCK_PARTICIPANTS[0];
            return {
              id: original.id,
              name: original.name,
              avatar: original.avatar,
              role: original.role || 'Creator',
              interests: original.interests,
              synchrony: m.synchrony || 82,
              rationale: m.rationale || "You're both building AI products right now.",
              sharedMomentIdea: m.sharedMomentIdea || 'Pair Prototyping',
              energyTone: m.energyTone || 'Deep Focus',
              activity: original.activity,
            };
          });
          setMatches(mapped);
          setIntentSummary(data.intentAnalysis || 'Intention aligned with active builders');
          setIsPoweredByGroq(!!data.poweredByGroq);
        } else {
          // Fallback static matches
          setMatches([
            {
              id: 'user_riya',
              name: 'Riya Sharma',
              avatar: MOCK_PARTICIPANTS[0].avatar,
              role: 'Product Designer',
              interests: ['UI/UX', 'React', 'AI Products'],
              synchrony: 88,
              rationale: "You're both building AI products right now.",
              sharedMomentIdea: 'Interactive Canvas Pairing',
              energyTone: 'High Velocity',
              activity: 'Designing UI',
            },
            {
              id: 'user_aarav',
              name: 'Aarav Patel',
              avatar: MOCK_PARTICIPANTS[1].avatar,
              role: 'AI Engineer',
              interests: ['Agents', 'LangChain', 'Python'],
              synchrony: 82,
              rationale: 'Complementary workflow architecture and autonomous execution.',
              sharedMomentIdea: 'Prompt Pipeline Jam',
              energyTone: 'Deep Focus',
              activity: 'Building Agent',
            },
          ]);
        }
      }, 2900);
    } catch (err) {
      setTimeout(() => {
        setIsMatching(false);
        setMatches([
          {
            id: 'user_riya',
            name: 'Riya Sharma',
            avatar: MOCK_PARTICIPANTS[0].avatar,
            role: 'Product Designer',
            interests: ['UI/UX', 'React', 'AI Products'],
            synchrony: 88,
            rationale: "You're both building AI products right now.",
            sharedMomentIdea: 'Pair Prototyping',
            energyTone: 'Creative Spark',
            activity: 'Designing UI',
          },
        ]);
      }, 2900);
    }
  };

  // Convert matched candidates to participants for VibeOrbit visual
  const matchedParticipants: Participant[] = matches
    ? matches.map((m, i) => ({
        id: m.id,
        name: m.name,
        avatar: m.avatar,
        activity: m.activity,
        interests: m.interests,
        orbitRadius: (i % 3) + 1,
        initialAngle: i * 110,
        onlineStatus: 'active',
      }))
    : [];

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-16 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Synchrony Matching Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Who should be here with you?
        </h1>

        <p className="text-sm sm:text-base text-slate-400">
          Describe your active intention, craft, or current challenge. VIBE will calculate momentary synchrony.
        </p>
      </div>

      {/* Input Form & Quick Prompt Chips */}
      <div className="w-full max-w-3xl mb-12">
        <form
          onSubmit={handleStartMatching}
          className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl sm:rounded-full bg-[#0E101D] border border-white/15 backdrop-blur-xl shadow-2xl focus-within:border-violet-500 transition-colors"
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={intentInput}
              onChange={(e) => setIntentInput(e.target.value)}
              placeholder="e.g. I’m building a GenAI project and need someone strong in UI..."
              className="w-full py-3 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isMatching || !intentInput.trim()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <span>Find My People</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 px-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Try:
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIntentInput(p);
                audioService.playSparkTone();
              }}
              className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5 transition-colors text-left truncate max-w-xs"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic 4-Stage Matching Animation */}
      <AnimatePresence>
        {isMatching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg p-8 rounded-3xl bg-[#0F111E] border border-violet-500/30 shadow-2xl flex flex-col items-center text-center my-6"
          >
            {/* Animated Orbiting Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/40 animate-spin-slow" />
              <div className="absolute inset-3 rounded-full border border-cyan-400/30 animate-spin-reverse-slow" />
              <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-400 flex items-center justify-center shadow-lg shadow-violet-500/40 animate-pulse">
                <Sparkles className="w-5 h-5 text-violet-300" />
              </div>
            </div>

            {/* Stages progression */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              {matchingStages.map((stage, index) => {
                const isCurrent = animationStage === index;
                const isDone = animationStage > index;

                return (
                  <div
                    key={stage}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-violet-950/60 border-violet-500 text-violet-200 shadow-md scale-105'
                        : isDone
                        ? 'bg-white/5 border-white/10 text-emerald-300'
                        : 'bg-transparent border-transparent text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
                    )}
                    <span className="tracking-wider">{stage}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section: Living Constellation + Synchrony Cards */}
      <AnimatePresence>
        {!isMatching && matches && matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-10"
          >
            {/* Synchrony Constellation Preview */}
            <div className="relative flex flex-col items-center p-6 rounded-3xl bg-[#0A0B13]/70 border border-white/10 backdrop-blur-xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold text-violet-300 tracking-wider uppercase">
                  SYNCHRONY CONSTELLATION
                </span>
                {isPoweredByGroq && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                    Powered by Groq
                  </span>
                )}
              </div>

              <VibeOrbit
                centerTitle="YOUR INTENTION"
                centerSubtitle={intentSummary || 'High Synchrony'}
                centerIcon="🎯"
                centerColor="#8B5CF6"
                participants={matchedParticipants}
                size="md"
                interactive={true}
                onSelectParticipant={(p) => onOpenConnectModal(p)}
              />
            </div>

            {/* Revealed Synchrony Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
              {matches.map((candidate, idx) => {
                const participantObj =
                  MOCK_PARTICIPANTS.find((p) => p.id === candidate.id) || MOCK_PARTICIPANTS[0];

                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="p-6 rounded-3xl bg-[#0F111E] border border-white/10 hover:border-violet-500/40 transition-all shadow-xl flex flex-col justify-between gap-5 relative group"
                  >
                    <div>
                      {/* Top Row: Synchrony Score + Energy Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={candidate.avatar}
                              alt={candidate.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-full object-cover border-2 border-violet-400 shadow-md shadow-violet-500/20"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0F111E]" />
                          </div>

                          <div>
                            <h3 className="text-lg font-extrabold text-white group-hover:text-violet-200 transition-colors">
                              {candidate.name}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                              {candidate.role} · {candidate.activity}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-xl font-extrabold text-violet-300 tracking-tight">
                            {candidate.synchrony}%
                          </span>
                          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                            SYNCHRONY
                          </span>
                        </div>
                      </div>

                      {/* Interest tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {candidate.interests.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] font-medium text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Rationale Quote */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 mb-2">
                        <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
                          “{candidate.rationale}”
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mt-2">
                        <span>Energy: <strong className="text-violet-300">{candidate.energyTone}</strong></span>
                        <span>Moment: <strong className="text-slate-200">{candidate.sharedMomentIdea}</strong></span>
                      </div>
                    </div>

                    {/* CTA: Connect for a Moment */}
                    <button
                      onClick={() => {
                        audioService.playConnectTone();
                        onOpenConnectModal(participantObj);
                      }}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <span>Connect for 30 min</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
