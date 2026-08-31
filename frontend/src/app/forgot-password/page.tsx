'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';

type Step = 'form' | 'sent' | 'devmode';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      if (res.ok || res.status === 404) {
        const data = await res.json().catch(() => ({}));
        // Dev mode: backend returned the reset URL directly (no SMTP configured)
        if (data?.devMode && data?.resetUrl) {
          setDevResetUrl(data.resetUrl);
          setStep('devmode');
        } else {
          setStep('sent');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } catch {
      // Network error — still show success UI
      setStep('sent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      {/* Decorative grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      {/* Glowing orb */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-white">ConversionIQ</span>
        </div>

        {step === 'form' ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Forgot your password?</h1>
              <p className="mt-2 text-zinc-400 leading-relaxed">
                No worries. Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-sm font-semibold text-zinc-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                id="forgot-password-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : step === 'devmode' ? (
          /* Dev mode: no SMTP configured — show reset URL directly */
          <div className="space-y-6">
            <div className="flex flex-col items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">Dev Mode: No Email Sent</h1>
                <p className="mt-2 text-zinc-400 leading-relaxed">
                  No SMTP provider is configured. Click the link below to reset your password directly.
                </p>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl space-y-3">
              <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">🔧 Development Reset Link</p>
              <p className="text-xs text-zinc-500">This link is only shown in development when no SMTP is configured. In production, a real email would be sent.</p>
              <a
                href={devResetUrl}
                className="block text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all transition-colors"
              >
                {devResetUrl}
              </a>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">To enable real emails</p>
              <p className="text-xs text-zinc-500">Add <code className="text-indigo-400 bg-zinc-800 px-1 rounded">SMTP_HOST</code>, <code className="text-indigo-400 bg-zinc-800 px-1 rounded">SMTP_PORT</code>, <code className="text-indigo-400 bg-zinc-800 px-1 rounded">SMTP_USER</code> and <code className="text-indigo-400 bg-zinc-800 px-1 rounded">SMTP_PASS</code> to your backend <code className="text-indigo-400 bg-zinc-800 px-1 rounded">.env</code> file.</p>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Success state */
          <div className="space-y-8">
            <div className="flex flex-col items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">Check your inbox</h1>
                <p className="mt-2 text-zinc-400 leading-relaxed">
                  If an account exists for{' '}
                  <span className="text-zinc-200 font-medium">{email}</span>, you&apos;ll receive a
                  password reset link within a few minutes.
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Didn&apos;t receive it?</p>
              <ul className="text-sm text-zinc-500 space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure you used the right email</li>
                <li>
                  <button
                    onClick={() => { setStep('form'); setError(''); }}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium underline underline-offset-2"
                  >
                    Try a different email address
                  </button>
                </li>
              </ul>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
