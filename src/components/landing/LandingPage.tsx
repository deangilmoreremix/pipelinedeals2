import React from 'react';
import { 
  Rocket, 
  Users, 
  BarChart3, 
  Brain, 
  Target, 
  Award, 
  ArrowRight, 
  Play,
  Zap,
  Shield
} from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
  onNavigate?: (route: string) => void;
  theme?: 'light' | 'dark';
  userName?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onLaunch, 
  onNavigate, 
  theme = 'light',
  userName 
}) => {
  const isDark = theme === 'dark';

  const features = [
    {
      icon: Target,
      title: 'Smart Pipeline',
      description: 'Drag-and-drop Kanban with AI-powered deal scoring, auto-staging, and real-time collaboration.',
      action: () => onNavigate?.('/pipeline')
    },
    {
      icon: Brain,
      title: 'AI Intelligence',
      description: 'Gemini & OpenAI powered enrichment, research, insights, automation, and predictive analytics.',
      action: () => onNavigate?.('/ai-insights')
    },
    {
      icon: Users,
      title: 'Contacts & CRM',
      description: '360° contact profiles, journey timelines, communication hub, and team gamification.',
      action: () => onNavigate?.('/contacts')
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Revenue forecasting, win/loss analysis, performance dashboards, and custom reports.',
      action: () => onNavigate?.('/analytics')
    },
    {
      icon: Award,
      title: 'Gamification',
      description: 'Achievements, challenges, leaderboards, and team engagement to boost sales productivity.',
      action: () => onNavigate?.('/achievements')
    },
    {
      icon: Zap,
      title: 'Automation Hub',
      description: 'Intelligent workflows, deal automation, smart follow-ups, and AI-driven actions.',
      action: () => onNavigate?.('/automation')
    }
  ];

  const stats = [
    { value: '47%', label: 'Faster Deal Closure' },
    { value: '3.2x', label: 'AI Conversion Lift' },
    { value: '12k+', label: 'Deals Managed' },
    { value: '94%', label: 'User Satisfaction' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900'} transition-colors duration-500`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 mb-6">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Enterprise Grade • AI-Native CRM</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Smart CRM
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10">
            The complete AI-powered sales platform. Pipeline, intelligence, automation, and team performance — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onLaunch}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-lg shadow-xl hover:shadow-2xl active:scale-[0.985] transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              Enter Full App
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => onNavigate?.('/pipeline')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-800/60 font-medium transition-all"
            >
              Explore Pipeline
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            {userName ? `Welcome back, ${userName.split(' ')[0]}. ` : ''}No signup required in demo mode.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-semibold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-[2px] mb-3">COMPLETE PLATFORM</div>
          <h2 className="text-4xl font-semibold tracking-tight">Everything you need to close more deals</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                onClick={feature.action}
                className="group p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex-1 leading-relaxed">{feature.description}</p>
                <div className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Open feature <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 dark:bg-black py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Rocket className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h2 className="text-white text-4xl font-semibold mb-4 tracking-tight">Ready to transform your sales process?</h2>
          <p className="text-gray-400 mb-8 text-lg">Launch the full Smart CRM experience with live data, AI tools, and interactive pipeline.</p>
          
          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-3 px-12 py-4 bg-white text-gray-950 rounded-2xl font-semibold text-lg hover:bg-gray-100 active:scale-[0.985] transition"
          >
            Launch Smart CRM <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="mt-6 text-xs text-gray-500">Hosted via Module Federation • Works inside SmartCRM host and standalone</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
