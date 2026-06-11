import { useState, useEffect, useRef, Fragment } from 'react';
import { motion } from "motion/react";
import {
  Leaf, Sparkles, Lock, Zap, Trophy, ChevronRight,
} from "lucide-react";
import { LunaCat } from '../../companion/LunaCat.jsx'

/* ══════════════════════════════════════════════
   DATA & THEME SYSTEM
══════════════════════════════════════════════ */

const GARDEN_THEMES = [
  { id: "classic", name: "Classic", emoji: "🌿" },
  { id: "forest",  name: "Forest",  emoji: "🌲" },
  { id: "autumn",  name: "Autumn",  emoji: "🍂" },
  { id: "galaxy",  name: "Galaxy",  emoji: "✨" },
  { id: "cyber",   name: "Cyber",   emoji: "⚡" },
];


const THEME_COLORS = {
  classic: { primary: "#22c55e", secondary: "#86efac", glow: "rgba(34,197,94,0.58)",   glowFaded: "rgba(34,197,94,0.12)",  trunk: "#713f12", sky: "linear-gradient(to bottom, #03040B 0%, #061b0f 50%, #0b3016 100%)", ground: "rgba(11,48,22,0.85)",  ambient: "rgba(34,197,94,0.09)",  firefly1: 145, firefly2: 55  },
  forest:  { primary: "#14b8a6", secondary: "#6ee7b7", glow: "rgba(6,182,212,0.58)",   glowFaded: "rgba(6,182,212,0.12)",  trunk: "#1c4532", sky: "linear-gradient(to bottom, #03040B 0%, #051a14 50%, #081e17 100%)", ground: "rgba(7,30,23,0.85)",   ambient: "rgba(6,182,212,0.08)",  firefly1: 165, firefly2: 50  },
  autumn:  { primary: "#f97316", secondary: "#fcd34d", glow: "rgba(249,115,22,0.58)",  glowFaded: "rgba(249,115,22,0.12)", trunk: "#92400e", sky: "linear-gradient(to bottom, #03040B 0%, #1c0a00 50%, #221004 100%)", ground: "rgba(34,16,4,0.85)",   ambient: "rgba(249,115,22,0.08)", firefly1: 30,  firefly2: 20  },
  galaxy:  { primary: "#8b5cf6", secondary: "#c4b5fd", glow: "rgba(139,92,246,0.58)", glowFaded: "rgba(139,92,246,0.12)", trunk: "#2e1065", sky: "linear-gradient(to bottom, #03040B 0%, #0b0618 50%, #0e071d 100%)", ground: "rgba(14,7,29,0.85)",   ambient: "rgba(139,92,246,0.09)", firefly1: 270, firefly2: 200 },
  cyber:   { primary: "#06b6d4", secondary: "#67e8f9", glow: "rgba(6,182,212,0.68)",   glowFaded: "rgba(6,182,212,0.15)",  trunk: "#0c4a6e", sky: "linear-gradient(to bottom, #03040B 0%, #001520 50%, #011e2a 100%)", ground: "rgba(1,30,42,0.85)",   ambient: "rgba(6,182,212,0.11)", firefly1: 185, firefly2: 160 },
};

const ACCESSORIES = [
  { emoji: "👓", name: "Glasses",  equipped: true,  unlocked: true,  level: null },
  { emoji: "🧣", name: "Scarf",    equipped: false, unlocked: true,  level: null },
  { emoji: "🎩", name: "Hat",      equipped: false, unlocked: false, level: 10   },
  { emoji: "🎒", name: "Backpack", equipped: false, unlocked: false, level: 12   },
  { emoji: "👑", name: "Crown",    equipped: false, unlocked: false, level: 15   },
];

const EVOLUTION_STAGES = [
  { name: "Seedling",     emoji: "🌱", xp: "0",     completed: true,  current: false, locked: false             },
  { name: "Sprout",       emoji: "🌿", xp: "100",   completed: true,  current: false, locked: false             },
  { name: "Young Tree",   emoji: "🌳", xp: "300",   completed: true,  current: false, locked: false             },
  { name: "Mature Tree",  emoji: "🌲", xp: "600",   completed: false, current: true,  locked: false, progress: 76 },
  { name: "Ancient Tree", emoji: "🌴", xp: "1,200", completed: false, current: false, locked: true              },
  { name: "Legendary",    emoji: "✦",  xp: "2,500", completed: false, current: false, locked: true              },
];

const GARDEN_TASKS = [
  { id: 1, label: "Complete 2 Habits",  xp: 20, done: true  },
  { id: 2, label: "Journal Entry",      xp: 15, done: true  },
  { id: 3, label: "Study Session",      xp: 25, done: false },
  { id: 4, label: "Daily Check-In",     xp: 10, done: false },
];

const GARDEN_MEMORIES_TIMELINE = [
  { emoji: "🌸", title: "First Bloom",          date: "Sep 1",  desc: "Your first flower bloomed.", incoming: false },
  { emoji: "🦋", title: "Butterfly Visitor",     date: "Sep 18", desc: "After your 7-day streak.",  incoming: false },
  { emoji: "🌿", title: "Forest Unlocked",       date: "Oct 3",  desc: "Reached Level 6.",          incoming: false },
  { emoji: "🌸", title: "Cherry Blossom Soon",   date: "Soon",   desc: "240 XP until it blooms.",   incoming: true  },
];

