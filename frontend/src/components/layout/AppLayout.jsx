import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  ListChecks,
  Heart,
  BookOpen,
  Bot,
  GraduationCap,
  Target,
  Award,
  Sprout,
  Sparkles,
  Hourglass,
  BarChart2,
  Settings,
  Flame,
  Bell,
  Plus,
  Search,
  LogOut,
} from 'lucide-react';
import { getSession, clearSession } from '../../lib/auth.js';

const SIDEBAR_ITEMS = [
  {
    section: '',
    items: [
      { name: 'Companion Home', icon: LayoutDashboard, path: '/app/home' },
      { name: 'AI Companion', icon: Bot, path: '/app/companion', accent: true },
      { name: 'Growth Garden', icon: Sprout, path: '/app/garden', accent: true },
    ],
  },
  {
    section: 'Daily',
    items: [
      { name: 'Daily Check-In', icon: CalendarCheck, path: '/app/checkin' },
      { name: 'Habits', icon: ListChecks, path: '/app/habits' },
      { name: 'Journal', icon: BookOpen, path: '/app/journal' },
      { name: 'Gratitude', icon: Heart, path: '/app/gratitude' },
    ],
  },
  {
    section: 'Progress',
    items: [
      { name: 'Goals', icon: Target, path: '/app/goals' },
      { name: 'Badges', icon: Award, path: '/app/badges' },
      { name: 'Analytics', icon: BarChart2, path: '/app/analytics' },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { name: 'AI Reflections', icon: Sparkles, path: '/app/reflections' },
      { name: 'Future Me', icon: Hourglass, path: '/app/future-me' },
      { name: 'Exam Focus', icon: GraduationCap, path: '/app/exams' },
    ],
  },
];

function NavItem({ item }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : item.accent
              ? 'text-cyan-300/80 hover:text-cyan-300 hover:bg-cyan-500/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 w-0.5 h-5 bg-primary rounded-r-full" />
          )}
          <item.icon
            className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : item.accent ? 'text-cyan-400/70' : ''}`}
          />
          <span className="text-sm">{item.name}</span>
          {item.accent && !isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
          )}
        </>
      )}
    </NavLink>
  );
}

export function AppLayout({ companion, streak = 0, onLogout }) {
  const { name } = getSession();
  const navigate = useNavigate();
  const petName = companion?.petName || 'Luna';
  const level = companion?.level ?? 1;
  const bondPct =
    companion?.petXp && companion?.level
      ? Math.min(100, Math.round(((companion.petXp % 250) / 250) * 100) || 83)
      : 83;

  const handleLogout = () => {
    clearSession();
    onLogout?.();
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-t-0 border-b-0 border-l-0 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">MindMate</span>
        </div>

        {companion?.hasSelectedCompanion && (
          <div className="mx-4 mb-4 p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/15 relative overflow-hidden">
            <div className="relative flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-500/20 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🐱</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-semibold">{petName}</span>
                  <span className="text-primary text-xs font-medium">Lv.{level}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
                      style={{ width: `${bondPct}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-[10px]">{bondPct}%</span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] flex-shrink-0" />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5 custom-scrollbar">
          {SIDEBAR_ITEMS.map((group) => (
            <div key={group.section || 'main'}>
              {group.section && (
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {group.section}
                </h4>
              )}
              <nav className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Link
            to="/app/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all text-sm"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all text-sm w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-8 z-10 glass-panel border-b border-l-0 border-r-0 border-t-0 py-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Good morning, {name}! ✨
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {petName} is with you · Your growth companion is listening
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-input-background border border-border/50 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-primary/50 w-48"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <span>🐱</span> {petName} Lv.{level}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              {streak} Day Streak
            </div>
            <Link
              to="/app/checkin"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              Check-In
            </Link>
            <button
              type="button"
              className="relative p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <Link
              to="/app/profile"
              className="w-9 h-9 rounded-full border border-border/50 bg-white/5 flex items-center justify-center text-xs font-bold text-primary"
            >
              {name.charAt(0).toUpperCase()}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
