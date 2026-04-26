'use client';

import { useState } from 'react';
import { Bell, Phone, Clock, Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ReminderSettings({ profile, onSave }) {
  const [phone, setPhone] = useState(profile?.phone || '');
  const [reminderTime, setReminderTime] = useState(profile?.reminder_time || '07:00');
  const [reminderOn, setReminderOn] = useState(profile?.reminder_on || false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    if (reminderOn && !phone) {
      return toast.error('Add a phone number to enable SMS reminders.');
    }
    setSaving(true);
    try {
      await onSave({ phone, reminder_time: reminderTime, reminder_on: reminderOn });
      toast.success('Reminder preferences saved.');
    } catch {
      toast.error('Could not save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/reminder', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success("Test SMS sent! Check your phone.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Bell size={18} className="text-[var(--accent)]" />
        <h3 className="font-semibold">SMS Reminders</h3>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] mb-4">
        <div>
          <p className="font-medium text-sm">Daily targets via SMS</p>
          <p className="text-xs text-[var(--text-secondary)]">A morning text with what to study today.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={reminderOn}
            onChange={(e) => setReminderOn(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[var(--bg-secondary)] rounded-full peer peer-checked:bg-[var(--accent)] border border-[var(--border)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      {reminderOn && (
        <div className="space-y-4">
          <div>
            <label className="label flex items-center gap-2">
              <Phone size={14} /> Phone (with country code)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              className="input"
            />
          </div>
          <div>
            <label className="label flex items-center gap-2">
              <Clock size={14} /> Delivery time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="input"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSave} loading={saving}>
          Save preferences
        </Button>
        {reminderOn && phone && (
          <Button variant="secondary" icon={Send} onClick={handleTest} loading={testing}>
            Send test SMS
          </Button>
        )}
      </div>
    </Card>
  );
}
