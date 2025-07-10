# Smart CRM Pipeline Deals Component

A modern, AI-enhanced CRM platform for managing sales pipelines, contacts, and deals with intelligent insights and analytics.

## Features

- **Interactive Deal Pipeline**: Drag-and-drop kanban board for visual deal management across stages
- **AI-Enhanced Contact Management**: Contact profiles with AI-generated insights and enrichment
- **Deal Analytics Dashboard**: Comprehensive analytics showing pipeline health, conversion rates, and deal metrics
- **Team Gamification**: Performance tracking with achievements, leaderboards, and team challenges
- **Communication Hub**: Integrated email, call, and meeting scheduling tools
- **Automation**: Deal-specific and contact-specific automation sequences
- **Dark Mode**: Fully accessible dark mode with persistent preferences and system theme respect
- **Journey Timelines**: Visual history tracking for deals and contacts

## AI Features

- **Lead Scoring**: Automatic scoring of contacts and deals with machine learning
- **Contact Enrichment**: AI-powered research to fill in missing contact information
- **Deal Insights**: Intelligent recommendations and risk analysis
- **Smart Email Composer**: AI-assisted email writing based on deal and contact context
- **Hybrid AI Routing**: Automatic selection of the best AI model (OpenAI GPT-4o, Gemini, Gemma) for each task

## Technologies Used

- **React 18**: Modern UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for robust code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Lightweight icon library
- **Zustand**: State management library
- **Recharts**: Composable charting library for analytics
- **Hello-Pangea/DND**: Drag and drop library for the pipeline board
- **Vite**: Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-crm.git
   cd smart-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables example file:
   ```bash
   cp .env.example .env
   ```

4. Set up API keys (optional, app works with mock data by default):
   - OpenAI API key (for GPT models)
   - Google Gemini API key (for Gemini models)
   - Supabase credentials (for database)

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── contacts/       # Contact-related components
│   │   ├── deals/          # Deal-related components
│   │   ├── gamification/   # Team performance components
│   │   └── ui/             # Reusable UI components
│   ├── config/             # Configuration files
│   ├── contexts/           # React contexts (Theme, Personalization)
│   ├── data/               # Mock data for development
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and utility services
│   │   ├── aiResearchService.ts     # AI research capabilities
│   │   ├── geminiService.ts         # Google Gemini integration
│   │   ├── openaiService.ts         # OpenAI integration 
│   │   ├── supabaseService.ts       # Database integration
│   │   └── intelligentAIService.ts  # AI routing system
│   ├── store/              # Zustand state stores
│   └── types/              # TypeScript type definitions
└── .env.example            # Environment variables template
```

## Building from Scratch

### 1. Setting up the Project

Begin by creating a new Vite project with React and TypeScript:

```bash
npm create vite@latest smart-crm -- --template react-ts
cd smart-crm
npm install
```

### 2. Installing Dependencies

Install the core dependencies:

```bash
npm add react@latest react-dom@latest zustand@latest recharts@latest @hello-pangea/dnd@latest lucide-react@latest fuse.js@latest
```

Install development dependencies:

```bash
npm add -D typescript@latest tailwindcss@latest postcss@latest autoprefixer@latest
```

### 3. Configuring Tailwind CSS

Initialize Tailwind CSS:

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js` with the proper content paths and theme extensions for animations, keyframes, and custom colors.

### 4. Creating Core Types

Define essential types for the application in the `src/types` directory:

- `Deal`: For sales opportunities
- `Contact`: For contacts and team members
- `PipelineColumn`: For kanban board columns
- `AIInsight`: For AI-generated intelligence

### 5. Implementing the Theme Context

Create a context for theme management with dark mode support:

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  isInitialized: boolean;
}

// ... Context implementation with localStorage persistence and system preference support
```

### 6. Building the Pipeline Component

The pipeline component is the central feature with kanban-style columns:

```tsx
// src/components/Pipeline.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AIEnhancedDealCard from './AIEnhancedDealCard';
// ... other imports

const Pipeline: React.FC = () => {
  // State management for deals, columns, filters, etc.
  // Drag and drop handlers
  // AI analysis functions
  // ...

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Controls */}
      {/* Pipeline View with drag-and-drop */}
      {/* Floating Action Panel */}
      {/* Modals for contacts, deals, etc. */}
    </div>
  );
};
```

### 7. Implementing AI Services

Set up AI service integrations to power the intelligent features:

```typescript
// src/services/intelligentAIService.ts
// This service automatically routes tasks to the best available AI model

class IntelligentAIService {
  // Define routing for different tasks
  private taskRouting = {
    'contact-analysis': {
      primary: 'gemini',
      model: 'gemma-2-9b-it',
      // ...
    },
    // ... other task types
  };

  // Methods for executing tasks with the optimal model
  // Fallback logic when primary model fails
  // ...
}
```

### 8. Building the Contacts System

Implement contact management with AI enrichment:

```tsx
// src/components/contacts/AIEnhancedContactCard.tsx
// AI-powered contact cards with scoring and enrichment capabilities

// src/components/contacts/ContactDetailView.tsx
// Detailed view with communication hub, analytics, and journey timeline
```

### 9. Creating Deal Management

Implement comprehensive deal management:

```tsx
// src/components/DealDetailView.tsx
// Detailed deal view with company profile, communication tools, and analytics

// src/components/deals/DealAnalyticsDashboard.tsx
// Advanced analytics for deal health and pipeline metrics
```

### 10. Implementing Gamification

Add team performance tracking and gamification:

```tsx
// src/contexts/GamificationContext.tsx
// Context provider for team achievements, challenges, and leaderboards

// src/components/gamification/AchievementPanel.tsx
// Visual display of team performance metrics
```

## Key Implementation Highlights

### Intelligent AI Routing System

The application uses a sophisticated AI routing system that automatically selects the most appropriate AI model for each task:

```typescript
// Example of AI routing decision-making
const modelPref = this.getOptimalModel(taskType, options.priority);

console.log(`🤖 AI Task: ${taskType} → Using ${modelPref.primary} (${modelPref.model}) - ${modelPref.reason}`);

// Try primary model first, fall back to secondary if it fails
```

### Accessible Dark Mode

The dark mode implementation follows accessibility best practices:

1. **Theme Context**: Provides theme state and methods for the entire application
2. **CSS Variables**: Uses HSL color format for easy manipulation
3. **User Preferences**: Respects `prefers-color-scheme` media query
4. **Persistence**: Saves preferences to localStorage
5. **Smooth Transitions**: Applies transitions for all theme changes
6. **Accessibility**: Proper ARIA attributes and keyboard navigation

### Advanced Drag-and-Drop Pipeline

The pipeline view leverages `@hello-pangea/dnd` for a smooth drag-and-drop experience:

```tsx
<DragDropContext onDragEnd={onDragEnd}>
  <div className="flex space-x-6 overflow-x-auto pb-6">
    {columnOrder.map((columnId) => {
      const column = filteredColumns[columnId];
      // Column implementation with draggable deals
    })}
  </div>
</DragDropContext>
```

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.