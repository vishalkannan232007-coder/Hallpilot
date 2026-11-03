import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotice(null);

    // Simulated auth delay for Phase 2 UI shell
    setTimeout(() => {
      setIsLoading(false);
      setNotice('Phase 2 UI Shell: Full authentication and session management will be wired to your Supabase tenant credentials in Phase 3.');
    }, 700);
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 subtle-grid">
      <div className="w-full max-w-md space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Public Search
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-card">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-sm">
              <ShieldCheck className="h-7 w-7 text-brand-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              College Admin Portal
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to manage exam sessions, upload seating files, and publish arrangements.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coe@apex-institute.edu"
                  className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {notice && (
              <div className="rounded-xl bg-brand-50 border border-brand-200 p-3.5 text-xs text-brand-900 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-brand-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{notice}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold rounded-xl py-3 bg-brand-900 hover:bg-brand-950 text-white shadow-md"
            >
              Sign In to Exam Cell
            </Button>
          </form>

          {/* Institutional Security Notice */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Protected by Multi-Tenant Row Level Security
            </p>
            <p className="text-[11px] text-slate-400">
              Only authorized examination coordinators can access seating upload panels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
