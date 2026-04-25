'use client';

import { useState, useCallback } from 'react';

export function useCoach() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState(null);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const generateWeeklyPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/weekly-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to generate plan');
      
      const plan = await response.json();
      setWeeklyPlan(plan);
      return plan;
    } catch (err) {
      console.error('Error generating plan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    weeklyPlan,
    sendMessage,
    generateWeeklyPlan,
    clearMessages,
  };
}
