import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ShieldCheck, Search } from 'lucide-react';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Find Exam Hall', href: '/lookup', icon: Search },
    { name: 'For Colleges', href: '/#features' },
    { name: 'Security & RLS', href: '/#security' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-[#EAF0FF] shadow-card backdrop-blur supports-[backdrop-filter]:bg-[#EAF0FF]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101B35] text-white shadow-card transition-transform group-hover:scale-105">
            <Compass className="h-6 w-6 text-[#0D9488]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#101B35]">
              Hall<span className="text-[#3157D5]">Pilot</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 border-l border-slate-200 pl-2">
              Exam Hall Lookup
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={clsx(
                'text-sm font-medium transition-colors hover:text-[#3157D5]',
                isActive(link.href) ? 'text-[#3157D5] font-semibold' : 'text-[#172033]'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-[#101B35] hover:bg-slate-50 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
            College Admin Portal
          </Link>
          <Link
            to="/lookup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white shadow-card hover:bg-[#0C7A78] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            Search Seat
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-[#EAF0FF] shadow-card px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-[#172033] hover:bg-slate-50 hover:text-[#3157D5] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-[#101B35] hover:bg-slate-50 transition-colors"
            >
              College Admin Portal
            </Link>
            <Link
              to="/lookup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center rounded-lg bg-[#0D9488] py-2.5 text-sm font-semibold text-white hover:bg-[#0C7A78] transition-colors"
            >
              Find Your Hall
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
