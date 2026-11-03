import React from 'react';
import { Compass, Shield, Lock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-white">
                <Compass className="h-5 w-5 text-brand-300" />
              </div>
              <span className="text-lg font-bold tracking-tight text-brand-900">
                Hall<span className="text-brand-500">Pilot</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Your Exam Hall, One Search Away. Digitize paper-based examination seating rosters with multi-tenant college isolation, row-level security, and instant student lookups.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-600" />
                Row Level Security
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-brand-600" />
                Anti-Scraping RPC
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/lookup" className="hover:text-brand-600 transition-colors">
                  Student Hall Search
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-600 transition-colors">
                  College Admin Portal
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Excel / CSV Ingestion</span>
              </li>
            </ul>
          </div>

          {/* Security & Policies */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Security & Privacy
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span>Zero Secret Exposure</span>
              </li>
              <li>
                <span>No Public Roster Scrapes</span>
              </li>
              <li>
                <span>Automated Session Expiry</span>
              </li>
              <li className="pt-2">
                <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                  Demo Mode: Fictional Data Only
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HallPilot Platform. Built for higher education institutions.</p>
          <p>Preserves Leading Zeros • Supabase PostgreSQL • React + Vite</p>
        </div>
      </div>
    </footer>
  );
};
