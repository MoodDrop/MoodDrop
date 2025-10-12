# MoodDrop - Emotional Wellness & Growth Platform

## Overview

MoodDrop is a full-stack web application that provides a safe space for users to express their emotions through text or voice messages. The platform has evolved from anonymous-only to supporting user accounts while maintaining anonymous posting capability. Users share feelings, receive supportive affirmations, access comfort resources, and watch their emotional journey bloom in a visual Mood Garden. The platform features a clean mobile-first design, comprehensive admin moderation tools, engagement features (streaks, insights, favorites), and persistent PostgreSQL database storage for production reliability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom color scheme (blush/cream palette)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **File Uploads**: Multer for handling audio file uploads
- **Development**: Custom Vite integration with hot module replacement
- **API Design**: RESTful endpoints with JSON responses

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless)
- **Schema**: 
  - Messages table: emotion, type, content, userId (optional), isFavorite, status, moderation fields
  - Users table: email, firstName, lastName, profileImageUrl, currentStreak, longestStreak, lastPostDate
  - Sessions table: Replit Auth session management
  - Admins table: Admin authentication
- **Storage Class**: DatabaseStorage with advanced filtering, bulk operations, streak tracking, and favorites
- **File Storage**: Local filesystem for audio files in uploads/audio directory
- **Migration**: Drizzle Kit for database schema management

## Key Components

### Authentication System
- **Replit Auth Integration**: Full OAuth support with Google, GitHub, Apple, X, and email/password login
- **User Management**: Automatic user creation and session management
- **Landing Page**: Beautiful onboarding experience for logged-out users
- **Dual Mode**: Support for both authenticated users and anonymous posting
- **Session Storage**: PostgreSQL-backed session persistence

### Message System
- **Emotion Tagging**: Users categorize messages as angry, sad, anxious, happy, excited, or other
- **Dual Input Methods**: Text messages (500 char limit) or voice recordings
- **Voice Processing**: WebM audio format with duration tracking
- **User Linking**: Messages automatically linked to authenticated users (optional for anonymous)
- **Affirmation Feedback**: After submission, users receive a supportive affirmation message tailored to their content with keyword matching (e.g., "tired" → rest encouragement). Affirmations display for 8 seconds in a beautifully styled card with fade-in animation
- **Favorites System**: Users can bookmark meaningful messages for later reflection

