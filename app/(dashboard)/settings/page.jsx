'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Bell, Shield, BookOpen, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, profile, updateProfile, loading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    reminder_time: profile?.reminder_time || '07:00',
    reminder_on: profile?.reminder_on || false,
    exam_type: profile?.exam_type || 'upsc',
    exam_date: profile?.exam_date || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <div>Loading...</div>;

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
        ].map(tab => (
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

      <Card>
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">Email Address (Read-only)</label>
                <input type="email" value={user?.email || ''} className="input opacity-50" readOnly />
              </div>
            </div>
            <Button onClick={handleSave} icon={Save}>Save Profile</Button>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2">Exam Target</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Exam Type</label>
                <select name="exam_type" value={formData.exam_type} onChange={handleChange} className="input appearance-none">
                  <option value="upsc">UPSC Civil Services</option>
                  <option value="jee">JEE Main + Advanced</option>
                  <option value="neet">NEET UG</option>
                  <option value="cat">CAT</option>
                  <option value="gate">GATE</option>
                </select>
              </div>
              <div>
                <label className="label">Target Date</label>
                <input type="date" name="exam_date" value={formData.exam_date} onChange={handleChange} className="input" />
              </div>
            </div>
            <Button onClick={handleSave} icon={Save}>Update Exam</Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2">Daily Reminders (SMS)</h3>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Daily Study Plan SMS</p>
                <p className="text-sm text-[var(--text-secondary)]">Get a text message with your targets every morning.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="reminder_on" checked={formData.reminder_on} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)] border border-[var(--border)]"></div>
              </label>
            </div>
            
            {formData.reminder_on && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-[var(--border-light)] rounded-lg">
                <div>
                  <label className="label">Phone Number (with country code)</label>
                  <input type="tel" name="phone" placeholder="+919876543210" value={formData.phone} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Delivery Time</label>
                  <input type="time" name="reminder_time" value={formData.reminder_time} onChange={handleChange} className="input" />
                </div>
              </div>
            )}
            <Button onClick={handleSave} icon={Save}>Save Preferences</Button>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b border-[var(--border)] pb-2 text-[var(--red)]">Danger Zone</h3>
            <p className="text-sm text-[var(--text-secondary)]">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="danger" onClick={() => toast.error('Account deletion disabled in demo.')}>
              Delete Account
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
