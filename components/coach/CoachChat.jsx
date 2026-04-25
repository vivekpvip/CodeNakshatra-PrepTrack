'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function CoachChat({ messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)] shadow-lg relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--teal)] z-10" />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-tertiary)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] border border-[rgba(108,99,255,0.3)] flex items-center justify-center text-[var(--accent)]">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Claude AI Coach</h3>
            <p className="text-xs text-[var(--teal)] flex items-center gap-1">
              <Sparkles size={10} /> Online and ready
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--bg-primary)]">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] mb-6 shadow-[0_0_30px_var(--accent-glow)]">
                <Bot size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2">Hello! I'm your AI Coach.</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-8">
                I have access to your syllabus progress, test scores, and daily targets. How can I help you prepare today?
              </p>
              
              <div className="grid grid-cols-1 gap-3 w-full">
                {['What should I focus on today?', 'Analyze my weak areas based on recent tests.', 'Help me create a revision schedule for History.'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(suggestion); }}
                    className="p-3 text-sm text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)] rounded-lg transition-all"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full shrink-0 flex items-center justify-center",
                msg.role === 'user' 
                  ? "bg-[var(--bg-tertiary)] border border-[var(--border)]" 
                  : "bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent-glow)]"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={cn(
                "rounded-2xl px-5 py-3.5 text-sm leading-relaxed overflow-hidden",
                msg.role === 'user'
                  ? "bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
                  : "bg-[rgba(108,99,255,0.05)] border border-[rgba(108,99,255,0.2)] text-[var(--text-primary)] markdown-content"
              )}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent-glow)] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl px-5 py-3.5 bg-[rgba(108,99,255,0.05)] border border-[rgba(108,99,255,0.2)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-tertiary)]">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach anything..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-full py-3 pl-5 pr-14 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style jsx global>{`
        .markdown-content p { margin-bottom: 0.75em; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.75em; }
        .markdown-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.75em; }
        .markdown-content li { margin-bottom: 0.25em; }
        .markdown-content strong { color: var(--accent); font-weight: 600; }
        .markdown-content h3 { font-size: 1.1em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; color: var(--text-primary); }
      `}</style>
    </div>
  );
}
