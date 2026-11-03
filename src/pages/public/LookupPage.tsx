import React, { useState, useEffect } from 'react';
import { LookupForm } from '@/components/student/LookupForm';
import { HallResultCard } from '@/components/student/HallResultCard';
import { getActiveColleges, lookupStudentSeating } from '@/services/lookupService';
import { College, StudentSeatingResult } from '@/types/models';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const LookupPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [registerNumber, setRegisterNumber] = useState<string>('');
  const [isLoadingColleges, setIsLoadingColleges] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [results, setResults] = useState<StudentSeatingResult[]>([]);
  const [searchedRegNo, setSearchedRegNo] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadColleges() {
      try {
        const list = await getActiveColleges();
        if (isMounted) {
          setColleges(list);
          if (list.length > 0 && !selectedCollegeId) {
            setSelectedCollegeId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load colleges', err);
      } finally {
        if (isMounted) setIsLoadingColleges(false);
      }
    }
    loadColleges();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollegeId || !registerNumber.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchedRegNo(registerNumber.trim());

    try {
      const data = await lookupStudentSeating(selectedCollegeId, registerNumber.trim());
      setResults(data);
    } catch (err) {
      console.error('Error querying seating data', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSample = (sampleCollegeId: string, sampleRegNo: string) => {
    setSelectedCollegeId(sampleCollegeId);
    setRegisterNumber(sampleRegNo);
    setSearchedRegNo(sampleRegNo);
    setIsSearching(true);
    setHasSearched(true);

    lookupStudentSeating(sampleCollegeId, sampleRegNo)
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setIsSearching(false));
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-900">
            <Compass className="h-3.5 w-3.5 text-brand-600" />
            <span>Official Examination Seating Desk</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Locate Your Examination Hall
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Select your college and input your register number to see your allocated hall, seat number, and session timing.
          </p>
        </div>

        {/* Lookup Form */}
        <LookupForm
          colleges={colleges}
          selectedCollegeId={selectedCollegeId}
          registerNumber={registerNumber}
          onCollegeChange={setSelectedCollegeId}
          onRegisterNumberChange={setRegisterNumber}
          onSearch={handleSearch}
          isLoading={isSearching || isLoadingColleges}
          onSelectSample={handleSelectSample}
        />

        {/* Results Area */}
        <div className="pt-2">
          {/* Loading State */}
          {isSearching && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-card space-y-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-900 border-t-transparent" />
              <p className="text-sm font-medium text-slate-700">
                Searching secure examination rosters...
              </p>
            </div>
          )}

          {/* Result Found State */}
          {!isSearching && hasSearched && results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Examination Hall Found ({results.length} Slot{results.length > 1 ? 's' : ''})
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Active Allocation
                </span>
              </div>
              {results.map((res) => (
                <HallResultCard
                  key={res.session_id}
                  result={res}
                  registerNumber={searchedRegNo}
                />
              ))}
            </div>
          )}

          {/* Not Found State */}
          {!isSearching && hasSearched && results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-sm space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  No Active Seating Allocation Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We could not find an active examination session for register number{' '}
                  <span className="font-mono font-bold text-slate-800">"{searchedRegNo}"</span>.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-4 text-left text-xs text-slate-600 border border-slate-200 space-y-2">
                <span className="font-semibold text-slate-800 block">Common causes:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Your college examination cell has not yet published today's seating roster.</li>
                  <li>Check for leading zeroes or typographical errors in your register number.</li>
                  <li>The exam session may have already expired and archived.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Initial Idle Guidance State */}
          {!isSearching && !hasSearched && (
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 border border-brand-200">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900">
                  Paperless & Instant Exam Day Guidance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your seat details are protected by HallPilot's zero-leak privacy design. No full student rosters are published, and your queries run directly through authorized institutional channels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
