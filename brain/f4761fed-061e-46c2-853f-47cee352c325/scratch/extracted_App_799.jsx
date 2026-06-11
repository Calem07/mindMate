""use strict";

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
  Sparkle
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Link, NavLink, Route, BrowserRouter as Router, Routes, useNavigate, useLocation } from 'react-router-dom'
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

// Global API fetch helper
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API Request failed");
  }
  if (response.status === 204) return null;
  return response.json();
}

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || 'STUDENT');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark min-h-screen bg-[#090f11] text-[#e2f1f0]' : 'min-h-screen bg-[#f3f8f8] text-[#0f1b24]'}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" s
<truncated 71663 bytes>