import React, { useState } from 'react';
import {
  Bell,
  Check,
  Heart,
  Menu,
  Sliders,
  Sparkles,
  Utensils,
  X
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types/messq';
import { MESS_HALL_NAME } from '../data/mockMenu';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onOpenDemoControls: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onMarkAllNotificationsRead,
  onOpenDemoControls,
  onOpenAuth,
  currentUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Live Crowd' },
    { id: 'mess-menu', label: 'Mess Menu' },
    { id: 'analytics', label: 'Peak Hours' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/40 flex items-center justify-center shadow-inner group-hover:border-cyan-400 transition-colors">
                <Utensils className="w-5 h-5 text-cyan-400" />
                {/* Active live dot */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight text-white font-mono">
                    Mess<span className="text-cyan-400">Q</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/60">
                    {MESS_HALL_NAME}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Live Queue & Daily Menu
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Simulation Preset Selector */}
            <button
              id="btn-demo-panel-toggle"
              onClick={onOpenDemoControls}
              title="Test queue crowd levels"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Simulate Crowd</span>
            </button>

            {/* Notifications Dropdown (Dish Alerts & Crowd Updates) */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-semibold text-white">Menu & Dining Alerts</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center font-mono">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`py-2.5 px-1 ${n.read ? 'opacity-70' : 'opacity-100'}`}>
                          <div className="flex items-start justify-between">
                            <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                              {n.title.includes('⭐') || n.title.includes('Favorite') ? (
                                <span className="text-amber-400 text-xs">★</span>
                              ) : null}
                              {n.title}
                            </h5>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <button
              id="btn-user-profile"
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-slate-300 max-w-[80px] sm:max-w-none truncate font-medium">
                {currentUser.name}
              </span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Dining Hall:</span>
            <span className="font-mono text-cyan-400">LH2 Mess</span>
          </div>
        </div>
      )}
    </header>
  );
};
