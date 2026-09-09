/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  name: 'VIBE',
  tagline: 'Social is a moment',
  version: '1.0.0',
  description: 'A futuristic digital social space where people, intentions, and moments visually orbit around shared energy.',
} as const;

export const API_CONFIG = {
  endpoints: {
    match: '/api/ai/match',
    health: '/api/health',
  },
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
} as const;

export const UI_CONFIG = {
  animation: {
    duration: 0.35,
    spring: { stiffness: 400, damping: 32 },
  },
  colors: {
    primary: '#8B5CF6',
    secondary: '#6366F1',
    background: '#07080D',
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
} as const;

export const CONNECTION_CONFIG = {
  defaultDuration: 30 * 60, // 30 minutes in seconds
  maxConnections: 10,
  warningThreshold: 5 * 60, // 5 minutes
} as const;

export const MATCHING_CONFIG = {
  maxMatches: 4,
  minSynchrony: 75,
  maxSynchrony: 98,
  fallbackSynchrony: 82,
} as const;
