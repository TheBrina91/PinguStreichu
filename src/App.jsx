import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Penguin } from './components/Penguin';
import { Milestones } from './components/Milestones';
import { SnowBackground } from './components/SnowBackground';
import { playCutePetSound, playCelebration } from './utils/sound';
import './App.css';

const INITIAL_PENGUINS = [
  {
    id: 'pippo',
    name: 'Pippo',
    title: 'Der verspielte Baby-Pinguin',
    accessory: 'beanie',
    colorScheme: 'arctic-blue',
  },
  {
    id: 'luna',
    name: 'Luna',
    title: 'Die kuschlige Träumerin',
    accessory: 'scarf',
    colorScheme: 'soft-rose',
  },
  {
    id: 'barnaby',
    name: 'Sir Barnaby',
    title: 'Der edle Frackträger',
    accessory: 'bowtie',
    colorScheme: 'golden-sun',
  },
  {
    id: 'cookie',
    name: 'Cookie',
    title: 'Der kleine Wirbelwind',
    accessory: 'earmuffs',
    colorScheme: 'purple-aurora',
  },
];

const MILESTONE_THRESHOLDS = [1, 10, 25, 50];

export default function App() {
  const [isNight, setIsNight] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [petCounts, setPetCounts] = useState({
    pippo: 0,
    luna: 0,
    barnaby: 0,
    cookie: 0,
  });

  // Track milestones achieved
  const prevPetsRef = useRef(0);

  // Total pets across all penguins
  const totalPets = Object.values(petCounts).reduce((a, b) => a + b, 0);

  // Check for milestone unlocks
  useEffect(() => {
    MILESTONE_THRESHOLDS.forEach((threshold) => {
      if (prevPetsRef.current < threshold && totalPets >= threshold) {
        // Milestone reached!
        playCelebration(soundEnabled);
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff4d88', '#ff7597', '#a855f7', '#38bdf8', '#fbbf24'],
        });
      }
    });
    prevPetsRef.current = totalPets;
  }, [totalPets, soundEnabled]);

  const handlePetPenguin = useCallback(
    (id, event) => {
      // Play character-specific super-cute sound + sparkling hearts
      playCutePetSound(id, soundEnabled);

      setPetCounts((prev) => ({
        ...prev,
        [id]: prev[id] + 1,
      }));

      // Subtle confetti puff near penguin on click
      if (event && event.clientX) {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        confetti({
          particleCount: 15,
          spread: 45,
          startVelocity: 18,
          ticks: 60,
          origin: { x, y },
          colors: ['#ff4d88', '#ff7597', '#ff2e63', '#ffffff'],
        });
      }
    },
    [soundEnabled]
  );

  // Pet All button action
  const handlePetAll = useCallback(() => {
    playCelebration(soundEnabled);

    // Boost count for all penguins
    setPetCounts((prev) => ({
      pippo: prev.pippo + 1,
      luna: prev.luna + 1,
      barnaby: prev.barnaby + 1,
      cookie: prev.cookie + 1,
    }));

    // Festive confetti storm
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff3366', '#ff7597', '#38bdf8', '#fbbf24', '#ffffff'],
    });
  }, [soundEnabled]);

  return (
    <div className={`app-root ${isNight ? 'theme-night' : 'theme-day'}`}>
      {/* Animated Atmospheric Background */}
      <SnowBackground isNight={isNight} />

      {/* Main Container */}
      <main className="main-content">
        <Header
          totalPets={totalPets}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          isNight={isNight}
          onToggleTheme={() => setIsNight((v) => !v)}
          onPetAll={handlePetAll}
        />

        {/* Penguin Colony Section */}
        <section className="colony-section">
          <div className="section-title-wrap">
            <h2 className="section-title">Wähle einen Pinguin zum Streicheln</h2>
            <p className="section-subtitle">
              Jeder Pinguin hat seinen ganz eigenen Charakter und freut sich über deine Zuwendung!
            </p>
          </div>

          <div className="penguins-grid">
            {INITIAL_PENGUINS.map((p) => (
              <Penguin
                key={p.id}
                id={p.id}
                name={p.name}
                title={p.title}
                accessory={p.accessory}
                colorScheme={p.colorScheme}
                petCount={petCounts[p.id]}
                onPet={handlePetPenguin}
                soundEnabled={soundEnabled}
              />
            ))}
          </div>
        </section>

        {/* Milestones / Friendship Level Section */}
        <Milestones totalPets={totalPets} />

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Gemacht mit <span className="heart-inline">❤️</span> und React &bull; "Hallo Welt" Pinguin-Paradies
          </p>
          <span className="footer-hint">Tipp: Du kannst auch auf der Tastatur [Enter] oder [Leertaste] drücken!</span>
        </footer>
      </main>
    </div>
  );
}
