import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import {
  DEFAULT_PROFILE,
  INITIATIVES,
  InitiativeItem,
  PortfolioProfile,
} from './data/portfolio';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EditorialRibbon } from './components/EditorialRibbon';
import { WorkSection } from './components/WorkSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { SabotWidget } from './components/SabotWidget';
import { SectionReveal } from './components/SectionReveal';
import { ReadingProgressBar } from './components/ReadingProgressBar';

export default function App() {
  const profile: PortfolioProfile = DEFAULT_PROFILE;

  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeItem | null>(null);
  const [isSabotOpen, setIsSabotOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.title = `${profile.name} — Portfolio`;
  }, [profile.name]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleScrollToContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen w-full overflow-x-clip flex flex-col bg-[#F8FBFF] dark:bg-[#050917] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Global ambient cyan/blue/indigo atmospheric lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 opacity-65 dark:opacity-100 transition-opacity duration-200"
          style={{
            background:
              'radial-gradient(60% 42% at 15% 8%, rgba(6, 182, 212, 0.13), transparent 70%), radial-gradient(50% 40% at 88% 18%, rgba(59, 130, 246, 0.14), transparent 70%), radial-gradient(48% 38% at 80% 62%, rgba(99, 102, 241, 0.11), transparent 70%), radial-gradient(52% 40% at 18% 84%, rgba(20, 184, 166, 0.10), transparent 72%)',
          }}
        />

        <div className="relative z-10 flex-1 flex flex-col w-full">
          <ReadingProgressBar />
          <Header
            brandName={profile.name}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onContactClick={handleScrollToContact}
          />

          <main className="flex-1 w-full">
          <SectionReveal immediate>
            <Hero profile={profile} />
          </SectionReveal>
          <SectionReveal>
            <EditorialRibbon />
          </SectionReveal>
          <SectionReveal>
            <WorkSection
              initiatives={INITIATIVES}
              onSelectInitiative={setSelectedInitiative}
            />
          </SectionReveal>
          <SectionReveal>
            <CapabilitiesSection />
          </SectionReveal>
          <SectionReveal>
            <ExperienceSection />
          </SectionReveal>
          <SectionReveal>
            <EducationSection />
          </SectionReveal>
          <SectionReveal>
            <ContactSection profile={profile} />
          </SectionReveal>
        </main>

        <Footer brandName={profile.name} />

        <ProjectModal
          initiative={selectedInitiative}
          initiatives={INITIATIVES}
          onClose={() => setSelectedInitiative(null)}
          onSelectInitiative={setSelectedInitiative}
        />

        <SabotWidget
          profile={profile}
          isOpen={isSabotOpen}
          onToggle={() => setIsSabotOpen((prev) => !prev)}
          onClose={() => setIsSabotOpen(false)}
        />
        </div>
      </div>
    </MotionConfig>
  );
}
