'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ReminderSettings from '@/components/planner/ReminderSettings';
import { User, Bell, Shield, BookOpen, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, updateProfile, signOut, loading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
  });
  const [examForm, setExamForm] = useState({
    exam_type: profile?.exam_type || 'upsc',
    exam_date: profile?.exam_date || '',
  });
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated.');
    } catch {
      toast.error('Could not save profile.');
    }
  };

  const handleExamSave = async () => {
    try {
      await updateProfile({
        exam_type: examForm.exam_type,
        exam_date: examForm.exam_date || null,
      });
      toast.success('Exam details updated.');
    } catch {
      toast.error('Could not save exam details.');
    }
  };

  const handleResetSyllabus = async () => {
    if (!confirm('Reset ALL syllabus progress? This cannot be undone.')) return;
    try {
      await supabase.from('topic_progress').delete().eq('user_id', user.id);
      toast.success('Syllabus progress cleared.');
    } catch {
      toast.error('Could not reset progress.');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== 'DELETE') {
      return toast.error('Type DELETE to confirm.');
    }
    try {
      // Profile + dependent rows cascade-delete via the `on delete cascade` FKs.
      await supabase.from('profiles').delete().eq('id', user.id);
      await signOut();
      toast.success('Account data deleted. Sign in again to start over.');
      router.push('/');
    } catch (err) {
      toast.error(err.message || 'Could not delete account.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-[var(--text-secondary)]">Manage your account and preferences.</p>
      </div>

      <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border)] overflow-x-auto scrollbar-hide">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'exam', label: 'Exam Details', icon: BookOpen },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'account', label: 'Account', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <Card hover={false}>
          <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2 mb-6">
            Profile information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Email Address (read-only)</label>
              <input type="email" value={user?.email || ''} className="input opacity-50" readOnly />
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleProfileSave} icon={Save}>Save profile</Button>
          </div>
        </Card>
      )}

      {activeTab === 'exam' && (
        <Card hover={false}>
          <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2 mb-6">
            Exam target
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Exam type</label>
              <select
                value={examForm.exam_type}
                onChange={(e) => setExamForm({ ...examForm, exam_type: e.target.value })}
                className="input"
              >
                <option value="upsc">UPSC Civil Services</option>
                <option value="jee">JEE Main + Advanced</option>
                <option value="neet">NEET UG</option>
                <option value="cat">CAT</option>
                <option value="gate">GATE</option>
              </select>
            </div>
            <div>
              <label className="label">Target date</label>
              <input
                type="date"
                value={examForm.exam_date || ''}
                onChange={(e) => setExamForm({ ...examForm, exam_date: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Button onClick={handleExamSave} icon={Save}>Update exam</Button>
            <Button variant="secondary" onClick={handleResetSyllabus}>Reset syllabus progress</Button>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <ReminderSettings profile={profile} onSave={updateProfile} />
      )}

      {activeTab === 'account' && (
        <Card hover={false}>
          <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2 mb-6 text-[var(--red)] flex items-center gap-2">
            <AlertTriangle size={18} /> Danger zone
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Deleting your account removes all profile data, syllabus progress, tests, and chat
            history. This cannot be undone.
          </p>
          <label className="label">Type <span className="font-mono text-[var(--red)]">DELETE</span> to confirm</label>
          <input
            type="text"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            className="input font-mono mb-4 max-w-xs"
            placeholder="DELETE"
          />
          <Button variant="danger" onClick={handleDeleteAccount} disabled={confirmDelete !== 'DELETE'}>
            Delete account
          </Button>
        </Card>
      )}
    </div>
  );
}
