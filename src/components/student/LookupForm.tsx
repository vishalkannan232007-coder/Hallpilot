import React, { useState } from 'react';
import { Search, Building2, Hash, AlertCircle } from 'lucide-react';
import { College } from '@/types/models';
import { Button } from '@/components/common/Button';

interface LookupFormProps {
  colleges: College[];
  selectedCollegeId: string;
  registerNumber: string;
  onCollegeChange: (id: string) => void;
  onRegisterNumberChange: (regNo: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
  onSelectSample?: (collegeId: string, regNo: string) => void;
}

export const LookupForm: React.FC<LookupFormProps> = ({
  colleges,
  selectedCollegeId,
  registerNumber,
  onCollegeChange,
  onRegisterNumberChange,
  onSearch,
  isLoading,
  onSelectSample,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollegeId) {
      setValidationError('Please select your college from the list.');
      return;
    }
    if (!registerNumber.trim()) {
      setValidationError('Please enter your register number.');
      return;
    }
    setValidationError(null);
    onSearch(e);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* College Selector */}
        <div>
          <label htmlFor="college-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            1. Select Your Institution
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Building2 className="h-5 w-5" />
            </div>
            <select
              id="college-select"
              value={selectedCollegeId}
              onChange={(e) => {
                onCollegeChange(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-800 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">-- Choose College / University --</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Register Number Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="reg-number-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              2. Student Register / Roll Number
            </label>
            <span className="text-[11px] text-slate-500">
              Preserves leading zeros (e.g., 004101)
            </span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Hash className="h-5 w-5" />
            </div>
            <input
              id="reg-number-input"
              type="text"
              autoComplete="off"
              spellCheck="false"
              value={registerNumber}
              onChange={(e) => {
                // Keep exact string representation
                onRegisterNumberChange(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. 004101 or 09CS102"
              className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-mono font-medium text-slate-900 shadow-sm placeholder:font-sans placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Search Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full text-base font-semibold py-3.5 rounded-xl bg-brand-900 hover:bg-brand-950 transition-all shadow-md"
        >
          <Search className="h-4 w-4 mr-1" />
          Find My Exam Hall
        </Button>
      </form>

      {/* Quick Test Fictional Samples */}
      {onSelectSample && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Try Sample Fictional Candidates:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectSample('11111111-1111-1111-1111-111111111111', '004101')}
              className="rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-900 border border-slate-200 px-2.5 py-1 text-xs font-mono text-slate-700 transition-colors"
            >
              AIT: 004101 (Leading Zero)
            </button>
            <button
              type="button"
              onClick={() => onSelectSample('11111111-1111-1111-1111-111111111111', '09CS102')}
              className="rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-900 border border-slate-200 px-2.5 py-1 text-xs font-mono text-slate-700 transition-colors"
            >
              AIT: 09CS102 (Alphanumeric)
            </button>
            <button
              type="button"
              onClick={() => onSelectSample('22222222-2222-2222-2222-222222222222', '005520')}
              className="rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-900 border border-slate-200 px-2.5 py-1 text-xs font-mono text-slate-700 transition-colors"
            >
              BCE: 005520 (Afternoon Slot)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
