import { useEffect, useMemo, useState } from 'react';
import { Check, Flame, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { habitService, gardenService } from '../../services/index.js';

function Notice({ tone = 'success', children }) {
  const classes =
    tone === 'error'
      ? 'border-destructive/25 bg-destructive/10 text-red-300'
      : 'border-primary/20 bg-primary/10 text-cyan-200';
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>{children}</div>;
}

export function HabitsPage({ pet, refreshKey = 0, triggerRefresh }) {
  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState(null);
  const [newHabit, setNewHabit] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');

  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const [habitData, progressData] = await Promise.all([
        habitService.list(),
        gardenService.progress(),
      ]);
      setHabits(habitData || []);
      setProgress(progressData);
    } catch (err) {
      setError(err.message || 'Your habits could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const completed = useMemo(() => habits.filter((habit) => habit.completed).length, [habits]);
  const completion = habits.length ? Math.round((completed / habits.length) * 100) : 0;

  const addHabit = async (event) => {
    event.preventDefault();
    const name = newHabit.trim();
    if (!name) return;
    setSubmitting(true);
    setError('');
    setReaction('');
    try {
      await habitService.create(name);
      setNewHabit('');
      setReaction(`${petName} added “${name}” to your shared rhythm. Start gently when you are ready.`);
      await load({ quiet: true });
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That habit could not be added.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHabit = async (habit) => {
    setBusyId(habit.id);
    setError('');
    setReaction('');
    try {
      const updated = await habitService.toggle(habit.id);
      setHabits((current) =>
        current.map((item) => (item.id === habit.id ? { ...item, ...updated } : item)),
      );
      setReaction(
        updated.completed
          ? `${petName} noticed that step. Your consistency is helping your garden grow.`
          : `${petName} moved it back to today. No pressure, you can return to it when it feels right.`,
      );
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That habit could not be updated.');
    } finally {
      setBusyId(null);
    }
  };

  const removeHabit = async (habit) => {
    setBusyId(habit.id);
    setError('');
    setReaction('');
    try {
      await habitService.remove(habit.id);
      setHabits((current) => current.filter((item) => item.id !== habit.id));
      setReaction(`${petName} cleared “${habit.name}” from your routine. Your plan can change with you.`);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That habit could not be removed.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingState label={`${petName} is gathering today’s habits...`} />;

  return (
    <PageContainer>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Your day with {petName}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Small habits, shared growth</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Choose a few actions that support you today. Progress matters more than perfection.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
          <Flame className="h-3.5 w-3.5" />
          {progress?.currentStreak || 0} day shared streak
        </div>
      </div>

      {error && (
        <Notice tone="error">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={() => load()} className="inline-flex items-center gap-1 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </Notice>
      )}
      {reaction && <Notice>{reaction}</Notice>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <GlassPanel className="p-5 md:p-6">
          <form onSubmit={addHabit} className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row">
            <input
              value={newHabit}
              onChange={(event) => setNewHabit(event.target.value)}
              placeholder="What small step would help today?"
              className="min-h-11 flex-1 rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              maxLength={120}
            />
            <Button type="submit" disabled={submitting || !newHabit.trim()}>
              <Plus className="h-4 w-4" />
              {submitting ? 'Adding...' : 'Add habit'}
            </Button>
          </form>

          <div className="mt-5 space-y-3">
            {habits.length === 0 ? (
              <EmptyState
                icon="✨"
                title="A clear page for today"
                description={`${petName} is ready to support the first small habit you choose.`}
              />
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`group flex items-center gap-3 rounded-2xl border p-3.5 transition-colors ${
                    habit.completed
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-border bg-white/[0.02] hover:border-primary/20'
                  }`}
                >
                  <button
                    type="button"
                    disabled={busyId === habit.id}
                    onClick={() => toggleHabit(habit)}
                    aria-label={habit.completed ? `Mark ${habit.name} incomplete` : `Complete ${habit.name}`}
                    className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border transition-all disabled:opacity-50 ${
                      habit.completed
                        ? 'border-primary/40 bg-primary/20 text-primary'
                        : 'border-border bg-white/5 text-muted-foreground hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${habit.completed ? 'text-white/55 line-through' : 'text-white'}`}>
                      {habit.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {habit.completed ? `${petName} is proud of this step.` : 'Ready when you are.'}
                    </p>
                  </div>
                  {habit.isCustom && (
                    <button
                      type="button"
                      disabled={busyId === habit.id}
                      onClick={() => removeHabit(habit)}
                      aria-label={`Remove ${habit.name}`}
                      className="rounded-lg p-2 text-muted-foreground opacity-100 transition-colors hover:bg-destructive/10 hover:text-red-300 disabled:opacity-50 md:opacity-0 md:group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Today together</p>
            </div>
            <p className="mt-5 text-4xl font-bold text-white">
              {completed}<span className="text-lg text-muted-foreground">/{habits.length}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">habits cared for</p>
            <ProgressBar value={completion} className="mt-5" />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {completion === 100 && habits.length
                ? `${petName} says: “That was enough for today. Let’s enjoy what you accomplished.”`
                : `${petName} says: “One honest step is always worth celebrating.”`}
            </p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{petName} suggests</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Keep today’s list short enough to feel kind. Three meaningful habits can be stronger than ten heavy ones.
            </p>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
