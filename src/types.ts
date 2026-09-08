export type IntentionType = 'BUILD' | 'LEARN' | 'CREATE' | 'CONNECT' | 'EXPLORE' | 'JUST BE';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  activity: string;
  role?: string;
  interests: string[];
  bio?: string;
  orbitRadius?: number; // 1 to 3
  orbitSpeed?: number;
  initialAngle?: number;
  onlineStatus?: 'active' | 'focus' | 'idle';
  currentVibeId?: string;
}

export interface VibeRoom {
  id: string;
  name: string;
  tagline: string;
  category: IntentionType;
  icon: string;
  activeCount: number;
  remainingTime: string; // e.g., "47:32"
  matchScore: number; // Synchrony %
  description: string;
  color: string;
  glowColor: string;
  participants: Participant[];
  themeKeywords: string[];
}

export type MomentType = 
  | '💡 Thought'
  | '🎯 Goal'
  | '🚀 Build'
  | '🧠 Learn'
  | '🎨 Create'
  | '🤝 Collaborate'
  | '🌙 Presence';

export interface Moment {
  id: string;
  vibeId?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  type: MomentType;
  content: string;
  timestamp: string;
  sparkCount: number;
  sparkedByMe?: boolean;
  activeCollaboratorsCount?: number;
}

export type ConnectionDuration = '15 MIN' | '30 MIN' | '1 HOUR' | 'TODAY' | 'KEEP CONNECTED';

export interface ActiveConnection {
  id: string;
  targetUser: Participant;
  duration: ConnectionDuration;
  totalSeconds: number;
  remainingSeconds: number;
  connectedAt: Date;
  vibeContext: string;
}

export interface MatchCandidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  interests: string[];
  synchrony: number; // e.g. 82
  rationale: string;
  sharedMomentIdea: string;
  energyTone: string;
  activity: string;
}

export interface SocialMemoryItem {
  day: string; // MON, TUE...
  dateStr: string;
  title: string;
  vibeName: string;
  partnerName?: string;
  partnerAvatar?: string;
  category: IntentionType;
  impactTag: string;
}
