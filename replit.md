# Hushed Haven - Anonymous Emotional Expression Platform

## Overview

Hushed Haven is a full-stack web application that provides a safe, anonymous space for users to express their emotions through text or voice messages. The platform features a clean mobile-first design with admin functionality for content moderation. The application now uses persistent PostgreSQL database storage for production reliability.

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
- **Schema**: Enhanced messages table with moderation fields (status, flagReason, reviewedBy, reviewedAt)
- **Storage Class**: DatabaseStorage with advanced filtering and bulk operations
- **File Storage**: Local filesystem for audio files in uploads/audio directory
- **Migration**: Drizzle Kit for database schema management

## Key Components

### Message System
- **Emotion Tagging**: Users categorize messages as angry, sad, anxious, or other
- **Dual Input Methods**: Text messages (500 char limit) or voice recordings
- **Voice Processing**: WebM audio format with duration tracking
- **Anonymous Storage**: No user identification or session tracking

### Professional Admin Moderation System
- **Authentication**: Simple username/password system (default: admin/hushed2024)
- **Advanced Dashboard**: Comprehensive admin interface with professional moderation tools
- **Analytics & Statistics**: Real-time stats showing message counts by emotion and status
- **Content Filtering**: Advanced filters by status (active/flagged/hidden), emotion, and text search
- **Bulk Operations**: Select multiple messages for bulk actions (delete, flag, hide, activate)
- **Message Status Management**: Flag messages with reasons, hide inappropriate content, or restore
- **Review Tracking**: Track which admin reviewed messages and when, with flag reasons
- **Audio Playback**: Direct audio file serving for voice message review

### UI/UX Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Toast Notifications**: User feedback for actions and errors
- **Progressive Enhancement**: Works without JavaScript for basic functionality

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
├── server/          # Express backend application  
├── shared/          # Shared TypeScript types and schemas
├── uploads/         # Audio file storage (created at runtime)
├── dist/            # Production build output
└── migrations/      # Database migration files
```

### Security Considerations
- **Input Validation**: Zod schemas for data validation
- **File Upload Limits**: 10MB max file size for audio
- **Content Moderation**: Admin dashboard for content review
- **No User Tracking**: Completely anonymous message system

The application emphasizes simplicity, emotional safety, and ease of use while maintaining the ability to moderate content when necessary.