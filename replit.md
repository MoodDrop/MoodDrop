# MoodDrop - Emotional Wellness & Growth Platform

## Overview
MoodDrop is a full-stack web application designed as a safe space for users to express emotions via text or voice. It supports both authenticated and anonymous posting, providing supportive affirmations, comfort resources, and a visual "Mood Garden" to track emotional journeys. The platform features a mobile-first design, robust admin moderation, engagement features (streaks, insights, favorites), and persistent PostgreSQL storage. Its core purpose is to foster emotional wellness and personal growth.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
### Homepage Mood Circles & Tab Integration (October 2025)
- **Horizontal Mood Circles**: Added 6 color-coded mood circles (28px/24px) displayed horizontally above tabs with header "What type of mood are you feeling today?" Each mood has unique color (#A6C8FF Calm, #A4C3A2 Grounded, #FBE694 Joyful, #F6C1B4 Tender, #C9C7D2 Overwhelmed, #E98A7A Frustrated)
- **Tab-Based Interface**: Homepage features two tabs - "Let It Flow" (Write) and "Take a Moment" (Voice). Mood selection integrates with both tabs showing mood name and meaning
- **Interactive Tooltips**: Hover/selection shows mood name + meaning. Full keyboard accessibility with ARIA labels and auto-focus on textarea when composer opens
- **Write It Out Composer Visibility**: Composer hidden by default on page load, reveals with smooth fade/slide animation (200ms) when mood selected. Text preserved across mood changes and cleared only on successful submission or explicit clear action
- **Memory Match Game**: 8-pair memory game without timer - users can play at their own pace with move and match counters. Includes reset functionality and win celebration
- **Preserved Layout**: Maintained original hero header, tagline, and overall homepage aesthetic

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
    - **Homepage with Mood Circles**: Horizontal row of 6 color-coded mood circles with tooltips. Composer hidden by default, reveals with fade/slide animation on mood selection. Tab-based interface with "Let It Flow" (Write) and "Take a Moment" (Voice). Write tab supports text input with affirmation feedback. Draft text preserved across mood changes, cleared only on submission.
    - **Message System**: Emotion tagging, text input, voice notes (in development), affirmation feedback, favorites.
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