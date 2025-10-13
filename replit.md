# MoodDrop - Emotional Wellness & Growth Platform

## Overview
MoodDrop is a full-stack web application designed as a safe space for users to express emotions via text or voice. It supports both authenticated and anonymous posting, providing supportive affirmations, comfort resources, and a visual "Mood Garden" to track emotional journeys. The platform features a mobile-first design, robust admin moderation, engagement features (streaks, insights, favorites), and persistent PostgreSQL storage. Its core purpose is to foster emotional wellness and personal growth.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
### Instagram Soft Launch Preparation (October 2025)
- **Release Page Affirmation Fix**: Resolved critical bug where affirmation displayed error instead of supportive message. Now uses requestAnimationFrame for proper React state updates and smooth visibility transitions with 8-second display duration
- **Bubble Pop Game Optimization**: Reduced bubble speed from -1.5 to -3.5 down to -0.8 to -2.0 for more playable experience. Fixed timer lag by using refs to prevent interval re-creation on score changes. Reduced spawn rate to 3% and max bubbles to 15
- **Soothing Sounds Implementation**: Replaced "Coming Soon" placeholder with fully functional audio player featuring 4 nature sounds (Gentle Rain, Ocean Waves, Forest Ambience, Flowing Stream) with play/pause controls, volume slider, mute toggle, and continuous loop playback
- **Authentication Verification**: Confirmed Sign Up buttons (header and Mood Garden) successfully redirect to Replit OAuth with all provider options working correctly
- **Production Readiness**: All features tested and architect-reviewed, ready for Instagram soft launch deployment

## System Architecture
### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with a custom blush/cream color scheme
- **UI Components**: Radix UI primitives and shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Build Tool**: Vite
- **UI/UX**: Mobile-first responsive design, accessibility-focused (semantic HTML, ARIA labels), toast notifications, progressive enhancement, calming tab transitions, animated Mood Garden elements, and a floating petal footer animation.
- **Key Pages**:
    - **Message System**: Emotion tagging, text input, voice notes (in development), affirmation feedback, favorites.
    - **Mood Garden**: Visual representation of emotional journey using color-coded Droplets, Flowers, and Trees with growth animations.
    - **Engagement Features**: Daily streak tracking, 30-day Mood Calendar (GitHub-style), Insights Dashboard (emotion distribution, activity summary), and a Favorites system.
    - **Comfort Page ("Find Your Calm")**: Inspirational quotes, coping strategies, crisis resources, curated YouTube videos, interactive calming games (Bubble Pop, Color Drift; Memory Match, Zen Garden locked), and soothing nature sounds player.
    - **Admin Moderation System**: Dedicated dashboard for content review, analytics, content filtering, bulk operations, message status management, and audio playback for voice messages.
    - **Auth**: Replit Auth integration (Google, GitHub, Apple, X, email/password), dual mode for authenticated and anonymous users, PostgreSQL-backed session persistence.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **File Uploads**: Multer for audio.
- **API**: RESTful endpoints with JSON responses.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless).
- **Schema**: Tables for Messages, Users, Sessions, and Admins.
- **File Storage**: Local filesystem for audio files.
- **Schema Management**: Drizzle Kit.

### Core Architectural Decisions
- **Dual User Mode**: Supports both anonymous and authenticated user interactions.
- **Emotional Visualisation**: Uses a "Mood Garden" for intuitive tracking of emotional patterns.
- **Engagement Driven**: Incorporates streaks, insights, and favorites to encourage consistent use.
- **Comprehensive Moderation**: Dedicated admin panel for content safety and management.
- **User Privacy**: Emphasizes minimal data collection and anonymous posting options.

## External Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection.
- **drizzle-orm & drizzle-zod**: ORM and schema validation.
- **@tanstack/react-query**: Server state management.
- **@radix-ui/***: Headless UI components.
- **tailwindcss**: CSS framework.
- **wouter**: React router.
- **Replit Auth**: For user authentication.