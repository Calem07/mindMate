import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Lock,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { LunaCat } from '../../companion/LunaCat.jsx';

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, Number(value) || 0));

const SUGGESTED_PROMPTS = [
  { emoji: '💬', text: 'I want to talk for a minute' },
  { emoji: '🌿', text: 'Help me slow down' },
  { emoji: '✨', text: 'What should I focus on today?' },
  { emoji: '📝', text: 'Help me reflect on my day' },
];

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function normalizeMessages(messages = []) {
  return messages.map((message, index) => ({
    id: message.id || `${message.createdAt || 'message'}-${index}`,
    from: message.sender === 'STUDENT' || message.role === 'user' ? 'user' : 'luna',
    text: message.content || message.message || message.reply || '',
    time: formatTime(message.createdAt || message.timestamp),
    crisisDetected: Boolean(message.crisisDetected),
  }));
}

function CompanionIdentityPanel({ petName, level, bondPct, xp, companion }) {
  const safeBond = clamp(bondPct);
  const equipped = companion?.petAccessory && companion.petAccessory !== 'None' ? companion.petAccessory : null;

  return (
    <div className="w-[210px] flex-shrink-0 flex flex-col gap-3">
      <div className="glass-panel rounded-3xl p-5 flex flex-col items-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(6,182,212,0.18) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 luna-float">
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 65%)',
              transform: 'scale(1.55)',
              animation: 'luna-glow-pulse 3s ease-in-out infinite',
            }}
          />
          <LunaCat size={185} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>{petName}</span>
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: 'rgba(6,182,212,0.14)', border: '1px solid rgba(6,182,212,0.3)', color: '#67e8f9' }}
            >
              Lv.{level}
            </span>
          </div>
          <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.6)' }}>
            {companion?.species || 'MindMate companion'} · {companion?.evolutionStage || 'New journey'}
          </p>
        </div>

        <div className="relative z-10 w-full space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1" style={{ color: 'rgba(148,163,184,0.8)' }}>
              <Heart className="w-2.5 h-2.5 text-rose-400" />
              Bond
            </span>
            <span className="font-semibold" style={{ color: '#f9a8d4' }}>{safeBond}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${safeBond}%` }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #f43f5e, #fb923c)', boxShadow: '0 0 8px rgba(244,63,94,0.4)' }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1" style={{ color: 'rgba(148,163,184,0.8)' }}>
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              XP
            </span>
            <span className="font-semibold text-amber-300">{xp}</span>
          </div>
          <p className="text-[9px] text-center" style={{ color: 'rgba(148,163,184,0.45)' }}>
            Earn XP by checking in, reflecting, and completing real actions.
          </p>
        </div>

        <a
          href="/app/companion"
          className="relative z-10 w-full flex items-center justify-center gap-2 py-2 rounded-2xl text-sm font-semibold transition-all"
          style={{ background: '#06b6d4', boxShadow: '0 0 22px rgba(6,182,212,0.35)', color: '#fff' }}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Talk to {petName}
        </a>
      </div>

      <div className="glass-panel rounded-3xl p-4">
        <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(148,163,184,0.55)' }}>Equipped</p>
        {equipped ? (
          <div className="p-3 rounded-xl text-xs text-cyan-200" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)' }}>
            {equipped}
          </div>
        ) : (
          <div className="p-3 rounded-xl text-[11px]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.7)' }}>
            No accessories equipped yet.
          </div>
        )}
      </div>
    </div>
  );
}

function AIChatPanel({ petName, messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;
    onSendMessage?.(clean);
    setInput('');
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full min-h-[700px] relative">
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)' }}>
            <LunaCat size={38} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{petName}</p>
            <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.6)' }}>Real chat history</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-medium text-emerald-300">Connected</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full min-h-[420px] flex items-center justify-center text-center">
            <div className="max-w-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-cyan-300" />
              <h3 className="text-white font-bold mb-2">Start your first conversation with {petName}.</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.72)' }}>
                Your companion will remember real conversations once you send them. Nothing here is pre-filled.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'luna' && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)' }}>
                  <LunaCat size={30} />
                </div>
              )}
              <div className={`max-w-[70%] flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.from === 'user' ? 'linear-gradient(135deg, #06b6d4, #14b8a6)' : 'rgba(255,255,255,0.04)',
                    border: msg.from === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    color: '#f8fafc',
                    borderTopLeftRadius: msg.from === 'luna' ? 6 : 18,
                    borderTopRightRadius: msg.from === 'user' ? 6 : 18,
                  }}
                >
                  {msg.text}
                  {msg.crisisDetected && (
                    <p className="mt-2 text-[10px] text-amber-200">
                      Safety support was triggered for this message.
                    </p>
                  )}
                </div>
                {msg.time && <span className="text-[9px] px-1" style={{ color: 'rgba(148,163,184,0.45)' }}>{msg.time}</span>}
              </div>
            </motion.div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-2.5 flex gap-2 overflow-x-auto custom-scrollbar border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => sendMessage(prompt.text)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.85)', whiteSpace: 'nowrap' }}
          >
            <span>{prompt.emoji}</span>{prompt.text}
          </button>
        ))}
      </div>

      <div className="px-5 py-3.5 flex items-end gap-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Mic className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={`Tell ${petName} something...`}
          rows={1}
          className="flex-1 resize-none py-2.5 px-4 rounded-2xl text-sm outline-none transition-all custom-scrollbar"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f8fafc', maxHeight: 120 }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
          style={{ background: input.trim() ? '#06b6d4' : 'rgba(255,255,255,0.04)', border: input.trim() ? 'none' : '1px solid rgba(255,255,255,0.08)', boxShadow: input.trim() ? '0 0 18px rgba(6,182,212,0.4)' : 'none' }}
        >
          <Send className={`w-3.5 h-3.5 ${input.trim() ? 'text-white' : 'text-muted-foreground'}`} />
        </button>
      </div>
    </div>
  );
}

