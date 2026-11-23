/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StarfieldBackground } from './components/StarfieldBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SolarSystemSection } from './components/SolarSystemSection';
import { ExplorationSection } from './components/ExplorationSection';
import { BlackHoleLab } from './components/BlackHoleLab';
import { MissionTimeline } from './components/MissionTimeline';
import { SpaceDashboard } from './components/SpaceDashboard';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060913] text-slate-100">
      <StarfieldBackground />
      <Navbar />
      <main>
        <HeroSection />
        <SolarSystemSection />
        <ExplorationSection />
        <BlackHoleLab />
        <MissionTimeline />
        <SpaceDashboard />
      </main>
      <Footer />
    </div>
  );
}
