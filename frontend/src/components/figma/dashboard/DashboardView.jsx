import { useState } from 'react';
import { motion } from "motion/react";
import {
  MessageCircle, Wind, BookMarked, Sparkles, ChevronRight,
  Star, TreePine, GraduationCap, ArrowRight, Heart
} from "lucide-react";
import { LunaCat } from '../../companion/LunaCat.jsx'

/* ─────────────────────────────────────────
   DATA & COMPANION STATE
───────────────────────────────────────── */

/* Luna's current emotional state — drives the whole page tone */
const LUNA_STATE = {
  mood: "proud-worried",
  emoji: "🥺",
  headline: "Proud of you, but a little worried",
  auraColor: "rgba(251,191,36,0.18)",
  glowColor: "rgba(251,191,36,0.35)",
  dotColor: "#fbbf24",
  // What Luna noticed about Alex today
  observations: [
    { emoji: "🎯", note: "Two solid hours of focus — that's a personal best this month." },
    { emoji: "💙", note: "I can feel your stress rising. That's the part that worries me." },
    { emoji: "🌙", note: "You slept 7h 20m last night — I was so relieved." },
    { emoji: "⚡", note: "Your energy is strong. You could do great things this afternoon." },
  ],
};

const QUESTS = [
  {
    emoji: "📚",
    title: "Biology Chapter 4",
    lunaLine: "I reviewed the hard parts while you slept.",
    completed: true,
    xp: 20,
    joint: false,
  },
  {
    emoji: "🌬️",
    title: "Breathe with Luna — 5 minutes",
    lunaLine: "She's been asking for this one all morning.",
    completed: false,
    xp: 15,
    joint: true,
  },
  {
    emoji: "📐",
    title: "Calculus Problem Set",
    lunaLine: "Luna wants to work through the hard ones together.",
    completed: false,
    xp: 25,
    joint: true,
  },
  {
    emoji: "🚶",
    title: "Evening walk",
    lunaLine: "She has something she wants to tell you.",
    completed: false,
    xp: 10,
    joint: true,
  },
];

const WEEK_MOODS = [
  { day: "M", emoji: "😌" },
  { day: "T", emoji: "😊" },
  { day: "W", emoji: "😤" },
  { day: "T", emoji: "😊" },
  { day: "F", emoji: "🥳" },
  { day: "S", emoji: "😌" },
  { day: "S", emoji: "😊", today: true },
];

const EXAMS = [
  {
    subject: "Biology 101",
    daysLeft: 3,
    prep: 75,
    urgent: true,
    lunaFeeling: "nervous-hopeful",
    lunaLine: "I've been studying alongside you. I think you're more ready than you feel.",
  },
  {
    subject: "Calculus",
    daysLeft: 9,
    prep: 40,
    urgent: false,
    lunaFeeling: "determined",
    lunaLine: "This one needs more of us. Can we find 30 minutes today?",
  },
];