function RelationshipPanel({ bondPct, progress, messages, companion }) {
  const unlockedAccessories = (companion?.unlockedAccessories || []).filter((item) => item && item !== 'None');
  const streak = progress?.currentStreak ?? 0;
  const xp = progress?.xp ?? companion?.petXp ?? 0;

  return (
    <div className="w-[200px] flex-shrink-0 flex flex-col gap-3">
      <div className="glass-panel rounded-3xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Journey</p>
          <Star className="w-3 h-3 text-rose-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '💬', label: 'Messages', value: messages.length },
            { icon: '🔥', label: 'Streak', value: streak },
            { icon: '⚡', label: 'XP', value: xp },
            { icon: '💙', label: 'Bond', value: `${clamp(bondPct)}%` },
          ].map((stat) => (
            <div key={stat.label} className="p-2.5 rounded-xl flex flex-col gap-0.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-base">{stat.icon}</span>
              <span className="text-base font-bold text-white">{stat.value}</span>
              <span className="text-[9px]" style={{ color: 'rgba(148,163,184,0.55)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Memory vault</p>
          <Lock className="w-3 h-3 text-muted-foreground" />
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.68)' }}>
          No saved companion memories yet. Future memories should come from real product events only.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>Achievements</p>
          <Trophy className="w-3 h-3" style={{ color: 'rgba(251,191,36,0.6)' }} />
        </div>
        <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(148,163,184,0.68)' }}>
          Badges unlock from real actions. Visit Badges & Challenges to see earned progress.
        </p>
        <a href="/app/badges" className="text-[10px] font-semibold text-cyan-300">Open badges</a>
      </div>

      <div className="glass-panel rounded-3xl p-4">
        <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(148,163,184,0.55)' }}>Unlocked accessories</p>
        {unlockedAccessories.length > 0 ? (
          <div className="space-y-2">
            {unlockedAccessories.map((item) => (
              <div key={item} className="px-2 py-1.5 rounded-xl text-[11px]" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#67e8f9' }}>
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px]" style={{ color: 'rgba(148,163,184,0.68)' }}>No accessories unlocked yet.</p>
        )}
      </div>
    </div>
  );
}

export function FigmaCompanionView({
  petName = 'Luna',
  level = 1,
  bondPct = 0,
  messages: apiMessages = [],
  onSendMessage,
  progress,
  companion,
}) {
  const messages = useMemo(() => normalizeMessages(apiMessages), [apiMessages]);
  const xp = progress?.xp ?? companion?.petXp ?? 0;

  return (
    <div className="flex flex-col gap-4 pb-6 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold tracking-tight" style={{ fontSize: '1.3rem' }}>
            {petName} — Your AI Companion
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>
            Level {level} · Bond {clamp(bondPct)}% · {messages.length} real conversations
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">{petName} is with you</span>
        </div>
      </motion.div>

      <div className="flex gap-4 items-start">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}>
          <CompanionIdentityPanel petName={petName} level={level} bondPct={bondPct} xp={xp} companion={companion} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="flex-1 min-w-0" style={{ minHeight: 700, display: 'flex', flexDirection: 'column' }}>
          <AIChatPanel petName={petName} messages={messages} onSendMessage={onSendMessage} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}>
          <RelationshipPanel bondPct={bondPct} progress={progress} messages={messages} companion={companion} />
        </motion.div>
      </div>
    </div>
  );
}
