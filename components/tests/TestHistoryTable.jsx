'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestHistoryTable({ tests, onDelete }) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!tests || tests.length === 0) {
    return (
      <Card className="text-center py-12 border-dashed">
        <FileText className="mx-auto text-[var(--text-muted)] mb-4" size={32} />
        <h3 className="text-lg font-medium mb-2">No tests logged yet</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          Log your mock tests to track your accuracy and identify weak areas over time.
        </p>
      </Card>
    );
  }

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'hard': return 'text-[var(--red)] bg-[var(--red-glow)]';
      case 'easy': return 'text-[var(--green)] bg-[var(--green-glow)]';
      default: return 'text-[var(--amber)] bg-[var(--amber-glow)]';
    }
  };

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Test Name</th>
              <th className="px-6 py-4 font-medium">Score</th>
              <th className="px-6 py-4 font-medium">%</th>
              <th className="px-6 py-4 font-medium">Difficulty</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {tests.map(test => {
              const isExpanded = expandedRow === test.id;
              const percent = Number(test.percentage);
              
              return (
                <React.Fragment key={test.id}>
                  <tr className="hover:bg-[rgba(255,255,255,0.01)] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)]">
                      {format(new Date(test.taken_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)] max-w-[200px] truncate">
                      {test.test_name}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span className="font-semibold">{test.score}</span>
                      <span className="text-[var(--text-muted)]">/{test.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${
                          percent >= 80 ? 'text-[var(--green)]' : 
                          percent >= 60 ? 'text-[var(--amber)]' : 'text-[var(--red)]'
                        }`}>
                          {percent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setExpandedRow(isExpanded ? null : test.id)}
                          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)] rounded transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Delete this test result?')) {
                              onDelete(test.id);
                            }
                          }}
                          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--red)] hover:bg-[var(--red-glow)] rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0 border-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[var(--bg-tertiary)] border-b border-[var(--border)] overflow-hidden"
                          >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                              {test.topic_tags && test.topic_tags.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Topics Covered</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {test.topic_tags.map((tag, i) => (
                                      <span key={i} className="px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded text-xs text-[var(--text-secondary)]">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Analysis Notes</h4>
                                {test.notes ? (
                                  <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] whitespace-pre-wrap">
                                    {test.notes}
                                  </p>
                                ) : (
                                  <p className="text-sm text-[var(--text-muted)] italic">No analysis notes provided.</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
