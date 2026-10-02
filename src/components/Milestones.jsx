import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';

const MILESTONES = [
  { threshold: 1, name: 'Erster Kontakt', desc: 'Den ersten Pinguin gestreichelt', icon: '❄️' },
  { threshold: 10, name: 'Kuschel-Fan', desc: '10 Streicheleinheiten verschenkt', icon: '💖' },
  { threshold: 25, name: 'Herz-Verteiler', desc: '25x reine Pinguin-Liebe', icon: '✨' },
  { threshold: 50, name: 'Pinguin-Flüsterer', desc: '50 Streicheleinheiten erreicht', icon: '👑' },
];

export function Milestones({ totalPets }) {
  return (
    <section className="milestones-section">
      <div className="section-header">
        <Award size={22} className="milestone-icon" />
        <h2>Pinguin-Freundschafts-Level</h2>
      </div>

      <div className="milestones-grid">
        {MILESTONES.map((m) => {
          const unlocked = totalPets >= m.threshold;
          const progress = Math.min(100, Math.round((totalPets / m.threshold) * 100));

          return (
            <div
              key={m.threshold}
              className={`milestone-card ${unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="milestone-badge-icon">{m.icon}</div>
              <div className="milestone-content">
                <div className="milestone-top">
                  <span className="milestone-title">{m.name}</span>
                  {unlocked ? (
                    <CheckCircle2 size={16} className="status-unlocked" />
                  ) : (
                    <Lock size={14} className="status-locked" />
                  )}
                </div>
                <p className="milestone-desc">{m.desc}</p>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="progress-text">
                  {totalPets}/{m.threshold}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
