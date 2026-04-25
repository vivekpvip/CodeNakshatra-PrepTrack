'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestEntryForm({ isOpen, onClose, onSave, topics }) {
  const [formData, setFormData] = useState({
    test_name: '',
    score: '',
    total: '',
    difficulty: 'medium',
    taken_at: new Date().toISOString().split('T')[0],
    notes: '',
    topic_tags: [],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Suggest tags based on input
  const suggestedTags = tagInput 
    ? topics.filter(t => t.name.toLowerCase().includes(tagInput.toLowerCase())).slice(0, 5)
    : [];

  const addTag = (tagName) => {
    if (tagName && !formData.topic_tags.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        topic_tags: [...prev.topic_tags, tagName]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      topic_tags: prev.topic_tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.score) > Number(formData.total)) {
      toast.error('Score cannot be greater than total marks');
      return;
    }
    
    setLoading(true);
    try {
      await onSave({
        ...formData,
        score: Number(formData.score),
        total: Number(formData.total),
      });
      toast.success('Test result saved!');
      // Reset form
      setFormData({
        test_name: '',
        score: '',
        total: '',
        difficulty: 'medium',
        taken_at: new Date().toISOString().split('T')[0],
        notes: '',
        topic_tags: [],
      });
      onClose();
    } catch (err) {
      toast.error('Failed to save test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Mock Test" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Test Name</label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g. Vision IAS Abhyaas Test 1"
            value={formData.test_name}
            onChange={e => setFormData(prev => ({ ...prev, test_name: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">Score</label>
            <input
              type="number"
              step="0.1"
              required
              className="input text-lg font-mono"
              placeholder="0"
              value={formData.score}
              onChange={e => setFormData(prev => ({ ...prev, score: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Total Marks</label>
            <input
              type="number"
              step="0.1"
              required
              className="input text-lg font-mono"
              placeholder="200"
              value={formData.total}
              onChange={e => setFormData(prev => ({ ...prev, total: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Date Taken</label>
            <input
              type="date"
              required
              className="input"
              max={new Date().toISOString().split('T')[0]}
              value={formData.taken_at}
              onChange={e => setFormData(prev => ({ ...prev, taken_at: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select
              className="input"
              value={formData.difficulty}
              onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Topics Covered (Tags)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.topic_tags.map(tag => (
              <span key={tag} className="bg-[var(--accent-muted)] text-[var(--accent)] px-2 py-1 rounded text-xs flex items-center gap-1 border border-[rgba(108,99,255,0.2)]">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-[var(--text-primary)]">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              className="input text-sm"
              placeholder="Type to search topics and press Enter..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (tagInput.trim()) addTag(tagInput.trim());
                }
              }}
            />
            {suggestedTags.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-md shadow-lg max-h-40 overflow-y-auto">
                {suggestedTags.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                    onClick={() => addTag(t.name)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="label">Notes / Mistakes Analysis</label>
          <textarea
            className="input min-h-[100px]"
            placeholder="What went wrong? E.g., Silly mistakes in Modern History, guessed too many Polity questions..."
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border)]">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" loading={loading} icon={Plus}>Save Result</Button>
        </div>
      </form>
    </Modal>
  );
}