const GARDEN_MEMORIES_CARDS = [
  { emoji: "🌸", title: "First bloom",    date: "Sep 1",  detail: "Luna danced around every petal.",     color: "rgba(236,72,153,0.07)", border: "rgba(236,72,153,0.15)" },
  { emoji: "🦋", title: "Butterfly",      date: "Sep 18", detail: "Appeared after your 7-day streak.",   color: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.15)" },
  { emoji: "🌿", title: "Forest theme",   date: "Oct 3",  detail: "Reached Level 6. Forest came alive.", color: "rgba(20,184,166,0.07)", border: "rgba(20,184,166,0.15)" },
];

const STARS = Array.from({ length: 72 }, (_, i) => ({
  top:     `${(i * 137.508) % 68}%`,
  left:    `${(i * 97.33) % 100}%`,
  size:    ((i * 7) % 3) + 0.5,
  opacity: ((i * 13) % 48) / 100 + 0.08,
  dur:     `${2.2 + (i * 0.41) % 2.5}s`,
  delay:   `${(i * 0.61) % 3.2}s`,
}));

const FLOWER_POSITIONS = [
  { left: "7%",  bottom: "14%", emoji: "🌸", size: 1.3, dur: 3.5, delay: 0   },
  { left: "15%", bottom: "12%", emoji: "🌻", size: 1.1, dur: 4.1, delay: 0.4 },
  { left: "24%", bottom: "15%", emoji: "🌺", size: 1.2, dur: 3.8, delay: 0.8 },
  { left: "33%", bottom: "11%", emoji: "🌼", size: 1.0, dur: 3.2, delay: 1.1 },
  { left: "64%", bottom: "12%", emoji: "🌷", size: 1.1, dur: 4.4, delay: 0.3 },
  { left: "73%", bottom: "15%", emoji: "🌸", size: 1.3, dur: 3.6, delay: 0.9 },
  { left: "82%", bottom: "13%", emoji: "🌿", size: 1.0, dur: 4.0, delay: 0.6 },
  { left: "90%", bottom: "11%", emoji: "🌼", size: 1.2, dur: 3.3, delay: 1.4 },
];

const BUTTERFLIES = [
  { x: "14%", y: "24%", delay: 0,   scale: 1.1  },
  { x: "72%", y: "18%", delay: 2.1, scale: 0.85 },
  { x: "38%", y: "10%", delay: 4.5, scale: 0.95 },
  { x: "56%", y: "30%", delay: 1.3, scale: 0.75 },
];

const AUTUMN_LEAVES = Array.from({ length: 18 }, (_, i) => ({
  x:     `${(i * 5.75 + 2) % 98}%`,
  sway:  12 + ((i * 11) % 30),
  size:  0.75 + ((i * 17) % 50) / 100,
  dur:   5.5 + ((i * 1.3) % 5),
  delay: (i * 0.8) % 9,
  emoji: ["🍂", "🍁", "🍂", "🍁", "🍃"][i % 5],
}));

