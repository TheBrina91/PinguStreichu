import React, { useMemo } from 'react';

export function SnowBackground({ isNight = true }) {
  // Generate random snowflakes
  const flakes = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 7 + 5,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.3,
      blur: Math.random() > 0.7 ? 1 : 0,
    }));
  }, []);

  return (
    <div className={`snow-container ${isNight ? 'night' : 'day'}`} aria-hidden="true">
      {/* Aurora glow blobs */}
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />

      {/* Floating snowflakes */}
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: f.opacity,
            filter: f.blur ? 'blur(1px)' : 'none',
          }}
        />
      ))}
    </div>
  );
}
