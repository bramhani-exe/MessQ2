import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, RotateCcw, Utensils } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { CrowdStatus } from './components/CrowdStatus';
import { DashboardHeader } from './components/DashboardHeader';
import { DemoControlsModal } from './components/DemoControlsModal';
import { Footer } from './components/Footer';
import { MessMenu } from './components/MessMenu';
import { Navbar } from './components/Navbar';
import { PrivacyAndTerms } from './components/PrivacyAndTerms';
import { QueueAnalytics } from './components/QueueAnalytics';
import { QueueStatus } from './components/QueueStatus';
import { RecentActivity } from './components/RecentActivity';
import { iotService, MessQSnapshot } from './services/iotService';
import { UserProfile } from './types/messq';

export default function App() {
  const [snapshot, setSnapshot] = useState<MessQSnapshot>(() => iotService.getSnapshot());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedHostel, setSelectedHostel] = useState<string>('LH2');
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

  // Authoritative real-time hardware polling subscription
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

  const handleToggleDataSource = (source: 'ESP32_LIVE' | 'SIMULATED') => {
    iotService.setDataSource(source);
  };

  const handleResetCounter = async (): Promise<boolean> => {
    return await iotService.resetHardwareCounter();
  };

  const isLive = snapshot.dataSource === 'ESP32_LIVE';

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#1e231d] flex flex-col font-sans selection:bg-[#f2e7d5] selection:text-[#a82a1b]">
      {/* Top Header & Hostel Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={snapshot.notifications}
        onMarkAllNotificationsRead={handleMarkAllRead}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        isLiveHardware={isLive}
        selectedHostel={selectedHostel}
        onSelectHostel={(hostel) => setSelectedHostel(hostel)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Network Error Alert Banner */}
        {isLive && snapshot.connectionStatus === 'ERROR' && (
          <div className="mb-5 p-3.5 bg-[#fdf2f0] border border-[#f5c7c1] rounded-md flex items-center justify-between text-xs font-mono text-[#a82a1b]">
            <div>
              <strong>Network Notice:</strong> Reconnecting to production telemetry endpoint. Preserving last known sensor counter values.
            </div>
            <button
              onClick={() => iotService.refreshLiveTelemetry()}
              className="px-2.5 py-1 bg-[#c53727] hover:bg-[#a82a1b] text-white font-semibold rounded text-[11px] transition-colors"
            >
              Retry Now
            </button>
          </div>
        )}

        {/* Dashboard Introductory & Hero (with Indian thali food photography) */}
        <DashboardHeader
          queue={snapshot.queue}
          onRefresh={() => iotService.refreshLiveTelemetry()}
          lastUpdated={snapshot.lastSuccessfulFetch || snapshot.queue.lastUpdated}
          connectionStatus={snapshot.connectionStatus}
          isLiveHardware={isLive}
          lastAgeSeconds={snapshot.rawTelemetry?.last_update_age_sec ?? 0}
          selectedHostel={selectedHostel}
        />

        {/* Hostel Empty State for non-LH2 selections */}
        {selectedHostel !== 'LH2' ? (
          <div className="bg-white border border-[#e5dac6] rounded-lg p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#ebf5ee] text-[#1b5e35] flex items-center justify-center mx-auto mb-4 border border-[#b7dfc4]">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1e231d] mb-2">
              No data available for {selectedHostel} yet.
            </h2>
            <p className="text-sm text-[#4d534b] max-w-md mx-auto leading-relaxed mb-6 font-sans">
              Real-time hardware monitoring is currently installed and operational in LH2 Mess.
              Optical break-beam sensors for {selectedHostel} are planned for the next deployment phase.
            </p>
            <button
              onClick={() => setSelectedHostel('LH2')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#c53727] hover:bg-[#a82a1b] text-white text-xs font-medium transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Switch to LH2 Live Mess</span>
            </button>
          </div>
        ) : (
          /* Tab-driven Content for LH2 */
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Main Live Queue with Meal Schedule, Vertical Queue Stack, Menu preview, & Hardware Telemetry */}
                <QueueStatus
                  queue={snapshot.queue}
                  thresholds={snapshot.thresholds}
                  isLoading={snapshot.isLoading}
                  rawTelemetry={snapshot.rawTelemetry}
                  onOpenResetModal={() => setIsDemoControlsOpen(true)}
                  onOpenSettings={() => setIsDemoControlsOpen(true)}
                  onNavigateToMenu={() => setActiveTab('mess-menu')}
                />
              </div>
            )}

            {activeTab === 'mess-menu' && (
              <div className="space-y-6">
                <MessMenu />
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

            {activeTab === 'policy' && <PrivacyAndTerms />}
          </>
        )}
      </main>

      {/* Footer with Chief Warden Dr. Malavika Ganta */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Hardware Calibration & Demo Controls Modal */}
      <DemoControlsModal
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        simulationActive={snapshot.simulationActive}
        simulationSpeedMs={snapshot.simulationIntervalMs}
        onToggleSimulation={handleToggleSimulation}
        onChangeSpeed={handleChangeSpeed}
        onManualEntry={handleManualEntry}
        onManualExit={handleManualExit}
        onSetPreset={handleSetPreset}
        dataSource={snapshot.dataSource}
        onToggleDataSource={handleToggleDataSource}
        onResetCounter={handleResetCounter}
        rawTelemetry={snapshot.rawTelemetry}
      />

      {/* Student/Staff Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
      />
    </div>
  );
}
