import React from 'react';
import {
  FileText,
  Globe,
  Lock,
  Scale,
  Shield,
  Utensils
} from 'lucide-react';
import { CHIEF_WARDEN_NAME, MESS_HALL_NAME } from '../data/mockMenu';

export const PrivacyAndTerms: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#236b3d] font-semibold flex items-center gap-1.5 mb-1">
          <Shield className="w-3.5 h-3.5" />
          Institutional Governance &amp; Transparency
        </span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1e231d]">
          Privacy Policy &amp; Hostel Dining Regulations
        </h2>
        <p className="text-xs text-[#6b7267] mt-1">
          Technical specifications for optical telemetry and dining hall administration at {MESS_HALL_NAME}
        </p>
      </div>

      {/* Grid: Privacy Policy & Terms of Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Privacy Policy */}
        <section className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#f0e7d7]">
            <Lock className="w-4 h-4 text-[#236b3d]" />
            <h3 className="font-heading text-base font-bold text-[#1e231d]">
              Privacy Policy (Hardware Data Handling)
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#4d534b] leading-relaxed font-sans">
            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">1. Optical Break-Beam Sensing</h4>
              <p className="mt-0.5 text-[#596055]">
                MessQ utilizes dual passive Infrared (IR) beam interrupt sensors positioned at physical doorway thresholds (GPIO 34 for Entry, GPIO 35 for Exit). The system detects binary light obstruction and does not capture imagery, facial biometric data, or physical video recordings.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">2. Zero Student Identity Tracking</h4>
              <p className="mt-0.5 text-[#596055]">
                The ESP32 microcontroller transmits anonymized telemetry packets containing exclusively integer counter values, RSSI signal strength, and uptime seconds. No student identity cards, RFID numbers, or biometric credentials are required or logged by the queue system.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">3. Data Storage &amp; Lifecycle</h4>
              <p className="mt-0.5 text-[#596055]">
                Live queue state is cached in memory and synchronized to Upstash Redis under key <code className="font-mono bg-[#faf7f0] border border-[#e5dac6] px-1 py-0.5 rounded text-[11px]">messq:queue:v1</code>. Transient hardware telemetry expires after dining hours to respect hostel student privacy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">4. Local Device Preferences</h4>
              <p className="mt-0.5 text-[#596055]">
                Favorite dish bookmarks are stored exclusively on your browser device using localStorage and are never synchronized to commercial analytics providers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Hostel Dining Terms */}
        <section className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#f0e7d7]">
            <Scale className="w-4 h-4 text-[#c53727]" />
            <h3 className="font-heading text-base font-bold text-[#1e231d]">
              Terms &amp; Dining Regulations
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#4d534b] leading-relaxed font-sans">
            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">1. Dining Hours &amp; Access</h4>
              <p className="mt-0.5 text-[#596055]">
                Dining access is strictly restricted to valid hostel residents during published operational hours:
              </p>
              <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-[#4d534b] pl-3 border-l-2 border-[#b7dfc4]">
                <li>&bull; Breakfast: 7:00 AM – 9:00 AM</li>
                <li>&bull; Lunch: 12:30 PM – 2:00 PM</li>
                <li>&bull; Evening Snacks (Common): 4:45 PM – 6:15 PM</li>
                <li>&bull; Dinner: 7:15 PM – 9:00 PM</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">2. Food Serving Discipline</h4>
              <p className="mt-0.5 text-[#596055]">
                Under the direct order of Chief Warden {CHIEF_WARDEN_NAME}, digital weighing machines are permanently positioned at serving counters. Cooked Chicken portions must weigh 150 g (180 g on Sundays) and Paneer portions must weigh 75 g, excluding bowl weight.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">3. Clean Tray &amp; Queue Protocol</h4>
              <p className="mt-0.5 text-[#596055]">
                Diners must clear used trays at designated wash stations immediately upon finishing meals to maintain counter turnaround and accurate exit sensor counting.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e231d] font-mono">4. Prototype Status &amp; Service Continuity</h4>
              <p className="mt-0.5 text-[#596055]">
                MessQ is deployed as an engineering project review prototype. Queue estimations are computed mathematically based on throughput across 3 counters.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 3: Custom Domain Setup Guide (For Project Owner & Evaluation) */}
      <section className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-[#f0e7d7]">
          <Globe className="w-4 h-4 text-[#236b3d]" />
          <h3 className="font-heading text-sm font-bold text-[#1e231d]">
            Custom Domain Configuration Guide
          </h3>
        </div>

        <p className="text-xs text-[#596055] leading-relaxed">
          To connect a university or custom top-level domain (e.g. <code className="font-mono bg-[#faf7f0] border border-[#e5dac6] px-1 py-0.5 rounded text-[11px]">messq.campus.edu</code>) to this Vercel deployment:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6] space-y-1">
            <span className="font-bold text-[#1e231d] block">Step 1: Vercel Domain Registration</span>
            <p className="text-[#596055] text-[11px]">
              Navigate to Vercel Project Settings &gt; Domains &gt; Add Domain. Enter your chosen custom domain.
            </p>
          </div>

          <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6] space-y-1">
            <span className="font-bold text-[#1e231d] block">Step 2: DNS Records</span>
            <p className="text-[#596055] text-[11px]">
              Add CNAME Record pointing to <code className="text-[#236b3d] font-bold">cname.vercel-dns.com</code> or A Record pointing to <code className="text-[#236b3d] font-bold">76.76.21.21</code> at your DNS registrar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
