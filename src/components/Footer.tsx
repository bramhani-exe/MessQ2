import React from 'react';
import { Clock, Coffee, Heart, Shield, Sparkles, UserCheck, Utensils } from 'lucide-react';
import { CHIEF_WARDEN_NAME, MESS_HALL_NAME } from '../data/mockMenu';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-12 bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono">
                Q
              </div>
              <span className="text-base font-bold text-white font-mono">
                Mess<span className="text-cyan-400">Q</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {MESS_HALL_NAME}
              </span>
            </div>
            <p className="text-slate-300 font-medium text-xs">
              "Smarter Queues. Better Dining."
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Real-time {MESS_HALL_NAME} queue status and daily dining menu for students.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-300 mb-3 tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-[11px] font-mono">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors text-left">
                  • Live Crowd Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mess-menu')} className="hover:text-cyan-400 transition-colors text-left">
                  • Today's Mess Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-cyan-400 transition-colors text-left">
                  • Peak Hours & Trends
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Meal Timings */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-300 mb-3 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dining Timings</span>
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
              <p>• Breakfast: 7:00 AM – 9:00 AM</p>
              <p>• Lunch: 12:30 PM – 2:00 PM</p>
              <p className="text-emerald-300">• Snacks (Common): 4:45 PM – 6:15 PM</p>
              <p>• Dinner: 7:15 PM – 9:00 PM</p>
            </div>
          </div>

          {/* Col 4: Mess Authority */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-300 mb-3 tracking-wider">
              Hostel Dining Administration
            </h4>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] space-y-2 font-mono">
              <div className="flex items-start space-x-2">
                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Chief Warden:</span>
                  <span className="font-semibold text-white">{CHIEF_WARDEN_NAME}</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                Facility: <span className="text-slate-200">{MESS_HALL_NAME} (Ladies Hostel 2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
            MessQ is a student-developed prototype for {MESS_HALL_NAME} residents.
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            Department of Computer Science & Engineering • Chief Warden: {CHIEF_WARDEN_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
};
