import { motion } from 'motion/react';
import {
  ArrowRight,
  BookMarked,
  ChevronRight,
  GraduationCap,
  Heart,
  MessageCircle,
  Sparkles,
  TreePine,
  Wind,
} from 'lucide-react';
import { LunaCat } from '../../companion/LunaCat.jsx';

function clamp(value, max = 100) {
  return Math.max(0, Math.min(max, Number(value || 0)));
}

function moodEmoji(mood = '') {
  const normalized = mood.toUpperCase();
  if (normalized.includes('EXCELLENT') || normalized.includes('GREAT')) return ':)';
  if (normalized.includes('GOOD')) return ':)';
  if (normalized.includes('STRESSED')) return ':|';
  if (normalized.includes('SAD')) return ':(';
  return '-';
}

function CompanionHero({ userName, petName, level, bondPct, insight, hasCheckins }) {
  const message = hasCheckins
    ? insight || `${petName} is noticing your recent check-ins and will keep helping you find the next kind step.`
    : `Hi ${userName}. I am ready when you are. Start with one check-in, one habit, or one quiet note, and I will grow from real moments with you.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[360px] overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.055) 0%, rgba(10,13,20,0.97) 45%, rgba(20,184,166,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.065)',
        backdropFilter: 'blur(28px)',
      }}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-96 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.11) 0%, transparent 65%)' }}
      />
      {[...Array(22)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 4 === 0 ? 2.5 : 1.5,
            height: i % 4 === 0 ? 2.5 : 1.5,
            top: `${6 + (i * 19) % 88}%`,
            left: `${(i * 27 + 8) % 92}%`,
            background: 'rgba(255,255,255,0.25)',
            animation: `sparkle-pop ${2.5 + (i % 3) * 0.8}s ease-in-out ${(i * 0.35) % 2.5}s infinite`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-stretch md:flex-row">
        <div className="relative flex flex-shrink-0 flex-col items-center justify-center px-8 py-10 md:w-[300px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-60 w-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 68%)' }} />
          </div>
          <div className="relative z-10 luna-float luna-glow-pulse">
            <LunaCat size={210} />
          </div>
          <div className="relative z-10 mt-3 flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white" style={{ fontSize: '1.15rem' }}>{petName}</span>
              <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: 'rgba(6,182,212,0.14)', border: '1px solid rgba(6,182,212,0.28)', color: '#67e8f9' }}>
                Lv.{level}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.9)', animation: 'bond-pulse 2s ease-in-out infinite' }} />
              <span className="text-xs font-medium text-cyan-200">{hasCheckins ? 'Learning your rhythm' : 'Ready to begin'}</span>
            </div>
          </div>
        </div>

        <div className="my-10 hidden w-px flex-shrink-0 md:block" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.055), transparent)' }} />

        <div className="flex flex-1 flex-col justify-center gap-7 px-8 py-10 md:px-10">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.9)', animation: 'bond-pulse 2.2s ease-in-out infinite' }} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">A message from {petName}</span>
          </div>
          <div className="max-w-lg space-y-4">
            <p className="leading-relaxed text-white" style={{ fontSize: '1.15rem' }}>{message}</p>
            <p className="leading-relaxed" style={{ color: 'rgba(148,163,184,0.9)', fontSize: '1.0rem' }}>
              Nothing here is guessed. As you use MindMate, this space will reflect your real check-ins, habits, goals, and letters.
            </p>
          </div>
          <div className="flex max-w-sm items-center gap-4">
            <Heart className="h-4 w-4 flex-shrink-0 text-rose-400" style={{ animation: 'bond-pulse 1.8s ease-in-out infinite' }} />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Your friendship with {petName}</span>
                <span className="font-medium" style={{ color: '#67e8f9' }}>{bondPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${bondPct}%` }} transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #f43f5e, #fb923c)', boxShadow: '0 0 8px rgba(244,63,94,0.4)' }} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/app/companion" className="flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all active:scale-[0.97]" style={{ background: '#06B6D4', boxShadow: '0 0 28px rgba(6,182,212,0.38)' }}>
              <MessageCircle className="h-4 w-4" /> Talk to {petName}
            </a>
            <a href="/app/checkin" className="flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-semibold transition-all" style={{ background: 'rgba(20,184,166,0.09)', border: '1px solid rgba(20,184,166,0.22)', color: '#5eead4' }}>
              <Wind className="h-4 w-4" /> Start check-in
            </a>
            <a href="/app/journal" className="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-medium transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}>
              <BookMarked className="h-4 w-4" /> Write a note
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LunaRightNow({ petName, checkins }) {
  const latest = checkins[0];
  const observations = latest
    ? [
        { emoji: moodEmoji(latest.mood), note: `Latest mood: ${latest.mood || 'recorded'}.` },
        { emoji: 'S', note: `Sleep: ${latest.sleepHours ?? 0} hours.` },
        { emoji: 'E', note: `Energy: ${latest.energyLevel ?? 0}/5.` },
        { emoji: 'T', note: `Stress: ${latest.stressLevel ?? 0}/5.` },
      ]
    : [
        { emoji: '+', note: 'Your first check-in will help Luna understand how today feels.' },
        { emoji: '+', note: 'Habits you complete will shape today’s shared progress.' },
        { emoji: '+', note: 'Letters, goals, and journal entries will appear only after you create them.' },
      ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_260px]">
      <div className="glass-panel relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{petName} is noticing...</p>
        <div className="space-y-2.5">
          {observations.map((obs, i) => (
            <motion.div key={`${obs.note}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="mt-0.5 flex-shrink-0 text-base">{obs.emoji}</span>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.75)' }}>{obs.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="glass-panel relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{petName} is growing...</p>
        <div className="flex flex-1 flex-col justify-center gap-4 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-violet-300" />
          <p className="text-sm leading-relaxed text-white/75">
            Evolution is based on real XP. Complete check-ins, habits, goals, gratitude, and reflections to help {petName} grow.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function YourDayWithLuna({ petName, habits }) {
  const items = habits.length ? habits.slice(0, 4) : [];
  const done = items.filter((item) => item.completed).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel flex flex-col gap-5 rounded-3xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Your Day with {petName}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {items.length ? `${done} of ${items.length} habits cared for today.` : 'Add habits to begin today’s shared plan.'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xl font-bold text-white">{pct}%</span>
          <div className="flex gap-1">
            {(items.length ? items : [{}, {}, {}]).map((_, i) => (
              <div key={i} className="h-1.5 w-6 rounded-full transition-all duration-500" style={{ background: i < done ? '#06B6D4' : 'rgba(255,255,255,0.08)', boxShadow: i < done ? '0 0 6px rgba(6,182,212,0.6)' : 'none' }} />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {items.length ? items.map((habit) => (
          <div key={habit.id} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: habit.completed ? 'rgba(6,182,212,0.04)' : 'rgba(255,255,255,0.02)', border: habit.completed ? '1px solid rgba(6,182,212,0.14)' : '1px solid rgba(255,255,255,0.05)', opacity: habit.completed ? 0.75 : 1 }}>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: habit.completed ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)', border: habit.completed ? '1px solid rgba(6,182,212,0.22)' : '1px solid rgba(255,255,255,0.07)' }}>
              {habit.completed ? '✓' : '+'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium" style={{ color: habit.completed ? 'rgba(148,163,184,0.7)' : '#f8fafc', textDecoration: habit.completed ? 'line-through' : 'none' }}>{habit.name}</p>
              <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(148,163,184,0.65)' }}>{habit.completed ? `${petName} noticed this real step.` : 'Ready when you are.'}</p>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl p-5 text-sm leading-relaxed text-muted-foreground" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            No habits yet. Create one small habit and it will appear here.
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LunasGarden({ petName, progress }) {
  const xp = Number(progress?.xp || 0);
  const level = Number(progress?.level || 1);
  const pct = clamp((xp % 1000) / 10);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="glass-panel flex flex-col overflow-hidden rounded-3xl">
      <div className="relative h-[220px] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(2,10,20,0.9) 0%, rgba(10,26,18,0.7) 60%, rgba(16,40,24,0.9) 100%)' }}>
        {[...Array(14)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: 1.5, height: 1.5, top: `${4 + (i * 11) % 42}%`, left: `${(i * 21 + 5) % 88}%`, background: 'rgba(255,255,255,0.4)', animation: `sparkle-pop ${2 + i % 3}s ease-in-out ${i * 0.28}s infinite` }} />
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-6xl leading-none" style={{ filter: 'drop-shadow(0 0 18px rgba(52,211,153,0.3))' }}>🌱</div>
        <div className="absolute bottom-4 left-[60%] text-2xl" style={{ animation: 'luna-float 6s ease-in-out 0.5s infinite' }}>🐱</div>
        <div className="absolute left-4 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'rgba(20,184,166,0.14)', border: '1px solid rgba(20,184,166,0.24)', backdropFilter: 'blur(8px)' }}>
          <TreePine className="h-3 w-3 text-teal-400" />
          <span className="text-xs font-semibold text-teal-300">{petName}'s Garden · Lv.{level}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">{petName}'s Garden</h3>
            <p className="mt-1 text-xs text-muted-foreground">{xp ? 'Growing from your real MindMate progress.' : 'Your garden is ready for its first real growth.'}</p>
          </div>
          <a href="/app/garden" className="flex flex-shrink-0 items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80">
            Visit <ChevronRight className="h-3 w-3" />
          </a>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Real XP progress</span>
            <span className="font-medium text-teal-400">{xp} XP</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.4, delay: 0.55, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #14b8a6, #34d399)', boxShadow: '0 0 10px rgba(20,184,166,0.45)' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LunasLetter({ userName, petName, letters, exams }) {
  const latestLetter = letters[0];
  const upcomingExam = exams[0];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} className="glass-panel relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="relative flex flex-col gap-10 md:flex-row">
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 0 14px rgba(6,182,212,0.14)' }}>🐱</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">A note from {petName}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">Dear {userName},</span>
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(20,184,166,0.03))', border: '1px solid rgba(6,182,212,0.1)' }}>
            <p className="pl-5 pt-3 text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.82)' }}>
              {latestLetter
                ? 'You have a real letter saved in Future Me. I will keep it safe until it is ready to open.'
                : 'No letters yet. When you write one, this space will reflect that real message instead of a pretend memory.'}
            </p>
            <p className="mt-3 pl-5 text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
              Always here, <span className="font-medium text-cyan-300">{petName}</span>
            </p>
          </div>
        </div>
        <div className="hidden w-px self-stretch md:block" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.055), transparent)' }} />
        <div className="flex flex-shrink-0 flex-col gap-4 md:w-[280px]">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-white">{petName} is watching over</h4>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.055)' }}>
            {upcomingExam ? (
              <>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{upcomingExam.subject}</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}>{upcomingExam.studyMinutes || 0}m</span>
                </div>
                <p className="flex items-start gap-1.5 text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.8)' }}>
                  <span className="flex-shrink-0">🐱</span><em>This exam is in your real plan.</em>
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">No exams in your plan yet. Add one in Exam Focus when you want support.</p>
            )}
          </div>
          <a href="/app/exams" className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition-all" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.14)', color: '#67e8f9' }}>
            Open Exam Focus <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardView({
  userName = 'friend',
  petName = 'Luna',
  level = 1,
  bondPct = 0,
  insight,
  progress,
  checkins = [],
  habits = [],
  exams = [],
  letters = [],
}) {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 pb-16">
      <CompanionHero userName={userName} petName={petName} level={level} bondPct={clamp(bondPct)} insight={insight} hasCheckins={checkins.length > 0} />
      <LunaRightNow petName={petName} checkins={checkins} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <YourDayWithLuna petName={petName} habits={habits} />
        <LunasGarden petName={petName} progress={progress} />
      </div>
      <LunasLetter userName={userName} petName={petName} letters={letters} exams={exams} />
    </div>
  );
}
