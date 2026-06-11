/** Approved Figma asset — do not restyle (LunaCat.tsx from Make) */
export function LunaCat({ size = 180, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 180 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="luna-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="eye-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bodyGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e2d4a" />
          <stop offset="60%" stopColor="#131d33" />
          <stop offset="100%" stopColor="#0a1120" />
        </radialGradient>
        <radialGradient id="headGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e2d4a" />
          <stop offset="60%" stopColor="#141e34" />
          <stop offset="100%" stopColor="#0a1120" />
        </radialGradient>
        <radialGradient id="eyeGrad" cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="40%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="bellyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="glowBg" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.18)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0)" />
        </radialGradient>
        <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.6)" />
          <stop offset="100%" stopColor="rgba(20,184,166,0.6)" />
        </linearGradient>
        <linearGradient id="earInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.35)" />
          <stop offset="100%" stopColor="rgba(20,184,166,0.2)" />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="160" rx="65" ry="30" fill="url(#glowBg)" />
      <ellipse cx="90" cy="192" rx="42" ry="6" fill="rgba(0,0,0,0.35)" />
      <ellipse cx="90" cy="148" rx="48" ry="52" fill="url(#bodyGrad)" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
      <circle cx="90" cy="82" r="48" fill="url(#headGrad)" stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
      <polygon points="48,54 57,16 76,50" fill="#0e1828" stroke="rgba(6,182,212,0.35)" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points="52,50 59,24 72,48" fill="url(#earInner)" />
      <polygon points="104,50 123,16 132,54" fill="#0e1828" stroke="rgba(6,182,212,0.35)" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points="108,48 121,24 128,50" fill="url(#earInner)" />
      <circle cx="57" cy="17" r="4" fill="rgba(6,182,212,0.15)" />
      <circle cx="123" cy="17" r="4" fill="rgba(6,182,212,0.15)" />
      <ellipse cx="69" cy="78" rx="13" ry="15" fill="url(#eyeGrad)" filter="url(#eye-glow)" />
      <ellipse cx="70" cy="79" rx="7" ry="11" fill="rgba(0,8,20,0.92)" />
      <ellipse cx="74" cy="74" rx="3.5" ry="4" fill="white" opacity="0.95" />
      <circle cx="65" cy="82" r="1.5" fill="white" opacity="0.5" />
      <ellipse cx="111" cy="78" rx="13" ry="15" fill="url(#eyeGrad)" filter="url(#eye-glow)" />
      <ellipse cx="112" cy="79" rx="7" ry="11" fill="rgba(0,8,20,0.92)" />
      <ellipse cx="116" cy="74" rx="3.5" ry="4" fill="white" opacity="0.95" />
      <circle cx="107" cy="82" r="1.5" fill="white" opacity="0.5" />
      <polygon points="90,96 86,103 94,103" fill="rgba(6,182,212,0.75)" filter="url(#luna-glow)" />
      <path d="M86,103 Q90,109 94,103" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="55" cy="92" rx="10" ry="6" fill="rgba(6,182,212,0.08)" />
      <ellipse cx="125" cy="92" rx="10" ry="6" fill="rgba(6,182,212,0.08)" />
      <line x1="22" y1="93" x2="78" y2="97" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="101" x2="78" y2="99" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="28" y1="108" x2="78" y2="103" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      <line x1="102" y1="97" x2="158" y2="93" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="102" y1="99" x2="158" y2="101" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="102" y1="103" x2="152" y2="108" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M135,158 Q165,140 158,112 Q152,86 140,118 Q134,138 142,148"
        stroke="url(#tailGrad)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="65" cy="188" rx="22" ry="11" fill="#101828" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
      <ellipse cx="55" cy="186" rx="5" ry="3.5" fill="#0c1622" />
      <ellipse cx="65" cy="185" rx="5" ry="3.5" fill="#0c1622" />
      <ellipse cx="75" cy="186" rx="5" ry="3.5" fill="#0c1622" />
      <ellipse cx="115" cy="188" rx="22" ry="11" fill="#101828" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
      <ellipse cx="105" cy="186" rx="5" ry="3.5" fill="#0c1622" />
      <ellipse cx="115" cy="185" rx="5" ry="3.5" fill="#0c1622" />
      <ellipse cx="125" cy="186" rx="5" ry="3.5" fill="#0c1622" />
      <ellipse cx="90" cy="148" rx="28" ry="34" fill="url(#bellyGrad)" />
      <ellipse cx="90" cy="112" rx="20" ry="16" fill="rgba(255,255,255,0.03)" />
      <text x="83" y="60" fontSize="10" fill="rgba(6,182,212,0.6)" textAnchor="middle">
        ✦
      </text>
    </svg>
  );
}
