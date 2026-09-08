# Vibe - Social Connection Platform

A modern React-based social connection platform with AI-powered matching, vibe rooms, and real-time interaction features.

## Features

- **Home Intention Grid** - Discover connections based on shared intentions
- **Social Radar** - Explore vibe rooms and social spaces
- **Vibe Rooms** - Join themed rooms for meaningful connections
- **AI Matching** - Smart algorithm-based user matching
- **Social Pulse** - Real-time social activity visualization
- **Profile Constellation** - Visual profile exploration
- **Active Connections** - Manage ongoing connections with countdown timers
- **Audio Experience** - Ambient presence and interactive sound effects
- **Spark Particles** - Visual feedback for interactions

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Backend**: Express.js server
- **AI Integration**: Google Gemini AI
- **Icons**: Lucide React

## Project Structure

```
vibe/
├── src/
│   ├── components/       # React components
│   │   ├── ActiveConnectionsView.tsx
│   │   ├── AIMatchingView.tsx
│   │   ├── ConnectModal.tsx
│   │   ├── HomeIntentionGrid.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProfileConstellation.tsx
│   │   ├── SocialPulseView.tsx
│   │   ├── SocialRadar.tsx
│   │   ├── SparkParticles.tsx
│   │   ├── VibeOrbit.tsx
│   │   └── VibeRoomView.tsx
│   ├── data/            # Mock data
│   │   └── mockData.ts
│   ├── utils/           # Utilities
│   │   └── audio.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles
│   └── types.ts         # TypeScript types
├── public/              # Static assets
├── server.ts            # Express server
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── .env.example         # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Set your environment variables in `.env`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   APP_URL="http://localhost:3000"
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### Other Commands

- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run TypeScript type checking

## Features Overview

### Navigation
- Desktop dock-style navigation
- Mobile bottom navigation bar
- Audio feedback on navigation

### Connection Management
- Real-time connection countdown timers
- Support for active and idle connections
- Vibe context tracking per connection

### Visual Effects
- Particle burst animations on interactions
- Atmospheric background with glows
- Smooth page transitions with Motion
- Starry node decorative elements

### Audio Experience
- Ambient presence audio
- Orbit hover tones
- Mute/unmute functionality

## Development Notes

- Uses mock data in `src/data/mockData.ts` for development
- TypeScript strict mode enabled
- Tailwind CSS v4 with Vite plugin
- Hot module replacement for development
