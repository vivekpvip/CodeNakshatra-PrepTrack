'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Video, FileText, Globe, BookOpen, Plus, Bookmark, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/utils';

const CURATED = [
  { title: 'Mrunal Patel — Economy', type: 'youtube', exam: 'upsc', url: 'https://www.youtube.com/@mrunal.official', description: 'Comprehensive Indian Economy lectures for UPSC CSE.' },
  { title: 'Vision IAS Monthly Current Affairs', type: 'web', exam: 'upsc', url: 'https://www.visionias.in/resources/material/monthly_current_affairs.php', description: 'Monthly compilations for GS papers.' },
  { title: 'Physics Wallah JEE Mechanics', type: 'youtube', exam: 'jee', url: 'https://www.youtube.com/@PhysicsWallah', description: 'Newtonian mechanics & kinematics deep-dives.' },
  { title: 'NCERT Biology Class 11 & 12', type: 'pdf', exam: 'neet', url: 'https://ncert.nic.in/textbook.php', description: 'The absolute foundation for NEET UG Biology.' },
  { title: 'Aman Dhattarwal — JEE Strategy', type: 'youtube', exam: 'jee', url: 'https://www.youtube.com/@AmanDhattarwal', description: 'Mindset & study strategy from a JEE topper.' },
  { title: 'Aakash NEET Mock Tests', type: 'web', exam: 'neet', url: 'https://www.aakash.ac.in/online-test', description: 'Free + premium NEET mock tests.' },
];

export default function ResourcesPage() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', type: 'web', notes: '' });

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setBookmarks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getIcon = (type) => {
    if (type === 'youtube') return <Video size={18} className="text-[#FF3D3D]" />;
    if (type === 'pdf') return <FileText size={18} className="text-[var(--red)]" />;
    if (type === 'book') return <BookOpen size={18} className="text-[var(--amber)]" />;
    return <Globe size={18} className="text-[var(--teal)]" />;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.url) return toast.error('Title and URL are required.');
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          title: form.title,
          url: form.url,
          type: form.type,
          notes: form.notes || null,
        })
        .select()
        .single();
      if (error) throw error;
      setBookmarks((prev) => [data, ...prev]);
      setForm({ title: '', url: '', type: 'web', notes: '' });
      setOpen(false);
      toast.success('Resource saved.');
    } catch (err) {
      toast.error(err.message || 'Could not save resource.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this bookmark?')) return;
    await supabase.from('bookmarks').delete().eq('id', id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Resources</h1>
          <p className="text-[var(--text-secondary)]">
            Curated picks plus your personal bookmarks.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setOpen(true)}>
          Save a resource
        </Button>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
          <Bookmark size={14} /> Your saved bookmarks
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : bookmarks.length === 0 ? (
          <Card hover={false} className="text-center py-10 border border-dashed">
            <Bookmark className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
            <p className="text-sm text-[var(--text-secondary)]">No bookmarks yet.</p>
            <p className="text-xs text-[var(--text-muted)]">
              Save links to videos, PDFs, or notes you'll come back to.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {bookmarks.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card hover className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
                        {getIcon(b.type)}
                      </div>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="opacity-60 hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--red)] p-1 rounded"
                        aria-label="Delete bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="font-semibold mb-1 truncate" title={b.title}>{b.title}</h3>
                    {b.notes && (
                      <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
                        {b.notes}
                      </p>
                    )}
                    <p className="text-[10px] text-[var(--text-muted)] font-mono mt-auto mb-3">
                      Saved {timeAgo(b.created_at)}
                    </p>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] text-sm font-medium rounded-lg transition-colors border border-[var(--border)]"
                    >
                      Open <ExternalLink size={12} />
                    </a>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
          Curated by toppers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED.map((res, i) => (
            <Card key={i} className="flex flex-col h-full" hover>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
                  {getIcon(res.type)}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                  {res.exam}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{res.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1">{res.description}</p>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] text-sm font-medium rounded-lg transition-colors border border-[var(--border)]"
              >
                Open Resource <ExternalLink size={14} />
              </a>
            </Card>
          ))}
        </div>
      </section>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Save a resource" size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. NCERT Class 11 Chemistry"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label">URL</label>
            <input
              type="url"
              className="input"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="web">Web page</option>
              <option value="youtube">YouTube</option>
              <option value="pdf">PDF</option>
              <option value="book">Book</option>
            </select>
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              className="input"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Why this resource is worth coming back to."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" icon={Bookmark}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
