import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, Lock, Sparkles, Trophy, Zap } from 'lucide-react';
import { LunaCat } from '../../companion/LunaCat.jsx';

const GARDEN_THEMES = [
  { id: 'classic', name: 'Classic', emoji: '🌿' },
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'autumn', name: 'Autumn', emoji: '🍂' },
  { id: 'galaxy', name: 'Galaxy', emoji: '✨' },
  { id: 'cyber', name: 'Cyber', emoji: '⚡' },
];

const THEME_COLORS = {
  classic: { primary: '#22c55e', secondary: '#86efac', glow: 'rgba(34,197,94,0.58)', ambient: 'rgba(34,197,94,0.09)', sky: 'linear-gradient(to bottom, #03040B 0%, #061b0f 50%, #0b3016 100%)' },
  forest: { primary: '#14b8a6', secondary: '#6ee7b7', glow: 'rgba(6,182,212,0.58)', ambient: 'rgba(6,182,212,0.08)', sky: 'linear-gradient(to bottom, #03040B 0%, #051a14 50%, #081e17 100%)' },
  autumn: { primary: '#f97316', secondary: '#fcd34d', glow: 'rgba(249,115,22,0.58)', ambient: 'rgba(249,115,22,0.08)', sky: 'linear-gradient(to bottom, #03040B 0%, #1c0a00 50%, #221004 100%)' },
  galaxy: { primary: '#8b5cf6', secondary: '#c4b5fd', glow: 'rgba(139,92,246,0.58)', ambient: 'rgba(139,92,246,0.09)', sky: 'linear-gradient(to bottom, #03040B 0%, #0b0618 50%, #0e071d 100%)' },
  cyber: { primary: '#06b6d4', secondary: '#67e8f9', glow: 'rgba(6,182,212,0.68)', ambient: 'rgba(6,182,212,0.11)', sky: 'linear-gradient(to bottom, #03040B 0%, #001520 50%, #011e2a 100%)' },
};

const STARS = Array.from({ length: 72 }, (_, i) => ({
  top: `${(i * 137.508) % 68}%`,
  left: `${(i * 97.33) % 100}%`,
  size: ((i * 7) % 3) + 0.5,
  opacity: ((i * 13) % 48) / 100 + 0.08,
  dur: `${2.2 + (i * 0.41) % 2.5}s`,
  delay: `${(i * 0.61) % 3.2}s`,
}));

const normalizeName = (name) => String(name || '').toLowerCase().replace(/[_\s-]+/g, '');

function GardenTree({ theme, level }) {
  const c = THEME_COLORS[theme] || THEME_COLORS.classic;
  const canopyScale = Math.min(1.15, 0.75 + Number(level || 1) * 0.035);

  return (
    <div style={{ filter: `drop-shadow(0 0 28px ${c.glow})`, transform: `scale(${canopyScale})`, transition: 'transform 300ms ease' }}>
      <svg width="220" height="290" viewBox="0 0 220 290" aria-label="Decorative growth tree">
        <ellipse cx="110" cy="282" rx="70" ry="14" fill={c.primary} opacity="0.16" />
        <path d="M95 282 Q99 255 100 228 Q104 206 110 194 Q116 206 120 228 Q121 255 125 282 Z" fill="#713f12" />
        <path d="M95 275 Q75 288 55 294" stroke="#713f12" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M125 275 Q145 288 165 294" stroke="#713f12" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="110" cy="118" r="94" fill={c.primary} opacity="0.05" />
        <circle cx="72" cy="150" r="46" fill={c.primary} opacity="0.50" />
        <circle cx="148" cy="144" r="48" fill={c.primary} opacity="0.46" />
        <circle cx="110" cy="98" r="60" fill={c.primary} opacity="0.56" />
        <circle cx="86" cy="122" r="37" fill={c.primary} opacity="0.46" />
        <circle cx="134" cy="116" r="42" fill={c.primary} opacity="0.43" />
        <circle cx="96" cy="62" r="38" fill={c.secondary} opacity="0.52" />
        <circle cx="122" cy="78" r="32" fill={c.secondary} opacity="0.44" />
        <circle cx="110" cy="48" r="30" fill={c.secondary} opacity="0.58" />
        <circle cx="104" cy="33" r="9" fill="#ffffff" opacity="0.38" />
      </svg>
    </div>
  );
}

