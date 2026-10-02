import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const REACTION_PHRASES = [
  'Piiiep! 🥰',
  'Sooo flauschig! ✨',
  'Kuschelzeit! ❤️',
  'Hihi, das kitzelt! 🐧',
  'Mehr Liebe! 💕',
  '*schnatter vor Freude*',
  'Du bist mein Lieblingsmensch! 💖',
  'Watschel-Watschel! ❄️',
];

export function Penguin({
  id,
  name,
  title,
  accessory,
  colorScheme,
  petCount,
  onPet,
  soundEnabled,
  allPetTrigger = 0,
  animationDelay = 0,
}) {
  const [isPetting, setIsPetting] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [localHearts, setLocalHearts] = useState([]);
  const heartIdCounter = useRef(0);
  const timeoutRef = useRef(null);
  const isFirstMount = useRef(true);

  const triggerPet = (coords = null) => {
    setIsPetting(true);

    // Pick random reaction phrase
    const randomPhrase =
      REACTION_PHRASES[Math.floor(Math.random() * REACTION_PHRASES.length)];
    setReaction(randomPhrase);

    // Coordinate origin for hearts
    const x = coords ? coords.x : 100;
    const y = coords ? coords.y : 90;

    // Add 4-5 floating hearts with slight random angle & offset
    const newHearts = Array.from({ length: 5 }).map((_, i) => ({
      id: `${Date.now()}-${heartIdCounter.current++}-${i}`,
      x: x + (Math.random() * 50 - 25),
      y: y + (Math.random() * 30 - 15),
      scale: Math.random() * 0.6 + 0.8,
      rotation: Math.random() * 40 - 20,
      color: ['#ff4d88', '#ff2e63', '#ff7597', '#ff85a2', '#f368e0'][
        Math.floor(Math.random() * 5)
      ],
    }));

    setLocalHearts((prev) => [...prev, ...newHearts]);

    // Clear active petting state
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsPetting(false);
    }, 750);

    // Remove old local hearts after animation
    setTimeout(() => {
      setLocalHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 1200);

    // Fade reaction bubble after 1.5s
    setTimeout(() => {
      setReaction((current) => (current === randomPhrase ? null : current));
    }, 1500);
  };

  const handleClick = (e) => {
    // Get click position relative to the penguin card for precise heart burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    triggerPet({ x, y });
    onPet(id, e);
  };

  // Listen to external 'Alle Pinguine knuddeln' trigger
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (allPetTrigger > 0) {
      const delayTimer = setTimeout(() => {
        triggerPet();
      }, animationDelay);
      return () => clearTimeout(delayTimer);
    }
  }, [allPetTrigger, animationDelay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`penguin-card ${isPetting ? 'is-petting' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${name} streicheln`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {/* Speech / Reaction Bubble */}
      {reaction && (
        <div className="penguin-reaction-bubble" key={reaction}>
          <span>{reaction}</span>
          <div className="bubble-tail" />
        </div>
      )}

      {/* Floating local click hearts */}
      <div className="local-hearts-overlay" aria-hidden="true">
        {localHearts.map((heart) => (
          <span
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              '--target-rot': `${heart.rotation}deg`,
              transform: `scale(${heart.scale})`,
              color: heart.color,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Interactive Penguin Graphic (SVG) */}
      <div className="penguin-avatar-wrapper">
        <svg
          viewBox="0 0 200 240"
          className="penguin-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`belly-grad-${id}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </radialGradient>
            <radialGradient id={`body-grad-${id}`} cx="45%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#2d3748" />
              <stop offset="70%" stopColor="#1a202c" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id={`beak-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id={`feet-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id={`shadow-${id}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Ice / ground shadow */}
          <ellipse
            cx="100"
            cy="225"
            rx="56"
            ry="11"
            fill="rgba(0, 30, 60, 0.16)"
            className="ground-shadow"
          />

          {/* Feet */}
          <g className="penguin-feet">
            <ellipse
              cx="75"
              cy="218"
              rx="18"
              ry="9"
              fill={`url(#feet-grad-${id})`}
              transform="rotate(-8 75 218)"
            />
            <ellipse
              cx="125"
              cy="218"
              rx="18"
              ry="9"
              fill={`url(#feet-grad-${id})`}
              transform="rotate(8 125 218)"
            />
          </g>

          {/* Left Flipper (Wing) */}
          <g className={`flipper left-flipper ${isPetting ? 'flapping' : ''}`}>
            <path
              d="M 52 110 C 26 122 18 165 34 184 C 42 193 54 186 58 174 C 62 160 64 135 52 110 Z"
              fill={`url(#body-grad-${id})`}
              filter={`url(#shadow-${id})`}
            />
          </g>

          {/* Right Flipper (Wing) */}
          <g className={`flipper right-flipper ${isPetting ? 'flapping' : ''}`}>
            <path
              d="M 148 110 C 174 122 182 165 166 184 C 158 193 146 186 142 174 C 138 160 136 135 148 110 Z"
              fill={`url(#body-grad-${id})`}
              filter={`url(#shadow-${id})`}
            />
          </g>

          {/* Main Penguin Body */}
          <ellipse
            cx="100"
            cy="135"
            rx="64"
            ry="82"
            fill={`url(#body-grad-${id})`}
            filter={`url(#shadow-${id})`}
            className="main-body"
          />

          {/* White Belly */}
          <path
            d="M 100 82 C 132 82 144 118 144 150 C 144 188 126 210 100 210 C 74 210 56 188 56 150 C 56 118 68 82 100 82 Z"
            fill={`url(#belly-grad-${id})`}
          />

          {/* Cheeks (Blushing pink) */}
          <ellipse
            cx="66"
            cy="126"
            rx="11"
            ry="7"
            fill="#ff6b8b"
            className={`blush-cheek ${isPetting ? 'blushing-bright' : ''}`}
            opacity={isPetting ? '0.85' : '0.45'}
          />
          <ellipse
            cx="134"
            cy="126"
            rx="11"
            ry="7"
            fill="#ff6b8b"
            className={`blush-cheek ${isPetting ? 'blushing-bright' : ''}`}
            opacity={isPetting ? '0.85' : '0.45'}
          />

          {/* Eyes (Happy crescents when petting, big sparkling pupils normally) */}
          {isPetting ? (
            <g className="happy-eyes" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none">
              {/* Joyful arched eye curves ^ ^ */}
              <path d="M 68 114 Q 78 102 88 114" />
              <path d="M 112 114 Q 122 102 132 114" />
            </g>
          ) : (
            <g className="normal-eyes">
              {/* Left Eye */}
              <ellipse cx="78" cy="110" rx="9" ry="12" fill="#0f172a" />
              <ellipse cx="75" cy="106" rx="3.5" ry="5" fill="#ffffff" />
              <circle cx="81" cy="115" r="1.8" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="122" cy="110" rx="9" ry="12" fill="#0f172a" />
              <ellipse cx="119" cy="106" rx="3.5" ry="5" fill="#ffffff" />
              <circle cx="125" cy="115" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Beak */}
          <path
            d="M 90 120 Q 100 114 110 120 Q 100 138 90 120 Z"
            fill={`url(#beak-grad-${id})`}
            filter={`url(#shadow-${id})`}
          />

          {/* Accessories */}
          {accessory === 'beanie' && (
            <g className="accessory beanie">
              {/* Pom-pom */}
              <circle cx="100" cy="38" r="12" fill="#ffffff" filter={`url(#shadow-${id})`} />
              {/* Beanie cap */}
              <path
                d="M 58 75 C 60 44 140 44 142 75 Z"
                fill="#38bdf8"
              />
              {/* Beanie rib brim */}
              <rect x="52" y="68" width="96" height="15" rx="7" fill="#0284c7" />
              <line x1="72" y1="68" x2="72" y2="83" stroke="#38bdf8" strokeWidth="2" />
              <line x1="100" y1="68" x2="100" y2="83" stroke="#38bdf8" strokeWidth="2" />
              <line x1="128" y1="68" x2="128" y2="83" stroke="#38bdf8" strokeWidth="2" />
            </g>
          )}

          {accessory === 'scarf' && (
            <g className="accessory scarf">
              {/* Scarf wrapped around neck */}
              <path
                d="M 64 135 C 80 144 120 144 136 135 C 142 144 136 154 120 156 C 80 158 60 148 64 135 Z"
                fill="#f43f5e"
              />
              {/* Scarf hanging tail */}
              <path
                d="M 112 146 L 126 195 L 105 198 L 98 152 Z"
                fill="#e11d48"
              />
              {/* Scarf fringes */}
              <line x1="108" y1="197" x2="108" y2="204" stroke="#f43f5e" strokeWidth="2" />
              <line x1="116" y1="196" x2="116" y2="204" stroke="#f43f5e" strokeWidth="2" />
              <line x1="124" y1="195" x2="124" y2="203" stroke="#f43f5e" strokeWidth="2" />
            </g>
          )}

          {accessory === 'bowtie' && (
            <g className="accessory bowtie">
              {/* Elegant Top Hat */}
              <rect x="74" y="32" width="52" height="34" rx="4" fill="#1e1e24" />
              <rect x="62" y="64" width="76" height="8" rx="4" fill="#1e1e24" />
              <rect x="74" y="58" width="52" height="6" fill="#eab308" />
              {/* Yellow Bowtie on chest */}
              <polygon points="86,140 100,146 86,152" fill="#eab308" />
              <polygon points="114,140 100,146 114,152" fill="#eab308" />
              <circle cx="100" cy="146" r="4" fill="#ca8a04" />
            </g>
          )}

          {accessory === 'earmuffs' && (
            <g className="accessory earmuffs">
              {/* Headband */}
              <path
                d="M 56 95 A 48 48 0 0 1 144 95"
                fill="none"
                stroke="#a855f7"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Fluffy earmuff left */}
              <ellipse cx="53" cy="98" rx="10" ry="14" fill="#c084fc" filter={`url(#shadow-${id})`} />
              {/* Fluffy earmuff right */}
              <ellipse cx="147" cy="98" rx="10" ry="14" fill="#c084fc" filter={`url(#shadow-${id})`} />
            </g>
          )}
        </svg>
      </div>

      {/* Info & Pet Button */}
      <div className="penguin-info">
        <h3 className="penguin-name">{name}</h3>
        <span className="penguin-title">{title}</span>

        <div className="penguin-stats">
          <span className="pet-badge">
            <Heart className="heart-icon-small" fill="#ff4d88" color="#ff4d88" size={16} />
            <strong className="pet-count-num">{petCount}</strong> gestreichelt
          </span>
        </div>

        <button
          type="button"
          className="pet-action-btn"
          aria-label={`${name} streicheln`}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
        >
          <Sparkles size={16} className="btn-sparkle" />
          <span>Streicheln!</span>
          <span className="btn-heart">❤️</span>
        </button>
      </div>
    </div>
  );
}
