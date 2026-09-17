import React, { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { CrowdStatus } from './components/CrowdStatus';
import { DashboardHeader } from './components/DashboardHeader';
import { DemoControlsModal } from './components/DemoControlsModal';
import { Footer } from './components/Footer';
import { MessMenu } from './components/MessMenu';
import { Navbar } from './components/Navbar';
import { QueueAnalytics } from './components/QueueAnalytics';
import { QueueStatus } from './components/QueueStatus';
import { RecentActivity } from './components/RecentActivity';
import { iotService, MessQSnapshot } from './services/iotService';
import { UserProfile } from './types/messq';

export default function App() {
  const [snapshot, setSnapshot] = useState<MessQSnapshot>(() => iotService.getSnapshot());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Ananya Roy',
    rollNumber: '2024CS042',
    role: 'STUDENT',
    hostelBlock: 'Ladies Hostel 2 (LH2)',
    roomNumber: 'LH2-314'
  });

  // Subscribe to real-time service
  useEffect(() => {
    const unsubscribe = iotService.subscribe((updatedSnapshot) => {
      setSnapshot(updatedSnapshot);
    });
    return () => unsubscribe();
  }, []);

  const handleManualEntry = () => {
    iotService.triggerManualEntry();
  };

  const handleManualExit = () => {
    iotService.triggerManualExit();
  };

  const handleSetPreset = (preset: 'LOW' | 'MODERATE' | 'HIGH' | 'EMPTY') => {
    iotService.setPreset(preset);
  };

  const handleToggleSimulation = (active: boolean) => {
    iotService.setSimulationActive(active);
  };

  const handleChangeSpeed = (ms: number) => {
    iotService.setSimulationSpeed(ms);
  };

  const handleMarkAllRead = () => {
    iotService.markAllNotificationsRead();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={snapshot.notifications}
        onMarkAllNotificationsRead={handleMarkAllRead}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Header with live time and LH2 Mess status */}
        <DashboardHeader
          queue={snapshot.queue}
          onRefresh={() => iotService.startSimulationLoop()}
          lastUpdated={snapshot.queue.lastUpdated}
        />

        {/* Tab-driven Content Rendering */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 1. Main Queue Status with "Current Queue (approx.)" & Timings */}
            <QueueStatus
              queue={snapshot.queue}
              thresholds={snapshot.thresholds}
              onOpenSettings={() => setIsDemoControlsOpen(true)}
            />

            {/* 2. LH2 Mess Menu with 3 Segments: Veg, Non-Veg, Special (Snacks same for all) */}
            <MessMenu />

            {/* 3. Analytics Chart */}
            <QueueAnalytics
              queue={snapshot.queue}
              history={snapshot.history}
              thresholds={snapshot.thresholds}
            />

            {/* 4. Two-Column Grid: Crowd Level Classification & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CrowdStatus
                currentStatus={snapshot.queue.crowdStatus}
                thresholds={snapshot.thresholds}
                currentCount={snapshot.queue.queueCount}
              />

              <RecentActivity logs={snapshot.logs} />
            </div>
          </div>
        )}

        {activeTab === 'mess-menu' && (
          <div className="space-y-6">
            <MessMenu />
            <QueueStatus
              queue={snapshot.queue}
              thresholds={snapshot.thresholds}
              onOpenSettings={() => setIsDemoControlsOpen(true)}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <QueueAnalytics
              queue={snapshot.queue}
              history={snapshot.history}
              thresholds={snapshot.thresholds}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CrowdStatus
                currentStatus={snapshot.queue.crowdStatus}
                thresholds={snapshot.thresholds}
                currentCount={snapshot.queue.queueCount}
              />
              <RecentActivity logs={snapshot.logs} />
            </div>
          </div>
        )}
      </main>

      {/* Campus Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Interactive Crowd Simulation Modal */}
      <DemoControlsModal
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        onSimulateEntry={handleManualEntry}
        onSimulateExit={handleManualExit}
        onSetPreset={handleSetPreset}
        simulationActive={snapshot.simulationActive}
        onToggleSimulation={handleToggleSimulation}
        simulationSpeedMs={snapshot.simulationIntervalMs}
        onChangeSpeed={handleChangeSpeed}
      />

      {/* Campus Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
