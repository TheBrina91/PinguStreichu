import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Heart, Sparkles } from 'lucide-react';

export function Header({
  totalPets,
  soundEnabled,
  onToggleSound,
  isNight,
  onToggleTheme,
  onPetAll,
}) {
  return (
    <header className="app-header">
      {/* Top utility bar */}
      <div className="top-nav">
        <div className="status-pill">
          <span className="live-dot" />
          <span>Antarktis Pinguin-Station</span>
        </div>

        <div className="controls-group">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Ton stummschalten' : 'Ton aktivieren'}
            aria-label={soundEnabled ? 'Ton stummschalten' : 'Ton aktivieren'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            title={isNight ? 'Zu Tag wechseln' : 'Zu Polarlicht-Nacht wechseln'}
            aria-label={isNight ? 'Zu Tag wechseln' : 'Zu Polarlicht-Nacht wechseln'}
          >
            {isNight ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Main Greeting Hero */}
      <div className="hero-banner">
        <div className="hero-badge">
          <Sparkles size={16} className="sparkle-anim" />
          <span>Interaktives Kuschel-Erlebnis</span>
        </div>

        <h1 className="hero-title">
          Hallo Welt! <span className="penguin-emoji">🐧</span>
        </h1>

        <p className="hero-subtitle">
          Tippe oder klicke auf unsere süßen Pinguine, um ihnen Streicheleinheiten zu schenken.
          <br className="desktop-break" />
          Sie freuen sich riesig und verteilen fliegende Herzen an dich!
        </p>

        {/* Global Love Meter & Quick Pet All Action */}
        <div className="love-meter-container">
          <div className="love-counter-card">
            <div className="counter-icon-wrap">
              <Heart className="counter-heart-pulse" size={28} fill="#ff3366" color="#ff3366" />
            </div>
            <div className="counter-text">
              <span className="counter-label">Verteilte Liebe</span>
              <span className="counter-value">{totalPets} {totalPets === 1 ? 'Streicheleinheit' : 'Streicheleinheiten'}</span>
            </div>
          </div>

          <button
            type="button"
            className="pet-all-btn"
            onClick={onPetAll}
            title="Alle Pinguine auf einmal knuddeln!"
          >
            <Sparkles size={18} />
            <span>Alle Pinguine knuddeln!</span>
            <span className="btn-badge">Super-Liebe ✨</span>
          </button>
        </div>
      </div>
    </header>
  );
}
