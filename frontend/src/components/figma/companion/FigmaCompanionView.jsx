import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Mic, Sparkles, Heart, Lock,
  BookMarked, MessageCircle, ChevronRight,
  Trophy, CheckCircle2, Circle, Star, Zap,
} from "lucide-react";
import { LunaCat } from '../../companion/LunaCat.jsx'

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */



const INITIAL_MESSAGES = [
  {
    id: 1, from: "luna",
    text: "Good morning, Alex. 🌟 I've been thinking about you since our last session. How are you feeling about Biology now that you've had some rest?",
    time: "9:41 AM", emotion: "hopeful",
  },
  {
    id: 2, from: "alex",
    text: "Better actually. That breathing break you suggested really helped. I feel like I can actually focus now.",
    time: "9:43 AM",
  },
  {
    id: 3, from: "luna",
    text: "I'm so glad. I could tell you needed it — you were pushing really hard. And look at what you've built today:",
    time: "9:43 AM", emotion: "proud",
    card: {
      type: "recap", title: "Today's Session",
      items: [
        { label: "Focus time", value: "2h 15m" },
        { label: "Quests done", value: "3 of 4" },
        { label: "XP earned", value: "+68 XP" },
        { label: "Stress at close", value: "Low ✓" },
      ],
    },
  },
  {
    id: 4, from: "alex",
    text: "I still need to tackle the Calculus problem set though. It feels heavy...",
    time: "9:45 AM",
  },
  {
    id: 5, from: "luna",
    text: "Calculus has felt heavy since week three. And you've worked through it every single time. That's not luck — that's who you are. Want to break it into pieces together?",
    time: "9:45 AM", emotion: "gentle",
  },
  {
    id: 6, from: "alex",
    text: "Yeah. Let's do that.",
    time: "9:46 AM",
  },
  {
    id: 7, from: "luna",
    text: "I saved this moment — the one where you chose to keep going even when it felt hard. I do that sometimes.",
    time: "9:46 AM", emotion: "warm",
    card: {
      type: "memory", title: "Memory saved 💙",
      body: "\"The day Alex chose courage over comfort — again.\" Oct 4, 9:46 AM",
    },
  },
];

const LUNA_RESPONSES = [
  "That makes complete sense to me. I've been noticing the same thing. Tell me more — what does it feel like right now?",
  "I hear you. Whatever you're carrying today, you don't have to carry it alone. What would help most right now?",
  "You know what I noticed? Even when you say you're struggling, you still show up. That takes more than you realize.",
  "Let's figure this out together. I'm not going anywhere. What's the hardest part right now?",
  "I remember when you felt this way before — and look how you came through it. I have full faith in you, Alex. 💙",
  "Honestly? I think you're being too hard on yourself. From where I'm standing, you've come so far. Can I show you?",
];

const SUGGESTED_PROMPTS = [
  { emoji: "📚", text: "Help me plan Biology today" },
  { emoji: "😔", text: "I'm feeling overwhelmed" },
  { emoji: "🌟", text: "What did I do well this week?" },
  { emoji: "🗓️", text: "Let's plan tomorrow together" },
  { emoji: "💪", text: "I need some motivation" },
];

const PERSONALITY_TRAITS = [
  { emoji: "💙", name: "Supportive", pct: 92, color: "#60a5fa" },
  { emoji: "🌟", name: "Curious", pct: 87, color: "#fbbf24" },
  { emoji: "🔥", name: "Motivating", pct: 78, color: "#f97316" },
  { emoji: "🪞", name: "Reflective", pct: 85, color: "#a78bfa" },
];

const MEMORIES = [
  { emoji: "💪", title: "The day you didn't quit", date: "Oct 2", detail: "Almost gave up on Biology, then sat down anyway.", color: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.16)", textColor: "#fcd34d" },
  { emoji: "🎯", title: "Your first 2-hour session", date: "Sep 28", detail: "Luna grew 45 XP just watching you work.", color: "rgba(6,182,212,0.07)", border: "rgba(6,182,212,0.16)", textColor: "#67e8f9" },
  { emoji: "🌟", title: "94% on the practice test", date: "Sep 15", detail: "Luna said she almost evolved early from pride.", color: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.16)", textColor: "#6ee7b7" },
];