### Mood Garden - Visual Growth System
- **Visual Elements**: Three types - Droplets 💧, Flowers 🌸, and Trees 🌳 that alternate for variety
- **Color-Coded Emotions**:
  - 💙 Blue (#60A5FA): Calm, Peaceful
  - 💗 Pink (#F9A8D4): Happy, Excited, Hopeful
  - 💛 Gold (#FCD34D): Proud, Accomplished
  - 🩶 Gray (#D1D5DB): Sad, Tired, Overwhelmed
  - 🧡 Orange (#FB923C): Anxious, Angry, Frustrated
  - 💜 Purple (#C4B5FD): Other emotions
- **Growth Animations**: Staggered fade-in and zoom effects as elements appear
- **Interactive**: Hover over elements to see emotion and date
- **Empty State**: Encouraging message when no blooms exist yet

### Engagement Features
- **Streak Tracking**: 
  - Automatic daily streak calculation based on posting patterns
  - Current streak with flame icon 🔥
  - Longest streak record with trophy icon 🏆
  - Motivational messages based on streak length
  - Updates automatically on message submission
- **Mood Calendar**: 
  - Last 30 days visualization
  - Color-coded entries by dominant emotion
  - Hover tooltips showing entry counts
  - GitHub-style contribution graph layout
- **Insights Dashboard**:
  - Emotion distribution with percentage bars
  - Activity summary (7-day and 30-day counts)
  - Personalized insights based on patterns
  - Trend analysis and encouragement
- **Favorites System**:
  - Bookmark meaningful messages with heart icon
  - Quick access from dashboard
  - Toggle favorite status on any message

### Professional Admin Moderation System
- **Authentication**: Simple username/password system (default: admin/hushed2024)
- **Advanced Dashboard**: Comprehensive admin interface with professional moderation tools
- **Analytics & Statistics**: Real-time stats showing message counts by emotion and status
- **Content Filtering**: Advanced filters by status (active/flagged/hidden), emotion, and text search
- **Bulk Operations**: Select multiple messages for bulk actions (delete, flag, hide, activate)
- **Message Status Management**: Flag messages with reasons, hide inappropriate content, or restore
- **Review Tracking**: Track which admin reviewed messages and when, with flag reasons
- **Audio Playback**: Direct audio file serving for voice message review
- **Access**: Admin dashboard accessible only via direct URL (/admin) - no public navigation link

### UI/UX Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Accessibility**: Proper semantic HTML and ARIA labels, decorative SVGs marked with aria-hidden
- **Toast Notifications**: User feedback for actions and errors
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Navigation**: Clean header with "Home • Drop What You're Holding • Mood Garden • Find Your Calm" navigation. Sign Up button in top-right corner for unauthenticated users
- **Tab System**: Smooth fade-in transitions between tab content for a calming user experience
- **Comfort Corner**: Integrated inspirational quotes, coping strategies, and crisis resources
- **Affirmation System**: Supportive messages displayed after sharing feelings, with smart keyword matching and gentle animations in MoodDrop's signature blush/cream color palette
- **GardenIllustration Component**: Animated flower illustration for empty garden states with three blooming flowers (blush pink, cream/peach, soft rose) and sage green stems/leaves. Features 1.8s staggered grow animations and gentle leaf swaying for a welcoming, calming visual
- **Footer Design**: Contact Us section prominently displays mooddrops2@gmail.com. Important Disclaimer and Support Resources are organized in a responsive 2-column grid layout that stacks on mobile devices

### Wellbeing Features (Comfort Page)
- **Inspirational Quotes**: Rotating collection of uplifting quotes with manual refresh option
- **Coping Strategies**: 6 practical techniques including deep breathing, grounding, and mindfulness
- **Crisis Resources**: Emergency support contacts including suicide prevention and crisis text lines
- **Find Your Calm**: Interactive tab system with three activities:
  - **Watch & Smile**: 3 curated YouTube videos with creator support message encouraging users to follow creators
    - **Story Time**: "Money Made Me Do It" by Creator YO DJ Star
    - **Funny**: "Teachers dressed as students day" by Creator RomanasKatun
    - **Uplifting**: "The Power of Hope" by Creator motivationalresource
    - Category filtering (All, Funny, Uplifting, Story Times), responsive 16:9 aspect ratio with rounded corners and soft shadows
    - Blush/cream aesthetic with sparkle icon and supportive creator message
  - **Games**: Interactive calming games with both desktop and mobile touch support
    - **Bubble Pop** (Free): Canvas-based stress relief game - click/tap rising bubbles to pop them and increase score
    - **Color Drift** (Free): Color matching game - match the target color from 3 orb choices with instant feedback
    - **Memory Match** (Locked): Requires sign-up to unlock
    - **Zen Garden** (Locked): Requires sign-up to unlock
  - **Soothing Sounds**: Coming Soon message displayed with blush/cream aesthetic
- **Daily Wellbeing Tips**: Guidance on morning routines, hydration, sleep, and social connection
- **Professional Help Information**: Resources for finding qualified mental health professionals

## Data Flow

1. **Message Submission**: User selects emotion → chooses input method → submits content
2. **File Processing**: Audio files saved to local storage with unique filenames
3. **Database Storage**: Message metadata stored with emotion, type, and content/filename
4. **Admin Review**: Admins can view all messages and delete as needed
5. **User Feedback**: Success/error states communicated through toast notifications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm & drizzle-zod**: Database ORM and schema validation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Assets**: Audio uploads and static files served from appropriate directories

### Environment Configuration
- **Development**: NODE_ENV=development with hot reloading
- **Production**: NODE_ENV=production with optimized builds
- **Database**: Requires DATABASE_URL environment variable

### File Structure
```
├── client/          # React frontend application
│   ├── src/pages/   # Application pages (landing, dashboard, garden, release, comfort, admin)
│   └── src/components/ # Reusable components (streak-display, mood-calendar, insights-dashboard, etc.)
│   └── src/lib/     # Utilities (gardenColors, affirmations, authUtils, etc.)
├── server/          # Express backend application  
│   ├── replitAuth.ts # Replit Auth integration
│   ├── storage.ts   # Database operations with streak tracking and favorites
│   └── routes.ts    # API endpoints
├── shared/          # Shared TypeScript types and schemas
├── uploads/         # Audio file storage (created at runtime)
├── dist/            # Production build output
└── migrations/      # Database migration files
```

### Security Considerations
- **Input Validation**: Zod schemas for data validation
- **File Upload Limits**: 10MB max file size for audio
- **Content Moderation**: Admin dashboard for content review
- **User Privacy**: Optional authentication with Replit Auth, anonymous posting still supported
- **Session Security**: PostgreSQL-backed session management

The application emphasizes simplicity, emotional safety, and ease of use while providing engaging features for users to track their emotional wellness journey and see their growth over time.