/* ══════════════════════════════════════════════
   TREE SVG
══════════════════════════════════════════════ */
function GardenTree({ theme }) {
  const c = THEME_COLORS[theme];
  const uid = `gt-${theme}`;
  return (
    <div style={{ filter: `drop-shadow(0 0 28px ${c.glow}) drop-shadow(0 0 66px ${c.glowFaded})` }}>
      <svg width="220" height="290" viewBox="0 0 220 290">
        <defs>
          <radialGradient id={`cg-${uid}`} cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={c.secondary} stopOpacity="0.95" />
            <stop offset="100%" stopColor={c.primary} stopOpacity="0.65" />
          </radialGradient>
          <radialGradient id={`gs-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c.glow} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {/* Root glow */}
        <ellipse cx="110" cy="282" rx="70" ry="14" fill={c.primary} opacity="0.16" />
        {/* Trunk */}
        <path d="M95 282 Q99 255 100 228 Q104 206 110 194 Q116 206 120 228 Q121 255 125 282 Z" fill={c.trunk} />
        <path d="M100 282 Q102 255 103 228 Q106 210 110 198 Q106 210 105 228 Q104 255 104 282 Z" fill="rgba(255,255,255,0.07)" />
        {/* Roots */}
        <path d="M95 275 Q75 288 55 294" stroke={c.trunk} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M125 275 Q145 288 165 294" stroke={c.trunk} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M110 282 Q110 294 110 302" stroke={c.trunk} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M97 280 Q82 296 68 302" stroke={c.trunk} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M123 280 Q138 296 152 302" stroke={c.trunk} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55" />
        {/* Wide canopy base glow */}
        <circle cx="110" cy="118" r="94" fill={c.primary} opacity="0.05" />
        <circle cx="110" cy="116" r="74" fill={`url(#cg-${uid})`} opacity="0.18" />
        {/* Lower canopy */}
        <circle cx="72" cy="150" r="46" fill={c.primary} opacity="0.50" />
        <circle cx="148" cy="144" r="48" fill={c.primary} opacity="0.46" />
        <circle cx="110" cy="98" r="60" fill={c.primary} opacity="0.56" />
        <circle cx="86" cy="122" r="37" fill={c.primary} opacity="0.46" />
        <circle cx="134" cy="116" r="42" fill={c.primary} opacity="0.43" />
        {/* Upper canopy */}
        <circle cx="96" cy="62" r="38" fill={c.secondary} opacity="0.52" />
        <circle cx="122" cy="78" r="32" fill={c.secondary} opacity="0.44" />
        <circle cx="78" cy="86" r="27" fill={c.secondary} opacity="0.40" />
        <circle cx="110" cy="48" r="30" fill={c.secondary} opacity="0.58" />
        {/* Tip highlights */}
        <circle cx="93" cy="46" r="13" fill={c.secondary} opacity="0.84" />
        <circle cx="118" cy="60" r="10" fill={c.secondary} opacity="0.70" />
        <circle cx="76" cy="76" r="8"  fill={c.secondary} opacity="0.56" />
        <circle cx="104" cy="33" r="9"  fill="#ffffff"     opacity="0.38" />
        <circle cx="120" cy="44" r="5"  fill="#ffffff"     opacity="0.22" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GARDEN SCENE — HERO CENTERPIECE (ENHANCED)
══════════════════════════════════════════════ */
function GardenScene({ theme }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const rafRef       = useRef(0);
  const c = THEME_COLORS[theme];
  const isAutumn = theme === "autumn";

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    cancelAnimationFrame(rafRef.current);

    const w = container.clientWidth  || 800;
    const h = container.clientHeight || 430;
    canvas.width  = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hex = c.primary.replace("#", "");
    const cr  = parseInt(hex.slice(0, 2), 16);
    const cg  = parseInt(hex.slice(2, 4), 16);
    const cb  = parseInt(hex.slice(4, 6), 16);

    /* — Fireflies — */
    const ff = Array.from({ length: 26 }, () => ({
      x: Math.random() * w, y: Math.random() * h * 0.74,
      vx: (Math.random() - 0.5) * 0.42, vy: (Math.random() - 0.5) * 0.32,
      sz: Math.random() * 1.6 + 0.8, op: Math.random(), od: Math.random() > 0.5 ? 1 : -1,
      hue: Math.random() > 0.55 ? c.firefly1 : c.firefly2,
      trail: [],
    }));

    /* — Rising tree particles — */
    const tX = w * 0.5, tY = h * 0.15;
    const pts = Array.from({ length: 36 }, () => ({
      x: tX + (Math.random() - 0.5) * 110, y: tY + Math.random() * 85,
      vx: (Math.random() - 0.5) * 0.25, vy: -(Math.random() * 0.44 + 0.12),
      sz: Math.random() * 1.6 + 0.4, life: Math.random(), ml: Math.random() * 0.55 + 0.45,
    }));

    /* — Ground mist particles — */
    const mist = Array.from({ length: 12 }, () => ({
      x: Math.random() * w, y: h * 0.82 + Math.random() * h * 0.12,
      vx: (Math.random() - 0.5) * 0.18, r: Math.random() * 55 + 35,
      op: Math.random() * 0.06 + 0.02, od: Math.random() > 0.5 ? 1 : -1,
    }));

    /* — Autumn leaf canvas particles (small dots) — */
    const canvasLeaves = isAutumn ? Array.from({ length: 20 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: Math.random() * 0.55 + 0.2,
      sz: Math.random() * 3 + 1.5, op: Math.random() * 0.55 + 0.25, rot: Math.random() * 360,
    })) : [];

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      /* Mist blobs */
      mist.forEach(m => {
        m.x += m.vx; m.op += m.od * 0.0004;
        if (m.op > 0.08) { m.op = 0.08; m.od = -1; }
        if (m.op < 0.01) { m.op = 0.01; m.od = 1; }
        if (m.x < -m.r) m.x = w + m.r; if (m.x > w + m.r) m.x = -m.r;
        const mg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
        mg.addColorStop(0, `rgba(${cr},${cg},${cb},${m.op})`);
        mg.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath(); ctx.fillStyle = mg; ctx.ellipse(m.x, m.y, m.r * 2.2, m.r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      });

      /* Fireflies with glow trail */
      ff.forEach(f => {
        f.trail.push({ x: f.x, y: f.y });
        if (f.trail.length > 6) f.trail.shift();
        f.x += f.vx; f.y += f.vy;
        f.op += f.od * 0.018;
        if (f.op > 1) { f.op = 1; f.od = -1; }
        if (f.op < 0) { f.op = 0; f.od = 1; f.vx = (Math.random() - 0.5) * 0.45; f.vy = (Math.random() - 0.5) * 0.35; }
        if (f.x < 0) f.x = w; if (f.x > w) f.x = 0;
        if (f.y < 0 || f.y > h * 0.78) f.vy *= -1;
        /* trail */
        f.trail.forEach((pt, ti) => {
          const a = (ti / f.trail.length) * f.op * 0.18;
          ctx.beginPath(); ctx.fillStyle = `hsla(${f.hue},85%,68%,${a})`; ctx.arc(pt.x, pt.y, f.sz * 3, 0, Math.PI * 2); ctx.fill();
        });
        /* glow bloom */
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.sz * 9);
        g.addColorStop(0, `hsla(${f.hue},85%,65%,${f.op * 0.60})`);
        g.addColorStop(1, `hsla(${f.hue},85%,65%,0)`);
        ctx.beginPath(); ctx.fillStyle = g; ctx.arc(f.x, f.y, f.sz * 9, 0, Math.PI * 2); ctx.fill();
        /* core dot */
        ctx.beginPath(); ctx.fillStyle = `hsla(${f.hue},100%,94%,${f.op})`; ctx.arc(f.x, f.y, f.sz, 0, Math.PI * 2); ctx.fill();
      });

      /* Rising tree magic particles */
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.0055;
        if (p.life <= 0) { p.x = tX + (Math.random() - 0.5) * 100; p.y = tY + Math.random() * 75; p.life = p.ml; p.vx = (Math.random() - 0.5) * 0.25; p.vy = -(Math.random() * 0.44 + 0.12); }
        const bloom = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.sz * 4);
        bloom.addColorStop(0, `rgba(${cr},${cg},${cb},${p.life * 0.55})`);
        bloom.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath(); ctx.fillStyle = bloom; ctx.arc(p.x, p.y, p.sz * 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.life * 0.5})`; ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();
      });

      /* Autumn canvas leaves (orange diamond dots) */
      canvasLeaves.forEach(lf => {
        lf.x += lf.vx; lf.y += lf.vy;
        lf.rot += 1.8;
        if (lf.y > h + 10) { lf.y = -10; lf.x = Math.random() * w; }
        if (lf.x < -10) lf.x = w; if (lf.x > w + 10) lf.x = 0;
        ctx.save();
        ctx.translate(lf.x, lf.y);
        ctx.rotate((lf.rot * Math.PI) / 180);
        ctx.fillStyle = `rgba(249,115,22,${lf.op})`;
        ctx.beginPath();
        ctx.moveTo(0, -lf.sz); ctx.lineTo(lf.sz * 0.6, 0); ctx.lineTo(0, lf.sz); ctx.lineTo(-lf.sz * 0.6, 0);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [theme, c, isAutumn]);

  return (
    <div ref={containerRef} className="relative glass-panel rounded-3xl overflow-hidden flex-shrink-0" style={{ height: "430px" }}>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: c.sky }} />

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, background: "#fff", opacity: s.opacity, animation: `sparkle-pop ${s.dur} ease-in-out ${s.delay} infinite` }} />
      ))}

      {/* Atmospheric depth — far hills */}
      <div className="absolute pointer-events-none" style={{ bottom: "30%", left: 0, right: 0, height: "28%" }}>
        <svg width="100%" height="100%" viewBox="0 0 800 120" preserveAspectRatio="none">
          <path d="M0 120 Q60 55 150 72 Q240 85 320 48 Q400 12 480 52 Q560 88 640 42 Q720 0 800 38 L800 120 Z"
            fill={`rgba(${theme === "autumn" ? "40,8,0" : theme === "galaxy" ? "15,5,35" : theme === "cyber" ? "0,18,28" : "4,20,10"},0.45)`} />
          <path d="M0 120 Q80 70 180 82 Q280 95 370 62 Q450 34 530 68 Q620 98 700 55 Q760 22 800 50 L800 120 Z"
            fill={`rgba(${theme === "autumn" ? "50,10,0" : theme === "galaxy" ? "18,6,42" : theme === "cyber" ? "0,22,35" : "5,25,12"},0.35)`} />
        </svg>
      </div>

      {/* Corner glow top-right */}
      <div className="absolute pointer-events-none"
        style={{ top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${c.glowFaded.replace("0.12", "0.22")} 0%, transparent 70%)`, filter: "blur(35px)" }} />

      {/* Ambient core under tree */}
      <div className="absolute pointer-events-none"
        style={{ bottom: "16%", left: "50%", transform: "translateX(-50%)", width: 460, height: 340, background: `radial-gradient(ellipse at center bottom, ${c.ambient.replace("0.09", "0.26").replace("0.08", "0.26").replace("0.11", "0.28")} 0%, transparent 65%)`, filter: "blur(20px)" }} />

      {/* Secondary ambient off-center */}
      <div className="absolute pointer-events-none"
        style={{ bottom: "20%", left: "20%", width: 200, height: 150, background: `radial-gradient(ellipse, ${c.glowFaded} 0%, transparent 70%)`, filter: "blur(25px)", opacity: 0.6 }} />

      {/* Ground layer */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "42%", background: `linear-gradient(to top, ${c.ground} 0%, ${c.ambient} 38%, transparent 100%)` }} />

      {/* Ground fog wisps */}
      <div className="absolute pointer-events-none" style={{ bottom: "12%", left: 0, right: 0, height: "12%", background: `linear-gradient(to top, ${c.ambient.replace("0.09", "0.14").replace("0.08", "0.14").replace("0.11", "0.16")} 0%, transparent 100%)`, filter: "blur(14px)" }} />

      {/* Mid-ground distant tree silhouettes */}
      <div className="absolute pointer-events-none" style={{ bottom: "22%", left: "4%", opacity: 0.25 }}>
        <svg width="28" height="55" viewBox="0 0 28 55"><path d="M14 55 L14 25 M14 25 Q5 15 8 5 Q14 -2 20 5 Q23 15 14 25" stroke={c.primary} strokeWidth="2" fill="none" /><circle cx="14" cy="12" r="10" fill={c.primary} /></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: "24%", right: "5%", opacity: 0.20 }}>
        <svg width="22" height="44" viewBox="0 0 22 44"><path d="M11 44 L11 22 M11 22 Q4 14 6 5 Q11 -1 16 5 Q18 14 11 22" stroke={c.secondary} strokeWidth="1.5" fill="none" /><circle cx="11" cy="11" r="8" fill={c.secondary} /></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: "26%", left: "12%", opacity: 0.18 }}>
        <svg width="18" height="36" viewBox="0 0 18 36"><circle cx="9" cy="9" r="7" fill={c.primary} /><rect x="7.5" y="14" width="3" height="22" fill={c.trunk} rx="1" /></svg>
      </div>

      {/* Central tree */}
      <div className="absolute" style={{ bottom: "16%", left: "50%", transform: "translateX(-50%)" }}>
        <div className="luna-glow-pulse"><GardenTree theme={theme} /></div>
      </div>

      {/* Flowers */}
      {FLOWER_POSITIONS.map((f, i) => (
        <div key={i} className="absolute select-none pointer-events-none"
          style={{ left: f.left, bottom: f.bottom, fontSize: `${f.size}rem`, animation: `luna-float ${f.dur}s ease-in-out infinite`, animationDelay: `${f.delay}s`, opacity: 0.90 }}>
          {f.emoji}
        </div>
      ))}

      {/* Luna */}
      <div className="absolute" style={{ bottom: "18%", left: "62%", transform: "translateX(-50%)" }}>
        <div className="luna-float" style={{ animationDelay: "0.9s" }}><LunaCat size={68} /></div>
        <p className="text-center mt-0.5" style={{ fontSize: "9px", color: "rgba(148,163,184,0.55)" }}>Luna 🌿</p>
      </div>

      {/* Butterflies */}
      {BUTTERFLIES.map((b, i) => (
        <motion.div key={i} className="absolute select-none pointer-events-none"
          style={{ left: b.x, top: b.y, fontSize: `${b.scale * 1.3}rem` }}
          animate={{ x: [0, 22, 38, 16, -12, -22, 0], y: [0, -14, -6, -20, -15, -6, 0] }}
          transition={{ duration: 7 + i * 2.2, repeat: Infinity, ease: "easeInOut", delay: b.delay }}>
          🦋
        </motion.div>
      ))}

      {/* Magic sparkles near tree */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none select-none"
          style={{ left: `${28 + i * 9}%`, top: `${28 + (i % 2) * 10}%`, fontSize: "0.55rem" }}
          animate={{ opacity: [0, 0.75, 0], y: [0, -18, -40], scale: [0.4, 1.1, 0.4] }}
          transition={{ duration: 2.6 + i * 0.55, repeat: Infinity, delay: i * 0.58 }}>
          ✨
        </motion.div>
      ))}

      {/* Autumn falling leaves (emoji, motion) */}
      {isAutumn && AUTUMN_LEAVES.map((lf, i) => (
        <motion.div key={i} className="absolute pointer-events-none select-none"
          style={{ left: lf.x, top: "-4%", fontSize: `${lf.size}rem`, opacity: 0.72 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, lf.sway, -lf.sway / 2, lf.sway / 3, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: lf.dur, repeat: Infinity, ease: "linear", delay: lf.delay }}>
          {lf.emoji}
        </motion.div>
      ))}

      {/* Canvas overlay (fireflies + particles) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Theme badge */}
      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(0,0,0,0.38)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.primary, boxShadow: `0 0 5px ${c.glow}`, animation: "bond-pulse 2s ease-in-out infinite" }} />
        <span className="text-[9px] font-medium text-white capitalize">{theme} Theme</span>
      </div>

      {/* Night badge */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
        <span className="text-[9px]">🌙</span>
        <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.7)" }}>Calm night</span>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center justify-between"
        style={{ background: "rgba(0,0,0,0.32)", borderTop: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-3.5">
          {[
            { label: "Level", value: "8",              color: c.primary },
            { label: "Stage", value: "Mature Tree 🌲", color: "rgba(248,250,252,0.9)" },
            { label: "XP",    value: "760 / 1,000",    color: "rgba(248,250,252,0.8)" },
          ].map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <div className="w-px h-3.5" style={{ background: "rgba(255,255,255,0.1)" }} />}
              <div className="flex items-center gap-1">
                <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.55)" }}>{item.label}</span>
                <span className="text-[9px] font-semibold" style={{ color: item.color }}>{item.value}</span>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <div className="w-1 h-1 rounded-full bg-emerald-400" style={{ animation: "bond-pulse 2s ease-in-out infinite" }} />
          <span className="text-[9px] font-medium text-emerald-300">Luna watching</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   EVOLUTION TIMELINE — wider + more visual weight
══════════════════════════════════════════════ */
function EvolutionTimeline() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass-panel rounded-3xl p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(20,184,166,0.08) 0%, transparent 55%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.05) 0%, transparent 60%)" }} />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(148,163,184,0.55)" }}>Garden Evolution Journey</p>
            <p className="text-sm text-white font-semibold leading-snug">Mature Tree · 250 XP from Ancient 🌴</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.22)" }}>
              <Leaf className="w-3 h-3 text-teal-400" />
              <span className="text-[9px] font-semibold text-teal-300">Stage 4 of 6</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.16)" }}>
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-[9px] font-semibold text-amber-300">+34 XP today</span>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mb-3 space-y-1">
          <div className="flex justify-between" style={{ fontSize: "9px" }}>
            <span style={{ color: "rgba(148,163,184,0.5)" }}>Overall garden progress</span>
            <span style={{ color: "#22d3ee", fontWeight: 600 }}>63%</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "63%" }} transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #22c55e, #06b6d4, #8b5cf6)", boxShadow: "0 0 8px rgba(6,182,212,0.4)" }} />
          </div>
        </div>

        <div className="flex items-center gap-0" style={{ overflowX: "hidden" }}>
          {EVOLUTION_STAGES.map((stage, i) => (
            <Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0" style={{ maxWidth: stage.current ? "140px" : "100px" }}>
                <div className="relative flex items-center justify-center" style={{ width: stage.current ? 58 : 42, height: stage.current ? 58 : 42, flexShrink: 0 }}>
                  {stage.current && (
                    <div className="absolute inset-0 rounded-full"
                      style={{ background: "radial-gradient(circle, rgba(6,182,212,0.26) 0%, transparent 70%)", animation: "luna-glow-pulse 3s ease-in-out infinite", transform: "scale(2.1)" }} />
                  )}
                  <div className="relative z-10 rounded-full flex items-center justify-center"
                    style={{
                      width: stage.current ? 58 : 42, height: stage.current ? 58 : 42,
                      background: stage.completed ? "rgba(6,182,212,0.16)" : stage.current ? "rgba(6,182,212,0.13)" : "rgba(255,255,255,0.025)",
                      border: stage.completed ? "2px solid rgba(6,182,212,0.45)" : stage.current ? "2.5px solid rgba(6,182,212,0.60)" : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: stage.current ? "0 0 20px rgba(6,182,212,0.35), 0 0 44px rgba(6,182,212,0.14)" : stage.completed ? "0 0 8px rgba(6,182,212,0.15)" : "none",
                      fontSize: stage.current ? "1.5rem" : "1.1rem",
                      flexShrink: 0,
                    }}>
                    {stage.locked
                      ? <span style={{ filter: "blur(2.5px) brightness(0.18)" }}>{stage.emoji}</span>
                      : <span style={{ filter: stage.current ? "drop-shadow(0 0 8px rgba(6,182,212,0.9))" : "none" }}>{stage.emoji}</span>}
                    {stage.completed && (
                      <div className="absolute rounded-full flex items-center justify-center"
                        style={{ bottom: "-3px", right: "-3px", width: "15px", height: "15px", background: "#22d3ee", boxShadow: "0 0 6px rgba(6,182,212,0.7)", fontSize: "8px", color: "#fff", fontWeight: 700 }}>✓</div>
                    )}
                  </div>
                </div>

                {stage.current && stage.progress !== undefined && (
                  <div className="w-full px-1 space-y-0.5">
                    <div className="flex justify-between" style={{ fontSize: "9px" }}>
                      <span style={{ color: "rgba(148,163,184,0.6)" }}>Progress</span>
                      <span className="font-bold text-cyan-400">{stage.progress}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${stage.progress}%` }}
                        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, #06b6d4, #14b8a6)", boxShadow: "0 0 6px rgba(6,182,212,0.5)" }} />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-[9px] font-semibold"
                    style={{ color: stage.current ? "#f8fafc" : stage.completed ? "rgba(103,232,249,0.85)" : "rgba(148,163,184,0.35)" }}>
                    {stage.locked ? "???" : stage.name}
                  </p>
                  <p style={{ fontSize: "8px", color: stage.current ? "rgba(148,163,184,0.6)" : "rgba(148,163,184,0.3)" }}>
                    {stage.locked ? "Locked" : `${stage.xp} XP`}
                  </p>
                  {stage.current && <p style={{ fontSize: "8px", color: "#22d3ee", fontWeight: 700 }} className="mt-0.5">← Here</p>}
                </div>
              </div>

              {i < EVOLUTION_STAGES.length - 1 && (
                <div className="flex items-center" style={{ marginBottom: "22px", width: "14px", flexShrink: 0 }}>
                  <div className="w-full h-0.5 rounded-full"
                    style={{
                      background: EVOLUTION_STAGES[i].completed ? "linear-gradient(to right, rgba(6,182,212,0.55), rgba(6,182,212,0.22))" : undefined,
                      backgroundImage: !EVOLUTION_STAGES[i].completed ? "repeating-linear-gradient(to right, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 4px, transparent 4px, transparent 9px)" : undefined,
                    }} />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{ background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.13)" }}>
          <span className="text-base flex-shrink-0">🌴</span>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#6ee7b7", marginBottom: "2px" }}>Ancient Tree awaits</p>
            <p style={{ fontSize: "9px", lineHeight: 1.5, color: "rgba(110,231,183,0.65)" }}>
              Deeper memories and a secret garden only Luna can enter. 250 XP away.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   LEFT COLUMN CARDS
══════════════════════════════════════════════ */
function GardenOverviewCard() {
  return (
    <div className="glass-panel rounded-3xl p-3 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(20,184,166,0.14) 0%, transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Overview</p>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.22)" }}>
            <Leaf className="w-2.5 h-2.5 text-teal-400" />
            <span className="text-[9px] font-semibold text-teal-300">Thriving</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.26)", boxShadow: "0 0 14px rgba(6,182,212,0.18)" }}>
            🌲
          </div>
          <div>
            <p className="text-xl font-bold text-white leading-none">Level 8</p>
            <p style={{ fontSize: "10px", color: "rgba(148,163,184,0.6)", marginTop: "2px" }}>Mature Tree · Stage 4 of 6</p>
          </div>
        </div>

        <div className="space-y-1 mb-2">
          <div className="flex items-center justify-between" style={{ fontSize: "10px" }}>
            <span className="flex items-center gap-1" style={{ color: "rgba(148,163,184,0.7)" }}>
              <Zap className="w-2.5 h-2.5 text-amber-400" /> Garden XP
            </span>
            <span className="font-semibold" style={{ color: "#6ee7b7" }}>760 / 1,000</span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "76%" }} transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #14b8a6, #06b6d4)", boxShadow: "0 0 8px rgba(6,182,212,0.5)" }} />
          </div>
          <p style={{ fontSize: "9px", color: "rgba(148,163,184,0.45)" }}>76% — 240 XP to Level 9</p>
        </div>

        <div className="p-2.5 rounded-2xl"
          style={{ background: "rgba(236,72,153,0.07)", border: "1px solid rgba(236,72,153,0.14)" }}>
          <p style={{ fontSize: "9px", color: "rgba(236,72,153,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "5px" }}>
            Next unlock
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "#fff" }}>Cherry Blossom Tree</p>
              <p style={{ fontSize: "9px", color: "rgba(148,163,184,0.55)" }}>Level 9 · 240 XP away</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LunaReflectionCard() {
  return (
    <div className="glass-panel rounded-3xl p-3 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 110%, rgba(6,182,212,0.13) 0%, transparent 65%)" }} />
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(12px)" }} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: "rgba(6,182,212,0.12)",
              border: "1px solid rgba(6,182,212,0.28)",
              boxShadow: "0 0 12px rgba(6,182,212,0.22)",
            }}>
            🐱
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#fff", lineHeight: 1 }}>Luna's Reflection</p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold flex-shrink-0"
                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
                😊 Happy
              </span>
              <span style={{ fontSize: "9px", color: "#fcd34d", fontWeight: 600 }}>+18 XP today</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "10px", lineHeight: 1.5, color: "rgba(148,163,184,0.75)", fontStyle: "italic" }}>
          "This garden reflects your consistency. Every flower here represents a day you chose to keep growing."
        </p>

        <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-xl"
          style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
            style={{ boxShadow: "0 0 5px rgba(52,211,153,0.8)", animation: "bond-pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: "9px", color: "rgba(148,163,184,0.6)" }}>Tending the garden with you 🌿</span>
        </div>
      </div>
    </div>
  );
}

function GardenTasksCard() {
  const [tasks, setTasks] = useState(GARDEN_TASKS);
  const done      = tasks.filter(t => t.done).length;
  const total     = tasks.length;
  const pct       = Math.round((done / total) * 100);
  const earnedXp  = tasks.filter(t => t.done).reduce((s, t) => s + t.xp, 0);
  const totalXp   = tasks.reduce((s, t) => s + t.xp, 0);

  const toggle = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="glass-panel rounded-3xl p-3 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(20,184,166,0.08) 0%, transparent 55%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Today's Tasks</p>
          <div className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#fcd34d" }}>{earnedXp}/{totalXp} XP</span>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between mb-1" style={{ fontSize: "9px" }}>
            <span style={{ color: "rgba(148,163,184,0.6)" }}>{done} of {total} complete</span>
            <span style={{ color: "#6ee7b7", fontWeight: 600 }}>{pct}%</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #14b8a6, #06b6d4)", boxShadow: "0 0 6px rgba(6,182,212,0.4)" }} />
          </div>
        </div>

        <div className="space-y-1">
          {tasks.map(task => (
            <div key={task.id} onClick={() => toggle(task.id)}
              className="flex items-center gap-2 px-2 py-1 rounded-xl cursor-pointer transition-all"
              style={{
                background: task.done ? "rgba(20,184,166,0.07)" : "rgba(255,255,255,0.015)",
                border: `1px solid ${task.done ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.04)"}`,
              }}>
              <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background: task.done ? "rgba(6,182,212,0.22)" : "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${task.done ? "rgba(6,182,212,0.55)" : "rgba(255,255,255,0.12)"}`,
                  flexShrink: 0,
                }}>
                {task.done && <span style={{ fontSize: "8px", color: "#22d3ee", fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{
                fontSize: "10px", flex: 1,
                color: task.done ? "rgba(148,163,184,0.5)" : "rgba(248,250,252,0.82)",
                textDecoration: task.done ? "line-through" : "none",
              }}>
                {task.label}
              </span>
              <span style={{ fontSize: "9px", color: "#fcd34d", fontWeight: 600, flexShrink: 0 }}>+{task.xp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GardenStatsCard() {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,0.55)" }}>Garden Stats</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { emoji: "🌸", label: "Flowers",     value: "12" },
          { emoji: "🦋", label: "Butterflies", value: "7"  },
          { emoji: "📅", label: "Days active", value: "47" },
          { emoji: "🎁", label: "Collected",   value: "18" },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-2 rounded-xl flex flex-col gap-0.5"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-base">{s.emoji}</span>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{s.value}</span>
            <span style={{ fontSize: "9px", color: "rgba(148,163,184,0.55)" }}>{s.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   RIGHT COLUMN CARDS
══════════════════════════════════════════════ */
function ThemeSelectorCard({ active, onSelect }) {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Theme</p>
        <Sparkles className="w-3 h-3 text-cyan-400" />
      </div>
      <div className="space-y-1">
        {GARDEN_THEMES.map(t => {
          const isActive = t.id === active;
          const tc = THEME_COLORS[t.id];
          return (
            <button key={t.id} onClick={() => onSelect(t.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all text-left"
              style={{
                background: isActive ? `${tc.primary}18` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? `${tc.primary}40` : "rgba(255,255,255,0.05)"}`,
                boxShadow: isActive ? `0 0 12px ${tc.glowFaded}` : "none",
              }}>
              <span className="text-sm">{t.emoji}</span>
              <span style={{ fontSize: "11px", fontWeight: 500, flex: 1, color: isActive ? "#f8fafc" : "rgba(148,163,184,0.75)" }}>{t.name}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: tc.primary, boxShadow: `0 0 5px ${tc.glow}`, animation: "bond-pulse 2s ease-in-out infinite" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccessoriesCard() {
  const [equipped, setEquipped] = useState("Glasses");
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Accessories</p>
        <span style={{ fontSize: "9px", color: "rgba(148,163,184,0.45)" }}>2 unlocked</span>
      </div>
      <div className="space-y-1">
        {ACCESSORIES.map((a, i) => {
          const isEq = equipped === a.name && a.unlocked;
          return (
            <div key={i} onClick={() => a.unlocked && setEquipped(a.name)}
              className="flex items-center gap-2 px-2 py-1 rounded-xl transition-all"
              style={{
                background: isEq ? "rgba(6,182,212,0.1)" : a.unlocked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
                border: `1px solid ${isEq ? "rgba(6,182,212,0.28)" : a.unlocked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)"}`,
                opacity: a.unlocked ? 1 : 0.42, cursor: a.unlocked ? "pointer" : "default",
              }}>
              <span style={{ fontSize: "1.1rem", filter: !a.unlocked ? "grayscale(1) brightness(0.35)" : isEq ? "drop-shadow(0 0 6px rgba(6,182,212,0.8))" : "none" }}>
                {a.emoji}
              </span>
              <span style={{ fontSize: "11px", flex: 1, color: isEq ? "#67e8f9" : a.unlocked ? "rgba(248,250,252,0.75)" : "rgba(148,163,184,0.4)" }}>{a.name}</span>
              {isEq && <span style={{ fontSize: "8px", padding: "1px 6px", borderRadius: "9999px", background: "rgba(6,182,212,0.15)", color: "#67e8f9", fontWeight: 600 }}>On</span>}
              {!a.unlocked && (
                <div className="flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                  <span style={{ fontSize: "8px", color: "rgba(148,163,184,0.35)" }}>Lv.{a.level}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingUnlockCard() {
  return (
    <div className="glass-panel rounded-3xl p-3 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(236,72,153,0.08) 0%, transparent 60%)" }} />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,0.55)" }}>Next Unlock</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.22)" }}>🌸</div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Cherry Blossom</p>
            <p style={{ fontSize: "9px", color: "rgba(148,163,184,0.55)" }}>Level 9 · 240 XP</p>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: "76%" }} transition={{ duration: 1.3, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #ec4899, #f97316)", boxShadow: "0 0 7px rgba(236,72,153,0.4)" }} />
        </div>
        <p style={{ fontSize: "9px", color: "rgba(148,163,184,0.4)", marginTop: "4px" }}>76% — keep growing 🌸</p>
      </div>
    </div>
  );
}

function GardenMemoriesCard() {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Garden Memories</p>
        <button className="flex items-center gap-0.5" style={{ fontSize: "10px", color: "#67e8f9" }}>
          All <ChevronRight className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Compact timeline */}
      <div className="relative pl-1">
        <div className="absolute left-3 top-2 bottom-2 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="space-y-2">
          {GARDEN_MEMORIES_TIMELINE.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}
              className="flex gap-2.5 relative items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs z-10"
                style={{
                  background: m.incoming ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${m.incoming ? "rgba(236,72,153,0.28)" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: m.incoming ? "0 0 8px rgba(236,72,153,0.22)" : "none",
                  animation: m.incoming ? "bond-pulse 2.5s ease-in-out infinite" : "none",
                }}>
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <span style={{ fontSize: "10px", fontWeight: 600, color: m.incoming ? "#f9a8d4" : "#f8fafc", lineHeight: 1.2 }}>{m.title}</span>
                  <span style={{ fontSize: "8px", color: "rgba(148,163,184,0.45)", flexShrink: 0 }}>{m.date}</span>
                </div>
                <p style={{ fontSize: "9px", color: "rgba(148,163,184,0.6)", lineHeight: 1.4, marginTop: "2px" }}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestonesCard() {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Milestones</p>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.14)" }}>
          <Trophy className="w-2.5 h-2.5 text-amber-400" />
          <span style={{ fontSize: "9px", color: "#fcd34d", fontWeight: 600 }}>3 reached</span>
        </div>
      </div>

      <div className="space-y-1.5 mb-2">
        {GARDEN_MEMORIES_CARDS.map((m, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
            style={{ background: m.color, border: `1px solid ${m.border}` }}>
            <span className="text-sm flex-shrink-0">{m.emoji}</span>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "10px", fontWeight: 600, color: "#fff" }}>{m.title}</p>
              <p style={{ fontSize: "8px", color: "rgba(148,163,184,0.65)", lineHeight: 1.3 }}>{m.detail}</p>
            </div>
            <span style={{ fontSize: "8px", color: "rgba(148,163,184,0.4)", flexShrink: 0 }}>{m.date}</span>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 rounded-xl flex items-center gap-2"
        style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.12)" }}>
        <span className="text-sm flex-shrink-0">🌴</span>
        <div>
          <p style={{ fontSize: "9px", fontWeight: 600, color: "#67e8f9" }}>Next: Ancient Tree</p>
          <p style={{ fontSize: "8px", color: "rgba(148,163,184,0.5)" }}>250 XP away</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export function FigmaGrowthGardenView({
  gardenTheme = 'forest',
  onThemeChange,
  level = 8,
  petName = 'Luna',
  petLevel = 12,
}) {
  const [activeTheme, setActiveTheme] = useState(gardenTheme);

  useEffect(() => {
    setActiveTheme(gardenTheme);
  }, [gardenTheme]);

  const handleTheme = (theme) => {
    setActiveTheme(theme);
    onThemeChange?.(theme);
  };

  return (
    <div className="flex flex-col gap-2 pb-4 max-w-[1700px] mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold tracking-tight" style={{ fontSize: "1.3rem" }}>Growth Garden</h2>
          <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.65)", marginTop: "2px" }}>
            Level {level} · Mature Tree · Luna is tending the garden 🌿
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
            style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}>
            <Leaf className="w-3 h-3 text-teal-400" />
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#5eead4" }}>Garden thriving</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)", animation: "bond-pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#6ee7b7" }}>{petName} · Lv.{petLevel}</span>
          </div>
        </div>
      </motion.div>

      {/* 3-column layout */}
      <div className="flex gap-2 items-start">

        {/* Left column — 4 cards */}
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}
          className="flex-shrink-0 flex flex-col gap-2" style={{ width: "188px" }}>
          <GardenOverviewCard />
          <LunaReflectionCard />
          <GardenTasksCard />
          <GardenStatsCard />
        </motion.div>

        {/* Center column — scene + evolution */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="flex-1 min-w-0 flex flex-col gap-2">
          <GardenScene theme={activeTheme} />
          <EvolutionTimeline />
        </motion.div>

        {/* Right column — 5 cards */}
        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}
          className="flex-shrink-0 flex flex-col gap-2" style={{ width: "196px" }}>
          <ThemeSelectorCard active={activeTheme} onSelect={handleTheme} />
          <AccessoriesCard />
          <UpcomingUnlockCard />
          <GardenMemoriesCard />
          <MilestonesCard />
        </motion.div>
      </div>
    </div>
  );
}