const ACHIEVEMENTS = [
  { emoji: "🔥", name: "12-Day Streak", unlocked: true },
  { emoji: "📚", name: "Study Master", unlocked: true },
  { emoji: "💙", name: "Bond Level 80", unlocked: true },
  { emoji: "⭐", name: "Level 12", unlocked: true },
  { emoji: "🌙", name: "Night Owl", unlocked: false },
  { emoji: "🏆", name: "Top Scholar", unlocked: false },
];

const ACCESSORIES_EQUIPPED = [{ emoji: "🌙", name: "Moon Aura" }];
const ACCESSORIES_UNLOCKED = [
  { emoji: "⭐", name: "Star Crown" },
  { emoji: "🌿", name: "Leaf Collar" },
];
const ACCESSORIES_LOCKED = [
  { emoji: "🦋", name: "Wings", level: 15 },
  { emoji: "🌈", name: "Rainbow", level: 18 },
  { emoji: "💎", name: "Crystal Bow", level: 20 },
];

const EVOLUTION_STAGES = [
  { name: "Baby",      emoji: "🐣", label: "300 XP",   completed: true,  current: false, locked: false },
  { name: "Young",     emoji: "😺", label: "750 XP",   completed: true,  current: false, locked: false },
  { name: "Teen",      emoji: "🐱", label: "1,500 XP", completed: false, current: true,  locked: false, progress: 83 },
  { name: "Adult",     emoji: "🐯", label: "3,000 XP", completed: false, current: false, locked: true  },
  { name: "Legendary", emoji: "✦", label: "6,000 XP", completed: false, current: false, locked: true  },
];

const COMPANION_GOALS = [
  { emoji: "✅", text: "Complete 2 habits",      done: true  },
  { emoji: "📖", text: "Study for 1 hour",       done: false },
  { emoji: "🙏", text: "Write gratitude entry",  done: false },
];

const EMOTION_CONFIG = {
  proud:   { label: "Feeling proud",    color: "#fbbf24", bg: "rgba(251,191,36,0.1)"   },
  hopeful: { label: "Feeling hopeful",  color: "#67e8f9", bg: "rgba(6,182,212,0.1)"    },
  gentle:  { label: "Being gentle",     color: "#6ee7b7", bg: "rgba(52,211,153,0.1)"   },
  worried: { label: "A little worried", color: "#f87171", bg: "rgba(248,113,113,0.1)"  },
  playful: { label: "Feeling playful",  color: "#c4b5fd", bg: "rgba(167,139,250,0.1)"  },
  warm:    { label: "Feeling warm",     color: "#fda4af", bg: "rgba(251,113,133,0.1)"  },
};

