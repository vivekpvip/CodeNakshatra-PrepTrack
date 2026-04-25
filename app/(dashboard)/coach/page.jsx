'use client';

import { useState } from 'react';
import { useCoach } from '@/hooks/useCoach';
import CoachChat from '@/components/coach/CoachChat';
import WeeklyPlanCard from '@/components/coach/WeeklyPlanCard';
import Button from '@/components/ui/Button';
import { Sparkles, Calendar, TrendingDown, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CoachPage() {
  const { messages, isLoading, weeklyPlan, sendMessage, generateWeeklyPlan, clearMessages } = useCoach();
  const [activeTab, setActiveTab] = useState('chat'); // chat, plan

  const handleGeneratePlan = async () => {
    setActiveTab('plan');
    try {
      await generateWeeklyPlan();
      toast.success('Weekly plan generated successfully!');
    } catch (err) {
      toast.error('Failed to generate plan. Please try again.');
    }
  };

  const handleQuickPrompt = (prompt) => {
    setActiveTab('chat');
    sendMessage(prompt);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col pb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI Study Coach</h1>
          <p className="text-[var(--text-secondary)]">
            Powered by Claude 3.5 Sonnet. Your personal mentor.
          </p>
        </div>
        <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border)] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'chat' 
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'plan' 
                ? 'bg-[var(--bg-card)] text-[var(--teal)] shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Weekly Plan
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Sidebar Actions */}
        <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
          <Button 
            className="w-full justify-start shadow-[0_0_20px_var(--teal-glow)]" 
            variant="teal" 
            icon={Calendar}
            onClick={handleGeneratePlan}
            loading={activeTab === 'plan' && isLoading}
          >
            Generate Weekly Plan
          </Button>

          <Button 
            className="w-full justify-start border-[var(--border)]" 
            variant="secondary" 
            icon={TrendingDown}
            onClick={() => handleQuickPrompt('Based on my test history, what are my weak areas and how should I improve them?')}
            disabled={isLoading}
          >
            Analyze Weaknesses
          </Button>

          <Button 
            className="w-full justify-start border-[var(--border)]" 
            variant="secondary" 
            icon={Sparkles}
            onClick={() => handleQuickPrompt('What should I focus on studying today to maximize my progress?')}
            disabled={isLoading}
          >
            Suggest Today's Focus
          </Button>

          <div className="my-2 border-t border-[var(--border)]" />

          <Button 
            className="w-full justify-start text-[var(--text-muted)] hover:text-[var(--text-primary)]" 
            variant="ghost" 
            icon={RefreshCcw}
            onClick={clearMessages}
            disabled={isLoading || messages.length === 0}
          >
            Clear Conversation
          </Button>

          <div className="mt-auto pt-6 hidden lg:block">
            <div className="p-4 rounded-xl bg-[rgba(108,99,255,0.05)] border border-[rgba(108,99,255,0.1)]">
              <h4 className="text-xs font-bold text-[var(--accent)] uppercase mb-2 flex items-center gap-1">
                <Sparkles size={12} /> Pro Tip
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The Coach has full access to your syllabus completion, test history, and daily targets. Ask specific questions for better results!
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 min-h-[400px]">
          {activeTab === 'chat' ? (
            <CoachChat 
              messages={messages} 
              onSendMessage={sendMessage} 
              isLoading={isLoading} 
            />
          ) : (
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
              {weeklyPlan ? (
                <WeeklyPlanCard plan={weeklyPlan} onAddAllToPlanner={() => {}} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-tertiary)]">
                  <Calendar size={48} className="text-[var(--text-muted)] mb-4" />
                  <h3 className="text-lg font-bold mb-2">No Plan Generated</h3>
                  <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
                    Generate an AI-powered weekly study schedule based on your progress and timeline.
                  </p>
                  <Button onClick={handleGeneratePlan} icon={Sparkles} loading={isLoading}>
                    Generate Plan Now
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
