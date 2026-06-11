import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, HeartPulse, RotateCcw, Sparkles } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { analyticsService, checkinService, habitService } from '../../services/index.js';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-popover px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-white">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="text-muted-foreground">
          {item.name}: <span className="font-semibold text-cyan-200">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

function avg(items, key) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + Number(item[key] || 0), 0) / items.length);
}

export function AnalyticsPage({ pet, refreshKey = 0 }) {
  const [dashboard, setDashboard] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [burnout, setBurnout] = useState(null);
  const [correlations, setCorrelations] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async () => {
    setLoading(true);
    setError('');
    setWarnings([]);
    try {
      const [dashboardData, checkinData, burnoutData] = await Promise.all([
        analyticsService.dashboard(),
        checkinService.history(),
        analyticsService.burnout(),
      ]);
      setDashboard(dashboardData);
      setCheckins(checkinData || []);
      setBurnout(burnoutData);

      const optionalWarnings = [];
      try {
        setHabitLogs((await habitService.logs()) || []);
      } catch (err) {
        optionalWarnings.push(`Habit consistency is unavailable: ${err.message}`);
        setHabitLogs([]);
      }
      try {
        setCorrelations((await analyticsService.correlations()) || []);
      } catch (err) {
        optionalWarnings.push(`Pattern correlations are unavailable: ${err.message}`);
        setCorrelations([]);
      }
      setWarnings(optionalWarnings);
    } catch (err) {
      setError(err.message || 'Analytics could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Reload only when app shell data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const recent = useMemo(() => [...checkins].slice(-14), [checkins]);
  const chartData = useMemo(
    () =>
      recent.map((entry) => ({
        name: new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        wellness: entry.wellnessScore,
        stress: entry.stressLevel,
        energy: entry.energyLevel,
        sleep: entry.sleepHours,
      })),
    [recent],
  );
  const stats = useMemo(
    () => ({
      wellness: avg(recent, 'wellnessScore'),
      stress: avg(recent, 'stressLevel'),
      energy: avg(recent, 'energyLevel'),
      sleep: recent.length
        ? Number((recent.reduce((sum, entry) => sum + Number(entry.sleepHours || 0), 0) / recent.length).toFixed(1))
        : 0,
    }),
    [recent],
  );

  if (loading) return <LoadingState label={`${petName} is reading your wellness patterns...`} />;

  if (error) {
    return (
      <EmptyState
        icon="!"
        title="Insights are out of reach"
        description={error}
        action={<Button onClick={load}><RotateCcw className="h-4 w-4" /> Try again</Button>}
      />
    );
  }

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Insights with {petName}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Patterns that help your companion understand you</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          These numbers are context for care, not a scorecard. {petName} uses them to notice what supports you.
        </p>
      </div>

      {warnings.map((warning) => (
        <div key={warning} className="rounded-2xl border border-orange-500/25 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {warning}</div>
        </div>
      ))}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Wellness', stats.wellness, '/100', HeartPulse],
          ['Sleep', stats.sleep, 'hrs', Activity],
          ['Stress', stats.stress, '/5', AlertTriangle],
          ['Energy', stats.energy, '/5', Sparkles],
        ].map(([label, value, suffix, Icon]) => (
          <GlassPanel key={label} className="p-5">
            <Icon className="h-4 w-4 text-primary" />
            <p className="mt-4 text-3xl font-bold text-white">{value}<span className="text-sm text-muted-foreground"> {suffix}</span></p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          </GlassPanel>
        ))}
      </div>

      {checkins.length === 0 ? (
        <EmptyState icon="✦" title="No check-ins yet" description={`${petName} needs a few check-ins before patterns can appear.`} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <GlassPanel className="p-5">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <BarChart3 className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">Wellness trend</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
                    <Tooltip content={<ChartTooltip />} />
                    <Area name="Wellness" type="monotone" dataKey="wellness" stroke="var(--primary)" fill="rgba(6,182,212,0.16)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel className="p-5">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Activity className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">Sleep, stress, and energy</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar name="Sleep" dataKey="sleep" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
                    <Bar name="Stress" dataKey="stress" fill="var(--chart-4)" radius={[8, 8, 0, 0]} />
                    <Bar name="Energy" dataKey="energy" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>

          <div className="space-y-5">
            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{petName} says</p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                “I’m looking for what helps you feel steadier. The trend matters more than one hard day.”
              </p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Burnout check</p>
              <p className={`mt-4 text-lg font-semibold ${burnout?.burnoutRisk ? 'text-orange-300' : 'text-cyan-200'}`}>
                {burnout?.burnoutRisk ? 'Extra care recommended' : 'No high-risk signal right now'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{burnout?.suggestion || 'Keep checking in gently.'}</p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Activity summary</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Mood logs</span><span className="text-white">{dashboard?.moodCount ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Journals</span><span className="text-white">{dashboard?.journalCount ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Chats</span><span className="text-white">{dashboard?.chatMessageCount ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Habit logs loaded</span><span className="text-white">{habitLogs.length}</span></div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Correlations</p>
              {correlations.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No reliable correlation data is available yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {correlations.slice(0, 3).map((item) => (
                    <div key={`${item.factor}-${item.effect}`} className="rounded-2xl border border-border bg-white/[0.02] p-3">
                      <p className="text-sm font-semibold text-white">{item.factor} → {item.effect}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.correlationText}</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>

            <GlassPanel className="p-6">
              <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Recent data coverage</span><span className="text-cyan-200">{Math.min(100, checkins.length * 5)}%</span></div>
              <ProgressBar value={Math.min(100, checkins.length * 5)} />
            </GlassPanel>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
