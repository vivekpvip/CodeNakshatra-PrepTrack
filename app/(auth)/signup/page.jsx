'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const exams = [
  { id: 'upsc', name: 'UPSC Civil Services' },
  { id: 'jee', name: 'JEE Main + Advanced' },
  { id: 'neet', name: 'NEET UG' },
  { id: 'cat', name: 'CAT' },
  { id: 'gate', name: 'GATE' },
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    examType: 'upsc',
    examDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          }
        }
      });

      if (error) throw error;

      // The profile is auto-created by the trigger, but we want to update the exam details right away
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            exam_type: formData.examType,
            exam_date: formData.examDate || null,
          })
          .eq('id', data.user.id);
          
        if (profileError) console.error('Error updating profile with exam info:', profileError);
      }
      
      toast.success('Account created successfully! Welcome to PrepTrack.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error('Could not initiate Google signup');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left Art Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-secondary)] to-[var(--bg-primary)] z-0" />
        <div className="absolute inset-0 gradient-mesh opacity-50 z-0" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group mb-12">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-white text-lg shadow-[0_0_20px_var(--accent-glow)]">
              P
            </div>
            <span className="text-2xl font-bold">
              Prep<span className="text-[var(--accent)]">Track</span>
            </span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Begin your journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--teal)]">success.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
            Join thousands of successful aspirants who manage their preparation with AI-powered insights and tracking.
          </p>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 glass-card p-6 rounded-2xl max-w-md">
          <div className="flex gap-1 mb-3 text-[var(--amber)]">
            ★★★★★
          </div>
          <p className="italic text-[var(--text-primary)] mb-4 leading-relaxed">
            "I used to track my syllabus on an Excel sheet. PrepTrack showed me I was only 40% done when I thought I was 70%. It literally saved my attempt."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold">Arjun S.</p>
              <p className="text-xs text-[var(--text-secondary)]">UPSC Rank 124</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Signup Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-white shadow-[0_0_20px_var(--accent-glow)]">
                P
              </div>
              <span className="text-xl font-bold">
                Prep<span className="text-[var(--accent)]">Track</span>
              </span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-center lg:text-left">Create Account</h2>
          <p className="text-[var(--text-secondary)] mb-8 text-center lg:text-left">
            Start your free PrepTrack account today.
          </p>

          <button 
            onClick={handleGoogleSignup}
            className="w-full mb-6 flex items-center justify-center gap-3 py-3 px-4 border border-[var(--border)] rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors font-medium text-[var(--text-primary)]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-[var(--border)]"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              Or sign up with email
            </span>
            <div className="flex-grow border-t border-[var(--border)]"></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[var(--text-muted)]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[var(--text-muted)]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[var(--text-muted)]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                />
              </div>
              {formData.password && (
                <div className="mt-2 flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${formData.password.length > 0 ? 'bg-[var(--red)]' : 'bg-[var(--bg-tertiary)]'} ${formData.password.length > 5 ? 'bg-[var(--amber)]' : ''} ${formData.password.length > 8 ? 'bg-[var(--green)]' : ''}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${formData.password.length > 5 ? 'bg-[var(--amber)]' : 'bg-[var(--bg-tertiary)]'} ${formData.password.length > 8 ? 'bg-[var(--green)]' : ''}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${formData.password.length > 8 ? 'bg-[var(--green)]' : 'bg-[var(--bg-tertiary)]'}`}></div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="examType">Target Exam</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen size={18} className="text-[var(--text-muted)]" />
                  </div>
                  <select
                    id="examType"
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="input pl-10 appearance-none bg-no-repeat"
                    style={{ backgroundPosition: 'right 12px center' }}
                    required
                  >
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label" htmlFor="examDate">Target Date <span className="text-[var(--text-muted)] font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-[var(--text-muted)]" />
                  </div>
                  <input
                    id="examDate"
                    name="examDate"
                    type="date"
                    value={formData.examDate}
                    onChange={handleChange}
                    className="input pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 mt-4" 
              loading={loading}
              icon={!loading && ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
