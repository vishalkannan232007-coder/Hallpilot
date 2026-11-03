import React from 'react';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StudentSeatingResult } from '@/types/models';
import { Badge } from '@/components/common/Badge';

interface HallResultCardProps {
  result: StudentSeatingResult;
  registerNumber: string;
}

export const HallResultCard: React.FC<HallResultCardProps> = ({ result, registerNumber }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-card-hover transition-all">
      {/* Top Banner */}
      <div className="bg-brand-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-brand-300">
            {result.college_name} ({result.college_code})
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            {result.session_title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="md">
            Candidate: <span className="font-mono font-bold ml-1">{registerNumber}</span>
          </Badge>
          <Badge variant="brand" size="md">
            Slot: {result.session_slot}
          </Badge>
        </div>
      </div>

      {/* Main Focus: Hall and Seat Number */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
          {/* Hall Box */}
          <div className="rounded-xl bg-brand-50/60 border border-brand-100 p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Allocated Examination Hall
            </span>
            <div className="mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-900">
                {result.hall_number}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <MapPin className="h-3.5 w-3.5 text-brand-600 shrink-0" />
              <span>
                {[result.building_name, result.floor_number].filter(Boolean).join(' • ') || 'Main Campus'}
              </span>
            </div>
          </div>

          {/* Seat Box */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Allocated Seat / Desk
            </span>
            <div className="mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                {result.seat_number || 'Open Seating'}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Confirmed in published roster</span>
            </div>
          </div>
        </div>

        {/* Schedule & Subject Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-brand-800">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Date</span>
              <span className="font-semibold text-slate-800">{result.session_date}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-brand-800">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Reporting & Exam Timing</span>
              <span className="font-semibold text-slate-800">
                {result.start_time} — {result.end_time}
              </span>
            </div>
          </div>

          {(result.course_code || result.course_name) && (
            <div className="sm:col-span-2 flex items-start gap-3 pt-2">
              <div className="p-2 rounded-lg bg-slate-100 text-brand-800">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Subject / Course</span>
                <span className="font-semibold text-slate-900">
                  {result.course_code ? `${result.course_code} - ` : ''}
                  {result.course_name || 'General Paper'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Candidate Special Instructions */}
        {result.special_instructions && (
          <div className="mt-6 rounded-xl bg-amber-50/70 border border-amber-200 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block text-amber-950 mb-0.5">Examination Instructions:</span>
              {result.special_instructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
