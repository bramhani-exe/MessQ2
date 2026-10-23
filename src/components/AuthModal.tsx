import React, { useState } from 'react';
import {
  Check,
  GraduationCap,
  X
} from 'lucide-react';
import { UserProfile } from '../types/messq';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser
}) => {
  const [notifyLowQueue, setNotifyLowQueue] = useState(true);
  const [notifySpecialMenu, setNotifySpecialMenu] = useState(true);

  if (!isOpen) return null;

  const sampleProfiles: UserProfile[] = [
    {
      id: 'usr-1',
      name: 'Ananya Roy',
      rollNumber: '2024CS042',
      role: 'STUDENT',
      hostelBlock: 'Ladies Hostel 2 (LH2)',
      roomNumber: 'LH2-314'
    },
    {
      id: 'usr-2',
      name: 'Pooja Verma',
      rollNumber: '2023EE108',
      role: 'MESS_ADMIN',
      hostelBlock: 'Ladies Hostel 2 (Mess Committee)',
      roomNumber: 'LH2-108'
    },
    {
      id: 'usr-3',
      name: 'Dr. Malavika Ganta',
      rollNumber: 'FAC-CHIEF-WARDEN',
      role: 'WARDEN',
      hostelBlock: 'Chief Warden Office / Hostel Administration',
      roomNumber: 'CW-01'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e231d]/40 backdrop-blur-xs">
      <div className="bg-white border border-[#e5dac6] rounded-lg max-w-md w-full p-5 sm:p-6 shadow-xl relative">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f0e7d7]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-[#ebf5ee] border border-[#b7dfc4] text-[#1b5e35] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1e231d]">
                Hostel Resident Profile
              </h3>
              <p className="text-xs text-[#6b7267] font-mono">
                LH2 Mess Resident Identification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b9187] hover:text-[#1e231d] p-1 rounded-md hover:bg-[#faf7f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs font-mono">
          <p className="text-[#4d534b] text-xs leading-relaxed font-sans">
            Select resident identity to view personalized preferences and dining notifications:
          </p>

          <div className="space-y-2">
            {sampleProfiles.map((p) => {
              const isCurrent = currentUser.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectUser(p)}
                  className={`w-full p-3 rounded-md border text-left flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-[#faf7f0] border-[#c53727] ring-1 ring-[#c53727]/20'
                      : 'bg-white border-[#e5dac6] hover:bg-[#faf7f0]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-md bg-[#faf7f0] border border-[#e5dac6] text-[#1e231d] flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#1e231d] text-xs">{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#faf7f0] border border-[#e5dac6] text-[#4d534b] font-medium">
                          {p.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6b7267] mt-0.5">
                        Roll: {p.rollNumber} &bull; {p.roomNumber}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-5 h-5 rounded-md bg-[#c53727] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Student Dining Alert Preferences */}
          <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6] space-y-2.5">
            <span className="text-[11px] font-semibold text-[#1e231d] uppercase tracking-wider block">
              Dining Notification Preferences
            </span>

            <label className="flex items-center justify-between text-[#4d534b] cursor-pointer">
              <span>Notify when queue count drops to Low (&lt;10 diners)</span>
              <input
                type="checkbox"
                checked={notifyLowQueue}
                onChange={(e) => setNotifyLowQueue(e.target.checked)}
                className="rounded border-[#e5dac6] accent-[#c53727] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-[#4d534b] cursor-pointer">
              <span>Notify when starred favorite dishes are on today&apos;s menu</span>
              <input
                type="checkbox"
                checked={notifySpecialMenu}
                onChange={(e) => setNotifySpecialMenu(e.target.checked)}
                className="rounded border-[#e5dac6] accent-[#c53727] focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-[#f0e7d7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#c53727] hover:bg-[#a82a1b] text-white rounded-md text-xs font-mono font-medium transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
