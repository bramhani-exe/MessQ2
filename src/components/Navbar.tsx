import React, { useState } from 'react';
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  Menu,
  Radio,
  Utensils,
  X
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types/messq';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onOpenDemoControls: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile;
  isLiveHardware: boolean;
  selectedHostel: string;
  onSelectHostel: (hostel: string) => void;
}

export const HOSTEL_OPTIONS = [
  { id: 'LH2', name: 'LH2 Mess (Live Hardware)', short: 'LH2' },
  { id: 'LH1', name: 'LH1 Mess (Ladies Hostel 1)', short: 'LH1' },
  { id: 'LH3', name: 'LH3 Mess (Ladies Hostel 3)', short: 'LH3' },
  { id: 'LH4', name: 'LH4 Mess (Ladies Hostel 4)', short: 'LH4' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onMarkAllNotificationsRead,
  onOpenDemoControls,
  onOpenAuth,
  currentUser,
  isLiveHardware,
  selectedHostel,
  onSelectHostel
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [hostelDropdownOpen, setHostelDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Live Queue' },
    { id: 'mess-menu', label: 'Mess Menu' },
    { id: 'analytics', label: 'Peak Hours' },
    { id: 'policy', label: 'Privacy & Terms' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f0]/95 backdrop-blur-xs border-b border-[#e5dac6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Identity & Hostel Switcher */}
          <div className="flex items-center space-x-3.5 sm:space-x-5">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-[#c53727] text-white flex items-center justify-center font-black shadow-sm transition-all duration-200 group-hover:bg-[#a82a1b] group-hover:scale-105">
                <Utensils className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-[#1e231d]">
                    Mess<span className="text-[#c53727]">Q</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#6b7267] hidden lg:block leading-none mt-1 font-medium">
                  Hostel Dining & Queue Monitoring
                </p>
              </div>
            </button>

            {/* Hostel Selector Dropdown */}
            <div className="relative">
              <button
                id="hostel-selector-dropdown-btn"
                onClick={() => setHostelDropdownOpen(!hostelDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-[#f6f0e4] border border-[#e5dac6] text-xs font-mono text-[#1e231d] transition-colors"
                title="Select Hostel Mess"
              >
                <Building2 className="w-3.5 h-3.5 text-[#236b3d]" />
                <span className="font-semibold">{selectedHostel}</span>
                <ChevronDown className="w-3 h-3 text-[#7a8077]" />
              </button>

              {hostelDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-[#e5dac6] rounded-md shadow-lg py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8b9187] border-b border-[#f0e7d7]">
                    Hostel Facilities
                  </div>
                  {HOSTEL_OPTIONS.map((hostel) => (
                    <button
                      key={hostel.id}
                      onClick={() => {
                        onSelectHostel(hostel.id);
                        setHostelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        selectedHostel === hostel.id
                          ? 'bg-[#f8f3e8] text-[#c53727] font-semibold'
                          : 'text-[#2a2f29] hover:bg-[#faf6ed]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#236b3d]" />
                        <span>{hostel.name}</span>
                      </div>
                      {selectedHostel === hostel.id && (
                        <Check className="w-3.5 h-3.5 text-[#c53727]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#f4efe4] text-[#a82a1b] font-semibold border border-[#dfd1ba]'
                      : 'text-[#4d534b] hover:text-[#1e231d] hover:bg-[#f6f1e6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Mode Indicator & Demo Controls Toggle */}
            <button
              id="btn-demo-panel-toggle"
              onClick={onOpenDemoControls}
              title="Hardware connection details and calibration controls"
              className={`flex items-center space-x-1.5 px-2.5 py-1 border rounded-md text-xs font-mono transition-colors ${
                isLiveHardware
                  ? 'bg-[#ebf5ee] text-[#1b5e35] border-[#b7dfc4] hover:bg-[#def0e3]'
                  : 'bg-[#fcf5e8] text-[#855314] border-[#ebd4b2] hover:bg-[#f7ebd3]'
              }`}
            >
              <Radio className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">
                {isLiveHardware ? 'Hardware Live' : 'Demo Mode'}
              </span>
              <span className="sm:hidden text-[10px]">
                {isLiveHardware ? 'Live' : 'Demo'}
              </span>
            </button>

            {/* Notifications Dropdown (Starred Favorite Dish Alerts) */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-1.5 text-[#3e443c] hover:text-[#1e231d] hover:bg-[#f4eee2] rounded-md transition-colors border border-[#e5dac6] bg-white"
                aria-label="View favorite dish and dining alerts"
              >
                <Bell className="w-4 h-4 text-[#3e443c]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-md bg-[#c53727] text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#e5dac6] rounded-md shadow-lg p-3.5 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0e7d7]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2a2f29] font-mono">
                      Dining Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-xs text-[#c53727] hover:underline flex items-center space-x-1 font-medium"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-[#f2e9dc] mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#8b9187] py-3 text-center font-mono">
                        No active alerts
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`py-2 px-1 ${n.read ? 'opacity-60' : 'opacity-100'}`}
                        >
                          <div className="flex items-start justify-between">
                            <h5 className="text-xs font-semibold text-[#1e231d]">
                              {n.title}
                            </h5>
                            <span className="text-[10px] text-[#8b9187] font-mono ml-2 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-[#4d534b] mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Student Profile Quick-Tag */}
            <button
              onClick={onOpenAuth}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-white hover:bg-[#f6f0e4] border border-[#e5dac6] rounded-md text-xs font-mono text-[#2a2f29] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#236b3d]" />
              <span>{currentUser.rollNumber}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#3e443c] hover:bg-[#f4eee2] rounded-md border border-[#e5dac6] bg-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2.5 border-t border-[#e5dac6] space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md ${
                  activeTab === item.id
                    ? 'bg-[#f4efe4] text-[#a82a1b] font-semibold border border-[#dfd1ba]'
                    : 'text-[#4d534b] hover:bg-[#f6f1e6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