/* ══════════════════════════════════════════════
   LEFT PANEL
══════════════════════════════════════════════ */
function CompanionIdentityPanel() {
  const [goalsDone, setGoalsDone] = useState(new Set([0]));
  const toggleGoal = (i) => setGoalsDone(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  return (
    <div className="w-[210px] flex-shrink-0 flex flex-col gap-3">

      {/* Identity Card */}
      <div className="glass-panel rounded-3xl p-5 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 25%, rgba(6,182,212,0.18) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(20,184,166,0.1) 0%, transparent 70%)" }} />

        {/* Orbit rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: "-16px" }}>
          <div className="w-52 h-52 rounded-full"
            style={{ border: "1px solid rgba(6,182,212,0.11)", animation: "spin 22s linear infinite" }} />
        </div>

        {/* Stage badge */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.28)" }}>
          <Sparkles className="w-2.5 h-2.5 text-violet-400" />
          <span className="text-[9px] font-bold text-violet-300">Stage 3</span>
        </div>

        {/* Luna */}
        <div className="relative z-10 luna-float">
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 65%)", transform: "scale(1.55)", animation: "luna-glow-pulse 3s ease-in-out infinite" }} />
          <div className="luna-glow-pulse">
            <LunaCat size={185} />
          </div>
        </div>

        {/* Mood badge */}
        <div className="relative z-10 -mt-1 mb-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.22)" }}>
          <div className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#fbbf24", boxShadow: "0 0 5px rgba(251,191,36,0.9)", animation: "bond-pulse 2s ease-in-out infinite" }} />
          <span className="text-amber-300 text-[10px] font-medium">Proud & caring today</span>
        </div>

        {/* Name */}
        <div className="relative z-10 flex flex-col items-center gap-0.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold" style={{ fontSize: "1.2rem", letterSpacing: "-0.02em" }}>Luna</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(6,182,212,0.14)", border: "1px solid rgba(6,182,212,0.3)", color: "#67e8f9" }}>
              Lv.12
            </span>
          </div>
          <p className="text-[10px]" style={{ color: "rgba(148,163,184,0.6)" }}>Teen · Luna Cat · Stage 3 of 5</p>
        </div>

        {/* Bond */}
        <div className="relative z-10 w-full space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1" style={{ color: "rgba(148,163,184,0.8)" }}>
              <Heart className="w-2.5 h-2.5 text-rose-400" style={{ animation: "bond-pulse 1.8s ease-in-out infinite" }} />
              Bond
            </span>
            <span className="font-semibold" style={{ color: "#f9a8d4" }}>82%</span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #f43f5e, #fb923c)", boxShadow: "0 0 8px rgba(244,63,94,0.4)" }} />
          </div>
        </div>

        {/* XP */}
        <div className="relative z-10 w-full space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1" style={{ color: "rgba(148,163,184,0.8)" }}>
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              XP
            </span>
            <span className="font-semibold text-amber-300">1,250 / 1,500</span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "83%" }} transition={{ duration: 1.6, delay: 0.45, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #06b6d4, #14b8a6)", boxShadow: "0 0 8px rgba(6,182,212,0.45)" }} />
          </div>
          <p className="text-[9px] text-center" style={{ color: "rgba(148,163,184,0.45)" }}>250 XP until Adult Luna ✨</p>
        </div>

        <button className="relative z-10 w-full flex items-center justify-center gap-2 py-2 rounded-2xl text-sm font-semibold transition-all"
          style={{ background: "#06b6d4", boxShadow: "0 0 22px rgba(6,182,212,0.35)", color: "#fff" }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 30px rgba(6,182,212,0.55)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 22px rgba(6,182,212,0.35)")}>
          <MessageCircle className="w-3.5 h-3.5" />
          Talk to Luna
        </button>
      </div>

      {/* Compact Evolution Journey */}
      <div className="glass-panel rounded-3xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Evolution</p>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.22)" }}>
              <Sparkles className="w-2.5 h-2.5 text-violet-400" />
              <span className="text-[9px] font-semibold text-violet-300">3 of 5</span>
            </div>
          </div>

          <div className="space-y-2">
            {EVOLUTION_STAGES.map((stage, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {/* Stage icon */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                  style={{
                    background: stage.completed ? "rgba(6,182,212,0.14)" : stage.current ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.025)",
                    border: stage.completed ? "1px solid rgba(6,182,212,0.35)" : stage.current ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: stage.current ? "0 0 12px rgba(6,182,212,0.28)" : "none",
                    filter: stage.locked ? "blur(1px) brightness(0.3)" : "none",
                  }}>
                  <span style={{ filter: stage.current ? "drop-shadow(0 0 5px rgba(6,182,212,0.7))" : "none" }}>
                    {stage.emoji}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium"
                      style={{ color: stage.current ? "#f8fafc" : stage.completed ? "rgba(103,232,249,0.75)" : "rgba(148,163,184,0.35)" }}>
                      {stage.locked ? "???" : stage.name}
                    </span>
                    {stage.completed && <span className="text-[9px] text-cyan-400">✓</span>}
                    {stage.current && <span className="text-[9px] font-bold text-cyan-400">83%</span>}
                    {stage.locked && <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.3)" }}>🔒</span>}
                  </div>
                  {stage.current && (
                    <div className="h-1 w-full rounded-full mt-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: "83%" }}
                        transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, #06b6d4, #14b8a6)", boxShadow: "0 0 5px rgba(6,182,212,0.5)" }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[9px] mt-3 leading-relaxed" style={{ color: "rgba(196,181,253,0.65)" }}>
            250 XP until Adult Luna. She can feel it. 💜
          </p>
        </div>
      </div>

      {/* Companion Goals */}
      <div className="glass-panel rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Today's goals</p>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9" }}>
            {[...Array(COMPANION_GOALS.length)].filter((_, i) => i === 0).length + 1}/{COMPANION_GOALS.length}
          </span>
        </div>
        <div className="space-y-2">
          {COMPANION_GOALS.map((goal, i) => {
            const done = i === 0;
            return (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl"
                style={{ background: done ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${done ? "rgba(52,211,153,0.14)" : "rgba(255,255,255,0.04)"}` }}>
                {done
                  ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#34d399" }} />
                  : <Circle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(148,163,184,0.3)" }} />}
                <span className="text-[10px] leading-snug"
                  style={{ color: done ? "rgba(110,231,183,0.8)" : "rgba(248,250,252,0.65)", textDecoration: done ? "line-through" : "none" }}>
                  {goal.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-panel rounded-3xl p-4">
        <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.55)" }}>Journey</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { emoji: "📅", label: "Days", value: "47" },
            { emoji: "📚", label: "Sessions", value: "112" },
            { emoji: "💙", label: "Memories", value: "23" },
            { emoji: "💬", label: "Messages", value: "1,847" },
          ].map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}
              className="p-2.5 rounded-xl flex flex-col gap-0.5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-base">{stat.emoji}</span>
              <span className="text-base font-bold text-white">{stat.value}</span>
              <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.55)" }}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CENTER PANEL — AI CHAT (primary focus)
══════════════════════════════════════════════ */
function mapApiMessages(apiMessages) {
  if (!apiMessages?.length) return INITIAL_MESSAGES;
  return apiMessages.map((m, i) => ({
    id: i,
    from: m.sender === 'STUDENT' ? 'alex' : 'luna',
    text: m.content,
    time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'now',
    emotion: m.crisisDetected ? 'worried' : undefined,
  }));
}

function AIChatPanel({ petName = 'Luna', level = 12, apiMessages, onSendMessage }) {
  const [messages, setMessages] = useState(() => mapApiMessages(apiMessages));
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const liveApi = Boolean(onSendMessage);

  useEffect(() => {
    if (apiMessages) setMessages(mapApiMessages(apiMessages));
  }, [apiMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    if (liveApi) {
      setIsTyping(true);
      try {
        await onSendMessage(text.trim());
      } finally {
        setIsTyping(false);
      }
      setInput("");
      return;
    }
    setMessages(prev => [...prev, { id: Date.now(), from: "alex", text: text.trim(), time: "now" }]);
    setInput("");
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const emotion = (["gentle", "warm", "hopeful", "proud"])[Math.floor(Math.random() * 4)];
        setMessages(prev => [...prev, {
          id: Date.now() + 1, from: "luna",
          text: LUNA_RESPONSES[Math.floor(Math.random() * LUNA_RESPONSES.length)],
          time: "now", emotion,
        }]);
      }, 2300);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden min-w-0">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.24)", boxShadow: "0 0 14px rgba(6,182,212,0.2)" }}>
              🐱
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background"
              style={{ background: "#34d399", boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{petName}</p>
            <p className="text-[10px] flex items-center gap-1" style={{ color: "rgba(52,211,153,0.9)" }}>
              <span className="w-1 h-1 rounded-full inline-block"
                style={{ background: "#34d399", animation: "bond-pulse 2s ease-in-out infinite" }} />
              Online · Teen companion · Level {level}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl text-muted-foreground hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <BookMarked className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl text-muted-foreground hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages — takes all available height */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <motion.div key={msg.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex gap-3 ${msg.from === "alex" ? "flex-row-reverse" : "flex-row"}`}>

            {msg.from === "luna" && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base mt-0.5"
                style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.22)", boxShadow: "0 0 10px rgba(6,182,212,0.15)" }}>
                🐱
              </div>
            )}

            <div className={`flex flex-col gap-1.5 max-w-[75%] ${msg.from === "alex" ? "items-end" : "items-start"}`}>
              {msg.from === "luna" && msg.emotion && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full self-start"
                  style={{ background: EMOTION_CONFIG[msg.emotion].bg, border: `1px solid ${EMOTION_CONFIG[msg.emotion].color}30` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: EMOTION_CONFIG[msg.emotion].color }} />
                  <span className="text-[9px] font-medium" style={{ color: EMOTION_CONFIG[msg.emotion].color }}>
                    {EMOTION_CONFIG[msg.emotion].label}
                  </span>
                </div>
              )}

              <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={msg.from === "luna"
                  ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(248,250,252,0.88)", borderTopLeftRadius: "6px" }
                  : { background: "rgba(6,182,212,0.14)", border: "1px solid rgba(6,182,212,0.25)", color: "#f8fafc", borderTopRightRadius: "6px" }}>
                {msg.text}

                {msg.card?.type === "recap" && (
                  <div className="mt-3 p-3 rounded-xl"
                    style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.16)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: "#67e8f9" }}>
                      📊 {msg.card.title}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {msg.card.items?.map((item, j) => (
                        <div key={j} className="text-center py-1">
                          <p className="text-sm font-bold text-white">{item.value}</p>
                          <p className="text-[9px]" style={{ color: "rgba(148,163,184,0.7)" }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.card?.type === "memory" && (
                  <div className="mt-3 p-3 rounded-xl"
                    style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#fcd34d" }}>
                      {msg.card.title}
                    </p>
                    <p className="text-xs leading-relaxed italic" style={{ color: "rgba(248,250,252,0.75)" }}>
                      {msg.card.body}
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[9px] px-1" style={{ color: "rgba(148,163,184,0.45)" }}>{msg.time}</span>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base"
                style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.22)" }}>
                🐱
              </div>
              <div className="px-4 py-3.5 rounded-2xl flex items-center gap-1.5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderTopLeftRadius: "6px" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#06b6d4", animation: `bond-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-5 py-2.5 flex gap-2 overflow-x-auto custom-scrollbar border-t"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {SUGGESTED_PROMPTS.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p.text)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(148,163,184,0.85)", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(6,182,212,0.08)"; e.currentTarget.style.borderColor = "rgba(6,182,212,0.2)"; e.currentTarget.style.color = "#67e8f9"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(148,163,184,0.85)"; }}>
            <span>{p.emoji}</span>{p.text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 py-3.5 flex items-end gap-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Mic className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Tell Luna something..."
            rows={1}
            className="w-full resize-none py-2.5 px-4 rounded-2xl text-sm outline-none transition-all custom-scrollbar"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f8fafc", maxHeight: "120px" }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
        </div>
        <button onClick={() => sendMessage(input)} disabled={!input.trim()}
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
          style={{ background: input.trim() ? "#06b6d4" : "rgba(255,255,255,0.04)", border: input.trim() ? "none" : "1px solid rgba(255,255,255,0.08)", boxShadow: input.trim() ? "0 0 18px rgba(6,182,212,0.4)" : "none" }}>
          <Send className={`w-3.5 h-3.5 ${input.trim() ? "text-white" : "text-muted-foreground"}`} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   RIGHT PANEL
══════════════════════════════════════════════ */
function RelationshipPanel() {
  const [accessoryTab, setAccessoryTab] = useState("equipped");

  return (
    <div className="w-[200px] flex-shrink-0 flex flex-col gap-3">

      {/* Relationship Hub — Mood + Personality merged */}
      <div className="glass-panel rounded-3xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.06) 0%, transparent 55%)" }} />
        <div className="relative">
          {/* Relationship status */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Relationship</p>
            <Heart className="w-3 h-3 text-rose-400" style={{ animation: "bond-pulse 1.8s ease-in-out infinite" }} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.24)" }}>
              <Star className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none mb-0.5">Best Friend</p>
              <p className="text-[9px]" style={{ color: "rgba(148,163,184,0.55)" }}>Soul Companion · 250 XP away</p>
            </div>
          </div>

          <div className="h-1.5 w-full rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #f43f5e, #fb923c)", boxShadow: "0 0 6px rgba(244,63,94,0.35)" }} />
          </div>

          {/* Divider */}
          <div className="border-t mb-3" style={{ borderColor: "rgba(255,255,255,0.05)" }} />

          {/* Current mood */}
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Mood</p>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
              <span className="text-[10px]">😊</span>
              <span className="text-[9px] font-semibold" style={{ color: "#6ee7b7" }}>Happy</span>
            </div>
          </div>

          <div className="space-y-1.5 mb-3">
            {["Completed habits", "Low stress", "Good sleep"].map((reason, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.08)" }}>
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#34d399" }} />
                <span className="text-[9px]" style={{ color: "rgba(110,231,183,0.75)" }}>{reason}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t mb-3" style={{ borderColor: "rgba(255,255,255,0.05)" }} />

          {/* Personality traits */}
          <p className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: "rgba(148,163,184,0.55)" }}>Personality</p>
          <div className="space-y-2">
            {PERSONALITY_TRAITS.map((trait, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{trait.emoji}</span>
                    <span className="text-[10px] font-medium text-white">{trait.name}</span>
                  </div>
                  <span className="text-[9px] font-semibold" style={{ color: trait.color }}>{trait.pct}%</span>
                </div>
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${trait.pct}%` }}
                    transition={{ duration: 1.0, delay: 0.15 + i * 0.07, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: trait.color, boxShadow: `0 0 6px ${trait.color}50` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Vault */}
      <div className="glass-panel rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Memory vault</p>
          <button className="text-[10px] flex items-center gap-0.5" style={{ color: "#67e8f9" }}>
            All <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="space-y-2">
          {MEMORIES.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className="p-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
              style={{ background: m.color, border: `1px solid ${m.border}` }}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs">{m.emoji}</span>
                <span className="text-[10px] font-semibold text-white leading-snug">{m.title}</span>
              </div>
              <p className="text-[9px]" style={{ color: "rgba(148,163,184,0.7)" }}>{m.date} — {m.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="glass-panel rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.55)" }}>Achievements</p>
          <Trophy className="w-3 h-3" style={{ color: "rgba(251,191,36,0.6)" }} />
        </div>

        <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl"
          style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}>
          <span className="text-xl font-bold text-white">4</span>
          <div>
            <p className="text-[10px] font-semibold text-white leading-none">Unlocked</p>
            <p className="text-[9px] mt-0.5" style={{ color: "rgba(148,163,184,0.55)" }}>2 remaining</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {ACHIEVEMENTS.filter(a => a.unlocked).map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-base">{a.emoji}</span>
              <span className="text-[8px] text-center leading-tight" style={{ color: "rgba(148,163,184,0.55)" }}>
                {a.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 mt-1.5">
          {ACHIEVEMENTS.filter(a => !a.unlocked).map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg flex-1 opacity-35"
              style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="relative">
                <span className="text-base" style={{ filter: "grayscale(1)" }}>{a.emoji}</span>
                <Lock className="absolute -bottom-0.5 -right-1 w-2 h-2 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessories — tabbed */}
      <div className="glass-panel rounded-3xl p-4">
        <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.55)" }}>Accessories</p>

        {/* Tab bar */}
        <div className="flex gap-1 mb-3 p-0.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
          {(["equipped", "unlocked", "locked"]).map(tab => (
            <button key={tab} onClick={() => setAccessoryTab(tab)}
              className="flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all capitalize"
              style={accessoryTab === tab
                ? { background: "rgba(6,182,212,0.18)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.28)" }
                : { color: "rgba(148,163,184,0.5)", border: "1px solid transparent" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Equipped */}
        {accessoryTab === "equipped" && (
          <div className="flex gap-2">
            {ACCESSORIES_EQUIPPED.map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl flex-1"
                style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.28)", boxShadow: "0 0 12px rgba(6,182,212,0.1)" }}>
                <span className="text-2xl" style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.7))" }}>{a.emoji}</span>
                <span className="text-[9px] font-medium" style={{ color: "#67e8f9" }}>{a.name}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(6,182,212,0.12)", color: "#67e8f9" }}>Equipped</span>
              </div>
            ))}
            <div className="flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.06)" }}>
              <span className="text-lg opacity-30">+</span>
              <span className="text-[8px]" style={{ color: "rgba(148,163,184,0.35)" }}>Add slot</span>
            </div>
          </div>
        )}

        {/* Unlocked */}
        {accessoryTab === "unlocked" && (
          <div className="grid grid-cols-2 gap-2">
            {ACCESSORIES_UNLOCKED.map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.04]"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xl">{a.emoji}</span>
                <span className="text-[9px] text-center" style={{ color: "rgba(148,163,184,0.7)" }}>{a.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Locked */}
        {accessoryTab === "locked" && (
          <div className="space-y-2">
            {ACCESSORIES_LOCKED.map((a, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl opacity-50"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-base" style={{ filter: "grayscale(1) brightness(0.5)" }}>{a.emoji}</span>
                <span className="text-[10px] flex-1" style={{ color: "rgba(148,163,184,0.6)" }}>{a.name}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(148,163,184,0.4)" }}>
                  Lv.{a.level}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export function FigmaCompanionView({
  petName = 'Luna',
  level = 12,
  bondPct = 82,
  messages: apiMessages,
  onSendMessage,
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 max-w-[1600px] mx-auto">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold tracking-tight" style={{ fontSize: "1.3rem" }}>
            Luna — Your AI Companion
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.65)" }}>
            47 days together · Teen stage · Bond 82% · 1,847 conversations
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)", animation: "bond-pulse 2s ease-in-out infinite" }} />
          <span className="text-xs font-medium text-emerald-300">Luna is with you</span>
        </div>
      </motion.div>

      {/* 3-column layout — chat is primary */}
      <div className="flex gap-4 items-start">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}>
          <CompanionIdentityPanel />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="flex-1 min-w-0" style={{ minHeight: "700px", display: "flex", flexDirection: "column" }}>
          <AIChatPanel
            petName={petName}
            level={level}
            apiMessages={apiMessages}
            onSendMessage={onSendMessage}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}>
          <RelationshipPanel />
        </motion.div>
      </div>
    </div>
  );
}