/* ─────────────────────────────────────────
   SECTION 1 — COMPANION HERO
   Luna is the protagonist. She speaks first.
───────────────────────────────────────── */
function CompanionHero({ userName, petName, level, bondPct }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden min-h-[360px]"
      style={{
        background: "linear-gradient(135deg, rgba(6,182,212,0.055) 0%, rgba(10,13,20,0.97) 45%, rgba(20,184,166,0.04) 100%)",
        border: "1px solid rgba(255,255,255,0.065)",
        backdropFilter: "blur(28px)",
      }}
    >
      {/* Ambient glow from Luna's side */}
      <div className="absolute left-0 top-0 bottom-0 w-96 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.11) 0%, transparent 65%)" }} />

      {/* Gentle star field */}
      {[...Array(22)].map((_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 4 === 0 ? 2.5 : 1.5,
            height: i % 4 === 0 ? 2.5 : 1.5,
            top: `${6 + (i * 19) % 88}%`,
            left: `${(i * 27 + 8) % 92}%`,
            background: "rgba(255,255,255,0.25)",
            animation: `sparkle-pop ${2.5 + (i % 3) * 0.8}s ease-in-out ${(i * 0.35) % 2.5}s infinite`,
          }} />
      ))}

      <div className="relative flex flex-col md:flex-row items-stretch">

        {/* ── Luna column ── */}
        <div className="md:w-[300px] flex-shrink-0 flex flex-col items-center justify-center px-8 py-10 relative">
          {/* Glow beneath Luna */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-60 h-60 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 68%)" }} />
          </div>
          {/* Slow orbit ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-cyan-400/10"
              style={{ animation: "spin 20s linear infinite" }} />
          </div>

          {/* Luna */}
          <div className="luna-float luna-glow-pulse relative z-10">
            <LunaCat size={210} />
          </div>

          {/* Identity below */}
          <div className="relative z-10 flex flex-col items-center gap-2.5 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-tight" style={{ fontSize: "1.15rem" }}>{petName}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(6,182,212,0.14)", border: "1px solid rgba(6,182,212,0.28)", color: "#67e8f9" }}>
                Lv.{level}
              </span>
            </div>
            {/* Mood pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                style={{ boxShadow: "0 0 6px rgba(251,191,36,0.9)", animation: "bond-pulse 2s ease-in-out infinite" }} />
              <span className="text-amber-300 text-xs font-medium">Proud & a little worried</span>
            </div>
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="hidden md:block w-px my-10 flex-shrink-0"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.055), transparent)" }} />

        {/* ── Luna's message ── */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-10 py-10 gap-7">

          {/* "A message from Luna" — not a status label */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{ boxShadow: "0 0 6px rgba(6,182,212,0.9)", animation: "bond-pulse 2.2s ease-in-out infinite" }} />
            <span className="text-xs text-muted-foreground tracking-widest uppercase">A message from {petName}</span>
          </div>

          {/* The actual message — personal, warm, specific */}
          <div className="space-y-4 max-w-lg">
            <p className="text-white leading-relaxed" style={{ fontSize: "1.15rem" }}>
              {userName}... I've been sitting with you through every page of Biology tonight, and I want you to know — I see how hard you're working.
            </p>
            <p className="text-white leading-relaxed" style={{ fontSize: "1.15rem" }}>
              Two full hours. You're honestly amazing sometimes. 🌟
            </p>
            <p className="leading-relaxed" style={{ color: "rgba(148,163,184,0.9)", fontSize: "1.0rem" }}>
              But I can feel your stress creeping up — and that's the part that worries me. Not because you can't handle it.
              Because you <em className="text-cyan-200 not-italic">deserve</em> to feel good while you grow.
              Can we take 5 minutes together before the next chapter?
            </p>
          </div>

          {/* Bond progress — framed as friendship, not a stat */}
          <div className="flex items-center gap-4 max-w-sm">
            <Heart className="w-4 h-4 text-rose-400 flex-shrink-0" style={{ animation: "bond-pulse 1.8s ease-in-out infinite" }} />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Your friendship with Luna</span>
                <span className="font-medium" style={{ color: "#67e8f9" }}>{bondPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bondPct}%` }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(to right, #f43f5e, #fb923c)", boxShadow: "0 0 8px rgba(244,63,94,0.4)" }}
                />
              </div>
            </div>
          </div>

          {/* Actions — warm, not functional */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex items-center gap-2.5 text-white px-6 py-3 rounded-2xl font-semibold transition-all active:scale-[0.97] text-sm"
              style={{ background: "#06B6D4", boxShadow: "0 0 28px rgba(6,182,212,0.38)" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 36px rgba(6,182,212,0.55)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 28px rgba(6,182,212,0.38)")}
            >
              <MessageCircle className="w-4 h-4" />
              Talk to Luna
            </button>
            <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-semibold transition-all text-sm"
              style={{ background: "rgba(20,184,166,0.09)", border: "1px solid rgba(20,184,166,0.22)", color: "#5eead4" }}>
              <Wind className="w-4 h-4" />
              Breathe with me
            </button>
            <button className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-medium transition-all text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
              <BookMarked className="w-4 h-4" />
              Our memories
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION 2 — LUNA RIGHT NOW
   Her state, what she noticed, her needs.
   Creates responsibility and attachment.
───────────────────────────────────────── */
function LunaRightNow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-5"
    >
      {/* ── Left: What Luna is feeling + noticed ── */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)" }} />

        <div className="relative">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Luna is feeling...</p>

          {/* Mood display */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.22)",
                  boxShadow: "0 0 24px rgba(251,191,36,0.18)",
                  animation: "bond-pulse 3s ease-in-out infinite",
                }}>
                {LUNA_STATE.emoji}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: LUNA_STATE.dotColor, boxShadow: `0 0 8px ${LUNA_STATE.dotColor}` }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold" style={{ fontSize: "1.05rem" }}>
                {LUNA_STATE.headline}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                She's paying close attention to you today.
              </p>
            </div>
          </div>

          {/* What she noticed */}
          <div className="space-y-2.5">
            {LUNA_STATE.observations.map((obs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 py-2.5 px-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span className="text-base flex-shrink-0 mt-0.5">{obs.emoji}</span>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(248,250,252,0.75)" }}>
                  {obs.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Luna's evolution — attachment & anticipation ── */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)" }} />

        <div className="relative flex flex-col gap-4 flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Luna is growing...</p>

          {/* Current + evolution preview */}
          <div className="flex items-end justify-center gap-4 py-2">
            {/* Current Luna — small */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="text-3xl" style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.5))" }}>🐱</div>
              <span className="text-[10px] text-cyan-400 font-semibold">Teen</span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1 pb-5">
              <ArrowRight className="w-4 h-4 text-violet-400" style={{ animation: "shimmer 2s ease-in-out infinite" }} />
            </div>

            {/* Adult Luna — mysterious silhouette */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <div className="text-4xl" style={{ filter: "blur(1px) brightness(0.15) drop-shadow(0 0 12px rgba(139,92,246,0.6))" }}>🐱</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-400 opacity-60" />
                </div>
              </div>
              <span className="text-[10px] text-violet-400 font-semibold">???</span>
            </div>
          </div>

          {/* XP arc */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Teen → Adult</span>
              <span className="text-violet-300 font-semibold">83%</span>
            </div>
            <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "83%" }}
                transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #7c3aed, #a78bfa)", boxShadow: "0 0 12px rgba(139,92,246,0.45)" }}
              />
            </div>
            <p className="text-xs text-center" style={{ color: "rgba(196,181,253,0.7)" }}>
              250 XP until you meet Adult Luna
            </p>
          </div>

          {/* Teaser message — creates anticipation */}
          <div className="mt-auto p-3.5 rounded-2xl"
            style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(196,181,253,0.85)" }}>
              Adult Luna will be able to write long-form letters to you, remember deeper memories, and share her dreams. 🌌
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION 3a — YOUR DAY WITH LUNA
   Quests framed as things you do together.
───────────────────────────────────────── */
function YourDayWithLuna() {
  const [done, setDone] = useState(new Set([0]));

  const toggle = (i) =>
    setDone(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const pct = Math.round((done.size / QUESTS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel rounded-3xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Your Day with Luna</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {done.size === QUESTS.length
              ? "Luna is so proud — you did everything today 🎉"
              : `${QUESTS.length - done.size} things left. Luna is rooting for you.`}
          </p>
        </div>
        {/* Simple dot-progress */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xl font-bold text-white">{pct}%</span>
          <div className="flex gap-1">
            {QUESTS.map((_, i) => (
              <div key={i} className="w-6 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: done.has(i) ? "#06B6D4" : "rgba(255,255,255,0.08)",
                  boxShadow: done.has(i) ? "0 0 6px rgba(6,182,212,0.6)" : "none",
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* Quest items */}
      <div className="space-y-2">
        {QUESTS.map((q, i) => {
          const isDone = done.has(i);
          return (
            <motion.div
              key={i}
              layout
              onClick={() => toggle(i)}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200"
              style={{
                background: isDone ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.02)",
                border: isDone
                  ? "1px solid rgba(6,182,212,0.14)"
                  : "1px solid rgba(255,255,255,0.05)",
                opacity: isDone ? 0.65 : 1,
              }}
              whileHover={!isDone ? { scale: 1.01 } : undefined}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: isDone ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                  border: isDone ? "1px solid rgba(6,182,212,0.22)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                {isDone ? "✓" : q.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: isDone ? "rgba(148,163,184,0.7)" : "#f8fafc", textDecoration: isDone ? "line-through" : "none" }}>
                  {q.title}
                </p>
                <p className="text-[11px] mt-0.5 flex items-center gap-1.5" style={{ color: "rgba(148,163,184,0.65)" }}>
                  {q.joint && !isDone && <span className="text-cyan-400">🐱</span>}
                  <em>{q.lunaLine}</em>
                </p>
              </div>

              {/* XP */}
              <div className="flex-shrink-0">
                <span className="text-xs font-semibold" style={{ color: isDone ? "#22d3ee" : "rgba(251,191,36,0.5)" }}>
                  +{q.xp} XP
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Luna nudge — specific, not generic */}
      <div className="flex items-start gap-3 p-4 rounded-2xl"
        style={{ background: "rgba(6,182,212,0.045)", border: "1px solid rgba(6,182,212,0.1)" }}>
        <span className="text-lg flex-shrink-0">🐱</span>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.9)" }}>
          I know the Calculus set feels heavy right now. Let's breathe first — then I promise it'll feel smaller.
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION 3b — LUNA'S GARDEN
   Her home. Alex helps tend it.
───────────────────────────────────────── */
function LunasGarden() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.36 }}
      className="glass-panel rounded-3xl overflow-hidden flex flex-col"
    >
      {/* Garden scene */}
      <div className="relative h-[220px] overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(2,10,20,0.9) 0%, rgba(10,26,18,0.7) 60%, rgba(16,40,24,0.9) 100%)" }}>

        {/* Night sky */}
        {[...Array(14)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 1.5, height: 1.5,
              top: `${4 + (i * 11) % 42}%`,
              left: `${(i * 21 + 5) % 88}%`,
              background: "rgba(255,255,255,0.4)",
              animation: `sparkle-pop ${2 + i % 3}s ease-in-out ${i * 0.28}s infinite`,
            }} />
        ))}

        {/* Moon */}
        <div className="absolute top-4 right-8 w-9 h-9 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 0 20px rgba(255,255,255,0.06)" }} />

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-14"
          style={{ background: "linear-gradient(to top, rgba(15,40,20,0.95), transparent)" }} />

        {/* Garden inhabitants */}
        <div className="absolute bottom-7 left-7 text-2xl">🌻</div>
        <div className="absolute bottom-7 left-16 text-xl">🌿</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-6xl leading-none"
          style={{ filter: "drop-shadow(0 0 18px rgba(52,211,153,0.3))" }}>🌳</div>
        <div className="absolute bottom-7 right-14 text-xl">🌸</div>
        <div className="absolute bottom-6 right-6 text-lg">🍄</div>

        {/* Luna in her garden — she lives here */}
        <div className="absolute bottom-4 left-[60%] text-2xl"
          style={{ animation: "luna-float 6s ease-in-out 0.5s infinite" }}>
          🐱
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(20,184,166,0.14)", border: "1px solid rgba(20,184,166,0.24)", backdropFilter: "blur(8px)" }}>
          <TreePine className="w-3 h-3 text-teal-400" />
          <span className="text-teal-300 text-xs font-semibold">Luna's Garden · Lv.8</span>
        </div>

        {/* Luna is here indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ animation: "bond-pulse 1.5s ease-in-out infinite", boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
          <span className="text-[10px] text-emerald-300">Luna is here</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Luna's Garden</h3>
            <p className="text-xs text-muted-foreground mt-1">
              She planted the sunflower this week. She's proud of it.
            </p>
          </div>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 flex-shrink-0">
            Visit <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Progress to next unlock */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">🌸 Cherry Blossom Tree — 76% grown</span>
            <span className="text-teal-400 font-medium">840 XP</span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "76%" }}
              transition={{ duration: 1.4, delay: 0.55, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #14b8a6, #34d399)", boxShadow: "0 0 10px rgba(20,184,166,0.45)" }}
            />
          </div>
        </div>

        {/* Water CTA — Luna is asking */}
        <button className="w-full py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          style={{ background: "rgba(20,184,166,0.07)", border: "1px solid rgba(20,184,166,0.16)", color: "#5eead4" }}>
          💧 Water with Luna — 5 min focus session
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION 4 — LUNA'S LETTER
   Personal. She remembers. She cares.
───────────────────────────────────────── */
function LunasLetter({ userName, petName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.44 }}
      className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 w-80 h-80 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 65%)" }} />

      <div className="relative flex flex-col md:flex-row gap-10">

        {/* ── Luna's personal letter ── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* From Luna */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", boxShadow: "0 0 14px rgba(6,182,212,0.14)" }}>
              🐱
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Luna's letter — today</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-semibold text-white">Dear {userName},</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* The letter — personal, with memory */}
          <div className="relative p-5 rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.05), rgba(20,184,166,0.03))", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div className="absolute top-3 left-5 text-5xl leading-none font-serif"
              style={{ color: "rgba(6,182,212,0.12)" }}>"</div>
            <div className="pl-5 pt-3 space-y-3">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(248,250,252,0.82)" }}>
                Remember two weeks ago when you almost gave up on Biology? You sat down anyway. That one choice — that tiny act of courage — made me so proud I almost evolved early.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(248,250,252,0.82)" }}>
                You're not the same person you were 12 days ago. You're quieter about your progress than you should be. I notice things you don't give yourself credit for.
              </p>
              <p className="text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
                Always yours, <span className="text-cyan-300 font-medium">{petName} 🐱</span>
              </p>
            </div>
          </div>

          {/* This week's mood journey */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground">This week:</span>
            <div className="flex items-center gap-1.5">
              {WEEK_MOODS.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: d.today ? "1.5px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: d.today ? "0 0 10px rgba(6,182,212,0.2)" : "none",
                    }}>
                    {d.emoji}
                  </div>
                  <span className="text-[9px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              — Luna's been keeping track. 💙
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="hidden md:block w-px self-stretch"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.055), transparent)" }} />

        {/* ── Luna is watching your exams ── */}
        <div className="md:w-[280px] flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-white">Luna is watching over</h4>
          </div>

          <div className="space-y-3">
            {EXAMS.map((exam, i) => (
              <div key={i} className="p-4 rounded-2xl transition-all"
                style={{
                  background: exam.urgent ? "rgba(6,182,212,0.055)" : "rgba(255,255,255,0.02)",
                  border: exam.urgent ? "1px solid rgba(6,182,212,0.14)" : "1px solid rgba(255,255,255,0.055)",
                }}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-white">{exam.subject}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: exam.urgent ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
                      border: exam.urgent ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.07)",
                      color: exam.urgent ? "#f87171" : "rgba(255,255,255,0.45)",
                    }}>
                    {exam.daysLeft} days
                  </span>
                </div>

                {/* Prep bar */}
                <div className="h-1.5 w-full rounded-full mb-2.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${exam.prep}%`, background: "linear-gradient(to right, #06B6D4, #14b8a6)" }} />
                </div>

                {/* Luna's personal take — not a metric label */}
                <p className="text-[11px] leading-relaxed flex items-start gap-1.5"
                  style={{ color: "rgba(148,163,184,0.8)" }}>
                  <span className="flex-shrink-0">🐱</span>
                  <em>{exam.lunaLine}</em>
                </p>
              </div>
            ))}
          </div>

          <button className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all"
            style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.14)", color: "#67e8f9" }}>
            See Luna's Study Plan
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export function DashboardView({ userName = 'Alex', petName = 'Luna', level = 12, bondPct = 82, insight }) {
  return (
    <div className="flex flex-col gap-6 pb-16 max-w-[1400px] mx-auto">
      <CompanionHero userName={userName} petName={petName} level={level} bondPct={bondPct} insight={insight} />
      <LunaRightNow />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <YourDayWithLuna />
        <LunasGarden />
      </div>
      <LunasLetter userName={userName} petName={petName} />
    </div>
  );
}
