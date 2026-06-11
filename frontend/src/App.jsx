"use strict";

import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle2,
  HeartHandshake,
  Home,
  Lock,
  MessageCircle,
  Moon,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Award,
  ListTodo,
  Calendar,
  Flame,
  TrendingUp,
  Clock,
  Compass,
  Smile,
  LogOut,
  Plus,
  Trash2,
  Sun,
  ChevronRight,
  Eye,
  Info,
  Layers,
  Sparkle,
  Settings,
  Bell,
  LockKeyhole,
  Check,
  Search,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  Target,
  Mail,
  Shield
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Link, NavLink, Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useLocation } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout.jsx'
import { CompanionHomePage } from './pages/home/CompanionHomePage.jsx'
import { CompanionPage } from './pages/companion/CompanionPage.jsx'
import { GardenPage as ApprovedGardenPage } from './pages/garden/GardenPage.jsx'
import { HabitsPage as SprintHabitsPage } from './pages/habits/HabitsPage.jsx'
import { JournalPage as SprintJournalPage } from './pages/journal/JournalPage.jsx'
import { GratitudePage as SprintGratitudePage } from './pages/gratitude/GratitudePage.jsx'
import { GoalsPage as SprintGoalsPage } from './pages/goals/GoalsPage.jsx'
import { ExamFocusPage as SprintExamFocusPage } from './pages/exams/ExamFocusPage.jsx'
import { BadgesChallengesPage as SprintBadgesChallengesPage } from './pages/badges/BadgesChallengesPage.jsx'
import { AnalyticsPage as SprintAnalyticsPage } from './pages/analytics/AnalyticsPage.jsx'
import { AIReflectionsPage as SprintAIReflectionsPage } from './pages/reflections/AIReflectionsPage.jsx'
import { FutureMePage as SprintFutureMePage } from './pages/future-me/FutureMePage.jsx'
import { apiFetch } from './lib/api.js'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts'

export function calculateWellnessScore(mood, stressLevel, energyLevel, sleepHours, sleepQuality, socialInteraction) {
  let moodVal = 60;
  switch (mood?.toUpperCase()) {
    case 'EXCELLENT': moodVal = 100; break;
    case 'GOOD': moodVal = 80; break;
    case 'NEUTRAL': moodVal = 60; break;
    case 'STRESSED': moodVal = 40; break;
    case 'SAD': moodVal = 20; break;
    default: moodVal = 60; break;
  }
  const stressFactor = (6 - stressLevel) * 20;
  const energyFactor = energyLevel * 20;
  const sleepFactor = Math.min(sleepHours * 12.5, 100.0);
  const qualityFactor = sleepQuality * 20;
  const socialFactor = socialInteraction * 20;

  const score = Math.round((moodVal + stressFactor + energyFactor + sleepFactor + qualityFactor + socialFactor) / 6);
  return Math.max(0, Math.min(100, score));
}

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(checkins) {
  if (!checkins || checkins.length === 0) return 0;
  
  const dates = Array.from(new Set(checkins.map(c => {
    const d = new Date(c.createdAt);
    return getLocalDateString(d);
  }))).sort((a, b) => new Date(b) - new Date(a));

  if (dates.length === 0) return 0;

  const todayStr = getLocalDateString(new Date());
  const yesterdayStr = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

  const latestDate = dates[0];
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streakCount = 0;
  let currentDate = new Date(latestDate);

  for (let i = 0; i < dates.length; i++) {
    const expectedStr = getLocalDateString(currentDate);
    if (dates[i] === expectedStr) {
      streakCount++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streakCount;
}

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || 'STUDENT');
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved) return saved;
    const oldSaved = localStorage.getItem("darkMode");
    if (oldSaved !== null) {
      return oldSaved === "true" ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
    localStorage.setItem("darkMode", themeMode === "dark" ? "true" : "false");
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(themeMode);
  }, [themeMode]);

  return (
    <div className={themeMode === 'dark' ? 'dark min-h-screen bg-[#020617] text-[#f8fafc]' : 'min-h-screen bg-[#f8fafc] text-[#0f172a]'}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" setRole={setRole} />} />
          <Route path="/register" element={<AuthPage mode="register" setRole={setRole} />} />
          <Route
            path="/app/*"
            element={<AppShell role={role} setRole={setRole} themeMode={themeMode} setThemeMode={setThemeMode} />}
          />
        </Routes>
      </Router>
    </div>
  )
}

function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col justify-between">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#14b8a6]">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#14b8a6] to-[#8b5cf6] text-white shadow-md">
            <Brain size={22} />
          </span>
          MindMate
        </Link>
        <div className="flex items-center gap-4">
          <Link className="btn btn-ghost" to="/login">Login</Link>
          <Link className="btn btn-primary" to="/register">Get Started</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl text-center px-6 py-20 flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-[#14b8a6] border border-teal-500/20">
          <Sparkle size={12} className="animate-pulse" /> Premium Teen Wellness Ecosystem
        </span>
        <h1 className="text-5xl font-black leading-tight text-white md:text-7xl mt-6 tracking-tight">
          Personal Growth, Habit Streaks & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14b8a6] to-[#8b5cf6]">AI Companionship</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-base leading-relaxed text-[#94a3b8]">
          MindMate combines scientific reflection metrics, exam-focus modules, and gamified achievements with your own virtual garden and reactive AI companion pet.
        </p>
        <div className="mt-10 flex gap-4">
          <Link className="btn btn-primary btn-large shadow-lg shadow-teal-500/20" to="/register">Create Free Account</Link>
          <Link className="btn btn-secondary btn-large" to="/login">Open Dashboard</Link>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 w-full">
        <h2 className="text-2xl font-black text-center text-white mb-8">Core Wellness Features</h2>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="p-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex flex-col items-center text-center shadow-lg">
            <span className="p-3.5 rounded-xl bg-teal-500/10 text-[#14b8a6] mb-4"><MessageCircle size={24} /></span>
            <strong className="text-white block font-bold mb-2">AI Companion</strong>
            <p className="text-xs text-slate-400">Chat with Luna, customized with unlocked themes and accessories based on your XP.</p>
          </div>
          <div className="p-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex flex-col items-center text-center shadow-lg">
            <span className="p-3.5 rounded-xl bg-green-500/10 text-green-400 mb-4"><Compass size={24} /></span>
            <strong className="text-white block font-bold mb-2">Growth Garden</strong>
            <p className="text-xs text-slate-400">Complete tasks to grow virtual trees through 5 stages of evolution.</p>
          </div>
          <div className="p-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex flex-col items-center text-center shadow-lg">
            <span className="p-3.5 rounded-xl bg-violet-500/10 text-[#8b5cf6] mb-4"><Clock size={24} /></span>
            <strong className="text-white block font-bold mb-2">Future Me</strong>
            <p className="text-xs text-slate-400">Write timelocked capsules to your future self and view unlocked letters archive.</p>
          </div>
          <div className="p-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex flex-col items-center text-center shadow-lg">
            <span className="p-3.5 rounded-xl bg-orange-500/10 text-orange-400 mb-4"><Target size={24} /></span>
            <strong className="text-white block font-bold mb-2">Life Goals</strong>
            <p className="text-xs text-slate-400">Organize achievements and monitor targets grouped by categories.</p>
          </div>
          <div className="p-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex flex-col items-center text-center shadow-lg">
            <span className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 mb-4"><Layers size={24} /></span>
            <strong className="text-white block font-bold mb-2">Analytics</strong>
            <p className="text-xs text-slate-400">Audit wellness, sleep quality, stress levels, and check-in metrics via premium charts.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="mx-auto max-w-5xl px-6 py-12 w-full text-center border-t border-slate-900 mt-6">
        <h2 className="text-2xl font-black text-white mb-8">How MindMate Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <span className="h-10 w-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] flex items-center justify-center font-bold text-sm mb-3">1</span>
            <strong className="text-white text-sm block mb-1">Adopt Companion</strong>
            <p className="text-xs text-slate-400">Pick from 6 unique reactive companion pets and customize their parameters.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="h-10 w-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] flex items-center justify-center font-bold text-sm mb-3">2</span>
            <strong className="text-white text-sm block mb-1">Log Daily Habits</strong>
            <p className="text-xs text-slate-400">Submit mood logs, checklists, Pomodoro sessions, and exam deadlines.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="h-10 w-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] flex items-center justify-center font-bold text-sm mb-3">3</span>
            <strong className="text-white text-sm block mb-1">Grow Your Garden</strong>
            <p className="text-xs text-slate-400">Check-ins grant XP points to nurture your seed into a Forest Guardian.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="h-10 w-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] flex items-center justify-center font-bold text-sm mb-3">4</span>
            <strong className="text-white text-sm block mb-1">AI Insights</strong>
            <p className="text-xs text-slate-400">Review weekly AI reflections summarizing sleep cycles and stress deltas.</p>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-slate-900 text-center text-xs text-[#94a3b8]">
        &copy; 2026 MindMate Ecosystem. All rights reserved.
      </footer>
    </main>
  )
}

