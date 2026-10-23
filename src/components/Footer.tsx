import React from 'react';
import { Clock, Shield, UserCheck, Utensils } from 'lucide-react';
import { CHIEF_WARDEN_NAME, MESS_HALL_NAME } from '../data/mockMenu';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-12 bg-white border-t border-[#e5dac6] text-[#4d534b] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-1 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-md bg-[#c53727] text-white flex items-center justify-center font-black text-base shadow-xs">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-black text-[#1e231d]">
                Mess<span className="text-[#c53727]">Q</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#faf7f0] text-[#1e231d] font-mono border border-[#e5dac6]">
                {MESS_HALL_NAME}
              </span>
            </div>
            <p className="text-[#1e231d] font-medium text-xs">
              Smarter Queues. Better Dining.
            </p>
            <p className="text-[#6b7267] text-[11px] leading-relaxed">
              Real-time {MESS_HALL_NAME} queue monitoring and daily hostel dining menu for students.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-[#1e231d] mb-3 tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-[11px] font-mono">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#c53727] transition-colors text-left"
                >
                  Live Queue Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('mess-menu')}
                  className="hover:text-[#c53727] transition-colors text-left"
                >
                  Daily Mess Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-[#c53727] transition-colors text-left"
                >
                  Peak Hours &amp; Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy')}
                  className="hover:text-[#c53727] transition-colors text-left"
                >
                  Privacy Policy &amp; Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Meal Timings */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-[#1e231d] mb-3 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#236b3d]" />
              <span>Dining Timings</span>
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono text-[#4d534b]">
              <p>Breakfast: 7:00 AM – 9:00 AM</p>
              <p>Lunch: 12:30 PM – 2:00 PM</p>
              <p className="text-[#c53727] font-semibold">Evening Snacks: 4:45 PM – 6:15 PM</p>
              <p>Dinner: 7:15 PM – 9:00 PM</p>
            </div>
          </div>

          {/* Col 4: Institutional Administration */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-[#1e231d] mb-3 tracking-wider">
              Dining Administration
            </h4>
            <div className="bg-[#faf7f0] p-3 rounded-md border border-[#e5dac6] text-[11px] space-y-1.5 font-mono">
              <div className="flex items-start space-x-2">
                <UserCheck className="w-4 h-4 text-[#236b3d] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#7a8077] block text-[10px]">Chief Warden:</span>
                  <span className="font-semibold text-[#1e231d]">{CHIEF_WARDEN_NAME}</span>
                </div>
              </div>
              <div className="text-[10px] text-[#7a8077] border-t border-[#ebdcc7] pt-1.5">
                Facility: <span className="text-[#1e231d]">{MESS_HALL_NAME} (Ladies Hostel 2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Policy Bar */}
        <div className="pt-6 border-t border-[#e5dac6] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7a8077] font-mono gap-3">
          <p>
            MessQ: Real-Time Hostel Mess Queue Monitoring System &bull; LH2 Mess
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('policy')}
              className="hover:text-[#c53727] hover:underline"
            >
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button
              onClick={() => onNavigate('policy')}
              className="hover:text-[#c53727] hover:underline"
            >
              Terms &amp; Regulations
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
