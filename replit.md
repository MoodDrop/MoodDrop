# MoodDrop - Emotional Wellness & Growth Platform

## Overview
MoodDrop is a fully anonymous emotional wellness platform designed as a safe space for users to express emotions via text or voice. No sign-up or authentication required—users select from 5 color-coded moods (Calm, Grounded, Joyful, Tender, Overwhelmed), click "💧 Drop It" to access a dedicated journaling page with Write or Voice tabs, practice guided breathing exercises, and access comfort resources and interactive games. The platform features a mobile-first design with calming animations, accessibility-first interactions, and localStorage-only storage. Its core purpose is to foster emotional wellness and personal growth through immediate, anonymous support.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
### Homepage Redesign & CSV Removal (October 30, 2025)
- **Simplified User Flow**: Homepage now features 5 mood circles (reduced from 6, removed Frustrated) → "💧 Drop It" button → dedicated /drop-it page for journaling
- **Mood Selection**: 5 color-coded moods: Calm (blue #A6C8FF), Grounded (green #A4C3A2), Joyful (yellow #FBE694), Tender (peach #F6C1B4), Overwhelmed (gray #C9C7D2)
- **DropItPage**: New dedicated page for journaling with two tabs: "Write" (text input with affirmation) and "Voice" (60s audio recording). Mood stored in localStorage, cleared after successful submission
- **Improved Error Handling**: Added try/catch blocks for localStorage operations, user-friendly error messages, FileReader error handling
- **CSV Removal**: Removed all CSV import/export functionality from MyDropsPage. Updated privacy footnote to: "Private to this device. Your drops stay on your device only — fully anonymous."
- **State Management**: Mood selection persisted via localStorage ("mooddrop_selected_mood"), automatically cleared after drop submission to prevent stale context
- **Enhanced UX**: Back button navigation, mood display on drop page, smooth tab transitions, automatic redirect after submission

### Take a Breath Breathing Exercise & Anonymous Mode (October 2025)
- **Fully Anonymous Platform**: Removed all authentication requirements—no sign-up, login, or account needed. Admin routes preserved but hidden from navigation
- **Take a Breath Page**: Replaced "Drop What You're Doing" with guided breathing exercises featuring three scientifically-backed presets:
  - **Box Breathing**: 4s inhale, 4s hold, 4s exhale, 4s hold (stress reduction, focus)
  - **4-7-8 Breathing**: 4s inhale, 7s hold, 8s exhale (sleep aid, anxiety relief)
  - **Long Exhale (Calming)**: 4s inhale, 6s exhale (nervous system regulation)
- **Visual Ring Animation**: Expanding/contracting ring synchronized with breath phases (blue on inhale, yellow on exhale, gray on hold). Respects `prefers-reduced-motion` with fallback to static progress indicator
- **Interactive Controls**: Start/Pause/Reset buttons with keyboard shortcuts (Spacebar to toggle, Enter to reset). Optional sound toggle (off by default) with gentle breath-chime audio
- **Phase Labels & Progress**: Real-time phase display ("Breathe in", "Hold", "Breathe out") with live countdown and visual progress ring driven by requestAnimationFrame for smooth 60fps animation
- **Accessibility Features**: ARIA live regions for screen readers, keyboard navigation, reduced-motion support, graceful audio fallback if sound file missing
- **Coming Soon Pages**: Dashboard and Garden now show "Coming Soon" placeholders with messaging: "Optional accounts for saved progress and tracking are on the way. For now, everything is fully anonymous"
- **Unlocked Games**: Removed "(Sign up)" text from locked games (Color Drift, Zen Garden) in Find Your Calm—they simply show lock icon
- **Routes Updated**: `/release` and `/breathe` both navigate to breathing exercise. Header navigation renamed to "Take a Breath"


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
    - **Homepage**: 5 color-coded mood circles (Calm, Grounded, Joyful, Tender, Overwhelmed) with pulsing glow animation. Select a mood to enable "💧 Drop It" button. Mood stored in localStorage and routes to /drop-it page.
    - **DropItPage**: Dedicated journaling page with two tabs - "Write" (text input with affirmation feedback, auto-redirect to /my-drops) and "Voice" (60s audio recording with Record/Stop/Play/Delete controls). Mood displayed at top, back button for navigation. Clears mood selection after successful submission.
    - **MyDropsPage**: Displays all drops from localStorage with search, filtering, delete with undo. No CSV import/export. Privacy footnote emphasizes device-only, anonymous storage.
    - **Message System**: Emotion tagging, text input, voice notes with local recording and playback, affirmation feedback, favorites.
    - **Mood Garden**: Visual representation of emotional journey using color-coded Droplets, Flowers, and Trees with growth animations.
    - **Engagement Features**: Daily streak tracking, 30-day Mood Calendar (GitHub-style), Insights Dashboard (emotion distribution, activity summary), and a Favorites system.
    - **Comfort Page ("Find Your Calm")**: Inspirational quotes, coping strategies, crisis resources, curated YouTube videos, interactive calming games (Bubble Pop with gentle pop sounds, Memory Match with 8 pairs at user's own pace; Color Drift and Zen Garden locked), and Soothing Sounds placeholder.
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