function AuthPage({ mode, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email, password } : { name, email, password };

    try {
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || 'STUDENT');
        localStorage.setItem("userName", data.name || 'Student');
        localStorage.setItem("userEmail", data.email || 'student@example.com');
        setRole(data.role || 'STUDENT');
        navigate('/app/home');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="auth-page bg-[#020617]">
      <form className="auth-card bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex justify-center mb-2">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr from-[#14b8a6] to-[#8b5cf6] text-white shadow-md">
            <Brain size={26} />
          </span>
        </div>
        <h1 className="text-2xl font-black text-center text-white">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-xs text-center text-slate-400 mt-1">
          {mode === 'login' ? 'Sign in to access your wellness workspace' : 'Get started with your interactive growth companion'}
        </p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-[#ef4444] rounded-lg text-xs font-semibold text-center mt-2 animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-3 mt-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Name</label>
              <input type="text" className="input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
            <input type="email" className="input" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Password</label>
            <input type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full justify-center mt-6 font-bold">
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>

        <div className="text-center mt-4">
          <Link to={mode === 'login' ? '/register' : '/login'} className="text-xs text-[#14b8a6] hover:underline font-bold">
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </Link>
        </div>
      </form>
    </div>
  );
}

function AppNav({ icon, label, to }) {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function getPetAvatar(type) {
  if (!type) return '/luna_avatar.png';
  const lower = type.toLowerCase();
  if (lower === 'luna' || lower === 'cat') return '/luna_avatar.png';
  if (lower === 'max' || lower === 'dog') return '/max_avatar.png';
  if (lower === 'nova' || lower === 'fox') return '/nova_avatar.png';
  if (lower === 'bamboo' || lower === 'panda') return '/bamboo_avatar.png';
  if (lower === 'mochi' || lower === 'rabbit') return '/mochi_avatar.png';
  if (lower === 'sage' || lower === 'owl') return '/sage_avatar.png';
  return '/luna_avatar.png';
}

function getPetEmoji(type) {
  if (!type) return '🐾';
  switch (type.toUpperCase()) {
    case 'CAT': return '🐱';
    case 'DOG': return '🐶';
    case 'FOX': return '🦊';
    case 'PANDA': return '🐼';
    case 'RABBIT': return '🐰';
    case 'OWL': return '🦉';
    default: return '🐾';
  }
}

function AppShell({ role, setRole, themeMode, setThemeMode }) {
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gardenTheme, setGardenTheme] = useState('classic');
  const [levelUpData, setLevelUpData] = useState(null);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const triggerLevelUpCelebration = (name, level) => {
    let unlocked = null;
    if (level === 2) unlocked = 'Glasses';
    else if (level === 3) unlocked = 'Forest Theme';
    else if (level === 4) unlocked = 'Scarves';
    else if (level === 5) unlocked = 'Autumn Theme';
    else if (level === 6) unlocked = 'Hats';
    else if (level === 8) unlocked = 'Backpacks';
    else if (level === 10) unlocked = 'Galaxy Theme';
    else if (level === 12) unlocked = 'Crowns';
    else if (level === 15) unlocked = 'Cyber Theme';

    let evolution = 'Baby';
    if (level >= 5 && level < 10) evolution = 'Young';
    else if (level >= 10) evolution = 'Adult';

    setLevelUpData({ name, level, evolution, unlocked });
  };

  const loadPet = () => {
    apiFetch('/api/companion')
      .then(data => {
        if (data && data.hasSelectedCompanion) {
          const companionObj = {
            type: data.petType,
            name: data.petName,
            species: data.species,
            personality: data.personality,
            petXp: data.petXp,
            level: data.level,
            evolutionStage: data.evolutionStage,
            mood: data.mood,
            avatar: data.avatar,
            unlockedThemes: data.unlockedThemes || ['Classic'],
            unlockedAccessories: data.unlockedAccessories || ['None'],
            insight: data.insight,
            hasSelectedCompanion: data.hasSelectedCompanion
          };
          
          const savedPetStr = localStorage.getItem("user_pet");
          if (savedPetStr) {
            try {
              const savedPet = JSON.parse(savedPetStr);
              if (savedPet.level && companionObj.level > savedPet.level) {
                triggerLevelUpCelebration(companionObj.name, companionObj.level);
              }
            } catch (e) {}
          }
          
          setPet(companionObj);
          localStorage.setItem("user_pet", JSON.stringify(companionObj));
        } else {
          setPet(null);
          localStorage.removeItem("user_pet");
        }
      })
      .catch(err => {
        console.error("Error loading pet:", err);
        const savedPet = localStorage.getItem("user_pet");
        if (savedPet) {
          setPet(JSON.parse(savedPet));
        }
      });
  };

  const loadStreak = () => {
    apiFetch('/api/checkins/history')
      .then(history => {
        if (Array.isArray(history)) {
          const calculated = calculateStreak(history);
          setStreak(calculated);
        }
      })
      .catch(console.error);
  };

  const loadGardenTheme = () => {
    apiFetch('/api/gamification/progress')
      .then(data => {
        if (data && data.gardenTheme) {
          let t = data.gardenTheme.toLowerCase();
          if (t === 'cozy_autumn') t = 'autumn';
          setGardenTheme(t);
        }
      })
      .catch(console.error);
  };

  const changeTheme = async (newTheme) => {
    try {
      await apiFetch('/api/gamification/theme', {
        method: 'POST',
        body: JSON.stringify({ theme: newTheme })
      });
      let t = newTheme.toLowerCase();
      if (t === 'cozy_autumn') t = 'autumn';
      setGardenTheme(t);
      triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPet();
    loadStreak();
    loadGardenTheme();
  }, [refreshKey]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', gardenTheme);
  }, [gardenTheme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_pet");
    setRole('STUDENT');
    navigate('/');
  };

  const layoutCompanion = pet
    ? {
        petName: pet.name,
        petType: pet.type,
        level: pet.level,
        petXp: pet.petXp,
        insight: pet.insight,
        hasSelectedCompanion: pet.hasSelectedCompanion,
      }
    : null;

  return (
    <>
        {!pet || !pet.hasSelectedCompanion ? (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <OnboardingPage setPet={setPet} />
          </div>
        ) : (
          <Routes>
            <Route
              element={
                <AppLayout
                  companion={layoutCompanion}
                  streak={streak}
                  onLogout={() => setRole('STUDENT')}
                />
              }
            >
              <Route path="home" element={<CompanionHomePage companion={pet} refreshKey={refreshKey} />} />
              <Route path="dashboard" element={<Navigate to="/app/home" replace />} />
              <Route path="checkin" element={<CheckinPage pet={pet} streak={streak} setStreak={setStreak} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="habits" element={<SprintHabitsPage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="gratitude" element={<SprintGratitudePage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="journal" element={<SprintJournalPage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="companion" element={<CompanionPage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="chat" element={<Navigate to="/app/companion" replace />} />
              <Route path="exams" element={<SprintExamFocusPage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="goals" element={<SprintGoalsPage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="badges" element={<SprintBadgesChallengesPage pet={pet} refreshKey={refreshKey} />} />
              <Route path="garden" element={<ApprovedGardenPage pet={pet} gardenTheme={gardenTheme} changeTheme={changeTheme} />} />
              <Route path="reflections" element={<SprintAIReflectionsPage pet={pet} refreshKey={refreshKey} />} />
              <Route path="future-me" element={<SprintFutureMePage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="analytics" element={<SprintAnalyticsPage pet={pet} refreshKey={refreshKey} />} />
              <Route path="profile" element={<ProfilePage pet={pet} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="settings" element={<SettingsPage pet={pet} themeMode={themeMode} setThemeMode={setThemeMode} refreshKey={refreshKey} triggerRefresh={triggerRefresh} />} />
              <Route path="*" element={<Navigate to="/app/home" replace />} />
            </Route>
          </Routes>
        )}

      {levelUpData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border-2 border-[#14b8a6] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400 via-slate-900 to-black"></div>
            <div className="relative z-10 space-y-6">
              <span className="text-6xl animate-bounce block">✨🎉💖</span>
              <h2 className="text-3xl font-black text-white">Level Up!</h2>
              <div className="bg-teal-500/10 border border-teal-500/20 py-4 px-6 rounded-xl inline-block">
                <span className="text-lg font-bold text-[#14b8a6] block">{levelUpData.name} reached Level {levelUpData.level}</span>
              </div>
              <div className="space-y-2 mt-4 text-slate-300">
                <p className="text-sm font-semibold">Evolution Stage: <strong className="text-white">{levelUpData.evolution}</strong></p>
                {levelUpData.unlocked && (
                  <p className="text-sm text-[#14b8a6] font-bold">🎁 Unlocked accessory/theme: {levelUpData.unlocked}</p>
                )}
              </div>
              <button onClick={() => setLevelUpData(null)} className="btn btn-primary w-full justify-center mt-6 font-bold text-sm py-2.5">
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function OnboardingPage({ setPet }) {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/companion/templates')
      .then(data => {
        if (Array.isArray(data)) {
          setCompanions(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const choose = () => {
    if (!name.trim() || companions.length === 0) return;
    const item = companions[selectedIdx];
    const newPetRequest = {
      petType: item.petType,
      petName: name,
      petTheme: 'Classic',
      petAccessory: 'None'
    };

    apiFetch('/api/companion', {
      method: 'POST',
      body: JSON.stringify(newPetRequest)
    })
    .then(data => {
      if (data && data.hasSelectedCompanion) {
        const petObj = {
          type: data.petType,
          name: data.petName,
          species: data.species,
          personality: data.personality,
          petXp: data.petXp,
          level: data.level,
          evolutionStage: data.evolutionStage,
          mood: data.mood,
          avatar: data.avatar,
          unlockedThemes: data.unlockedThemes || ['Classic'],
          unlockedAccessories: data.unlockedAccessories || ['None'],
          insight: data.insight,
          hasSelectedCompanion: data.hasSelectedCompanion
        };
        localStorage.setItem("user_pet", JSON.stringify(petObj));
        setPet(petObj);
      }
    })
    .catch(console.error);
  };

  if (loading || companions.length === 0) {
    return (
      <section className="max-w-3xl mx-auto p-8 bg-[#0f172a] border border-[#1e293b] rounded-2xl text-center shadow-xl loading-pulse h-[300px]"></section>
    );
  }

  const selectedCompanion = companions[selectedIdx];

  return (
    <section className="max-w-3xl mx-auto p-8 bg-[#0f172a] border border-[#1e293b] rounded-2xl text-center shadow-xl">
      <h2 className="text-3xl font-black text-white mb-2">Choose Your Companion</h2>
      <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm">Select an AI companion pet to join you on your daily wellness journey.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {companions.map((c, i) => (
          <button
            key={c.petType}
            onClick={() => setSelectedIdx(i)}
            type="button"
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              selectedIdx === i ? 'border-[#14b8a6] bg-[#14b8a6]/10' : 'border-[#1e293b] hover:bg-slate-800'
            }`}
          >
            <img src={getPetAvatar(c.petType)} className="w-12 h-12 rounded-full object-cover mb-2" alt={c.species} />
            <strong className="text-sm block text-white">{c.species}</strong>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{getPetEmoji(c.petType)} {c.personality}</span>
          </button>
        ))}
      </div>

      <div className="bg-[#020617] p-4 rounded-xl max-w-md mx-auto mb-6 border border-[#1e293b]">
        <strong className="text-[#14b8a6] block mb-1 text-sm">{selectedCompanion.species} ({selectedCompanion.personality})</strong>
        <p className="text-xs text-slate-400 leading-relaxed">{selectedCompanion.description}</p>
      </div>

      <div className="max-w-md mx-auto flex flex-col gap-3">
        <input className="input text-center font-semibold text-sm py-1.5" placeholder="Name your companion..." value={name} onChange={e => setName(e.target.value)} required />
        <button onClick={choose} className="btn btn-primary justify-center font-bold text-xs py-2.5">Adopt Companion</button>
      </div>
    </section>
  );
}

// 1. Dashboard Page
function DashboardPage({ pet, setPet, refreshKey, triggerRefresh }) {
  const [progress, setProgress] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [exams, setExams] = useState([]);
  const [habits, setHabits] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch('/api/gamification/progress'),
      apiFetch('/api/checkins/history'),
      apiFetch('/api/exams'),
      apiFetch('/api/habits'),
      apiFetch('/api/dashboard')
    ])
    .then(([progData, checkinsData, examsData, habitsData, dashData]) => {
      setProgress(progData);
      setCheckins(checkinsData || []);
      setExams(examsData || []);
      setHabits(habitsData || []);
      setDashboardData(dashData);
    })
    .catch(err => {
      console.error("Dashboard load error:", err);
      setError("Failed to sync wellness dashboard data. Please try again.");
    })
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAllData();
  }, [refreshKey]);

  // Derived Calculations
  const latestCheckin = checkins[0];
  const wellnessScore = latestCheckin ? latestCheckin.wellnessScore : 0;
  
  const wellnessStatus = useMemo(() => {
    if (wellnessScore >= 80) return { label: 'Excellent Progress', color: 'text-[#22c55e] bg-emerald-500/10' };
    if (wellnessScore >= 60) return { label: 'Good Progress', color: 'text-[#14b8a6] bg-teal-500/10' };
    if (wellnessScore >= 40) return { label: 'Moderate Progress', color: 'text-[#f59e0b] bg-amber-500/10' };
    return { label: 'Needs Attention', color: 'text-[#ef4444] bg-red-500/10' };
  }, [wellnessScore]);

  const streakVal = progress?.currentStreak || 0;
  const bestStreak = progress?.longestStreak || 0;

  const avgSleep = useMemo(() => {
    const last7 = checkins.slice(0, 7);
    return last7.length > 0 
      ? (last7.reduce((sum, c) => sum + c.sleepHours, 0) / last7.length).toFixed(1) 
      : '0.0';
  }, [checkins]);

  const moodVal = useMemo(() => {
    if (!latestCheckin) return 'N/A';
    const mapping = {
      EXCELLENT: 'Great 🟢',
      GOOD: 'Good 😊',
      NEUTRAL: 'Okay 😐',
      STRESSED: 'Stressed 😟',
      SAD: 'Sad 🔴'
    };
    return mapping[latestCheckin.mood] || latestCheckin.mood;
  }, [latestCheckin]);

  const energyVal = useMemo(() => {
    if (!latestCheckin) return 'N/A';
    const labels = ['', 'Low', 'Medium-Low', 'Medium', 'High', 'Very High'];
    return labels[latestCheckin.energyLevel] || 'N/A';
  }, [latestCheckin]);

  const stressVal = useMemo(() => {
    if (!latestCheckin) return 'N/A';
    return `${latestCheckin.stressLevel} / 5`;
  }, [latestCheckin]);

  // Today's Focus targets status
  const checkinDone = useMemo(() => {
    if (!latestCheckin) return false;
    return new Date(latestCheckin.createdAt).toDateString() === new Date().toDateString();
  }, [latestCheckin]);

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const habitsProgress = totalHabits > 0 ? `${completedHabits}/${totalHabits}` : '0/0';
  const habitsDone = totalHabits > 0 && completedHabits === totalHabits;

  const journalDone = useMemo(() => {
    if (!dashboardData?.recentJournals) return false;
    return dashboardData.recentJournals.some(j => new Date(j.createdAt).toDateString() === new Date().toDateString());
  }, [dashboardData]);

  // Upcoming Exams count sorted chronologically
  const upcomingExams = useMemo(() => {
    return exams
      .filter(ex => new Date(ex.examDate) >= new Date(new Date().setHours(0,0,0,0)))
      .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
      .slice(0, 2);
  }, [exams]);

  // Calculate dynamic weekly trend
  const thisWeek = checkins.slice(0, 7);
  const lastWeek = checkins.slice(7, 14);
  const thisWeekAvg = thisWeek.length > 0 ? thisWeek.reduce((sum, c) => sum + c.wellnessScore, 0) / thisWeek.length : 0;
  const lastWeekAvg = lastWeek.length > 0 ? lastWeek.reduce((sum, c) => sum + c.wellnessScore, 0) / lastWeek.length : 0;

  const trendText = useMemo(() => {
    if (lastWeekAvg === 0) return 'No trend data yet';
    const diff = thisWeekAvg - lastWeekAvg;
    const pct = Math.abs(Math.round((diff / lastWeekAvg) * 100));
    return diff >= 0 ? `↑ ${pct}% vs last week` : `↓ ${pct}% vs last week`;
  }, [thisWeekAvg, lastWeekAvg]);

  const userName = localStorage.getItem("userName") || "User";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#0f172a] border border-[#1e293b] rounded-2xl text-center shadow-xl max-w-xl mx-auto my-12">
        <span className="text-4xl mb-4">⚠️</span>
        <h3 className="text-lg font-black text-white mb-2">Sync Connection Error</h3>
        <p className="text-xs text-slate-400 mb-6">{error}</p>
        <button onClick={loadAllData} className="btn btn-primary font-bold">Try Syncing Again</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid-12">
        <div className="col-4 panel h-card-md loading-pulse"></div>
        <div className="col-4 panel h-card-md loading-pulse"></div>
        <div className="col-4 panel h-card-md loading-pulse"></div>
        <div className="col-12 panel h-[90px] loading-pulse"></div>
        <div className="col-3 panel h-card-lg loading-pulse"></div>
        <div className="col-3 panel h-card-lg loading-pulse"></div>
        <div className="col-3 panel h-card-lg loading-pulse"></div>
        <div className="col-3 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Hero Row - 3 Separate Columns with Shared Height system */}
      {/* Column 1: Companion Card */}
      <div className="col-4 panel h-card-md">
        <div className="flex justify-between items-start w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Your Companion</span>
          <span className="text-[10px] text-[#14b8a6] bg-teal-500/10 px-2.5 py-0.5 rounded-full font-bold">
            {getPetEmoji(pet.type)} {pet.mood}
          </span>
        </div>
        <div className="flex items-center gap-4 my-auto">
          <img src={getPetAvatar(pet.type)} className="w-16 h-16 rounded-2xl border border-slate-700 shadow-lg object-cover" alt={pet.name} />
          <div className="flex-1">
            <strong className="text-base block text-white font-black">{pet.name}</strong>
            <span className="text-xs text-slate-400 block mt-0.5">{pet.species} ({pet.evolutionStage}) · Lvl {pet.level}</span>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
              <div className="bg-[#14b8a6] h-2 rounded-full shadow-[0_0_8px_var(--teal)]" style={{ width: `${pet.petXp % 100}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-semibold">{pet.petXp % 100} / 100 XP</span>
          </div>
        </div>
        <Link to="/app/chat" className="btn btn-outline w-full justify-center mt-2">Chat with {pet.name}</Link>
      </div>

      {/* Column 2: Wellness Score Card */}
      <div className="col-4 panel h-card-md panel-glow">
        <div className="flex justify-between items-start w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Wellness Score</span>
          <span className={`text-[11px] font-bold ${thisWeekAvg >= lastWeekAvg ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            {trendText}
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div>
            <h3 className="text-3xl font-black text-white">{wellnessScore} <span className="text-slate-500 text-sm">/ 100</span></h3>
            <span className={`text-xs ${wellnessStatus.color} px-2.5 py-0.5 rounded-full font-bold block mt-2 w-max`}>
              {wellnessStatus.label}
            </span>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
              <circle cx="40" cy="40" r="32" stroke="#22c55e" strokeWidth="6" fill="transparent" strokeDasharray={201} strokeDashoffset={201 - (201 * wellnessScore) / 100} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 grid place-items-center font-black text-xs text-white">{wellnessScore}%</div>
          </div>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-bold mb-1">What's affecting your score?</span>
          <div className="flex gap-1.5">
            {['😴 Sleep', '😊 Mood', '⚡ Energy', '😌 Stress'].map((label, i) => (
              <span key={i} className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-semibold">{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Growth Garden */}
      <div className="col-4 panel h-card-md">
        <div className="flex justify-between items-start w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Growth Garden</span>
          <span className="text-[10px] text-[#14b8a6] bg-teal-500/10 px-2.5 py-0.5 rounded-full font-bold">Lvl {progress?.level || 1}</span>
        </div>
        <div className="flex items-center gap-4 my-auto">
          <img src="/garden_tree.png" className="w-16 h-16 object-contain floating" alt="Tree" />
          <div className="flex-1">
            <strong className="text-sm block text-white font-black">{progress?.level >= 20 ? 'Forest Guardian' : progress?.level >= 12 ? 'Young Tree' : 'Sprout'}</strong>
            <span className="text-xs text-slate-400 block mt-0.5">Theme: {progress?.gardenTheme || 'Classic'}</span>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5">
              <div className="bg-[#14b8a6] h-2 rounded-full shadow-[0_0_8px_var(--teal)]" style={{ width: `${Math.min(100, ((progress?.xp || 0) % 1000) / 10)}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1.5 font-semibold">Trees Grown: {progress?.treesGrown || 0}</span>
          </div>
        </div>
        <Link to="/app/garden" className="btn btn-outline w-full justify-center mt-2">Visit Garden</Link>
      </div>

      {/* Row 2: Metrics Row (12 Column Full Span with 5 sub-items) */}
      <div className="col-12">
        <div className="metrics-row-5">
          <div className="metric-card">
            <span className="text-2xl p-2 bg-orange-500/10 rounded-xl text-orange-400">🔥</span>
            <div>
              <span>Streak</span>
              <strong className="block">{streakVal} Days</strong>
              <p>Best: {bestStreak} Days</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="text-2xl p-2 bg-blue-500/10 rounded-xl text-blue-400">😴</span>
            <div>
              <span>Sleep (7d)</span>
              <strong className="block">{avgSleep} Hours</strong>
              <p>Weekly average</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="text-2xl p-2 bg-teal-500/10 rounded-xl text-teal-400">😊</span>
            <div>
              <span>Mood</span>
              <strong className="block truncate max-w-[80px]">{moodVal}</strong>
              <p>Latest checkin</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="text-2xl p-2 bg-yellow-500/10 rounded-xl text-yellow-400">⚡</span>
            <div>
              <span>Energy</span>
              <strong className="block truncate max-w-[80px]">{energyVal}</strong>
              <p>Latest level</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="text-2xl p-2 bg-purple-500/10 rounded-xl text-purple-400">😌</span>
            <div>
              <span>Stress</span>
              <strong className="block truncate max-w-[80px]">{stressVal}</strong>
              <p>Latest indicator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 Grid Split (4 Columns of col-3 each matching bottom dashboard panels) */}
      {/* 1. Today's Focus */}
      <div className="col-3 panel h-card-lg">
        <div>
          <h2><ListTodo size={18} className="text-[#14b8a6]" /> Today's Focus</h2>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={checkinDone} readOnly className="h-4 w-4" />
                <span className="text-xs font-semibold text-slate-200">Daily Check-In</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${checkinDone ? 'text-[#14b8a6] bg-teal-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {checkinDone ? '1/1' : '0/1'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={habitsDone} readOnly className="h-4 w-4" />
                <span className="text-xs font-semibold text-slate-200">Daily Habits</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${habitsDone ? 'text-[#14b8a6] bg-teal-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {habitsProgress}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={journalDone} readOnly className="h-4 w-4" />
                <span className="text-xs font-semibold text-slate-200">Write Journal</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${journalDone ? 'text-[#14b8a6] bg-teal-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {journalDone ? '1/1' : '0/1'}
              </span>
            </div>
          </div>
        </div>
        <Link to="/app/habits" className="text-xs text-[#14b8a6] font-bold flex items-center gap-1 hover:underline mt-4">
          View all tasks <ArrowRight size={12} />
        </Link>
      </div>

      {/* 2. Companion Speech Card */}
      <div className="col-3 panel h-card-lg">
        <h2><Sparkle size={18} className="text-[#14b8a6]" /> {pet.name} Says</h2>
        <div className="flex flex-col items-center text-center gap-3 my-auto w-full">
          <img src={getPetAvatar(pet.type)} className="w-16 h-16 rounded-full border border-slate-700 object-cover" alt={pet.name} />
          <div className="bg-[#020617] p-3 rounded-xl border border-[#1e293b] text-xs italic text-slate-300 relative w-full leading-relaxed">
            "{pet.insight || `Let's work on your wellness goals together, ${userName}!`}"
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-bold text-center uppercase tracking-wider">{getPetEmoji(pet.type)} AI Companion Pet</div>
      </div>

      {/* 3. Upcoming Modules */}
      <div className="col-3 panel h-card-lg">
        <div>
          <h2><GraduationCap size={18} className="text-[#14b8a6]" /> Upcoming Exams</h2>
          <div className="flex flex-col gap-2 mt-3">
            {upcomingExams.map((ex, i) => {
              const diffTime = Math.ceil((new Date(ex.examDate) - new Date()) / (1000 * 60 * 60 * 24));
              const displayDays = diffTime > 0 ? `In ${diffTime} Days` : 'Today';
              return (
                <div key={i} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-white block font-bold truncate max-w-[100px]">{ex.subject}</strong>
                    <span className="text-[9px] text-slate-500 font-semibold">{new Date(ex.examDate).toLocaleDateString([], {month:'short', day:'numeric'})}</span>
                  </div>
                  <span className="text-[#14b8a6] font-black">{displayDays}</span>
                </div>
              );
            })}
            {upcomingExams.length === 0 && (
              <div className="text-slate-500 text-xs italic text-center my-6">No scheduled exams.</div>
            )}
          </div>
        </div>
        <Link to="/app/exams" className="text-xs text-[#14b8a6] font-bold flex items-center gap-1 hover:underline mt-4">
          Go to Exam Focus <ArrowRight size={12} />
        </Link>
      </div>

      {/* 4. Wellness Trend with smooth curved area chart and gradient fill */}
      <div className="col-3 panel h-card-lg">
        <div className="flex justify-between items-center w-full mb-1">
          <h2><TrendingUp size={18} className="text-[#14b8a6]" /> Trend</h2>
          <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">This Week</span>
        </div>
        <div className="my-auto h-[120px] w-full">
          {checkins.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs italic">
              Log check-ins to unlock trend graphs.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={checkins.slice(0, 7).reverse()}>
                <defs>
                  <linearGradient id="dashboardTrendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity="0.3" vertical={false} />
                <XAxis dataKey="createdAt" tickFormatter={str => new Date(str).toLocaleDateString([], {day:'numeric',month:'short'})} tick={{fontSize:8, fill:'var(--muted)'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{fontSize:8, fill:'var(--muted)'}} axisLine={false} tickLine={false} width={15} />
                <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="wellnessScore" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#dashboardTrendColor)" activeDot={{ r: 5 }} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="text-[10px] text-slate-500 text-center font-semibold mt-2">Smooth Weekly Progress Chart</div>
      </div>
    </section>
  );
}

// 2. Daily Checkin Page
function CheckinPage({ pet, streak, setStreak, refreshKey, triggerRefresh }) {
  const [mood, setMood] = useState('GOOD');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(2);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [socialInteraction, setSocialInteraction] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [moodTrigger, setMoodTrigger] = useState('Exams');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {
    setLoading(true);
    apiFetch('/api/checkins/history')
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, [refreshKey]);

  const submit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const previousHistory = [...history];
    const previousStreak = streak;

    // Calculate optimistic wellness score
    const computedWellness = calculateWellnessScore(
      mood, stressLevel, energyLevel, sleepHours, sleepQuality, socialInteraction
    );

    // Create optimistic check-in object
    const optimisticCheckin = {
      id: Date.now(),
      mood,
      energyLevel,
      stressLevel,
      sleepHours,
      sleepQuality,
      socialInteraction,
      moodTrigger,
      wellnessScore: computedWellness,
      createdAt: new Date().toISOString()
    };

    // Optimistically update history and streak
    const newHistory = [optimisticCheckin, ...history];
    setHistory(newHistory);
    const calculatedStreak = calculateStreak(newHistory);
    if (setStreak) setStreak(calculatedStreak);

    try {
      await apiFetch('/api/checkins', {
        method: 'POST',
        body: JSON.stringify({
          mood, energyLevel, stressLevel, sleepHours, sleepQuality, socialInteraction, moodTrigger
        })
      });
      setSuccess('Check-in successfully logged! +5 XP earned.');
      setNotes('');
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
      setError('Failed to log check-in. Connection offline.');
      // Rollback optimistic state
      setHistory(previousHistory);
      if (setStreak) setStreak(previousStreak);
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-8 panel h-card-xl loading-pulse"></div>
        <div className="col-4 panel h-card-xl loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Left Column (col-8) */}
      <form className="col-8 panel h-card-xl bg-[#0f172a]" onSubmit={submit}>
        <div>
          <h2>How are you feeling today?</h2>
          <p className="text-xs text-slate-400 mb-4">Your daily metrics feed allows {pet.name} to compile reflections.</p>
          {success && <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] rounded-xl text-xs mb-3 font-semibold">{success}</div>}
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-[#ef4444] rounded-xl text-xs mb-3 font-semibold">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">Select Mood</span>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: 'Great', value: 'EXCELLENT', icon: '🟢' },
                  { label: 'Good', value: 'GOOD', icon: '😊' },
                  { label: 'Okay', value: 'NEUTRAL', icon: '😐' },
                  { label: 'Not Good', value: 'STRESSED', icon: '😟' },
                  { label: 'Awful', value: 'SAD', icon: '🔴' }
                ].map(m => (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      mood === m.value ? 'border-[#14b8a6] bg-[#14b8a6]/10 shadow-[0_0_12px_rgba(20,184,166,0.1)]' : 'border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[10px] text-slate-300 font-bold mt-1.5">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Energy Level (1 - 5): {energyLevel}</label>
                <input type="range" min="1" max="5" value={energyLevel} onChange={e => setEnergyLevel(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Stress Level (1 - 5): {stressLevel}</label>
                <input type="range" min="1" max="5" value={stressLevel} onChange={e => setStressLevel(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Sleep Duration: {sleepHours} hrs</label>
                <input type="range" min="1" max="15" step="0.5" value={sleepHours} onChange={e => setSleepHours(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Motivation (1 - 5): {motivation}</label>
                <input type="range" min="1" max="5" value={motivation} onChange={e => setMotivation(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Any notes for today?</label>
              <textarea className="input min-h-16" placeholder="Write down how you felt today..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full justify-center font-bold mt-4">Save Check-In</button>
      </form>

      {/* Right Column (col-4) */}
      <div className="col-4 flex flex-col gap-4 h-card-xl">
        <div className="panel bg-[#0f172a] text-center p-5 flex flex-col justify-center items-center">
          <span className="text-3xl block">🔥</span>
          <strong className="text-base block text-white mt-1.5 font-black">Check-in Streak</strong>
          <span className="text-3xl font-black text-orange-400 block mt-0.5">{streak || 0} Days</span>
          <p className="text-[11px] text-slate-400 mt-1">Keep it up!</p>
        </div>

        <div className="panel bg-[#0f172a] flex-grow overflow-y-auto max-h-[220px]">
          <h2>Recent Check-Ins</h2>
          <div className="flex flex-col gap-2 mt-2">
            {history.slice(0, 4).map((h, i) => (
              <div key={i} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block font-bold">{h.mood}</strong>
                  <span className="text-slate-400 text-[10px] mt-0.5">Sleep: {h.sleepHours}h · Stress: {h.stressLevel}/5</span>
                </div>
                <span className="text-[9px] text-slate-500 font-bold">{new Date(h.createdAt).toLocaleDateString([], {day:'numeric',month:'short'})}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3 mt-auto">
          <img src="/luna_avatar.png" className="w-10 h-10 rounded-xl object-cover" alt="Luna" />
          <div>
            <span className="text-[10px] font-bold text-[#14b8a6] block">Tip from {pet.name}</span>
            <p className="text-xs text-slate-300 italic">"Consistent tracking feeds the AI reflections model to predict focus optimizations."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Habits Streaker Page
function HabitsPage({ pet, triggerRefresh }) {
  const [habitsList, setHabitsList] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiFetch('/api/habits'),
      apiFetch('/api/gamification/progress')
    ])
    .then(([habitsData, progData]) => {
      setHabitsList(habitsData);
      setProgress(progData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    try {
      await apiFetch('/api/habits', {
        method: 'POST',
        body: JSON.stringify({ name: newHabitName })
      });
      setNewHabitName('');
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const toggle = async (id) => {
    try {
      await apiFetch(`/api/habits/${id}/toggle`, { method: 'POST' });
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const total = habitsList.length;
  const completed = habitsList.filter(h => h.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading && habitsList.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-8 panel h-card-lg loading-pulse"></div>
        <div className="col-4 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Left Column (col-8) */}
      <div className="col-8 panel h-card-lg bg-[#0f172a]">
        <div className="flex justify-between items-center mb-3">
          <h2>Your Habits</h2>
          <form onSubmit={addHabit} className="flex gap-2">
            <input className="input" placeholder="Add Habit..." value={newHabitName} onChange={e => setNewHabitName(e.target.value)} required />
            <button type="submit" className="btn btn-primary"><Plus size={16} /></button>
          </form>
        </div>

        <div className="flex flex-col gap-2.5 mt-2 overflow-y-auto max-h-[250px] pr-1">
          {habitsList.map((h, i) => (
            <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={h.completed} onChange={() => toggle(h.id)} className="h-5 w-5 accent-[#14b8a6]" />
                <span className={`text-sm ${h.completed ? 'line-through text-slate-500' : 'text-white font-bold'}`}>{h.name}</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${h.completed ? 'text-[#22c55e] bg-emerald-500/10' : 'text-slate-400 bg-slate-800'}`}>
                {h.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column (col-4) */}
      <div className="col-4 panel h-card-lg bg-[#0f172a] text-center flex flex-col justify-between items-center">
        <div>
          <h2>Overall Progress</h2>
          <p className="text-xs text-slate-400 mt-1">Completing habits feeds Companion XP</p>
        </div>
        <div className="relative w-32 h-32 my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="52" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
            <circle cx="64" cy="64" r="52" stroke="#14b8a6" strokeWidth="8" fill="transparent" strokeDasharray={326} strokeDashoffset={326 - (326 * percent) / 100} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <strong className="text-2xl font-black text-white">{percent}%</strong>
          </div>
        </div>
        
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <img src="/luna_avatar.png" className="w-8 h-8 rounded-full border border-slate-700 object-cover" alt="Luna" />
              <span className="text-[10px] text-slate-300 font-bold">Luna's Tip</span>
            </div>
            <span className="text-[10px] text-slate-400 italic">"Keep going! Current streak is {progress?.currentStreak || 0} days."</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. Gratitude Corner Page
function GratitudePage({ pet, streak, triggerRefresh }) {
  const [moment, setMoment] = useState('');
  const [grateful, setGrateful] = useState('');
  const [proud, setProud] = useState('');
  const [history, setHistory] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLogs = () => {
    setLoading(true);
    apiFetch('/api/gratitude/history')
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      await apiFetch('/api/gratitude', {
        method: 'POST',
        body: JSON.stringify({ happyMoment: moment, gratefulFor: grateful, proudAchievement: proud })
      });
      setMoment('');
      setGrateful('');
      setProud('');
      setSuccess('Gratitude entry logged! +10 XP companion points.');
      loadLogs();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-8 panel h-card-lg loading-pulse"></div>
        <div className="col-4 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Left Column (col-8) */}
      <form className="col-8 panel h-card-lg bg-[#0f172a]" onSubmit={save}>
        <div>
          <h2>What are you grateful for today? 🌸</h2>
          <p className="text-xs text-slate-400 mb-4">Focusing on gratefulness drives motivation metrics.</p>
          {success && <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] rounded-xl text-xs mb-3 font-semibold">{success}</div>}
          <textarea className="input min-h-20 mb-3" placeholder="I'm grateful for..." value={grateful} onChange={e => setGrateful(e.target.value)} required />
          <input className="input mb-3" placeholder="A happy moment today..." value={moment} onChange={e => setMoment(e.target.value)} required />
          <input className="input mb-3" placeholder="A proud achievement..." value={proud} onChange={e => setProud(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-full justify-center font-bold">Save Entry</button>
      </form>

      {/* Right Column (col-4) */}
      <div className="col-4 flex flex-col gap-4 h-card-lg justify-between">
        <div className="panel bg-[#0f172a] text-center p-5">
          <span className="text-3xl block">🙏</span>
          <strong className="text-base block text-white mt-1 font-black">Gratitude Logs</strong>
          <span className="text-3xl font-black text-orange-400 block mt-0.5">{history.length} Entries</span>
        </div>

        <div className="panel bg-[#0f172a] flex-grow overflow-y-auto max-h-[160px]">
          <h2>History Logs</h2>
          <div className="flex flex-col gap-2 mt-2">
            {history.slice(0, 3).map((h, i) => (
              <div key={i} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="text-[9px] text-slate-500 font-bold block">{new Date(h.createdAt).toLocaleDateString()}</span>
                <p className="mt-1">"I am grateful for: {h.gratefulFor}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <img src="/luna_avatar.png" className="w-8 h-8 rounded-full object-cover" alt="Luna" />
          <p className="text-[10px] text-slate-300 italic">"{pet.name}: 'Gratitude turns what we have into enough.'"</p>
        </div>
      </div>
    </section>
  );
}

// 5. Journal Logs Page
function JournalPage({ pet }) {
  const [journalsList, setJournalsList] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiFetch('/api/journals').then(data => {
      setJournalsList(data);
      if (data.length > 0 && selectedIdx === null) {
        setSelectedIdx(0);
        setTitle(data[0].title);
        setContent(data[0].content);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const select = (idx) => {
    setSelectedIdx(idx);
    setTitle(journalsList[idx].title);
    setContent(journalsList[idx].content);
  };

  const createNew = () => {
    setSelectedIdx(null);
    setTitle('Untitled Entry');
    setContent('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      if (selectedIdx === null) {
        await apiFetch('/api/journals', { method: 'POST', body: JSON.stringify({ title, content }) });
        setSuccess('New journal entry saved!');
        loadData();
      } else {
        const active = journalsList[selectedIdx];
        await apiFetch(`/api/journals/${active.id}`, { method: 'PUT', body: JSON.stringify({ title, content }) });
        setSuccess('Journal entry updated!');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && journalsList.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-4 panel h-card-xl loading-pulse"></div>
        <div className="col-8 panel h-card-xl loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Left Column (col-4) */}
      <div className="col-4 panel h-card-xl bg-[#0f172a] flex flex-col justify-between">
        <div>
          <button onClick={createNew} className="btn btn-primary w-full justify-center font-bold mb-3">+ New Entry</button>
          <div className="flex flex-col gap-2 mt-2 max-h-[300px] overflow-y-auto pr-1">
            {journalsList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => select(idx)}
                className={`p-3 rounded-xl text-left border flex flex-col transition-all ${
                  selectedIdx === idx ? 'border-[#14b8a6] bg-[#14b8a6]/10 text-white font-bold' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <strong className="text-xs truncate block font-bold">{item.title}</strong>
                <small className="text-[9px] text-slate-500 mt-1 font-semibold">{new Date(item.createdAt).toLocaleDateString()}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <img src="/luna_avatar.png" className="w-8 h-8 rounded-full object-cover" alt="Luna" />
          <p className="text-[10px] text-slate-400 italic">"Write down your thoughts to clear your mind."</p>
        </div>
      </div>

      {/* Right Column (col-8) */}
      <form className="col-8 panel h-card-xl bg-[#0f172a] flex flex-col justify-between" onSubmit={save}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Notion-style Journal Workspace</span>
            <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">😊 Reflective</span>
          </div>
          {success && <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] rounded-xl text-xs mb-3 font-semibold">{success}</div>}
          <input className="input font-black text-xl mb-3" placeholder="Today's Title..." value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="input min-h-[220px] font-serif leading-relaxed text-sm" placeholder="Dear journal..." value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-1.5">
            <span className="text-[9px] bg-slate-800 text-[#14b8a6] font-bold px-2 py-0.5 rounded">#Productive</span>
            <span className="text-[9px] bg-slate-800 text-[#8b5cf6] font-bold px-2 py-0.5 rounded">#Growth</span>
          </div>
          <button type="submit" className="btn btn-primary px-6 font-bold">Save Entry</button>
        </div>
      </form>
    </section>
  )
}

// 6. AI Companion (Chat)
function ChatPage({ pet, setPet, refreshKey, triggerRefresh }) {
  const [thread, setThread] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState({
    wellnessScore: 0,
    activeGoal: 'None',
    gardenStatus: 'Seed (Level 1)'
  });

  // Companion customize fields
  const themes = ['Classic', 'Forest', 'Galaxy', 'Cyber', 'Autumn'];
  const accessories = ['None', 'Glasses', 'Scarf', 'Hat', 'Backpack', 'Crown'];

  useEffect(() => {
    apiFetch('/api/chat/history').then(setThread).catch(console.error);

    Promise.all([
      apiFetch('/api/checkins/history'),
      apiFetch('/api/goals'),
      apiFetch('/api/gamification/progress')
    ])
    .then(([checkins, goals, progress]) => {
      const latestCheckin = checkins?.[0];
      const wellnessScore = latestCheckin ? latestCheckin.wellnessScore : 0;
      
      const activeGoalObj = goals?.find(g => !g.completed);
      const activeGoal = activeGoalObj ? activeGoalObj.title : 'None';
      
      const level = progress?.level || pet.level || 1;
      const title = progress?.levelTitle || (level >= 20 ? 'Forest Guardian' : level >= 12 ? 'Young Tree' : 'Sprout');
      const gardenStatus = `${title} (Level ${level})`;
      
      setContextData({
        wellnessScore,
        activeGoal,
        gardenStatus
      });
    })
    .catch(console.error);
  }, [refreshKey]);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMsg = { sender: 'STUDENT', content: message, createdAt: new Date().toISOString() };
    setThread(prev => [...prev, userMsg]);
    const orig = message;
    setMessage('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: orig }) });
      setThread(prev => [...prev, { sender: 'BOT', content: data.reply, createdAt: new Date().toISOString() }]);
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomize = async (key, val) => {
    const updatedPet = { ...pet, [key]: val };
    try {
      await apiFetch('/api/companion', {
        method: 'POST',
        body: JSON.stringify({
          petType: updatedPet.type,
          petName: updatedPet.name,
          petTheme: key === 'theme' ? val : updatedPet.theme,
          petAccessory: key === 'accessory' ? val : updatedPet.accessory
        })
      });
      setPet(updatedPet);
      localStorage.setItem("user_pet", JSON.stringify(updatedPet));
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getThemeLvlReq = (t) => {
    switch (t) {
      case 'Forest': return 3;
      case 'Autumn': return 5;
      case 'Galaxy': return 10;
      case 'Cyber': return 15;
      default: return 1;
    }
  };

  const getAccessoryLvlReq = (a) => {
    switch (a) {
      case 'Glasses': return 2;
      case 'Scarves': return 4;
      case 'Hats': return 6;
      case 'Backpacks': return 8;
      case 'Crowns': return 12;
      default: return 1;
    }
  };

  return (
    <section className="grid-12">
      {/* Left Column - Chat workspace (col-8) */}
      <div className="col-8 chat-container h-card-xl">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <img src={getPetAvatar(pet.type)} className="w-10 h-10 rounded-xl object-cover" alt={pet.name} />
            <div>
              <strong className="text-white block text-sm font-black">{pet.name}</strong>
              <span className="text-[10px] text-slate-400 block font-semibold">Level {pet.level} · {getPetEmoji(pet.type)} {pet.mood}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#14b8a6] bg-teal-500/10 px-2 py-0.5 rounded">Active theme: {pet.theme}</span>
          </div>
        </div>
        
        <div className="chat-thread pr-1">
          {thread.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender === 'STUDENT' ? 'student' : 'bot'}`}>
              <span className="text-[10px] font-bold block mb-1 text-slate-400">{msg.sender === 'STUDENT' ? 'You' : pet.name}</span>
              <p>{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot loading-pulse h-[50px] w-[180px]"></div>
          )}
        </div>

        <form onSubmit={send} className="chat-form">
          <input className="input" placeholder={`Send message to ${pet.name}...`} value={message} onChange={e => setMessage(e.target.value)} />
          <button type="submit" className="btn btn-primary font-bold">Send</button>
        </form>
      </div>

      {/* Right Column - User Context & Companion Customize (col-4) */}
      <div className="col-4 flex flex-col gap-4 h-card-xl justify-between">
        <div className="panel bg-[#0f172a]">
          <h2>Your Context</h2>
          <div className="space-y-2.5 mt-2.5 text-xs">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 font-semibold uppercase text-[9px]">Wellness Score</span>
              <strong className="text-white">{contextData.wellnessScore} / 100</strong>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 font-semibold uppercase text-[9px]">Active Goal</span>
              <strong className="text-white text-right truncate max-w-[120px]">{contextData.activeGoal}</strong>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 font-semibold uppercase text-[9px]">Garden Status</span>
              <strong className="text-white">{contextData.gardenStatus}</strong>
            </div>
          </div>
        </div>

        {/* Companion Customization Section */}
        <div className="panel bg-[#0f172a] flex-grow">
          <h2>Companion Customization</h2>
          <span className="text-[9px] text-[#14b8a6] font-bold block mt-0.5 mb-2.5 uppercase">Unlocked using XP. Cosmetic only.</span>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Pet Theme</label>
              <select className="input max-h-[36px] py-1 text-xs" value={pet.theme} onChange={e => handleCustomize('theme', e.target.value)}>
                {themes.map(t => {
                  const req = getThemeLvlReq(t);
                  const isUnlocked = pet.level >= req;
                  return (
                    <option key={t} value={t} disabled={!isUnlocked}>
                      {t} {!isUnlocked ? `🔒 (Level ${req})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Accessory</label>
              <select className="input max-h-[36px] py-1 text-xs" value={pet.accessory} onChange={e => handleCustomize('accessory', e.target.value)}>
                {accessories.map(a => {
                  const req = getAccessoryLvlReq(a);
                  const isUnlocked = pet.level >= req;
                  return (
                    <option key={a} value={a} disabled={!isUnlocked}>
                      {a} {!isUnlocked ? `🔒 (Level ${req})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 7. Exam Focus Page
function ExamsPage({ pet, triggerRefresh }) {
  const [examsList, setExamsList] = useState([]);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiFetch('/api/exams')
      .then(setExamsList)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!subject || !date) return;
    try {
      await apiFetch('/api/exams', {
        method: 'POST',
        body: JSON.stringify({ subject, examDate: new Date(date).toISOString(), studyMinutes: 0 })
      });
      setSubject('');
      setDate('');
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const logStudyTime = async (id, minutes) => {
    try {
      await apiFetch(`/api/exams/${id}/study?minutes=${minutes}`, { method: 'POST' });
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const upcomingCount = examsList.filter(ex => new Date(ex.examDate) >= new Date(new Date().setHours(0,0,0,0))).length;
  const totalStudyMinutes = examsList.reduce((sum, ex) => sum + ex.studyMinutes, 0);
  const focusScore = Math.min(100, Math.round(totalStudyMinutes / 5)); // 500 mins = 100%

  if (loading && examsList.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-4 panel h-card-lg loading-pulse"></div>
        <div className="col-5 panel h-card-lg loading-pulse"></div>
        <div className="col-3 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Column 1 (col-4) */}
      <div className="col-4 panel h-card-lg bg-[#0f172a]">
        <div>
          <h2>Upcoming Exams ({upcomingCount})</h2>
          <form onSubmit={submit} className="space-y-2.5 my-3">
            <input className="input" placeholder="Subject name..." value={subject} onChange={e => setSubject(e.target.value)} required />
            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <button type="submit" className="btn btn-primary w-full font-bold">Lock Exam</button>
          </form>
        </div>
        
        <div className="flex flex-col gap-2 mt-2 overflow-y-auto max-h-[160px] pr-1">
          {examsList.map((ex, i) => {
            const diffTime = Math.ceil((new Date(ex.examDate) - new Date()) / (1000 * 60 * 60 * 24));
            const displayDays = diffTime > 0 ? `In ${diffTime} Days` : diffTime === 0 ? 'Today' : 'Passed';
            return (
              <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block font-bold truncate max-w-[100px]">{ex.subject}</strong>
                  <span className="text-slate-400 text-[10px] block">{new Date(ex.examDate).toLocaleDateString()}</span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-semibold">Studied: {ex.studyMinutes} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#14b8a6] font-black">{displayDays}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2 (col-5) */}
      <div className="col-5 panel h-card-lg bg-[#0f172a]">
        <div>
          <div className="flex justify-between items-center w-full mb-2">
            <h2>Pomodoro Study Sessions</h2>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">Log Focus</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Select an exam subject below to log your Pomodoro focus time.</p>
          {examsList.length === 0 ? (
            <div className="text-slate-500 text-xs italic text-center my-6">Please schedule an exam first.</div>
          ) : (
            <div className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Select Subject</label>
                <select id="studyExamSelect" className="input text-xs py-1.5" defaultValue={examsList[0]?.id}>
                  {examsList.map(e => <option key={e.id} value={e.id}>{e.subject}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => {
                    const selectEl = document.getElementById("studyExamSelect");
                    if (selectEl) logStudyTime(selectEl.value, 25);
                  }}
                  className="btn btn-primary flex-1 font-bold text-xs"
                >
                  ⏱️ Pomodoro (25m)
                </button>
                <button 
                  onClick={() => {
                    const selectEl = document.getElementById("studyExamSelect");
                    if (selectEl) logStudyTime(selectEl.value, 50);
                  }}
                  className="btn btn-secondary flex-1 font-bold text-xs"
                >
                  ⏱️ Double (50m)
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-400 mt-auto">
          Every 5 minutes studied awards 1 XP companion point!
        </div>
      </div>

      {/* Column 3 (col-3) */}
      <div className="col-3 panel h-card-lg bg-[#0f172a] text-center flex flex-col justify-between items-center">
        <div>
          <h2>Focus Score</h2>
          <span className="text-[9px] text-[#14b8a6] font-bold block uppercase tracking-wider mt-0.5">Study Consistency</span>
        </div>
        <div className="relative w-28 h-28 my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle cx="56" cy="56" r="44" stroke="#14b8a6" strokeWidth="6" fill="transparent" strokeDasharray={276} strokeDashoffset={276 - (276 * focusScore) / 100} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <strong className="text-xl font-black text-white">{focusScore}%</strong>
          </div>
        </div>

        <div className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <img src="/luna_avatar.png" className="w-8 h-8 rounded-full object-cover" alt="Mascot" />
          <div className="text-left">
            <span className="text-[9px] text-orange-400 block font-bold">🔥 {totalStudyMinutes} mins logged</span>
            <p className="text-[9px] text-slate-400 italic">"XP earned: {Math.round(totalStudyMinutes / 5)}"</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 8. Life Goals Page
function GoalsPage({ pet, triggerRefresh }) {
  const [goalsList, setGoalsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Academic');
  const [formTargetDate, setFormTargetDate] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [formCompleted, setFormCompleted] = useState(false);

  useEffect(() => {
    setFormTargetDate(new Date().toISOString().split('T')[0]);
  }, []);

  const loadData = () => {
    setLoading(true);
    apiFetch('/api/goals')
      .then(setGoalsList)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormTitle('');
    setFormCategory('Academic');
    setFormTargetDate(new Date().toISOString().split('T')[0]);
    setFormProgress(0);
    setFormCompleted(false);
    setActiveModal('create');
  };

  const openEditModal = (g) => {
    setSelectedGoal(g);
    setFormTitle(g.title);
    setFormCategory(g.category);
    setFormTargetDate(g.targetDate || new Date().toISOString().split('T')[0]);
    setFormProgress(g.progressPercent);
    setFormCompleted(g.completed);
    setActiveModal('edit');
  };

  const openDeleteModal = (g) => {
    setSelectedGoal(g);
    setActiveModal('delete');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    try {
      await apiFetch('/api/goals', {
        method: 'POST',
        body: JSON.stringify({
          category: formCategory,
          title: formTitle,
          targetDate: formTargetDate,
          progressPercent: formProgress,
          completed: formProgress === 100 ? true : formCompleted
        })
      });
      setActiveModal(null);
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    try {
      await apiFetch(`/api/goals/${selectedGoal.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          category: formCategory,
          title: formTitle,
          targetDate: formTargetDate,
          progressPercent: formProgress,
          completed: formProgress === 100 ? true : formCompleted
        })
      });
      setActiveModal(null);
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/api/goals/${selectedGoal.id}`, { method: 'DELETE' });
      setActiveModal(null);
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleGoal = async (g) => {
    try {
      await apiFetch(`/api/goals/${g.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          category: g.category,
          title: g.title,
          targetDate: g.targetDate,
          progressPercent: g.completed ? 0 : 100,
          completed: !g.completed
        })
      });
      loadData();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getDueDaysText = (dateStr) => {
    if (!dateStr) return 'No due date';
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dateStr + 'T00:00:00');
    target.setHours(0,0,0,0);
    
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    const dateFormatted = new Date(dateStr + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric' });
    
    if (days === 0) return `Due: ${dateFormatted} (Today)`;
    if (days === 1) return `Due: ${dateFormatted} (Tomorrow)`;
    if (days > 1) return `Due: ${dateFormatted} (${days} days left)`;
    return `Due: ${dateFormatted} (${Math.abs(days)} days overdue)`;
  };

  const getStatusBadge = (progress, completed) => {
    if (completed || progress === 100) {
      return { text: 'Completed', style: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    }
    if (progress > 0) {
      return { text: 'In Progress', style: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
    }
    return { text: 'Not Started', style: 'bg-slate-800 text-slate-400 border border-slate-700/60' };
  };

  // Calculations
  const totalGoals = goalsList.length;
  const completedGoals = goalsList.filter(g => g.completed || g.progressPercent === 100).length;
  const activeGoals = totalGoals - completedGoals;
  const overallProgress = totalGoals > 0 
    ? Math.round(goalsList.reduce((sum, g) => sum + g.progressPercent, 0) / totalGoals) 
    : 0;

  const defaultCategories = ['Academic', 'Career', 'Growth', 'Fitness', 'Dream'];
  
  const categoryStats = useMemo(() => {
    const cats = new Set(defaultCategories);
    goalsList.forEach(g => {
      if (g.category) cats.add(g.category);
    });
    
    return Array.from(cats).map(cat => {
      const goalsInCat = goalsList.filter(g => g.category === cat);
      const count = goalsInCat.length;
      const completedCount = goalsInCat.filter(g => g.completed || g.progressPercent === 100).length;
      const avgProgress = count > 0 
        ? Math.round(goalsInCat.reduce((sum, g) => sum + g.progressPercent, 0) / count)
        : 0;
        
      return {
        name: cat,
        count,
        completedCount,
        avgProgress
      };
    });
  }, [goalsList]);

  if (loading && goalsList.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-8 panel h-card-lg loading-pulse"></div>
        <div className="col-4 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Left Column: Goals board (col-8) */}
      <div className="col-8 panel h-card-lg bg-[#0f172a] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2>Life Goals Board</h2>
            <span className="text-[10px] text-[var(--muted)]">Plan milestones and earn XP on completion</span>
          </div>
          <button 
            type="button" 
            onClick={openCreateModal} 
            className="btn btn-primary font-bold text-xs"
          >
            + Define Goal
          </button>
        </div>

        <div className="flex flex-col gap-3 pr-1">
          {goalsList.map((g, i) => {
            const badgeColor = g.category === 'Academic' 
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
              : g.category === 'Career'
              ? 'bg-violet-500/10 text-[#8b5cf6] border border-violet-500/20'
              : g.category === 'Growth'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

            const status = getStatusBadge(g.progressPercent, g.completed);

            return (
              <div key={i} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 transition-all hover:border-slate-700">
                <div className="flex justify-between items-start text-xs">
                  <div className="flex items-start gap-2.5 flex-1">
                    <input 
                      type="checkbox" 
                      checked={g.completed} 
                      onChange={() => toggleGoal(g)} 
                      className="h-4.5 w-4.5 mt-0.5" 
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${badgeColor}`}>{g.category}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${status.style}`}>{status.text}</span>
                      </div>
                      <strong className={`text-white font-extrabold text-sm block ${g.completed ? 'line-through text-slate-500' : ''}`}>
                        {g.title}
                      </strong>
                      <span className="text-[9.5px] text-slate-400 font-semibold block">
                        📅 {getDueDaysText(g.targetDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black text-sm">{g.progressPercent}%</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditModal(g)} className="text-slate-400 hover:text-white transition-colors">
                        ✏️
                      </button>
                      <button onClick={() => openDeleteModal(g)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-slate-800 h-1.5 rounded-full relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${g.progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
          {goalsList.length === 0 && (
            <div className="text-slate-500 text-xs italic text-center my-8">No goals defined yet. Click "+ Define Goal" above to start!</div>
          )}
        </div>
      </div>

      {/* Right Column: Overall progress & Categories (col-4) */}
      <div className="col-4 panel h-card-lg bg-[#0f172a] overflow-y-auto justify-between gap-4">
        {/* Ring section */}
        <div className="flex flex-col items-center text-center">
          <h2>Goals Target Tracker</h2>
          <span className="text-[9px] text-[#14b8a6] font-bold block uppercase tracking-wider mt-0.5">Overall Target Achievement</span>
          
          <div className="relative w-28 h-28 my-3.5">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
              <circle cx="56" cy="56" r="44" stroke="#14b8a6" strokeWidth="6" fill="transparent" strokeDasharray={276} strokeDashoffset={276 - (276 * overallProgress) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <strong className="text-xl font-black text-white">{overallProgress}%</strong>
            </div>
          </div>
          
          <div className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <img src="/luna_avatar.png" className="w-8 h-8 rounded-full object-cover" alt="Luna" />
            <div className="text-left flex-1">
              <span className="text-[10px] text-slate-300 font-bold block">{completedGoals} / {totalGoals} Goals Achieved</span>
              <p className="text-[9px] text-slate-400 italic">"Active: {activeGoals} pending"</p>
            </div>
          </div>
        </div>

        {/* Dynamic Categories summary section */}
        <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Category Completion</span>
          <div className="space-y-2">
            {categoryStats.map((c, i) => (
              <div key={i} className="p-2 bg-slate-900/50 border border-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <strong className="text-white font-extrabold text-[10px]">{c.name}</strong>
                  <span className="text-[8px] text-slate-500 font-bold uppercase">{c.count} goals ({c.completedCount} done)</span>
                </div>
                <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
                  {c.avgProgress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-md grid place-items-center z-50 p-4 animate-fadeIn">
          <form className="bg-[#0f172a] border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4" onSubmit={handleCreate}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[8px] text-[var(--primary)] font-black uppercase tracking-widest block">Goal Creator</span>
                <h3 className="text-sm font-black text-white">Define New Life Goal</h3>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Goal Title</label>
                <input 
                  className="input" 
                  placeholder="Enter details of your goal..." 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                  <select 
                    className="input py-1 text-xs" 
                    value={formCategory} 
                    onChange={e => setFormCategory(e.target.value)}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Growth">Growth</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Dream">Dream</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Date</label>
                  <input 
                    type="date" 
                    className="input py-1 text-xs" 
                    value={formTargetDate} 
                    onChange={e => setFormTargetDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Milestone Progress ({formProgress}%)</label>
                <div className="flex gap-1 bg-[#020617] p-1 rounded-lg border border-slate-800 justify-between">
                  {[0, 25, 50, 75, 100].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setFormProgress(val);
                        if (val === 100) setFormCompleted(true);
                      }}
                      className={`flex-1 py-1 rounded text-[9px] font-black transition-all ${
                        formProgress === val
                          ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                          : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                <input 
                  type="checkbox" 
                  id="create-completed" 
                  checked={formCompleted} 
                  onChange={e => {
                    setFormCompleted(e.target.checked);
                    if (e.target.checked) setFormProgress(100);
                    else if (formProgress === 100) setFormProgress(75);
                  }} 
                  className="h-4.5 w-4.5"
                />
                <label htmlFor="create-completed" className="font-bold text-slate-300 select-none">Mark as Completed</label>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setActiveModal(null)} className="btn btn-outline flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn btn-primary flex-1 justify-center font-bold">Create Goal</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-md grid place-items-center z-50 p-4 animate-fadeIn">
          <form className="bg-[#0f172a] border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4" onSubmit={handleUpdate}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[8px] text-[var(--primary)] font-black uppercase tracking-widest block">Goal Editor</span>
                <h3 className="text-sm font-black text-white">Modify Goal Target</h3>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Goal Title</label>
                <input 
                  className="input" 
                  placeholder="Enter details of your goal..." 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                  <select 
                    className="input py-1 text-xs" 
                    value={formCategory} 
                    onChange={e => setFormCategory(e.target.value)}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Growth">Growth</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Dream">Dream</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Date</label>
                  <input 
                    type="date" 
                    className="input py-1 text-xs" 
                    value={formTargetDate} 
                    onChange={e => setFormTargetDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Milestone Progress ({formProgress}%)</label>
                <div className="flex gap-1 bg-[#020617] p-1 rounded-lg border border-slate-800 justify-between">
                  {[0, 25, 50, 75, 100].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setFormProgress(val);
                        if (val === 100) setFormCompleted(true);
                      }}
                      className={`flex-1 py-1 rounded text-[9px] font-black transition-all ${
                        formProgress === val
                          ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                          : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                <input 
                  type="checkbox" 
                  id="edit-completed" 
                  checked={formCompleted} 
                  onChange={e => {
                    setFormCompleted(e.target.checked);
                    if (e.target.checked) setFormProgress(100);
                    else if (formProgress === 100) setFormProgress(75);
                  }} 
                  className="h-4.5 w-4.5"
                />
                <label htmlFor="edit-completed" className="font-bold text-slate-300 select-none">Mark as Completed</label>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setActiveModal(null)} className="btn btn-outline flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn btn-primary flex-1 justify-center font-bold">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {activeModal === 'delete' && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-md grid place-items-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-800 max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[8px] text-red-400 font-black uppercase tracking-widest block">Confirmation Required</span>
              <h3 className="text-sm font-black text-white">Delete Life Goal</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete the goal <strong className="text-white">"{selectedGoal?.title}"</strong>? This will permanently remove it from your tracker.
            </p>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setActiveModal(null)} className="btn btn-outline flex-1 justify-center">Cancel</button>
              <button type="button" onClick={handleDelete} className="btn bg-red-600 hover:bg-red-500 text-white flex-1 justify-center font-bold">✕ Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// 9. Badges & Challenges Page
function BadgesPage({ pet, triggerRefresh }) {
  const [badgesList, setBadgesList] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch('/api/badges'),
      apiFetch('/api/gamification/progress')
    ])
    .then(([badgesData, progData]) => {
      setBadgesList(badgesData || []);
      setProgress(progData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const legendary = useMemo(() => badgesList.filter(b => b.rarity?.toLowerCase() === 'legendary'), [badgesList]);
  const epic = useMemo(() => badgesList.filter(b => b.rarity?.toLowerCase() === 'epic'), [badgesList]);
  const rare = useMemo(() => badgesList.filter(b => b.rarity?.toLowerCase() === 'rare'), [badgesList]);
  const common = useMemo(() => badgesList.filter(b => b.rarity?.toLowerCase() === 'common'), [badgesList]);

  const earnedCount = useMemo(() => badgesList.filter(b => b.earned).length, [badgesList]);
  const totalCount = badgesList.length;
  const pct = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  if (loading && badgesList.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-9 panel h-card-lg loading-pulse"></div>
        <div className="col-3 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  const renderBadgeSection = (title, items, labelColor, headerBorder) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <span className={`text-[10px] font-black uppercase tracking-wider block mb-2.5 ${labelColor}`}>{title}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((b, i) => (
            <div
              key={i}
              className={`badge-card relative group flex flex-col items-center justify-between p-3.5 border rounded-2xl transition-all duration-300 ${
                b.earned
                  ? 'bg-[var(--secondary)] border-[var(--primary)] shadow-[0_4px_20px_rgba(20,184,166,0.12)] scale-100 opacity-100 hover:scale-[1.05] hover:shadow-[0_8px_30px_rgba(20,184,166,0.22)]'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-80 scale-95'
              }`}
            >
              {/* Unlock Visual and Floating Animation */}
              <div className={`relative grid place-items-center w-12 h-12 rounded-full mb-2.5 transition-all duration-500 ${
                b.earned
                  ? 'bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white animate-bounce-slow shadow-md'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                <span className="text-xl">{b.earned ? '🏆' : '🔒'}</span>
                {b.earned && (
                  <span className="absolute -inset-1 rounded-full bg-[var(--primary)] opacity-20 animate-ping" />
                )}
              </div>

              <strong className="text-[11px] text-[var(--text-primary)] font-black text-center mb-0.5 tracking-tight group-hover:text-[var(--primary)] transition-colors">
                {b.badgeName}
              </strong>

              <p className="text-[9px] text-[var(--muted)] text-center mb-2.5 leading-normal px-1 font-medium min-h-[24px]">
                {b.description}
              </p>

              <div className="flex flex-col items-center gap-1 mt-auto w-full pt-2 border-t border-slate-800/60">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                  b.earned
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  +{b.xpReward} XP
                </span>

                <span className="text-[8px] text-[var(--muted)] font-semibold mt-0.5">
                  {b.earned
                    ? `Earned: ${new Date(b.earnedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}`
                    : 'Locked'
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="grid-12">
      {/* Left Column (col-9) */}
      <div className="col-9 panel h-card-lg bg-[#0f172a] overflow-y-auto">
        <h2>Achievements Trophy Closet</h2>
        <span className="text-[10px] text-[#14b8a6] font-bold block uppercase mt-0.5 mb-3">Grouped by Rarity tiers</span>

        <div className="space-y-5">
          {renderBadgeSection("Legendary", legendary, "text-[#eab308]", "border-[#eab308]/30")}
          {renderBadgeSection("Epic", epic, "text-[#8b5cf6]", "border-[#8b5cf6]/30")}
          {renderBadgeSection("Rare", rare, "text-[#14b8a6]", "border-[#14b8a6]/30")}
          {renderBadgeSection("Common", common, "text-slate-500", "border-slate-800/40")}
        </div>
      </div>

      {/* Right Column (col-3) */}
      <div className="col-3 panel h-card-lg bg-[#0f172a] text-center flex flex-col justify-between items-center">
        <div>
          <h2>Badge Progress</h2>
          <span className="text-[9px] text-[#14b8a6] font-bold block uppercase tracking-wider mt-0.5">Unlocked Milestones</span>
        </div>
        <div className="relative w-28 h-28 my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle cx="56" cy="56" r="44" stroke="#14b8a6" strokeWidth="6" fill="transparent" strokeDasharray={276} strokeDashoffset={276 - (276 * pct) / 100} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <strong className="text-base font-black text-white">{earnedCount} / {totalCount}</strong>
          </div>
        </div>

        <div className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <img src="/luna_avatar.png" className="w-8 h-8 rounded-full object-cover" alt="Luna" />
          <div className="text-left flex-1">
            <span className="text-[10px] text-slate-300 font-bold block">{progress?.xp || 0} XP</span>
            <p className="text-[9px] text-slate-400 italic">"{pet.name}: Keep completing habits!"</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 10. Growth Garden Page
function GardenPage({ pet, setPet, gardenTheme, changeTheme }) {
  const [progress, setProgress] = useState(null);
  const [accessory, setAccessory] = useState('None');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiFetch('/api/gamification/progress')
      .then(data => {
        setProgress(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    if (pet && pet.accessory) setAccessory(pet.accessory);
  }, [pet]);

  const handleAccessory = async (acc) => {
    try {
      await apiFetch('/api/companion', {
        method: 'POST',
        body: JSON.stringify({
          petType: pet.type,
          petName: pet.name,
          petTheme: pet.theme,
          petAccessory: acc
        })
      });
      const updated = { ...pet, accessory: acc };
      setPet(updated);
      localStorage.setItem("user_pet", JSON.stringify(updated));
      setAccessory(acc);
    } catch (err) {
      console.error(err);
    }
  };

  const getAccessoryLvlReq = (acc) => {
    switch (acc) {
      case 'Glasses': return 2;
      case 'Scarves': return 4;
      case 'Hats': return 6;
      case 'Backpacks': return 8;
      case 'Crowns': return 12;
      default: return 1;
    }
  };

  if (loading && progress === null) {
    return (
      <div className="grid-12">
        <div className="col-8 panel h-card-lg loading-pulse"></div>
        <div className="col-4 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  const isSelected = (buttonTheme) => {
    let bt = buttonTheme.toLowerCase();
    if (bt === 'cozy_autumn') bt = 'autumn';
    return gardenTheme === bt;
  };

  return (
    <section className="grid-12">
      {/* Left Column (col-8) */}
      <div className="col-8 panel h-card-lg bg-[#0f172a] text-center flex flex-col justify-between">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-bold">Evolution: {pet.species} ({pet.evolutionStage})</span>
          <span className="text-[#14b8a6] bg-teal-500/10 px-2.5 py-0.5 rounded font-bold">Level {progress?.level || 1} Garden</span>
        </div>
        
        {/* Garden Hero Scene with interactive layout */}
        <div className="my-auto relative flex flex-col items-center">
          <img src="/garden_tree.png" className="w-36 h-36 object-contain floating" alt="Tree" />
          <img src={getPetAvatar(pet.type)} className="w-14 h-14 rounded-full border border-slate-700 object-cover absolute bottom-1 right-24 shadow-lg" alt={pet.name} />
        </div>

        {/* Garden Themes Switcher */}
        <div>
          <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase text-left">Select Garden Theme</span>
          <div className="flex gap-2 justify-center">
            {['CLASSIC', 'COZY_AUTUMN', 'CYBER', 'MOONLIGHT'].map(t => (
              <button key={t} onClick={() => changeTheme(t)} className={`btn text-xs ${isSelected(t) ? 'btn-primary' : 'btn-outline'}`}>
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (col-4) */}
      <div className="col-4 flex flex-col gap-4 h-card-lg justify-between text-xs">
        <div className="panel bg-[#0f172a] space-y-3">
          <h2>Garden Statistics</h2>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Trees Grown</span>
            <strong className="text-white">{progress?.treesGrown || 0}</strong>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Companion Level</span>
            <strong className="text-white">Level {pet.level}</strong>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1 text-left">
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
              <span>XP Progress</span>
              <span>{pet.petXp % 100} / 100 XP</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-0.5">
              <div className="bg-[#14b8a6] h-1.5 rounded-full" style={{ width: `${pet.petXp % 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Companion Customization Section Accessories switcher */}
        <div className="panel bg-[#0f172a] flex-grow">
          <h2>Accessories</h2>
          <span className="text-[9px] text-[#14b8a6] font-bold block mb-2 uppercase">Equip Companion cosmetic gear</span>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {['None', 'Glasses', 'Scarves', 'Hats', 'Backpacks', 'Crowns'].map(acc => {
              const req = getAccessoryLvlReq(acc);
              const isUnlocked = pet.level >= req;
              return (
                <button
                  key={acc}
                  disabled={!isUnlocked}
                  onClick={() => handleAccessory(acc)}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    !isUnlocked ? 'border-slate-900 bg-slate-950/60 text-slate-600 cursor-not-allowed' :
                    accessory === acc ? 'border-[#14b8a6] bg-[#14b8a6]/10 text-white' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {!isUnlocked && '🔒'} {acc} {!isUnlocked && `(Lvl ${req})`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// 11. AI Reflections Page
function ReflectionsPage({ pet, refreshKey }) {
  const [checkins, setCheckins] = useState([]);
  const [exams, setExams] = useState([]);
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    Promise.all([
      apiFetch('/api/checkins/history'),
      apiFetch('/api/exams')
    ]).then(([checkinsData, examsData]) => {
      setCheckins(checkinsData || []);
      setExams(examsData || []);
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadReflection = () => {
    setLoading(true);
    apiFetch('/api/reflections/weekly')
      .then(res => setReflection(res.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const totalStudy = useMemo(() => exams.reduce((sum, ex) => sum + ex.studyMinutes, 0), [exams]);
  const avgSleep = useMemo(() => checkins.length > 0 ? (checkins.reduce((sum, c) => sum + c.sleepHours, 0) / checkins.length).toFixed(1) : 0, [checkins]);
  const avgStress = useMemo(() => checkins.length > 0 ? (checkins.reduce((sum, c) => sum + c.stressLevel, 0) / checkins.length).toFixed(1) : 0, [checkins]);
  const avgWellness = useMemo(() => checkins.length > 0 ? Math.round(checkins.reduce((sum, c) => sum + c.wellnessScore, 0) / checkins.length) : 0, [checkins]);

  return (
    <section className="grid-12">
      {/* Top Reflection Card (col-8) */}
      <div className="col-8 panel h-card-lg bg-[#0f172a] flex flex-col justify-between">
        <div>
          <h2>Weekly AI reflections</h2>
          <p className="text-xs text-slate-400 mb-3">AI compiles weekly check-in parameters into support notes.</p>
          
          {/* Mascot says bubble integrated */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3 mb-3">
            <img src="/luna_avatar.png" className="w-9 h-9 rounded-full object-cover" alt="Luna" />
            <p className="text-xs text-[#14b8a6] font-semibold italic">"🐱 {pet.name} says: 'This week you showed great consistency. Let's review your summary insights!'"</p>
          </div>

          <button onClick={loadReflection} disabled={loading} className="btn btn-primary w-full justify-center font-bold">
            {loading ? 'Compiling reflections...' : 'Generate Weekly Reflection'}
          </button>
          
          {reflection && (
            <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xs italic mt-3 font-serif text-slate-200">
              {reflection}
            </div>
          )}
        </div>
        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-2">AI reflections model v1.1</div>
      </div>

      {/* Right Column Mascot visual card (col-4) */}
      <div className="col-4 panel h-card-lg bg-[#0f172a] text-center flex flex-col justify-center items-center gap-4">
        <img src="/luna_avatar.png" className="w-24 h-24 rounded-full border border-slate-700 object-cover floating" alt="Luna" />
        <div>
          <strong className="text-sm block text-white font-bold">Reflections companion pet</strong>
          <p className="text-xs text-slate-400 mt-1 max-w-[180px] mx-auto">Luna helps synthesize sleep schedules, goal tasks and focus time metrics.</p>
        </div>
      </div>

      {/* Delta Insights Row (col-12) */}
      <div className="col-12 grid grid-cols-4 gap-4 mt-2">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Focus Time</span>
            <strong className="text-white text-sm">{totalStudy} mins</strong>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">total logged</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Sleep Quality</span>
            <strong className="text-white text-sm">{avgSleep} hrs</strong>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">average</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Stress Level</span>
            <strong className="text-white text-sm">{avgStress} / 5</strong>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">average</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Wellness Score</span>
            <strong className="text-white text-sm">{avgWellness} / 100</strong>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">average</span>
        </div>
      </div>
    </section>
  );
}

// 12. Future Me Page
function FutureMePage({ pet }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockOption, setUnlockOption] = useState('1m');
  const [customDate, setCustomDate] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCustomDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const loadLetters = () => {
    setLoading(true);
    apiFetch('/api/letters')
      .then(setLetters)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLetters();
  }, []);

  const getDaysRemaining = (unlockDateStr) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const unlock = new Date(unlockDateStr + 'T00:00:00');
    unlock.setHours(0,0,0,0);
    
    const diff = unlock.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const generateAI = async () => {
    setGenerating(true);
    try {
      const data = await apiFetch('/api/future-me/generate');
      if (data && data.content) {
        setTitle(`AI Capsule Reflection - ${new Date().toLocaleDateString()}`);
        setContent(data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let targetUnlock = '';
    const now = new Date();
    if (unlockOption === '1m') {
      now.setMonth(now.getMonth() + 1);
      targetUnlock = now.toISOString().split('T')[0];
    } else if (unlockOption === '6m') {
      now.setMonth(now.getMonth() + 6);
      targetUnlock = now.toISOString().split('T')[0];
    } else if (unlockOption === '1y') {
      now.setFullYear(now.getFullYear() + 1);
      targetUnlock = now.toISOString().split('T')[0];
    } else {
      targetUnlock = customDate;
    }

    try {
      await apiFetch('/api/letters', {
        method: 'POST',
        body: JSON.stringify({ content: `${title}\n\n${content}`, unlockDate: targetUnlock })
      });
      setTitle('');
      setContent('');
      loadLetters();
    } catch (err) {
      console.error(err);
    }
  };

  const processedLetters = useMemo(() => {
    return letters.map((letter, i) => {
      const isLocked = letter.content.startsWith('[Locked until') || new Date(letter.unlockDate + 'T00:00:00') > new Date();
      const daysLeft = isLocked ? getDaysRemaining(letter.unlockDate) : 0;
      
      let letterTitle = `Capsule #${i + 1}`;
      let letterBody = letter.content;
      
      if (!isLocked && letter.content.includes('\n\n')) {
        const parts = letter.content.split('\n\n');
        letterTitle = parts[0];
        letterBody = parts.slice(1).join('\n\n');
      }
      
      return {
        ...letter,
        originalIndex: i,
        isLocked,
        daysLeft,
        displayTitle: letterTitle,
        displayBody: letterBody
      };
    });
  }, [letters]);

  const openedLetters = useMemo(() => processedLetters.filter(l => !l.isLocked), [processedLetters]);
  const lockedLetters = useMemo(() => processedLetters.filter(l => l.isLocked), [processedLetters]);
  const upcomingUnlocks = useMemo(() => {
    return [...lockedLetters].sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate));
  }, [lockedLetters]);

  if (loading && letters.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-5 panel h-card-lg loading-pulse"></div>
        <div className="col-7 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12">
      {/* Left Column: Writer Panel (col-5) */}
      <div className="col-5 flex flex-col gap-4">
        <form className="panel h-card-lg bg-[#0f172a] justify-between" onSubmit={send}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2>Write to Future Me</h2>
              <button
                type="button"
                onClick={generateAI}
                disabled={generating}
                className="btn btn-secondary text-[10px] py-1 px-2.5 min-h-[30px]"
              >
                ✨ {generating ? 'Channelling...' : 'AI Assist'}
              </button>
            </div>
            <p className="text-[10px] text-[var(--muted)]">Seal a message in a digital time-capsule. Select an unlock threshold below.</p>
            
            <input 
              className="input text-xs" 
              placeholder="Capsule Title (e.g. My Freshman Goals)..." 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
            
            <textarea 
              className="input min-h-[140px] font-serif text-xs leading-relaxed" 
              placeholder="Dear Future Me, write your worries, plans, and aspirations..." 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
            />
            
            <div>
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1.5">Unlock Duration</label>
              <div className="grid grid-cols-4 gap-1.5 bg-[#020617] p-1 rounded-lg border border-slate-800">
                {['1m', '6m', '1y', 'custom'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setUnlockOption(opt)}
                    className={`py-1.5 rounded-md text-[9px] font-black transition-all ${
                      unlockOption === opt
                        ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {opt === '1m' ? '1 Month' : opt === '6m' ? '6 Months' : opt === '1y' ? '1 Year' : 'Custom'}
                  </button>
                ))}
              </div>
            </div>

            {unlockOption === 'custom' && (
              <div className="animate-fadeIn">
                <label className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">Pick Unlock Date</label>
                <input 
                  type="date" 
                  className="input text-xs py-1" 
                  value={customDate} 
                  onChange={e => setCustomDate(e.target.value)} 
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required 
                />
              </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary w-full justify-center font-bold mt-2">
            🔒 Lock Time-Capsule
          </button>
        </form>

        {/* Companion Helper Card */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <img src="/luna_avatar.png" className="w-9 h-9 rounded-full object-cover" alt="Luna" />
          <div className="flex-1">
            <span className="text-[9px] text-[var(--primary)] font-black uppercase tracking-wider block">Luna's Capsule Guard</span>
            <p className="text-[9.5px] text-[var(--muted)] italic">"Time-capsules are locked using cryptography and cannot be opened prematurely!"</p>
          </div>
        </div>
      </div>

      {/* Right Column: Capsular Lists (col-7) */}
      <div className="col-7 panel h-card-lg bg-[#0f172a] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2>Time-Capsule Vault</h2>
          <div className="flex gap-2">
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-[var(--muted)] font-black px-2 py-0.5 rounded-full">
              Sealed: {lockedLetters.length}
            </span>
            <span className="text-[9px] bg-[var(--secondary)] border border-[var(--primary)]/20 text-[var(--primary)] font-black px-2 py-0.5 rounded-full">
              Opened: {openedLetters.length}
            </span>
          </div>
        </div>

        {/* Upcoming Unlocks Banner */}
        {upcomingUnlocks.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 rounded-xl mb-4 flex justify-between items-center animate-pulse-slow">
            <div>
              <span className="text-[8px] text-[var(--primary)] font-extrabold uppercase tracking-widest block">Next Unlock In Focus</span>
              <strong className="text-[11px] text-[var(--text-primary)] font-black">
                {upcomingUnlocks[0].displayTitle || `Capsule #${upcomingUnlocks[0].originalIndex + 1}`}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-black text-[var(--primary)] block">
                ⏳ {upcomingUnlocks[0].daysLeft} Days
              </span>
              <span className="text-[8px] text-[var(--muted)] font-medium">Unlocks {upcomingUnlocks[0].unlockDate}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Section: Locked Letters */}
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Sealed Envelopes (Locked)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lockedLetters.map((l, i) => (
                <div key={i} className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl flex justify-between items-center group transition-all hover:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    <div>
                      <strong className="text-[10px] text-slate-300 block font-black">Capsule #{l.originalIndex + 1}</strong>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">Locked until: {l.unlockDate}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
                    {l.daysLeft}d left
                  </span>
                </div>
              ))}
              {lockedLetters.length === 0 && (
                <div className="text-[10px] text-[var(--muted)] italic text-center py-4 col-span-2">No sealed letters.</div>
              )}
            </div>
          </div>

          {/* Section: Opened Letters (Archive View) */}
          <div>
            <span className="text-[9px] text-[var(--primary)] font-bold uppercase tracking-wider block mb-2">Opened Letters (Archive)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {openedLetters.map((l, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-[var(--secondary)] border border-[var(--primary)]/20 rounded-xl flex flex-col justify-between group transition-all hover:scale-[1.02] hover:border-[var(--primary)]/50 cursor-pointer"
                  onClick={() => setSelectedLetter(l)}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-lg">✉️</span>
                    <span className="text-[8px] text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded font-black uppercase">Opened</span>
                  </div>
                  <strong className="text-[11px] text-[var(--text-primary)] font-black truncate block mb-0.5">
                    {l.displayTitle}
                  </strong>
                  <p className="text-[9px] text-[var(--muted)] line-clamp-2 leading-relaxed mb-2">
                    {l.displayBody}
                  </p>
                  <span className="text-[8px] text-[var(--muted)] font-semibold block mt-auto pt-1.5 border-t border-slate-800/60">
                    Unlocked: {l.unlockDate}
                  </span>
                </div>
              ))}
              {openedLetters.length === 0 && (
                <div className="text-[10px] text-[var(--muted)] italic text-center py-6 col-span-2 border border-dashed border-slate-800 rounded-xl">
                  No unlocked time-capsules yet. Check back when the timers expire!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Modal Overlay */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-md grid place-items-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-800 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[8px] text-[var(--primary)] font-black uppercase tracking-widest block">Opened Time-Capsule</span>
                <h3 className="text-sm font-black text-white">{selectedLetter.displayTitle}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedLetter(null)} 
                className="btn btn-outline min-h-[30px] px-2.5 py-1 text-xs justify-center"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="overflow-y-auto pr-1 flex-1 text-xs text-slate-300 font-serif leading-relaxed whitespace-pre-wrap py-2">
              {selectedLetter.displayBody}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-500 font-bold">
              <span>Sealed on: {selectedLetter.createdAt ? new Date(selectedLetter.createdAt).toLocaleDateString() : 'N/A'}</span>
              <span>Opened on: {selectedLetter.unlockDate}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// 13. Analytics Page
function AnalyticsPage({ pet, themeMode, refreshKey }) {
  const [checkins, setCheckins] = useState([]);
  const [habitsList, setHabitsList] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month'); // 'week' | 'month' | 'year'

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiFetch('/api/checkins/history'),
      apiFetch('/api/habits'),
      apiFetch('/api/habits/logs'),
      apiFetch('/api/dashboard')
    ])
    .then(([checkinsData, habitsData, logsData, dashData]) => {
      setCheckins(checkinsData || []);
      setHabitsList(habitsData || []);
      setHabitLogs(logsData || []);
      setDashboardData(dashData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  // Date filtering logic
  const getFilteredCheckins = () => {
    const now = new Date();
    let cutoff = new Date();
    if (timeframe === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
      cutoff.setDate(now.getDate() - 30);
    } else {
      cutoff.setDate(now.getDate() - 365);
    }
    return checkins.filter(c => new Date(c.createdAt) >= cutoff);
  };

  // Group checkins by month for the 'year' view to avoid crowded rendering
  const getChartData = useMemo(() => {
    const filtered = getFilteredCheckins();
    if (timeframe !== 'year') {
      return filtered.slice().reverse(); // Chronological order
    }
    
    // Aggregate by Year-Month
    const groups = {};
    filtered.forEach(c => {
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = {
          key,
          name: d.toLocaleDateString([], { month: 'short', year: 'numeric' }),
          wellnessScoreSum: 0,
          sleepHoursSum: 0,
          sleepQualitySum: 0,
          stressLevelSum: 0,
          energyLevelSum: 0,
          count: 0
        };
      }
      groups[key].wellnessScoreSum += c.wellnessScore;
      groups[key].sleepHoursSum += c.sleepHours;
      groups[key].sleepQualitySum += c.sleepQuality;
      groups[key].stressLevelSum += c.stressLevel;
      groups[key].energyLevelSum += c.energyLevel;
      groups[key].count++;
    });

    return Object.values(groups)
      .map(g => ({
        createdAt: g.key + '-01T00:00:00Z',
        name: g.name,
        wellnessScore: Math.round(g.wellnessScoreSum / g.count),
        sleepHours: Number((g.sleepHoursSum / g.count).toFixed(1)),
        sleepQuality: Number((g.sleepQualitySum / g.count).toFixed(1)),
        stressLevel: Number((g.stressLevelSum / g.count).toFixed(1)),
        energyLevel: Number((g.energyLevelSum / g.count).toFixed(1))
      }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [checkins, timeframe]);

  // Habit consistency mapping
  const habitConsistencyData = useMemo(() => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const data = [];
    const totalHabits = habitsList.length || 1;

    if (timeframe === 'week' || timeframe === 'month') {
      const days = timeframe === 'week' ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        d.setHours(0,0,0,0);
        
        const dateStr = getLocalDateString(d);
        const completedOnDate = habitLogs.filter(log => log.completedDate === dateStr);
        const pct = Math.round((completedOnDate.length / totalHabits) * 100);

        data.push({
          dateStr,
          name: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          completionRate: pct,
          completedCount: completedOnDate.length,
          totalCount: habitsList.length
        });
      }
    } else {
      // Group by month
      const groups = {};
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const year = d.getFullYear();
        const month = d.getMonth();
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;

        groups[key] = {
          key,
          name: d.toLocaleDateString([], { month: 'short', year: 'numeric' }),
          logsCount: 0
        };
      }

      habitLogs.forEach(log => {
        if (log.completedDate) {
          const logDate = new Date(log.completedDate + 'T00:00:00');
          const key = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}`;
          if (groups[key]) {
            groups[key].logsCount++;
          }
        }
      });

      Object.keys(groups).forEach(key => {
        const g = groups[key];
        const parts = key.split('-');
        const y = parseInt(parts[0]);
        const m = parseInt(parts[1]) - 1;
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const totalPossible = (habitsList.length || 1) * daysInMonth;
        const rate = Math.min(100, Math.round((g.logsCount / totalPossible) * 100));

        data.push({
          dateStr: key + '-01',
          name: g.name,
          completionRate: rate
        });
      });
    }
    return data;
  }, [habitLogs, habitsList, timeframe]);

  // Mood distribution counting
  const moodPieData = useMemo(() => {
    const counts = { EXCELLENT: 0, GOOD: 0, NEUTRAL: 0, STRESSED: 0, SAD: 0 };
    const filtered = getFilteredCheckins();
    filtered.forEach(c => {
      if (c.mood && counts[c.mood.toUpperCase()] !== undefined) {
        counts[c.mood.toUpperCase()]++;
      }
    });

    return [
      { name: 'Great', value: counts.EXCELLENT, color: '#22c55e' },
      { name: 'Good', value: counts.GOOD, color: '#14b8a6' },
      { name: 'Okay', value: counts.NEUTRAL, color: '#f59e0b' },
      { name: 'Stressed', value: counts.STRESSED, color: '#ef4444' },
      { name: 'Sad', value: counts.SAD, color: '#8b5cf6' }
    ].filter(item => item.value > 0);
  }, [checkins, timeframe]);

  // Key stats based on selected timeframe
  const stats = useMemo(() => {
    const filtered = getFilteredCheckins();
    const count = filtered.length;
    const avgWellness = count > 0 
      ? Math.round(filtered.reduce((sum, c) => sum + c.wellnessScore, 0) / count)
      : 0;
    
    // Average sleep
    const avgSleep = count > 0
      ? Number((filtered.reduce((sum, c) => sum + c.sleepHours, 0) / count).toFixed(1))
      : 0;

    // Completed habits count (overall consistency average)
    const consistencyValues = habitConsistencyData.map(d => d.completionRate);
    const avgConsistency = consistencyValues.length > 0
      ? Math.round(consistencyValues.reduce((sum, v) => sum + v, 0) / consistencyValues.length)
      : 0;

    return {
      avgWellness,
      logsCount: count,
      avgSleep,
      avgConsistency
    };
  }, [checkins, habitConsistencyData, timeframe]);

  // Theme-aware grid line stroke & axis text styling
  const gridStroke = themeMode === 'light' ? '#e2e8f0' : '#1e293b';
  const textFill = themeMode === 'light' ? '#64748b' : '#94a3b8';

  // Custom tooltips to support dark and light mode beautifully
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Determine if label is date format
      let formattedLabel = label;
      if (typeof label === 'string' && label.includes('T')) {
        formattedLabel = new Date(label).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return (
        <div className="p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-md">
          <p className="text-[var(--muted)] font-semibold mb-1">{formattedLabel}</p>
          {payload.map((item, index) => (
            <div key={index} className="flex justify-between gap-4 items-center">
              <span className="text-[var(--muted)] font-medium">{item.name}:</span>
              <strong className="font-extrabold" style={{ color: item.color || item.fill || 'var(--primary)' }}>
                {item.value} {item.name.toLowerCase().includes('sleep') ? 'hrs' : item.name.toLowerCase().includes('consistency') ? '%' : ''}
              </strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const filtered = getFilteredCheckins();
    if (filtered.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ['Date', 'Wellness Score', 'Mood', 'Sleep Hours', 'Sleep Quality (1-5)', 'Energy Level (1-5)', 'Stress Level (1-5)', 'Social Interaction (1-5)', 'Mood Trigger'];
    const rows = filtered.map(c => [
      new Date(c.createdAt).toLocaleDateString(),
      c.wellnessScore,
      c.mood,
      c.sleepHours,
      c.sleepQuality,
      c.energyLevel,
      c.stressLevel,
      c.socialInteraction,
      c.moodTrigger || 'None'
    ]);

    const csvContent = "\uFEFF" // Add UTF-8 BOM
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mindmate_wellness_analytics_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export utility using window.print()
  const handleExportPDF = () => {
    window.print();
  };

  if (loading && checkins.length === 0) {
    return (
      <div className="grid-12">
        <div className="col-12 panel h-[120px] loading-pulse"></div>
        <div className="col-12 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  return (
    <section className="grid-12 print:p-0 print:m-0">
      {/* Top Header: Dashboard Controls */}
      <div className="col-12 flex justify-between items-center bg-[#0f172a] border border-slate-800 p-4 rounded-2xl print:border-none print:bg-white print:p-0 print:mb-6">
        <div>
          <h2 className="text-white print:text-black">Professional Wellness Dashboard</h2>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Metrics analysis over selected timeframes</span>
        </div>
        
        {/* Action Controls */}
        <div className="flex items-center gap-3 print-hidden">
          {/* Timeframe selector */}
          <div className="flex gap-1 bg-[#020617] p-1 rounded-xl border border-slate-800">
            {['week', 'month', 'year'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                  timeframe === t
                    ? 'bg-[var(--primary)] text-[var(--bg)] shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export buttons */}
          <div className="flex gap-1.5 border-l border-slate-800 pl-3">
            <button 
              onClick={handleExportCSV} 
              className="btn btn-outline text-xs px-3 py-1 min-h-[30px] font-bold"
            >
              📥 CSV
            </button>
            <button 
              onClick={handleExportPDF} 
              className="btn btn-primary text-xs px-3 py-1 min-h-[30px] font-bold text-slate-900"
            >
              📄 PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="col-12 grid grid-cols-4 gap-4 print:grid-cols-4 print:mb-6">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl print:border-slate-300 print:bg-white">
          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1 print:text-slate-600">Avg Wellness Score</span>
          <strong className="text-white text-xl block print:text-black">{stats.avgWellness} <span className="text-slate-500 text-xs">/ 100</span></strong>
          <span className="text-[9px] text-emerald-400 mt-1 block font-bold print:text-emerald-700">Period average</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl print:border-slate-300 print:bg-white">
          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1 print:text-slate-600">Check-In Logs</span>
          <strong className="text-white text-xl block print:text-black">{stats.logsCount} Logs</strong>
          <span className="text-[9px] text-emerald-400 mt-1 block font-bold print:text-emerald-700">Total in timeframe</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl print:border-slate-300 print:bg-white">
          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1 print:text-slate-600">Avg Sleep Duration</span>
          <strong className="text-white text-xl block print:text-black">{stats.avgSleep} hrs</strong>
          <span className="text-[9px] text-emerald-400 mt-1 block font-bold print:text-emerald-700">Daily average</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl print:border-slate-300 print:bg-white">
          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1 print:text-slate-600">Habit Consistency</span>
          <strong className="text-white text-xl block print:text-black">{stats.avgConsistency}%</strong>
          <span className="text-[9px] text-emerald-400 mt-1 block font-bold print:text-emerald-700">Completion rate</span>
        </div>
      </div>

      {/* Row 2: Charts Row 1 - Wellness & Sleep */}
      <div className="col-12 grid md:grid-cols-2 gap-4">
        {/* Wellness Trend Area Chart */}
        <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-2xl print:bg-white print:border-slate-300">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 print:text-black">Wellness Score Trend</h3>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData}>
                <defs>
                  <linearGradient id="analyticsTrendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity="0.3" vertical={false} />
                <XAxis 
                  dataKey="createdAt" 
                  tickFormatter={str => timeframe === 'year' ? new Date(str).toLocaleDateString([], {month:'short', year:'2-digit'}) : new Date(str).toLocaleDateString([], {day:'numeric',month:'short'})} 
                  tick={{fontSize:8, fill:textFill}} 
                  stroke={gridStroke}
                />
                <YAxis domain={[0, 100]} tick={{fontSize:8, fill:textFill}} stroke={gridStroke} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Wellness Score" dataKey="wellnessScore" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsTrendColor)" dot={{ r: timeframe === 'week' ? 4 : 0, strokeWidth: 2, fill: 'var(--card-bg)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Hours & Quality Bar Chart */}
        <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-2xl print:bg-white print:border-slate-300">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 print:text-black">Sleep Hours & Quality</h3>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity="0.3" vertical={false} />
                <XAxis 
                  dataKey="createdAt" 
                  tickFormatter={str => timeframe === 'year' ? new Date(str).toLocaleDateString([], {month:'short'}) : new Date(str).toLocaleDateString([], {day:'numeric',month:'short'})} 
                  tick={{fontSize:8, fill:textFill}} 
                  stroke={gridStroke}
                />
                <YAxis yAxisId="left" orientation="left" stroke="var(--accent)" tick={{fontSize:8, fill:textFill}} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} stroke="var(--primary)" tick={{fontSize:8, fill:textFill}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" name="Sleep Hours" dataKey="sleepHours" fill="var(--accent)" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar yAxisId="right" name="Sleep Quality" dataKey="sleepQuality" fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Charts Row 2 - Moods, Stress & Habits */}
      <div className="col-12 grid md:grid-cols-3 gap-4">
        {/* Mood Distribution Pie Chart */}
        <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-2xl flex flex-col justify-between print:bg-white print:border-slate-300">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-2 print:text-black">Mood Distribution</h3>
          {moodPieData.length === 0 ? (
            <div className="text-slate-500 text-xs italic my-auto text-center py-10">No data logged in this timeframe.</div>
          ) : (
            <div className="h-[180px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={moodPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} fill="#8884d8" paddingAngle={4}>
                    {moodPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Pie Legends */}
              <div className="absolute bottom-0 inset-x-0 flex justify-center gap-2.5 flex-wrap text-[8.5px] font-bold">
                {moodPieData.map((m, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-slate-400 print:text-slate-600">{m.name} ({m.value})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stress & Energy Levels Line Chart */}
        <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-2xl print:bg-white print:border-slate-300">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 print:text-black">Stress vs Energy Levels</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity="0.3" vertical={false} />
                <XAxis 
                  dataKey="createdAt" 
                  tickFormatter={str => timeframe === 'year' ? new Date(str).toLocaleDateString([], {month:'short'}) : new Date(str).toLocaleDateString([], {day:'numeric',month:'short'})} 
                  tick={{fontSize:8, fill:textFill}} 
                  stroke={gridStroke}
                />
                <YAxis domain={[1, 5]} tick={{fontSize:8, fill:textFill}} stroke={gridStroke} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" name="Stress Level" dataKey="stressLevel" stroke="#ef4444" strokeWidth={2.5} dot={{ r: timeframe === 'week' ? 3 : 0 }} />
                <Line type="monotone" name="Energy Level" dataKey="energyLevel" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: timeframe === 'week' ? 3 : 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Consistency Area Chart */}
        <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-2xl print:bg-white print:border-slate-300">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 print:text-black">Habit Consistency (%)</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={habitConsistencyData}>
                <defs>
                  <linearGradient id="habitConsistencyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity="0.3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize:8, fill:textFill}} 
                  stroke={gridStroke}
                />
                <YAxis domain={[0, 100]} tick={{fontSize:8, fill:textFill}} stroke={gridStroke} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Consistency" dataKey="completionRate" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#habitConsistencyColor)" dot={{ r: timeframe === 'week' ? 3 : 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Mascot reflection footer */}
      <div className="col-12 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3.5 print:border-slate-300 print:bg-white">
        <img src="/luna_avatar.png" className="w-9 h-9 rounded-full object-cover border border-slate-800 print:border-slate-300" alt="Luna" />
        <div className="flex-1">
          <span className="text-[10px] text-[var(--primary)] font-black uppercase tracking-wider block">{pet.name}'s Insight</span>
          <p className="text-[10.5px] text-slate-400 italic leading-relaxed print:text-slate-800">
            "We are tracking {stats.logsCount} logs over this {timeframe} with {stats.avgConsistency}% habit consistency. Keep reflecting daily to build even better patterns!"
          </p>
        </div>
      </div>
    </section>
  );
}

// 14. Privacy Profile Page
function ProfilePage({ pet, triggerRefresh }) {
  const [selectedSubTab, setSelectedSubTab] = useState('profile');
  const [userSummary, setUserSummary] = useState(null);
  const [consent, setConsent] = useState(() => localStorage.getItem("moderationConsent") === "true");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/profile/consent', {
      method: 'PUT',
      body: JSON.stringify({ moderationConsent: consent })
    })
    .then(data => {
      if (data) {
        setUserSummary(data);
        setConsent(data.moderationConsent);
        localStorage.setItem("moderationConsent", data.moderationConsent);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const handleConsentToggle = async (val) => {
    try {
      const data = await apiFetch('/api/profile/consent', {
        method: 'PUT',
        body: JSON.stringify({ moderationConsent: val })
      });
      if (data) {
        setUserSummary(data);
        setConsent(data.moderationConsent);
        localStorage.setItem("moderationConsent", data.moderationConsent);
        if (triggerRefresh) triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !userSummary) {
    return (
      <div className="grid-12">
        <div className="col-4 panel h-card-lg loading-pulse"></div>
        <div className="col-8 panel h-card-lg loading-pulse"></div>
      </div>
    );
  }

  const name = userSummary?.name || localStorage.getItem("userName") || 'Student';
  const email = userSummary?.email || localStorage.getItem("userEmail") || 'student@example.com';
  const role = userSummary?.role || localStorage.getItem("role") || 'STUDENT';
  const memberSince = userSummary?.createdAt
    ? new Date(userSummary.createdAt).toLocaleDateString([], { month: 'long', year: 'numeric' })
    : 'May 2024';

  return (
    <section className="grid-12">
      {/* Left Column Settings Sidebar (col-4) */}
      <div className="col-4 panel h-card-lg bg-[#0f172a] flex flex-col gap-2.5">
        <h2>Privacy Profile</h2>
        <button onClick={() => setSelectedSubTab('profile')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}>👤 Profile Settings</button>
        <button onClick={() => setSelectedSubTab('privacy')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'privacy' ? 'btn-primary' : 'btn-outline'}`}>🔒 Consent Settings</button>
        <button onClick={() => setSelectedSubTab('sharing')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'sharing' ? 'btn-primary' : 'btn-outline'}`}>🤝 Data Sharing</button>
        <button onClick={() => setSelectedSubTab('ai')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'ai' ? 'btn-primary' : 'btn-outline'}`}>🤖 AI Data Usage</button>
        <button onClick={() => setSelectedSubTab('activity')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'activity' ? 'btn-primary' : 'btn-outline'}`}>📋 Activity History</button>
      </div>

      {/* Right Column Form (col-8) */}
      <div className="col-8 panel h-card-lg bg-[#0f172a] text-xs justify-between">
        {selectedSubTab === 'profile' ? (
          <div>
            <h2>Your Information</h2>
            <div className="flex items-center gap-4 my-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-sm text-[#14b8a6] border border-slate-700">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="text-white block text-sm font-black">{name}</strong>
                <span className="text-slate-500">{email} · Member since {memberSince}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-[8px] mb-1">Full Name</span>
                <strong className="text-white text-sm">{name}</strong>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-[8px] mb-1">Email Address</span>
                <strong className="text-white text-sm">{email}</strong>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-[8px] mb-1">System Role</span>
                <strong className="text-white text-sm">{role}</strong>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-[8px] mb-1">Data Storage Mode</span>
                <strong className="text-white text-sm">PostgreSQL DB Cloud</strong>
              </div>
            </div>
          </div>
        ) : selectedSubTab === 'privacy' ? (
          <div>
            <h2>Consent Settings</h2>
            <p className="text-slate-400 mt-2">MindMate fully respects teen consent and security structures under moderation rules.</p>
            <div className="space-y-3.5 mt-4">
              <div className="flex justify-between items-center p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <strong className="text-white block font-bold">AI Chat Moderation Consent</strong>
                  <span className="text-slate-500 text-[10px]">Allow AI helper to moderate chat messages for safety</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => handleConsentToggle(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        ) : selectedSubTab === 'sharing' ? (
          <div>
            <h2>Data Sharing Preferences</h2>
            <p className="text-slate-400 mt-2 mb-4">Control how your wellness data is compiled or aggregated for analysis reports.</p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-white block font-bold">Anonymized Research Support</strong>
                  <span className="text-slate-500 text-[10px]">Contribute anonymous trend statistics to mental health studies</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-white block font-bold">Educator Sync</strong>
                  <span className="text-slate-500 text-[10px]">Share high-level progress charts with class coordinators</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        ) : selectedSubTab === 'ai' ? (
          <div>
            <h2>AI Data & Training Usage</h2>
            <p className="text-slate-400 mt-2 mb-4">MindMate utilizes fine-tuned local models to generate weekly reflection summaries.</p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <strong className="text-white block font-bold mb-1">Model Sandboxing</strong>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Your check-in history and journal inputs are processed inside isolated sandbox environments and are never used to train public commercial AI models.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2>Activity History Logs</h2>
            <p className="text-slate-400 mt-2 mb-4">View your login and interaction metadata audited by the system.</p>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <strong className="text-white block">Session Authenticated</strong>
                  <span className="text-slate-500 text-[10px]">JWT token handshake completed</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <strong className="text-white block">Companion Adopted</strong>
                  <span className="text-slate-500 text-[10px]">Companion {pet.name} active</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
        {pet && (
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <img src={getPetAvatar(pet.type)} className="w-8 h-8 rounded-full object-cover" alt={pet.name} />
              <span className="text-[10px] text-slate-400 italic">
                "{getPetEmoji(pet.type)} {pet.name}: 'We protect your data privacy to the highest standard.'"
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SettingsPage({ pet, themeMode, setThemeMode, triggerRefresh }) {
  const [selectedSubTab, setSelectedSubTab] = useState('general');
  const [reminders, setReminders] = useState(true);
  const [sound, setSound] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [newName, setNewName] = useState(pet?.name || '');
  const [activeType, setActiveType] = useState(pet?.type || 'CAT');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/api/companion/templates')
      .then(data => {
        if (Array.isArray(data)) setTemplates(data);
      })
      .catch(console.error);
  }, []);

  const handleSaveCompanion = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const data = await apiFetch('/api/companion', {
        method: 'POST',
        body: JSON.stringify({
          petType: activeType,
          petName: newName,
          petTheme: pet?.theme || 'Classic',
          petAccessory: pet?.accessory || 'None'
        })
      });
      if (data && data.hasSelectedCompanion) {
        const updated = {
          type: data.petType,
          name: data.petName,
          species: data.species,
          personality: data.personality,
          petXp: data.petXp,
          level: data.level,
          evolutionStage: data.evolutionStage,
          mood: data.mood,
          avatar: data.avatar,
          unlockedThemes: data.unlockedThemes || ['Classic'],
          unlockedAccessories: data.unlockedAccessories || ['None'],
          insight: data.insight,
          hasSelectedCompanion: data.hasSelectedCompanion
        };
        setPet(updated);
        localStorage.setItem("user_pet", JSON.stringify(updated));
        if (triggerRefresh) triggerRefresh();
        alert("Companion settings updated successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid-12">
      {/* Left Column Sidebar (col-4) */}
      <div className="col-4 panel h-card-lg bg-[#0f172a] flex flex-col gap-2.5">
        <h2>Settings</h2>
        <button onClick={() => setSelectedSubTab('general')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'general' ? 'btn-primary' : 'btn-outline'}`}>⚙️ General</button>
        <button onClick={() => setSelectedSubTab('companion')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'companion' ? 'btn-primary' : 'btn-outline'}`}>🦊 Companion Management</button>
        <button onClick={() => setSelectedSubTab('notify')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'notify' ? 'btn-primary' : 'btn-outline'}`}>🔔 Notifications</button>
        <button onClick={() => setSelectedSubTab('appearance')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'appearance' ? 'btn-primary' : 'btn-outline'}`}>🎨 Appearance</button>
        <button onClick={() => setSelectedSubTab('security')} className={`btn text-xs w-full justify-start ${selectedSubTab === 'security' ? 'btn-primary' : 'btn-outline'}`}>🔒 Security</button>
      </div>

      {/* Right Column details (col-8) */}
      <div className="col-8 panel h-card-lg bg-[#0f172a] text-xs justify-between">
        {selectedSubTab === 'general' ? (
          <div>
            <h2>General Parameters</h2>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Language</label>
                  <select className="input text-xs py-1"><option>English</option></select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Time Format</label>
                  <select className="input text-xs py-1"><option>12 Hour</option></select>
                </div>
              </div>
              
              {/* Custom toggles section */}
              <div className="space-y-3.5 mt-2">
                <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div>
                    <strong className="text-white block font-bold">Daily Reminders</strong>
                    <span className="text-slate-500 text-[10px]">Send daily pushes to check-in</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={reminders} onChange={e => setReminders(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div>
                    <strong className="text-white block font-bold">Appearance Mode</strong>
                    <span className="text-slate-500 text-[10px]">Select application appearance theme</span>
                  </div>
                  <div className="flex gap-1 bg-[#020617] p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setThemeMode('light')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        themeMode === 'light'
                          ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                          : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode('dark')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        themeMode === 'dark'
                          ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                          : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedSubTab === 'companion' ? (
          <div>
            <h2>Companion Management</h2>
            <p className="text-slate-400 mt-2 mb-4">Rename or swap your virtual wellness companion pet.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Companion Name</label>
                <input 
                  className="input text-xs py-1.5 font-bold" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  placeholder="Name your companion..." 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Adopt/Select Companion Pet</label>
                <div className="grid grid-cols-3 gap-2">
                  {templates.map(t => {
                    const isSelected = activeType.toUpperCase() === t.petType.toUpperCase();
                    return (
                      <button
                        key={t.petType}
                        type="button"
                        onClick={() => setActiveType(t.petType)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected ? 'border-[#14b8a6] bg-[#14b8a6]/10' : 'border-[#1e293b] hover:bg-slate-800 bg-slate-900/40'
                        }`}
                      >
                        <img src={getPetAvatar(t.petType)} className="w-10 h-10 rounded-full mb-1 object-cover" alt={t.species} />
                        <strong className="text-xs text-white">{t.species}</strong>
                        <span className="text-[9px] text-slate-500 font-semibold">{t.personality}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleSaveCompanion} 
                disabled={saving}
                className="btn btn-primary justify-center font-bold text-xs w-full py-2.5 mt-2"
              >
                {saving ? 'Updating...' : 'Save Companion Changes'}
              </button>
            </div>
          </div>
        ) : selectedSubTab === 'notify' ? (
          <div>
            <h2>Notification Options</h2>
            <p className="text-slate-400 mt-2 mb-4">Personalize system notifications and sound alerts.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <strong className="text-white block font-bold">Sound Effects</strong>
                  <span className="text-slate-500 text-[10px]">Play alert sounds upon completing focus timer</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <strong className="text-white block font-bold">Weekly Reflection Digest</strong>
                  <span className="text-slate-500 text-[10px]">Receive push digest when a new weekly reflection is ready</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        ) : selectedSubTab === 'appearance' ? (
          <div>
            <h2>Appearance & Layout Mode</h2>
            <p className="text-slate-400 mt-2 mb-4">Configure fonts, text size, and contrast preferences.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <strong className="text-white block font-bold">Appearance Mode</strong>
                  <span className="text-slate-500 text-[10px]">Select application appearance theme</span>
                </div>
                <div className="flex gap-1 bg-[#020617] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                      themeMode === 'light'
                        ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                      themeMode === 'dark'
                        ? 'bg-[var(--primary)] text-[var(--bg)] shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Font Family</label>
                <select className="input text-xs py-1"><option>Inter (Sans-Serif)</option><option>Roboto</option><option>Outfit</option></select>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2>Security Settings</h2>
            <p className="text-slate-400 mt-2 mb-4">Manage password updates and active login tokens.</p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-[8px] mb-1">Authentication Handshake Token</span>
                <code className="text-[#14b8a6] text-[10px] block break-all font-mono">
                  {localStorage.getItem("token")?.slice(0, 50)}...
                </code>
              </div>
              <button className="btn btn-outline w-full justify-center text-xs">Request Password Reset Link</button>
            </div>
          </div>
        )}

        {pet && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 mt-6">
            <img src={getPetAvatar(pet.type)} className="w-8 h-8 rounded-full object-cover" alt={pet.name} />
            <p className="text-[10px] text-slate-400 italic">"{getPetEmoji(pet.type)} {pet.name}: 'Adjust parameters here to customize your growth dashboard experience.'"</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default App
