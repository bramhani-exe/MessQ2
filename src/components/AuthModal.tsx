import React, { useState } from 'react';
import {
  Bell,
  Check,
  GraduationCap,
  KeyRound,
  Shield,
  User,
  UserCheck,
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
      name: 'Arjun Sharma',
      rollNumber: '2024CS042',
      role: 'STUDENT',
      hostelBlock: 'Block A (B.Tech Hostel)',
      roomNumber: 'A-214'
    },
    {
      id: 'usr-2',
      name: 'Sneha Patel',
      rollNumber: '2023EE108',
      role: 'MESS_ADMIN',
      hostelBlock: 'Block A (Mess Secretary)',
      roomNumber: 'A-305'
    },
    {
      id: 'usr-3',
      name: 'Dr. GDV Santhosh',
      rollNumber: 'FAC-CHIEF-WARDEN',
      role: 'WARDEN',
      hostelBlock: 'Chief Warden Office / Hostel Dining Committee',
      roomNumber: 'CW-01'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white">
                Campus Portal Identity
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Hostel Dining Access Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs font-mono">
          <p className="text-slate-400 text-xs leading-relaxed">
            Switch between simulated campus user personas for role-based features and dining preference alerts:
          </p>

          <div className="space-y-2">
            {sampleProfiles.map((p) => {
              const isCurrent = currentUser.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectUser(p)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-slate-950 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        p.role === 'WARDEN'
                          ? 'bg-amber-950 border border-amber-700 text-amber-300'
                          : p.role === 'MESS_ADMIN'
                          ? 'bg-purple-950 border border-purple-700 text-purple-300'
                          : 'bg-cyan-950 border border-cyan-700 text-cyan-300'
                      }`}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {p.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ID: {p.rollNumber} • {p.roomNumber}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Student Dining Alerts */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              Hostel Notification Subscriptions
            </span>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>Alert when crowd drops to LOW (&lt;10 people)</span>
              <input
                type="checkbox"
                checked={notifyLowQueue}
                onChange={(e) => setNotifyLowQueue(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>Notify for Chef's Special lunch/dinner menus</span>
              <input
                type="checkbox"
                checked={notifySpecialMenu}
                onChange={(e) => setNotifySpecialMenu(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
