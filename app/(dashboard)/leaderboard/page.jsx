'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Copy, Flame, Sparkles, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { getLevel } from '@/lib/utils';

const RANK_COLORS = ['var(--amber)', 'var(--text-secondary)', '#cd7f32'];

export default function LeaderboardPage() {
  const { user, profile } = useUser();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Friends (their profiles via the leaderboard_friends_read RLS policy)
      const { data: friendRows } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      const ids = (friendRows || []).map((r) => r.friend_id);
      let friendProfiles = [];
      if (ids.length > 0) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, exam_type, streak, longest_streak, xp_points')
          .in('id', ids);
        friendProfiles = profs || [];
      }
      setFriends(friendProfiles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const board = [...(profile ? [{ ...profile, isMe: true }] : []), ...friends].sort(
    (a, b) => (b.xp_points || 0) - (a.xp_points || 0)
  );

  const handleCopyCode = async () => {
    if (!profile?.invite_code) return;
    try {
      await navigator.clipboard.writeText(profile.invite_code);
      toast.success('Invite code copied.');
    } catch {
      toast.error('Copy failed.');
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    const slug = code.trim().toLowerCase();
    if (!slug) return;
    setAdding(true);
    try {
      const { data: target, error: lookupError } = await supabase
        .from('profiles')
        .select('id, full_name, invite_code')
        .eq('invite_code', slug)
        .single();

      if (lookupError || !target) throw new Error('No user with that invite code.');
      if (target.id === user.id) throw new Error("That's your own code.");

      const { error: insertError } = await supabase
        .from('friends')
        .insert({ user_id: user.id, friend_id: target.id });
      if (insertError && !insertError.message.includes('duplicate')) throw insertError;

      // Add the reverse edge as well so both see each other (best-effort).
      await supabase
        .from('friends')
        .insert({ user_id: target.id, friend_id: user.id })
        .then();

      toast.success(`Connected with ${target.full_name || 'a fellow aspirant'}!`);
      setCode('');
      setOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.message || 'Could not add friend.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (friendId) => {
    if (!confirm('Remove this friend from your leaderboard?')) return;
    await supabase.from('friends').delete().eq('user_id', user.id).eq('friend_id', friendId);
    refresh();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Trophy className="text-[var(--amber)]" /> Leaderboard
          </h1>
          <p className="text-[var(--text-secondary)]">
            Friendly competition with your study circle.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Copy} onClick={handleCopyCode}>
            My code: <span className="font-mono">{profile?.invite_code || '—'}</span>
          </Button>
          <Button icon={UserPlus} onClick={() => setOpen(true)}>
            Add a friend
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : board.length === 0 ? (
        <Card hover={false} className="text-center py-12">
          <Trophy className="mx-auto text-[var(--text-muted)] mb-4" size={40} />
          <h3 className="text-lg font-semibold mb-1">No leaderboard yet</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
            Share your invite code with study buddies. The leaderboard ranks everyone by XP earned.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {board.map((person, idx) => {
            const level = getLevel(person.xp_points || 0);
            return (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card
                  hover={false}
                  className={`!p-4 flex items-center gap-4 ${person.isMe ? 'border-[var(--accent)] glow-accent' : ''}`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold font-mono shrink-0"
                    style={{
                      background: idx < 3 ? `${RANK_COLORS[idx]}20` : 'var(--bg-tertiary)',
                      color: idx < 3 ? RANK_COLORS[idx] : 'var(--text-secondary)',
                      border: `1px solid ${idx < 3 ? RANK_COLORS[idx] : 'var(--border)'}`,
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] flex items-center justify-center font-bold shrink-0">
                    {person.full_name?.[0] || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">
                        {person.full_name || 'Aspirant'}
                      </span>
                      {person.isMe && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent)]">
                          you
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        {(person.exam_type || 'upsc').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-3">
                      <span style={{ color: level.color }}>
                        {level.icon} {level.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame size={10} className="text-[var(--amber)]" />
                        {person.streak || 0}d
                      </span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-lg flex items-center gap-1.5 justify-end" style={{ color: level.color }}>
                      <Sparkles size={14} />
                      {person.xp_points || 0}
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">XP</p>
                  </div>

                  {!person.isMe && (
                    <button
                      onClick={() => handleRemove(person.id)}
                      className="ml-2 p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--red)] hover:bg-[var(--red-glow)] transition-colors"
                      aria-label="Remove friend"
                    >
                      <X size={14} />
                    </button>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add a friend" size="sm">
        <form onSubmit={handleAddFriend} className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Ask your friend for their invite code (visible above their leaderboard).
          </p>
          <div>
            <label className="label">Invite code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 7a3b9c1f"
              className="input font-mono"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" loading={adding} icon={Plus}>
              Add friend
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
