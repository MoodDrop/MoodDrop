# MoodDrop - Emotional Wellness & Growth Platform

## Overview
MoodDrop is a full-stack web application designed as a safe space for users to express emotions via text or voice. It supports both authenticated and anonymous posting, providing supportive affirmations, comfort resources, and a visual "Mood Garden" to track emotional journeys. The platform features a mobile-first design, robust admin moderation, engagement features (streaks, insights, favorites), and persistent PostgreSQL storage. Its core purpose is to foster emotional wellness and personal growth.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
### Visual Mood Selector on Homepage (October 2025)
- **Mood Selector Feature**: Added interactive mood selector on homepage with 6 color-coded mood icons (Calm, Grounded, Joyful, Tender, Overwhelmed, Frustrated). Each mood has unique color, shape icon, and meaning description displayed when selected
- **Write & Record Options**: Users can choose to Write (text input with mood meaning displayed) or Record Voice after selecting a mood. Affirmation displays for 8 seconds after submission, then automatically returns to mood grid
- **Memory Match Game**: Replaced Color Drift with Memory Match card game featuring 8 pairs of flower emojis. Tracks moves and matches with win celebration. Color Drift moved to locked games
- **Mood Flow**: Homepage now features: Mood Grid → Select Mood → Write/Record → Submit → Affirmation (8s) → Auto-reset to Grid
- **Accessibility**: Full keyboard navigation support, ARIA labels for all mood icons, calming color palette matching MoodDrop aesthetic

### Previous Updates
- **Release Page Affirmation Fix**: Resolved critical bug where affirmation failed to display after message submission. Fixed by using React Query's `onSuccess` callback pattern instead of async/await for reliable state updates
- **Bubble Pop Game Sound**: Added gentle popping sound effect when bubbles are clicked. Audio element initialized with error handling for graceful fallback if sound file missing
- **Soothing Sounds Tab**: Restored tab with "Coming Soon" message featuring Music2 icon, centered text, and soft blush/cream gradient background
- **Production Readiness**: All features tested and verified via comprehensive end-to-end testing

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
    - **Homepage Mood Selector**: Interactive visual mood selector with 6 color-coded moods (Calm, Grounded, Joyful, Tender, Overwhelmed, Frustrated). Users select mood, choose Write or Record Voice, receive affirmation, and auto-return to mood grid.
    - **Message System**: Emotion tagging, text input, voice notes (in development), affirmation feedback, favorites.
    - **Mood Garden**: Visual representation of emotional journey using color-coded Droplets, Flowers, and Trees with growth animations.
    - **Engagement Features**: Daily streak tracking, 30-day Mood Calendar (GitHub-style), Insights Dashboard (emotion distribution, activity summary), and a Favorites system.
    - **Comfort Page ("Find Your Calm")**: Inspirational quotes, coping strategies, crisis resources, curated YouTube videos, interactive calming games (Bubble Pop with gentle pop sounds, Memory Match with 8 pairs; Color Drift and Zen Garden locked), and Soothing Sounds placeholder.
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