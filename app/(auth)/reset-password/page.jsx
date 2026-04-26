'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

function ResetPasswordInner() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('request'); // 'request' | 'update'

  // If user clicked the email link, Supabase delivers them here with a recovery
  // token. The browser client picks it up and emits PASSWORD_RECOVERY.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStage('update');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Reset link sent. Check your email.');
    } catch (err) {
      toast.error(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated. Sign in to continue.');
      router.push('/login');
    } catch (err) {
      toast.error(err.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] z-0" />
        <div className="absolute inset-0 gradient-mesh opacity-50 z-0" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-white text-lg shadow-[0_0_20px_var(--accent-glow)]">P</div>
            <span className="text-2xl font-bold">Prep<span className="text-[var(--accent)]">Track</span></span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Locked out?<br />Let's get you back in.
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
            Reset your password in two steps. Your progress is safe and waiting.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-6">
            <ArrowLeft size={16} /> Back to sign in
          </Link>

          <h2 className="text-3xl font-bold mb-2">
            {stage === 'request' ? 'Reset your password' : 'Set a new password'}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            {stage === 'request'
              ? "We'll email you a secure link to set a new password."
              : 'Enter and confirm your new password below.'}
          </p>

          {stage === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-5">
              <div>
                <label className="label" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[var(--text-muted)]" />
                  </div>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-10" placeholder="name@example.com" required />
                </div>
              </div>
              <Button type="submit" className="w-full py-3" loading={loading} icon={!loading && ArrowRight}>
                Send reset link
              </Button>
            </form>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="label" htmlFor="password">New password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-[var(--text-muted)]" />
                  </div>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-10" placeholder="••••••••" minLength={8} required />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="confirm">Confirm new password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-[var(--text-muted)]" />
                  </div>
                  <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input pl-10" placeholder="••••••••" minLength={8} required />
                </div>
              </div>
              <Button type="submit" className="w-full py-3" loading={loading} icon={!loading && ArrowRight}>
                Update password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
