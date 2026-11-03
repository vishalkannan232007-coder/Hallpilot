import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  ShieldCheck, 
  Clock, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet 
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-900 to-navy-950 text-white pt-20 pb-28 subtle-grid">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(61,131,185,0.18),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-800/60 px-4 py-1.5 text-xs font-semibold text-brand-200 backdrop-blur">
              <Compass className="h-4 w-4 text-brand-300" />
              <span>Next-Generation Exam Hall Logistics</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              Your Exam Hall, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-sky-200 to-brand-100">
                One Search Away.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Eliminate paper notice crowds on exam day morning. HallPilot provides instantaneous, secure, and privacy-protected seating lookups for college students.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/lookup">
                <Button size="lg" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-400 text-white font-semibold shadow-lg shadow-brand-500/20">
                  <Search className="h-4 w-4 mr-2" />
                  Find Your Exam Hall
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 bg-white/10 text-white hover:bg-white/20 backdrop-blur">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  College Admin Portal
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-10 grid grid-cols-3 gap-4 border-t border-brand-800/60 max-w-xl mx-auto text-left">
              <div>
                <span className="block text-2xl font-bold text-white">&lt; 3 sec</span>
                <span className="text-xs text-slate-400">Lookup speed</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">0%</span>
                <span className="text-xs text-slate-400">Public roster leak</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">100%</span>
                <span className="text-xs text-slate-400">Leading zero safe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-20 bg-white border-b border-slate-200" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Why Institutions Choose HallPilot
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Exam Day Reliability
            </p>
            <p className="mt-3 text-sm text-slate-600">
              From Excel ingestion to student smartphone lookup, every step is optimized for zero errors and zero delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:border-brand-200 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-white mb-5">
                <FileSpreadsheet className="h-6 w-6 text-brand-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                1-Click Excel / CSV Staging
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Upload existing examination spreadsheets directly. Our parser automatically normalizes column aliases, detects duplicate seatings, and validates data before publishing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:border-brand-200 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-white mb-5">
                <Lock className="h-6 w-6 text-brand-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Zero Public Roster Scraping
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Unlike static PDF notices posted online, HallPilot uses database-level security to prevent anyone from harvesting your entire student roster.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:border-brand-200 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-white mb-5">
                <Clock className="h-6 w-6 text-brand-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Automated Session Expiry
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Exam arrangements automatically become unsearchable once the session concludes. No stale data and no confused candidates on subsequent days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture Callout */}
      <section className="py-20 bg-slate-50" id="security">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-900 text-white p-8 sm:p-14 overflow-hidden relative shadow-modal">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-3 py-1 text-xs font-semibold text-brand-200">
                <ShieldCheck className="h-4 w-4" />
                <span>Enterprise Multi-Tenant Security</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Institutional Data Isolation via Supabase Row-Level Security
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Each college’s examination records are isolated at the database engine level. Administrators can only view and manage their own college’s sessions. Public lookups are handled through isolated Postgres Remote Procedure Calls.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Leading zero preservation guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Public role has 0% direct table SELECT access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Service role keys excluded from client</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Pre-publishing staging preview table</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/lookup">
                  <Button variant="secondary" size="md" className="font-semibold">
                    Test Student Lookup Experience <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
