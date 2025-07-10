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

## Complete Code Implementation

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

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'bounce-subtle': 'bounceSubtle 1s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'glass-white': 'rgba(255, 255, 255, 0.25)',
        'glass-black': 'rgba(0, 0, 0, 0.25)',
      },
      gridTemplateColumns: {
        '53': 'repeat(53, minmax(0, 1fr))',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neumorphism': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        'neumorphism-inset': 'inset 20px 20px 60px #bebebe, inset -20px -20px 60px #ffffff',
      },
    },
  },
  plugins: [],
};
```

### 4. Creating Core Types

Create types for the core business entities:

`src/types/index.ts`:
```typescript
export interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  contactId?: string;
  value: number;
  stage: 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  contactAvatar?: string;
  companyAvatar?: string;
  lastActivity?: string;
  tags?: string[];
  
  // AI and enhanced features
  isFavorite?: boolean;
  customFields?: Record<string, string | number | boolean>;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  lastEnrichment?: {
    confidence: number;
    aiProvider?: string;
    timestamp?: Date;
  };
  links?: Array<{
    title: string;
    url: string;
    type?: string;
    createdAt?: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  }>;
  nextFollowUp?: string;
  aiScore?: number;
}

export interface PipelineColumn {
  id: string;
  title: string;
  dealIds: string[];
  color: string;
}

export interface PipelineStats {
  totalValue: number;
  totalDeals: number;
  averageDealSize: number;
  conversionRate: number;
  stageValues: Record<string, number>;
}

export interface AIInsight {
  dealId: string;
  score: number;
  recommendations: string[];
  riskFactors: string[];
  nextBestActions: string[];
  probability: number;
}
```

`src/types/contact.ts`:
```typescript
export interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  industry?: string;
  avatarSrc?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  interestLevel: 'hot' | 'medium' | 'low' | 'cold';
  sources: string[];
  socialProfiles?: Record<string, string>;
  customFields?: Record<string, string | number | boolean>;
  notes?: string;
  aiScore?: number;
  lastConnected?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isFavorite?: boolean;
  lastEnrichment?: {
    confidence: number;
    aiProvider?: string;
    timestamp?: Date;
  };
  
  // Team-related fields
  isTeamMember?: boolean;
  role?: 'sales-rep' | 'manager' | 'executive' | 'admin';
  gamificationStats?: {
    totalDeals: number;
    totalRevenue: number;
    winRate: number;
    currentStreak: number;
    longestStreak: number;
    level: number;
    points: number;
    achievements: string[];
    lastAchievementDate?: Date;
    monthlyGoal?: number;
    monthlyProgress?: number;
  };
}

export interface ContactFilters {
  search: string;
  interestLevel: string;
  status: string;
  source: string;
  company: string;
  isTeamMember?: boolean;
}

export interface AIContactAnalysis {
  score: number;
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
}

export interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  startDate: Date;
  endDate: Date;
  reward: string;
  participants: string[];
  type: 'revenue' | 'deals' | 'streak' | 'conversion';
}
```

### 5. Implementing the ThemeContext

Create a powerful, accessible dark mode context:

`src/contexts/ThemeContext.tsx`:
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';

// Accessible theme context with better TypeScript support
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  isInitialized: boolean; // Track if theme is initialized to prevent flash
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or OS preference
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark' | 'auto') || 'auto';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Helper to set theme with localStorage persistence
  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'auto') {
        setIsDarkMode(mediaQuery.matches);
      } else {
        setIsDarkMode(theme === 'dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]); 

  // Apply theme to document and mark as initialized
  useEffect(() => {
    // Only apply after we have determined the theme
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', isDarkMode);
    
    // Prevent flash by marking as initialized after the theme is applied
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [theme, isDarkMode, isInitialized]);

  // Accessible toggle function
  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      theme, 
      setTheme, 
      isInitialized 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

`src/components/ui/DarkModeToggle.tsx`:
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, Laptop, ChevronDown } from 'lucide-react';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode, theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDarkMode}
        role="switch"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-300" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" aria-hidden="true" />
        )}
        <span className="sr-only">
          {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        </span>
      </button>
      
      {/* Theme options dropdown button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="ml-1 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded-md"
        aria-label="More theme options"
        aria-expanded={isMenuOpen}
        aria-controls="theme-menu"
        aria-haspopup="menu"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {/* Dropdown menu */}
      <div 
        id="theme-menu" 
        ref={menuRef}
        className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 transition-opacity duration-200 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 invisible'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="theme-menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          <button
            className={`w-full text-left px-4 py-2 text-sm ${
              theme === 'light' 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
            onClick={() => {
              setTheme('light');
              setIsMenuOpen(false);
            }}
            role="menuitem"
            tabIndex={0}
          >
            <span className="flex items-center">
              <Sun className="w-4 h-4 mr-3 text-yellow-500" aria-hidden="true" />
              Light Mode
            </span>
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm ${
              theme === 'dark' 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
            onClick={() => {
              setTheme('dark');
              setIsMenuOpen(false);
            }}
            role="menuitem"
            tabIndex={0}
          >
            <span className="flex items-center">
              <Moon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" aria-hidden="true" />
              Dark Mode
            </span>
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm ${
              theme === 'auto' 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
            onClick={() => {
              setTheme('auto');
              setIsMenuOpen(false);
            }}
            role="menuitem"
            tabIndex={0}
          >
            <span className="flex items-center">
              <Laptop className="w-4 h-4 mr-3 text-blue-500" aria-hidden="true" />
              System Preference
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 6. Setting Up CSS Variables for Dark Mode

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme CSS Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.75rem;
  
  /* Theme transition - applies to all elements */
  --theme-transition: background-color 0.3s ease, color 0.3s ease, 
                      border-color 0.3s ease, fill 0.3s ease, 
                      stroke 0.3s ease, opacity 0.3s ease;
}

/* Dark mode variables */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}

/* Apply transitions to elements for smooth theme changes */
html {
  transition: var(--theme-transition);
}

body {
  transition: var(--theme-transition);
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

/* Higher contrast elements in dark mode */
.dark button {
  --tw-ring-opacity: 0.85;
}

.dark .text-gray-600 {
  --tw-text-opacity: 0.9;
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor;
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1deg);
  }
  75% {
    transform: rotate(-1deg);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 1s infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out infinite;
}

/* Glassmorphism utilities */
.glass-light {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-medium {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-heavy {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Dark mode glassmorphism */
.dark .glass-light {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .glass-medium {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.dark .glass-heavy {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Micro-interaction utilities */
.hover-lift {
  transition: all 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Gradient backgrounds */
.bg-gradient-mesh {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Temperature gauge styling */
.temperature-cold {
  color: #3b82f6;
}

.temperature-cool {
  color: #10b981;
}

.temperature-warm {
  color: #f59e0b;
}

.temperature-hot {
  color: #ef4444;
}

/* Deal health indicators */
.health-excellent {
  background: linear-gradient(135deg, #10b981, #059669);
}

.health-good {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.health-fair {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.health-poor {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* Competitive analysis styling */
.competitive-alert {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #991b1b;
}

/* Achievement animations */
.achievement-unlock {
  animation: scale-in 0.5s ease-out, pulse-glow 2s infinite 0.5s;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after,
  html {
    animation-duration: 0.01ms !important; 
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7. Implement App.tsx

`src/App.tsx`:
```typescript
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Pipeline from './components/Pipeline';
import { DarkModeToggle } from './components/ui/DarkModeToggle';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';

function AppContent() {
  useKeyboardShortcuts(globalShortcuts);
  const { isInitialized } = useTheme();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${
      isInitialized ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart CRM</h1>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <Pipeline />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PersonalizationProvider>
        <GamificationProvider>
          <AppContent />
        </GamificationProvider>
      </PersonalizationProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 8. Intelligent AI Service Implementation

This service routes AI tasks to the appropriate model:

`src/services/intelligentAIService.ts`:
```typescript
interface AITask {
  type: 'contact-analysis' | 'email-generation' | 'company-research' | 'deal-summary' | 'next-actions' | 'insights' | 'contact-research';
  priority: 'speed' | 'quality' | 'cost';
  complexity: 'low' | 'medium' | 'high';
}

interface ModelPreference {
  primary: 'openai' | 'gemini';
  model: string;
  fallback: 'openai' | 'gemini';
  fallbackModel: string;
  reason: string;
}

class IntelligentAIService {
  // Define which AI service is best for each task type
  private taskRouting: Record<string, ModelPreference> = {
    'contact-analysis': {
      primary: 'gemini',
      model: 'gemma-2-9b-it',
      fallback: 'openai',
      fallbackModel: 'gpt-4o-mini',
      reason: 'Gemma excels at structured data analysis and scoring'
    },
    'email-generation': {
      primary: 'openai',
      model: 'gpt-4o',
      fallback: 'gemini',
      fallbackModel: 'gemini-2.0-flash-exp',
      reason: 'OpenAI superior for creative writing and personalization'
    },
    'company-research': {
      primary: 'gemini',
      model: 'gemini-1.5-pro',
      fallback: 'openai',
      fallbackModel: 'gpt-4o',
      reason: 'Gemini better for factual research and comprehensive analysis'
    },
    'deal-summary': {
      primary: 'gemini',
      model: 'gemma-2-27b-it',
      fallback: 'openai',
      fallbackModel: 'gpt-4o',
      reason: 'Gemma provides concise, actionable business summaries'
    },
    'next-actions': {
      primary: 'gemini',
      model: 'gemma-2-9b-it',
      fallback: 'openai',
      fallbackModel: 'gpt-4o-mini',
      reason: 'Gemma optimized for specific, actionable recommendations'
    },
    'insights': {
      primary: 'openai',
      model: 'gpt-4o',
      fallback: 'gemini',
      fallbackModel: 'gemini-2.0-flash-exp',
      reason: 'OpenAI better for creative insights and pattern recognition'
    },
    'contact-research': {
      primary: 'gemini',
      model: 'gemini-1.5-flash',
      fallback: 'openai',
      fallbackModel: 'gpt-4o-mini',
      reason: 'Gemini faster for contact information and strategy research'
    }
  };

  private openaiService: any;
  private geminiService: any;

  constructor(openaiService: any, geminiService: any) {
    this.openaiService = openaiService;
    this.geminiService = geminiService;
  }

  private getOptimalModel(taskType: string, priority: 'speed' | 'quality' | 'cost' = 'quality'): ModelPreference {
    const basePreference = this.taskRouting[taskType];
    
    if (!basePreference) {
      // Default fallback
      return {
        primary: 'gemini',
        model: 'gemini-2.0-flash-exp',
        fallback: 'openai',
        fallbackModel: 'gpt-4o-mini',
        reason: 'Default routing for unknown task'
      };
    }

    // Adjust based on priority
    if (priority === 'speed') {
      // Prefer faster models
      if (basePreference.primary === 'gemini') {
        return {
          ...basePreference,
          model: 'gemini-1.5-flash', // Faster Gemini model
        };
      } else {
        return {
          ...basePreference,
          model: 'gpt-4o-mini', // Faster OpenAI model
        };
      }
    } else if (priority === 'cost') {
      // Prefer lower cost models
      return {
        ...basePreference,
        primary: 'gemini', // Gemini generally more cost effective
        model: 'gemma-2-2b-it',
      };
    }

    return basePreference;
  }

  async executeTask(taskType: string, data: any, options: { priority?: 'speed' | 'quality' | 'cost' } = {}): Promise<any> {
    const modelPref = this.getOptimalModel(taskType, options.priority);
    
    console.log(`🤖 AI Task: ${taskType} → Using ${modelPref.primary} (${modelPref.model}) - ${modelPref.reason}`);

    try {
      // Try primary model first
      if (modelPref.primary === 'openai') {
        return await this.executeOpenAITask(taskType, data, modelPref.model);
      } else {
        return await this.executeGeminiTask(taskType, data, modelPref.model);
      }
    } catch (error) {
      console.warn(`❌ Primary model failed, trying fallback: ${modelPref.fallback} (${modelPref.fallbackModel})`);
      
      try {
        // Try fallback model
        if (modelPref.fallback === 'openai') {
          return await this.executeOpenAITask(taskType, data, modelPref.fallbackModel);
        } else {
          return await this.executeGeminiTask(taskType, data, modelPref.fallbackModel);
        }
      } catch (fallbackError) {
        console.error(`❌ Both AI services failed for task: ${taskType}`, fallbackError);
        return this.generateFallbackResponse(taskType, data);
      }
    }
  }

  private async executeOpenAITask(taskType: string, data: any, model: string): Promise<any> {
    switch (taskType) {
      case 'contact-analysis':
        return await this.openaiService.analyzeContact(data);
      case 'email-generation':
        return await this.openaiService.generateEmail(data.contact, data.context);
      case 'insights':
        return await this.openaiService.getInsights(data);
      case 'deal-summary':
        return await this.openaiService.generateDealSummary(data);
      case 'next-actions':
        return await this.openaiService.suggestNextActions(data);
      default:
        throw new Error(`Unsupported OpenAI task: ${taskType}`);
    }
  }

  private async executeGeminiTask(taskType: string, data: any, model: string): Promise<any> {
    switch (taskType) {
      case 'contact-analysis':
        return await this.geminiService.analyzeContact(data, model);
      case 'email-generation':
        return await this.geminiService.generateEmail(data.contact, data.context, model);
      case 'company-research':
        return await this.geminiService.researchCompany(data.companyName, data.domain, model);
      case 'contact-research':
        return await this.geminiService.findContactInfo(data.personName, data.companyName, model);
      case 'deal-summary':
        return await this.geminiService.generateDealSummary(data, model);
      case 'next-actions':
        return await this.geminiService.suggestNextActions(data, model);
      case 'insights':
        return await this.geminiService.getInsights(data, model);
      default:
        throw new Error(`Unsupported Gemini task: ${taskType}`);
    }
  }

  private generateFallbackResponse(taskType: string, data: any): any {
    // Provide basic fallback responses when all AI services fail
    switch (taskType) {
      case 'contact-analysis':
        return {
          score: 60,
          insights: ['Contact data available for analysis'],
          recommendations: ['Schedule follow-up meeting'],
          riskFactors: ['Limited information available']
        };
      case 'email-generation':
        return `Subject: Following up

Hi ${data.contact?.firstName || data.contact?.name || 'there'},

I wanted to follow up on our previous conversation about ${data.contact?.company || 'your business'}.

I believe our solution could provide value to your team. Would you be available for a brief call this week?

Best regards,
[Your Name]`;
      case 'insights':
        return ['Follow up within 24 hours', 'Research company background', 'Prepare value proposition'];
      case 'deal-summary':
        return `Deal: ${data.title || 'Untitled'} with ${data.company || 'Unknown Company'}. Value: $${data.value?.toLocaleString() || 0}. Status: ${data.stage || 'Unknown'}`;
      case 'next-actions':
        return ['Schedule follow-up call', 'Send additional information', 'Connect with decision maker'];
      default:
        return 'AI analysis temporarily unavailable. Please try again later.';
    }
  }

  // Public methods for different AI tasks
  async analyzeContact(contact: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return this.executeTask('contact-analysis', contact, { priority });
  }

  async generateEmail(contact: any, context?: string, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return this.executeTask('email-generation', { contact, context }, { priority });
  }

  async researchCompany(companyName: string, domain?: string, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return this.executeTask('company-research', { companyName, domain }, { priority });
  }

  async researchContact(personName: string, companyName?: string, priority: 'speed' | 'quality' | 'cost' = 'speed') {
    return this.executeTask('contact-research', { personName, companyName }, { priority });
  }

  async generateDealSummary(dealData: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return this.executeTask('deal-summary', dealData, { priority });
  }

  async suggestNextActions(dealData: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return this.executeTask('next-actions', dealData, { priority });
  }

  async getInsights(data: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return this.executeTask('insights', data, { priority });
  }

  // Utility method to get routing information
  getTaskRouting() {
    return Object.entries(this.taskRouting).map(([task, pref]) => ({
      task,
      primaryModel: `${pref.primary} (${pref.model})`,
      fallbackModel: `${pref.fallback} (${pref.fallbackModel})`,
      reason: pref.reason
    }));
  }
}

export { IntelligentAIService };
```

### 9. Creating a Zustand Contact Store

`src/store/contactStore.ts`:
```typescript
import { create } from 'zustand';
import { Contact } from '../types/contact';
import { mockContacts } from '../data/mockContacts';

interface ContactStore {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  selectedContact: Contact | null;
  
  // Actions
  fetchContacts: () => Promise<void>;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  selectContact: (contact: Contact | null) => void;
  
  // Team management
  addTeamMember: (contactId: string, role?: Contact['role']) => Promise<void>;
  removeTeamMember: (contactId: string) => Promise<void>;
  updateTeamMemberStats: (contactId: string, stats: Partial<Contact['gamificationStats']>) => Promise<void>;
  
  // New methods for enhanced features
  toggleFavorite: (contactId: string) => Promise<void>;
  findNewImage: (contactId: string) => Promise<string>;
  aiEnrichContact: (contactId: string, enrichmentData: any) => Promise<Contact>;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  isLoading: false,
  error: null,
  selectedContact: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ contacts: mockContacts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch contacts', isLoading: false });
    }
  },

  createContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      const newContact: Contact = {
        ...contactData,
        id: `contact-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        contacts: [...state.contacts, newContact],
        isLoading: false
      }));
      
      return newContact;
    } catch (error) {
      set({ error: 'Failed to create contact', isLoading: false });
      throw error;
    }
  },

  updateContact: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const existingContact = get().contacts.find(c => c.id === id);
      if (!existingContact) {
        throw new Error('Contact not found');
      }
      
      const updatedContact = {
        ...existingContact,
        ...updates,
        updatedAt: new Date()
      };
      
      set(state => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? updatedContact : contact
        ),
        isLoading: false
      }));
      
      return updatedContact;
    } catch (error) {
      set({ error: 'Failed to update contact', isLoading: false });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete contact', isLoading: false });
      throw error;
    }
  },

  selectContact: (contact) => {
    set({ selectedContact: contact });
  },

  // Team management functions
  addTeamMember: async (contactId, role = 'sales-rep') => {
    const { updateContact } = get();
    await updateContact(contactId, {
      isTeamMember: true,
      role,
      gamificationStats: {
        totalDeals: 0,
        totalRevenue: 0,
        winRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        points: 0,
        achievements: [],
        monthlyGoal: role === 'sales-rep' ? 50000 : role === 'manager' ? 100000 : 200000,
        monthlyProgress: 0
      }
    });
  },

  removeTeamMember: async (contactId) => {
    const { updateContact } = get();
    await updateContact(contactId, {
      isTeamMember: false,
      role: undefined,
      gamificationStats: undefined
    });
  },

  updateTeamMemberStats: async (contactId, stats) => {
    const contact = get().contacts.find(c => c.id === contactId);
    if (contact && contact.gamificationStats) {
      const { updateContact } = get();
      await updateContact(contactId, {
        gamificationStats: {
          ...contact.gamificationStats,
          ...stats
        }
      });
    }
  },
  
  // New methods for enhanced features
  toggleFavorite: async (contactId) => {
    const { updateContact } = get();
    const contact = get().contacts.find(c => c.id === contactId);
    if (contact) {
      await updateContact(contactId, {
        isFavorite: !contact.isFavorite
      });
    }
  },
  
  findNewImage: async (contactId) => {
    const { updateContact } = get();
    const contact = get().contacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    // Simulate API call to find new image
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a new avatar with a different seed
    const newSeed = Date.now().toString();
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    
    await updateContact(contactId, {
      avatarSrc: newAvatarUrl
    });
    
    return newAvatarUrl;
  },
  
  aiEnrichContact: async (contactId, enrichmentData) => {
    const { updateContact } = get();
    const contact = get().contacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    const updates: Partial<Contact> = {
      lastEnrichment: {
        confidence: enrichmentData.confidence || 75,
        aiProvider: enrichmentData.aiProvider || 'AI Assistant',
        timestamp: new Date()
      }
    };
    
    // Apply other updates from enrichment data
    if (enrichmentData.phone) updates.phone = enrichmentData.phone;
    if (enrichmentData.industry) updates.industry = enrichmentData.industry;
    if (enrichmentData.title) updates.title = enrichmentData.title;
    if (enrichmentData.notes) {
      updates.notes = contact.notes 
        ? `${contact.notes}\n\nAI Research: ${enrichmentData.notes}` 
        : `AI Research: ${enrichmentData.notes}`;
    }
    
    const updatedContact = await updateContact(contactId, updates);
    return updatedContact;
  }
}));
```

### 10. Building the Pipeline Component

The central component for the entire application:

`src/components/Pipeline.tsx`:
```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AIEnhancedDealCard from './AIEnhancedDealCard';
import DealAnalytics from './DealAnalytics';
import PipelineStats from './PipelineStats';
import { useAIResearch } from '../services/aiResearchService';
import { AchievementPanel } from './gamification/AchievementPanel';
import { ContactsModal } from './contacts/ContactsModal';
import { APIStatusIndicator } from './ui/APIStatusIndicator';
import { FloatingActionPanel } from './ui/FloatingActionPanel';
import { AdvancedFilter } from './ui/AdvancedFilter';
import AddDealModal from './deals/AddDealModal';
import DealDetail from './DealDetail';
import { mockDeals, mockColumns, columnOrder, calculateStageValues } from '../data/mockDeals';
import { Deal, PipelineColumn } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  BarChart3, 
  Users, 
  Grid3X3, 
  List, 
  Settings,
  Zap,
  Eye,
  EyeOff,
  Brain,
} from 'lucide-react';

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Record<string, Deal>>(mockDeals);
  const [columns, setColumns] = useState<Record<string, PipelineColumn>>(mockColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);
  const [enrichingDealId, setEnrichingDealId] = useState<string | null>(null);
  const aiResearch = useAIResearch();

  // Filter deals based on search and filters
  const filteredDeals = useMemo(() => {
    let filtered = { ...deals };

    // Apply search filter
    if (searchTerm) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, deal]) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply advanced filters
    activeFilters.forEach(filter => {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, deal]) => {
          switch (filter.field) {
            case 'value':
              switch (filter.operator) {
                case 'gt': return deal.value > filter.value;
                case 'lt': return deal.value < filter.value;
                case 'eq': return deal.value === filter.value;
                case 'gte': return deal.value >= filter.value;
                case 'lte': return deal.value <= filter.value;
                default: return true;
              }
            case 'probability':
              switch (filter.operator) {
                case 'gt': return deal.probability > filter.value;
                case 'lt': return deal.probability < filter.value;
                case 'eq': return deal.probability === filter.value;
                case 'gte': return deal.probability >= filter.value;
                case 'lte': return deal.probability <= filter.value;
                default: return true;
              }
            case 'stage':
              return filter.operator === 'equals' ? deal.stage === filter.value : deal.stage !== filter.value;
            case 'priority':
              return filter.operator === 'equals' ? deal.priority === filter.value : deal.priority !== filter.value;
            default:
              return true;
          }
        })
      );
    });

    return filtered;
  }, [deals, searchTerm, activeFilters]);

  // Update columns with filtered deals
  const filteredColumns = useMemo(() => {
    const newColumns = { ...columns };
    
    Object.keys(newColumns).forEach(columnId => {
      newColumns[columnId] = {
        ...newColumns[columnId],
        dealIds: newColumns[columnId].dealIds.filter(dealId => filteredDeals[dealId])
      };
    });
    
    return newColumns;
  }, [columns, filteredDeals]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      const newDealIds = Array.from(sourceColumn.dealIds);
      newDealIds.splice(source.index, 1);
      newDealIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        dealIds: newDealIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const sourceDealIds = Array.from(sourceColumn.dealIds);
      sourceDealIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        dealIds: sourceDealIds,
      };

      const destDealIds = Array.from(destColumn.dealIds);
      destDealIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        dealIds: destDealIds,
      };

      // Update deal stage
      const updatedDeal = {
        ...deals[draggableId],
        stage: destination.droppableId as Deal['stage'],
        updatedAt: new Date(),
      };

      setDeals({
        ...deals,
        [draggableId]: updatedDeal,
      });

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
  };

  const handleApplyFilters = (filters: any[]) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleAddDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDealId = `deal-${Date.now()}`;
    const newDeal: Deal = {
      ...dealData,
      id: newDealId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to deals
    setDeals(prev => ({
      ...prev,
      [newDealId]: newDeal
    }));

    // Add to appropriate column
    setColumns(prev => ({
      ...prev,
      [newDeal.stage]: {
        ...prev[newDeal.stage],
        dealIds: [...prev[newDeal.stage].dealIds, newDealId]
      }
    }));
  };

  const handleAnalyzeDeal = async (deal: Deal) => {
    setAnalyzingDealId(deal.id);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update deal with enhanced probability
      const newProbability = Math.min(deal.probability + 15, 95);
      const updatedDeal = {
        ...deal,
        probability: newProbability,
        lastEnrichment: {
          confidence: newProbability,
          aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
          timestamp: new Date()
        }
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return false;
    } finally {
      setAnalyzingDealId(null);
    }
  };

  const handleEnrichDeal = async (deal: Deal) => {
    setEnrichingDealId(deal.id);
    try {
      // Use the AI Research service to get company information
      const companyData = await aiResearch.researchCompany(deal.company);
      
      // Update the deal with enhanced data
      const updatedDeal = {
        ...deal,
        probability: Math.min(deal.probability + 20, 95),
        lastEnrichment: {
          confidence: 85,
          aiProvider: companyData.aiProvider || 'AI Research',
          timestamp: new Date()
        }
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('AI enrichment failed:', error);
      return false;
    } finally {
      setEnrichingDealId(null);
    }
  };

  const handleToggleFavorite = async (deal: Deal) => {
    const updatedDeal = {
      ...deal,
      isFavorite: !deal.isFavorite,
      updatedAt: new Date()
    };
    
    setDeals(prev => ({
      ...prev,
      [deal.id]: updatedDeal
    }));
  };

  const handleFindNewImage = async (deal: Deal) => {
    try {
      // Simulate finding a new image
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, use a different seed for the avatar
      const newSeed = Date.now().toString();
      const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${newSeed}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444&textColor=ffffff`;
      
      const updatedDeal = {
        ...deal,
        companyAvatar: newAvatar
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
    } catch (error) {
      console.error('Failed to find new image:', error);
    }
  };

  const stageValues = calculateStageValues(filteredDeals, filteredColumns);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
            
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 text-sm font-medium transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Advanced Filters */}
            <AdvancedFilter
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Analytics Toggle */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showAnalytics 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              {showAnalytics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Analytics</span>
            </button>

            {/* Achievements Toggle */}
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showAchievements 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Team</span>
            </button>

            {/* Add Deal Button */}
            <button
              onClick={() => setShowAddDealModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200"
              >
                {filter.field} {filter.operator} {filter.value}
                <button
                  onClick={() => {
                    const newFilters = activeFilters.filter((_, i) => i !== index);
                    setActiveFilters(newFilters);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Pipeline Stats */}
        <PipelineStats
          totalValue={Object.values(filteredDeals).reduce((sum, deal) => sum + deal.value, 0)}
          totalDeals={Object.keys(filteredDeals).length}
        />

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="mb-8">
            <DealAnalytics deals={filteredDeals} />
          </div>
        )}

        {/* Team Achievements */}
        {showAchievements && (
          <div className="mb-8">
            <AchievementPanel />
          </div>
        )}

        {/* Pipeline View */}
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-6 overflow-x-auto pb-6">
              {columnOrder.map((columnId) => {
                const column = filteredColumns[columnId];
                const columnDeals = column.dealIds.map((dealId) => filteredDeals[dealId]);
                const columnValue = columnDeals.reduce((sum, deal) => sum + deal.value, 0);

                return (
                  <div key={column.id} className="flex-shrink-0 w-80">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {columnDeals.length}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${(columnValue / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                      
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-4 min-h-[200px] transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg' : ''
                            }`}
                          >
                            {column.dealIds.map((dealId, index) => {
                              const deal = filteredDeals[dealId];
                              if (!deal) return null;

                              return (
                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`transition-all duration-200 ${
                                        snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                      }`}
                                    >
                                      <AIEnhancedDealCard
                                        deal={deal}
                                        onClick={() => handleDealClick(deal.id)}
                                        showAnalyzeButton={true}
                                        onAnalyze={handleAnalyzeDeal}
                                        onAIEnrich={handleEnrichDeal}
                                        isAnalyzing={analyzingDealId === deal.id}
                                        isEnriching={enrichingDealId === deal.id}
                                        onToggleFavorite={handleToggleFavorite}
                                        onFindNewImage={handleFindNewImage}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        ) : (
          // List View
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {Object.values(filteredDeals).map((deal) => (
                    <tr
                      key={deal.id}
                      onClick={() => handleDealClick(deal.id)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={deal.contactAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.contact}`}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{deal.contact}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {deal.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        ${deal.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                          deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                          deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {deal.probability}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {deal.dueDate?.toLocaleDateString() || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Floating Action Panel */}
        <FloatingActionPanel
          onNewDeal={() => setShowAddDealModal(true)}
          onAIAnalysis={() => setShowAnalytics(!showAnalytics)}
          onViewContacts={() => setShowContactsModal(true)}
          onViewAnalytics={() => setShowAnalytics(!showAnalytics)}
          onSettings={() => console.log('Settings')}
        />

        {/* Modals */}
        <ContactsModal
          isOpen={showContactsModal}
          onClose={() => setShowContactsModal(false)}
        />

        <AddDealModal
          isOpen={showAddDealModal}
          onClose={() => setShowAddDealModal(false)}
          onSave={handleAddDeal}
        />

        {selectedDealId && (
          <DealDetail
            dealId={selectedDealId}
            onClose={() => setSelectedDealId(null)}
          />
        )}
      </div>
      
      {/* AI Status Indicator */}
      <APIStatusIndicator />
    </div>
  );
};

export default Pipeline;
```

### 11. DealDetailView Component Implementation

The DealDetailView component renders a detailed modal for a specific deal:

`src/components/DealDetailView.tsx`:
```typescript
import React, { useState } from 'react';
import { Deal } from '../types';
import { Contact } from '../types/contact';
import { DealAnalyticsDashboard } from './deals/DealAnalyticsDashboard';
import { DealJourneyTimeline } from './deals/DealJourneyTimeline';
import { DealCommunicationHub } from './deals/DealCommunicationHub';
import { DealAutomationPanel } from './deals/DealAutomationPanel';
import { AIInsightsPanel } from './deals/AIInsightsPanel';
import { useAIResearch } from '../services/aiResearchService';
import { 
  X, 
  Edit, 
  DollarSign, 
  Target, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Tag, 
  FileText, 
  BarChart2, 
  Zap, 
  MessageSquare, 
  Save, 
  Brain,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  Users,
  Database,
  CheckCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';

interface DealDetailViewProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Deal>) => Promise<any>;
  contactData: Contact | null;
}

export const DealDetailView: React.FC<DealDetailViewProps> = ({ 
  deal, 
  isOpen, 
  onClose, 
  onUpdate,
  contactData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'company' | 'insights' | 'journey' | 'communication' | 'analytics' | 'automation'>('overview');
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({ ...deal });
  const [saving, setSaving] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<any>({});
  const aiResearch = useAIResearch();

  // Handle research button click
  const handleResearchCompany = async () => {
    setIsResearching(true);
    try {
      // Use AI Research service to get company data
      const data = await aiResearch.researchCompany(deal.company);
      setCompanyDetails(data);
      
      // Update deal with any relevant info
      if (data && data.industry) {
        await onUpdate(deal.id, { 
          customFields: { 
            ...deal.customFields, 
            Industry: data.industry 
          }
        });
      }
    } catch (error) {
      console.error('Company research failed:', error);
    } finally {
      setIsResearching(false);
    }
  };

  const toggleEditMode = (field: string) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (field: string) => {
    setSaving(true);
    try {
      const updates = { [field]: formData[field as keyof Deal] };
      await onUpdate(deal.id, updates);
      toggleEditMode(field);
    } catch (error) {
      console.error('Failed to update deal:', error);
    } finally {
      setSaving(false);
    }
  };

  // Format helpers
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatDate = (date?: Date): string => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex animate-scale-in shadow-2xl">
        {/* Left Side - Deal Information */}
        <div className="w-2/5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex flex-col max-h-[95vh]">
          {/* Fixed Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deal Details</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Deal Title */}
            <div className="mb-6">
              {editMode.title ? (
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Deal Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('title')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('title')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{deal.title}</h2>
                  <button
                    onClick={() => toggleEditMode('title')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Deal Value */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              {editMode.value ? (
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Deal Value</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('value')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('value')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-10 w-10 p-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg mr-4" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Deal Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(deal.value)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleEditMode('value')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Deal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Deal Stage */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 p-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Stage</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{deal.stage.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleEditMode('stage')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Probability */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 p-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Probability</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{deal.probability}%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleEditMode('probability')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Due Date */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 p-1.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-lg mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Due Date</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {deal.dueDate ? formatDate(deal.dueDate) : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleEditMode('dueDate')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Priority */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 p-1.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Priority</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{deal.priority}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleEditMode('priority')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Contact Person
              </h3>
              
              {contactData ? (
                <div className="flex items-start space-x-4">
                  {contactData.avatarSrc ? (
                    <img 
                      src={contactData.avatarSrc}
                      alt={contactData.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{contactData.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{contactData.title} at {contactData.company}</p>
                    
                    <div className="mt-3 space-y-2">
                      {contactData.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <a 
                            href={`mailto:${contactData.email}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contactData.email}
                          </a>
                        </div>
                      )}
                      
                      {contactData.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <a 
                            href={`tel:${contactData.phone}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contactData.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{deal.contact}</p>
                    <button 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      onClick={() => alert('Connect contact functionality')}
                    >
                      Connect with full contact details
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Tags
                </h3>
                <button
                  onClick={() => toggleEditMode('tags')}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              {editMode.tags ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={(formData.tags || []).join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                    placeholder="Enter tags separated by commas"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('tags')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('tags')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {deal.tags && deal.tags.length > 0 ? (
                    deal.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No tags added</p>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                  Notes
                </h3>
                <button
                  onClick={() => toggleEditMode('notes')}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              {editMode.notes ? (
                <div className="space-y-2">
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                    placeholder="Add notes about this deal..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleEditMode('notes')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('notes')}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {deal.notes || 'No notes for this deal.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Detailed Tabs */}
        <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto flex flex-col">
          {/* Tabs Navigation */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'company', label: 'Company', icon: Building2 },
                { id: 'insights', label: 'AI Insights', icon: Brain },
                { id: 'journey', label: 'Journey', icon: Target },
                { id: 'communication', label: 'Communication', icon: MessageSquare },
                { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                { id: 'automation', label: 'Automation', icon: Zap }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 flex-1 overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Deal Overview</h3>
                
                {/* Deal Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{deal.title}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      deal.stage === 'closed-lost' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {deal.stage === 'closed-won' ? 'Won' : 
                       deal.stage === 'closed-lost' ? 'Lost' : 
                       deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(deal.value)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Probability</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{deal.probability}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {deal.dueDate ? formatDate(deal.dueDate) : 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Company</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{deal.company}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{deal.contact}</p>
                    </div>
                  </div>
                  
                  {deal.lastActivity && (
                    <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Last Activity: {deal.lastActivity}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <button className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>Email Contact</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Phone className="w-5 h-5" />
                    <span>Call Contact</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Meeting</span>
                  </button>
                </div>
                
                {/* Next Steps */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Next Steps
                  </h4>
                  
                  <div className="space-y-3">
                    {deal.stage === 'qualification' && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Schedule discovery call</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get a better understanding of client requirements</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Identify decision makers</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Map all stakeholders involved in the process</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {deal.stage === 'proposal' && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Follow up on proposal</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Send a follow-up email regarding the proposal</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Schedule demo</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Show product/service value with tailored demo</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {deal.stage === 'negotiation' && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Negotiate final terms</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Address pricing and contract concerns</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Finalize contract</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get all necessary approvals for contract</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {deal.stage === 'closed-won' && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Onboard client</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Set up initial onboarding and training</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Schedule success review</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Plan 30-day review meeting</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {deal.stage === 'closed-lost' && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Loss analysis</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Document reasons for loss and learnings</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Plan follow-up outreach</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Schedule follow-up in 3-6 months</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button className="w-full mt-4 flex items-center justify-center p-2 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Step
                  </button>
                </div>
                
                {/* AI Analysis Card */}
                {deal.lastEnrichment && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                        AI Deal Analysis
                      </h4>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        deal.lastEnrichment.confidence >= 80 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}>
                        {deal.lastEnrichment.confidence}% confidence
                      </div>
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-200">
                      {deal.probability >= 80 
                        ? "This deal shows strong signs of closing. The high probability score indicates positive engagement and alignment with client needs. Focus on maintaining momentum and addressing any final concerns." 
                        : deal.probability >= 60
                        ? "This deal is progressing well but may need additional attention. Continue building value and addressing specific client needs to increase closing probability." 
                        : "This deal requires additional nurturing. Consider scheduling more discovery conversations to better understand client needs and build stronger relationships."}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 flex items-center justify-between">
                      {deal.lastEnrichment.timestamp && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last analyzed: {new Date(deal.lastEnrichment.timestamp).toLocaleDateString()}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Powered by {deal.lastEnrichment.aiProvider || 'AI Assistant'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Building2 className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                    Company Profile
                  </h3>
                  
                  <button 
                    onClick={handleResearchCompany} 
                    disabled={isResearching}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isResearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Researching...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>AI Research</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Company Profile Panel */}
                <div className="space-y-6">
                  {/* Logo and Basic Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <img 
                          src={deal.companyAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${deal.company}`}
                          alt={deal.company}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                        />
                        <button
                          onClick={() => console.log('Find company image')}
                          className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                          title="Find company image"
                        >
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate">{deal.company}</h4>
                        {companyDetails.industry && (
                          <p className="text-gray-600 dark:text-gray-400">{companyDetails.industry}</p>
                        )}
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {deal.stage === 'closed-won' ? 'Customer' : 
                            deal.stage === 'closed-lost' ? 'Lost Opportunity' : 
                            'Active Opportunity'}
                          </span>
                          {deal.priority === 'high' && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Key Company Details */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Website</p>
                        <a 
                          href={companyDetails.website || `https://${deal.company.toLowerCase().replace(/\s+/g, '')}.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          <Globe className="w-3.5 h-3.5 mr-1" />
                          {companyDetails.website || `${deal.company.toLowerCase().replace(/\s+/g, '')}.com`}
                        </a>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Headquarters</p>
                        <p className="text-sm text-gray-900 dark:text-gray-200 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-500" />
                          {companyDetails.headquarters || 'Not specified'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Employee Count</p>
                        <p className="text-sm text-gray-900 dark:text-gray-200 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1 text-gray-500" />
                          {companyDetails.employees || 'Unknown'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Annual Revenue</p>
                        <p className="text-sm text-gray-900 dark:text-gray-200 flex items-center">
                          <DollarSign className="w-3.5 h-3.5 mr-1 text-gray-500" />
                          {companyDetails.revenue || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Description */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Company Description
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                      {companyDetails.description || 
                      `${deal.company} is a company involved in the ${companyDetails.industry || 'business'} industry. No detailed description available.`}
                    </p>
                  </div>
                  
                  {/* Social Profiles & Links */}
                  {deal.socialProfiles && Object.values(deal.socialProfiles).some(Boolean) && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Online Presence
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {deal.socialProfiles.linkedin && (
                          <a
                            href={deal.socialProfiles.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <div className="p-2 bg-blue-500 rounded text-white mr-3">
                              <Linkedin className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">LinkedIn</span>
                          </a>
                        )}
                        
                        {deal.socialProfiles.website && (
                          <a
                            href={deal.socialProfiles.website}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                          >
                            <div className="p-2 bg-purple-500 rounded text-white mr-3">
                              <Globe className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Website</span>
                          </a>
                        )}
                        
                        {deal.socialProfiles.twitter && (
                          <a
                            href={deal.socialProfiles.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <div className="p-2 bg-blue-400 rounded text-white mr-3">
                              <Twitter className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Twitter</span>
                          </a>
                        )}
                        
                        {deal.socialProfiles.facebook && (
                          <a
                            href={deal.socialProfiles.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <div className="p-2 bg-blue-700 rounded text-white mr-3">
                              <Facebook className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Facebook</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Company Intelligence */}
                  {companyDetails.potentialNeeds && companyDetails.potentialNeeds.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        Company Intelligence
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Potential Needs */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Potential Needs</h5>
                          <div className="flex flex-wrap gap-2">
                            {companyDetails.potentialNeeds.map((need: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 text-sm rounded-full">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Competitors */}
                        {companyDetails.competitors && companyDetails.competitors.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Competitors</h5>
                            <div className="flex flex-wrap gap-2">
                              {companyDetails.competitors.map((competitor: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-sm rounded-full">
                                  {competitor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Key Decision Makers */}
                        {companyDetails.keyDecisionMakers && companyDetails.keyDecisionMakers.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Decision Makers</h5>
                            <div className="flex flex-wrap gap-2">
                              {companyDetails.keyDecisionMakers.map((role: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-sm rounded-full">
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {companyDetails.salesApproach && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1 flex items-center">
                            <Target className="w-3 h-3 mr-1" />
                            Recommended Sales Approach
                          </h5>
                          <p className="text-sm text-blue-700 dark:text-blue-400">{companyDetails.salesApproach}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Custom Fields */}
                  {deal.customFields && Object.keys(deal.customFields).length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                          <Database className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Custom Fields
                        </h4>
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <Plus className="w-3 h-3 inline mr-1" />
                          Add Field
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(deal.customFields).map(([key, value], index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{key}</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <AIInsightsPanel deal={deal} />
            )}
            
            {/* Journey Tab */}
            {activeTab === 'journey' && (
              <DealJourneyTimeline deal={deal} />
            )}
            
            {/* Communication Tab */}
            {activeTab === 'communication' && (
              <DealCommunicationHub deal={deal} contact={contactData} />
            )}
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <DealAnalyticsDashboard deal={deal} />
            )}
            
            {/* Automation Tab */}
            {activeTab === 'automation' && (
              <DealAutomationPanel deal={deal} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailView;
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