function GardenScene({ theme, level, petName }) {
  const c = THEME_COLORS[theme] || THEME_COLORS.classic;

  return (
    <div className="relative glass-panel rounded-3xl overflow-hidden flex-shrink-0" style={{ height: 430 }}>
      <div className="absolute inset-0" style={{ background: c.sky }} />
      {STARS.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full pointer-events-none"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size, background: '#fff', opacity: star.opacity, animation: `sparkle-pop ${star.dur} ease-in-out ${star.delay} infinite` }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: `radial-gradient(ellipse at center, ${c.ambient} 0%, rgba(0,0,0,0.45) 72%)` }} />
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <GardenTree theme={theme} level={level} />
      </div>
      <div className="absolute bottom-8 left-8 flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <LunaCat size={46} />
        <div>
          <p className="text-xs font-semibold text-white">{petName} is here</p>
          <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.68)' }}>Decorative garden scene</p>
        </div>
      </div>
    </div>
  );
}

function GardenOverviewCard({ level, progress }) {
  const xp = progress?.xp ?? 0;
  const currentStreak = progress?.currentStreak ?? 0;

  return (
    <div className="glass-panel rounded-3xl p-3 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Overview</p>
        <Leaf className="w-3 h-3 text-teal-400" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Level', value: level },
          { label: 'XP', value: xp },
          { label: 'Streak', value: currentStreak },
          { label: 'Longest', value: progress?.longestStreak ?? 0 },
        ].map((item) => (
          <div key={item.label} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-base font-bold text-white">{item.value}</p>
            <p className="text-[9px]" style={{ color: 'rgba(148,163,184,0.55)' }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LunaReflectionCard({ petName }) {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <LunaCat size={34} />
        <div>
          <p className="text-xs font-semibold text-white">{petName}'s note</p>
          <p className="text-[9px]" style={{ color: 'rgba(148,163,184,0.55)' }}>Honest garden state</p>
        </div>
      </div>
      <p className="text-[10px] leading-relaxed italic" style={{ color: 'rgba(148,163,184,0.75)' }}>
        This garden grows from real check-ins, habits, reflections, and goals. New gardens start quietly.
      </p>
    </div>
  );
}

function GardenTasksCard() {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Today's tasks</p>
        <Zap className="w-3 h-3 text-amber-400" />
      </div>
      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.72)' }}>
          No garden tasks are shown until they come from real product activity.
        </p>
      </div>
    </div>
  );
}

function GardenStatsCard({ progress }) {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(148,163,184,0.55)' }}>Real stats</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { emoji: '⚡', label: 'XP', value: progress?.xp ?? 0 },
          { emoji: '🔥', label: 'Current', value: progress?.currentStreak ?? 0 },
          { emoji: '🏆', label: 'Longest', value: progress?.longestStreak ?? 0 },
          { emoji: '🌿', label: 'Level', value: progress?.level ?? 1 },
        ].map((stat) => (
          <div key={stat.label} className="p-2 rounded-xl flex flex-col gap-0.5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-base">{stat.emoji}</span>
            <span className="text-[15px] font-bold text-white">{stat.value}</span>
            <span className="text-[9px]" style={{ color: 'rgba(148,163,184,0.55)' }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemeSelectorCard({ active, unlockedThemes, onSelect }) {
  const unlocked = new Set(unlockedThemes.map(normalizeName));

  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Theme</p>
        <Sparkles className="w-3 h-3 text-cyan-400" />
      </div>
      <div className="space-y-1">
        {GARDEN_THEMES.map((theme) => {
          const isActive = theme.id === active;
          const isUnlocked = unlocked.has(normalizeName(theme.id)) || unlocked.has(normalizeName(theme.name)) || theme.id === 'classic';
          const color = THEME_COLORS[theme.id];
          return (
            <button
              key={theme.id}
              onClick={() => isUnlocked && onSelect(theme.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all text-left"
              style={{
                background: isActive ? `${color.primary}18` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isActive ? `${color.primary}40` : 'rgba(255,255,255,0.05)'}`,
                opacity: isUnlocked ? 1 : 0.45,
                cursor: isUnlocked ? 'pointer' : 'default',
              }}
            >
              <span className="text-sm">{theme.emoji}</span>
              <span className="text-[11px] font-medium flex-1" style={{ color: isActive ? '#f8fafc' : 'rgba(148,163,184,0.75)' }}>{theme.name}</span>
              {!isUnlocked && <Lock className="w-2.5 h-2.5 text-muted-foreground" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccessoriesCard({ unlockedAccessories }) {
  const realAccessories = unlockedAccessories.filter((item) => item && item !== 'None');

  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Accessories</p>
        <span className="text-[9px]" style={{ color: 'rgba(148,163,184,0.45)' }}>{realAccessories.length} unlocked</span>
      </div>
      {realAccessories.length > 0 ? (
        <div className="space-y-1">
          {realAccessories.map((item) => (
            <div key={item} className="px-2 py-1.5 rounded-xl text-[11px]" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#67e8f9' }}>
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <p className="text-[11px]" style={{ color: 'rgba(148,163,184,0.7)' }}>No accessories unlocked yet.</p>
        </div>
      )}
    </div>
  );
}

function EmptyHistoryCard({ title, body, icon: Icon = Trophy }) {
  return (
    <div className="glass-panel rounded-3xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>{title}</p>
        <Icon className="w-3 h-3" style={{ color: 'rgba(251,191,36,0.6)' }} />
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.68)' }}>{body}</p>
    </div>
  );
}

export function FigmaGrowthGardenView({
  gardenTheme = 'classic',
  onThemeChange,
  level = 1,
  petName = 'Luna',
  petLevel = 1,
  progress,
  unlockedThemes = ['Classic'],
  unlockedAccessories = [],
}) {
  const [activeTheme, setActiveTheme] = useState(gardenTheme);
  const safeLevel = Number(level) || 1;
  const normalizedTheme = THEME_COLORS[gardenTheme] ? gardenTheme : 'classic';
  const realUnlockedThemes = useMemo(() => (unlockedThemes.length ? unlockedThemes : ['Classic']), [unlockedThemes]);

  useEffect(() => {
    setActiveTheme(normalizedTheme);
  }, [normalizedTheme]);

  const handleTheme = (theme) => {
    setActiveTheme(theme);
    onThemeChange?.(theme);
  };

  return (
    <div className="flex flex-col gap-2 pb-4 max-w-[1700px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold tracking-tight" style={{ fontSize: '1.3rem' }}>Growth Garden</h2>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>
            Level {safeLevel} · {progress?.xp ?? 0} XP · garden progress from real activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
            <Leaf className="w-3 h-3 text-teal-400" />
            <span className="text-[11px] font-medium text-teal-300">New growth is honest</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-300">{petName} · Lv.{petLevel}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 items-start">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }} className="flex-shrink-0 flex flex-col gap-2" style={{ width: 188 }}>
          <GardenOverviewCard level={safeLevel} progress={progress} />
          <LunaReflectionCard petName={petName} />
          <GardenTasksCard />
          <GardenStatsCard progress={progress} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="flex-1 min-w-0 flex flex-col gap-2">
          <GardenScene theme={activeTheme} level={safeLevel} petName={petName} />
          <div className="glass-panel rounded-3xl p-4">
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(148,163,184,0.55)' }}>Evolution</p>
            <p className="text-sm text-white font-semibold">Level {safeLevel}</p>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Evolution stages should unlock from backend gamification data. Until then, the garden shows your verified level only.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }} className="flex-shrink-0 flex flex-col gap-2" style={{ width: 196 }}>
          <ThemeSelectorCard active={activeTheme} unlockedThemes={realUnlockedThemes} onSelect={handleTheme} />
          <AccessoriesCard unlockedAccessories={unlockedAccessories} />
          <EmptyHistoryCard title="Next unlock" body="No upcoming unlock is shown until the backend returns a real unlock target." icon={Lock} />
          <EmptyHistoryCard title="Garden memories" body="No garden memories yet. Future memories should be created from real user milestones." />
          <EmptyHistoryCard title="Milestones" body="Milestones will appear after real achievements are earned." />
        </motion.div>
      </div>
    </div>
  );
}
