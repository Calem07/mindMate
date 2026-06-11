import { useEffect, useMemo, useState } from 'react';
import { Check, Pencil, Plus, RotateCcw, Target, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { goalService } from '../../services/index.js';

const today = () => new Date().toISOString().slice(0, 10);
const emptyGoal = () => ({
  id: null,
  title: '',
  category: 'Growth',
  targetDate: today(),
  progressPercent: 0,
  completed: false,
});

export function GoalsPage({ pet, refreshKey = 0, triggerRefresh }) {
  const [goals, setGoals] = useState([]);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      setGoals((await goalService.list()) || []);
    } catch (err) {
      setError(err.message || 'Your goals could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const overall = useMemo(
    () => (goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progressPercent, 0) / goals.length) : 0),
    [goals],
  );
  const completed = goals.filter((goal) => goal.completed || goal.progressPercent === 100).length;

  const save = async (event) => {
    event.preventDefault();
    if (!draft?.title.trim()) return;
    setSaving(true);
    setError('');
    setReaction('');
    const body = {
      category: draft.category,
      title: draft.title.trim(),
      targetDate: draft.targetDate,
      progressPercent: Number(draft.progressPercent),
      completed: Number(draft.progressPercent) === 100 || draft.completed,
    };
    try {
      const saved = draft.id ? await goalService.update(draft.id, body) : await goalService.create(body);
      setGoals((current) =>
        draft.id ? current.map((goal) => (goal.id === saved.id ? saved : goal)) : [saved, ...current],
      );
      setReaction(
        draft.id
          ? `${petName} noticed your progress. The direction can change, and the effort still counts.`
          : `${petName} is excited to grow toward “${saved.title}” with you.`,
      );
      setDraft(null);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That goal could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const completeGoal = async (goal) => {
    setBusyId(goal.id);
    setError('');
    setReaction('');
    try {
      const completedGoal = await goalService.update(goal.id, {
        category: goal.category,
        title: goal.title,
        targetDate: goal.targetDate,
        progressPercent: 100,
        completed: true,
      });
      setGoals((current) => current.map((item) => (item.id === goal.id ? completedGoal : item)));
      setReaction(`${petName} is celebrating this milestone with you. You stayed with something meaningful.`);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That goal could not be completed.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (goal) => {
    setBusyId(goal.id);
    setError('');
    setReaction('');
    try {
      await goalService.remove(goal.id);
      setGoals((current) => current.filter((item) => item.id !== goal.id));
      setReaction(`${petName} cleared that goal without judgment. Letting go can also be growth.`);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That goal could not be removed.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingState label={`${petName} is gathering the paths you care about...`} />;

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Grow with {petName}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Meaningful directions, one step at a time</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Goals are allowed to evolve. Track the progress that feels useful, not perfect.
          </p>
        </div>
        <Button onClick={() => setDraft(emptyGoal())}>
          <Plus className="h-4 w-4" /> Add a goal
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-red-300">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={() => load()} className="inline-flex items-center gap-1 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </div>
      )}
      {reaction && <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-cyan-200">{reaction}</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          {goals.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState
                icon="✦"
                title="No goal needs your attention yet"
                description={`${petName} can help you hold one meaningful direction when you are ready.`}
                action={<Button onClick={() => setDraft(emptyGoal())}>Choose a direction</Button>}
              />
            </div>
          ) : (
            goals.map((goal) => {
              const done = goal.completed || goal.progressPercent === 100;
              return (
                <GlassPanel key={goal.id} className="flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                        {goal.category}
                      </span>
                      <h3 className={`mt-3 text-lg font-semibold ${done ? 'text-white/55 line-through' : 'text-white'}`}>
                        {goal.title}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setDraft({ ...goal })} className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" disabled={busyId === goal.id} onClick={() => remove(goal)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-red-300 disabled:opacity-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-muted-foreground">Shared progress</span>
                      <span className="font-semibold text-cyan-200">{goal.progressPercent}%</span>
                    </div>
                    <ProgressBar value={goal.progressPercent} />
                    <p className="mt-3 text-xs text-muted-foreground">
                      {goal.targetDate ? `Aiming gently for ${new Date(`${goal.targetDate}T00:00:00`).toLocaleDateString()}` : 'No target date'}
                    </p>
                  </div>
                  {!done && (
                    <Button variant="secondary" className="mt-5 w-full" disabled={busyId === goal.id} onClick={() => completeGoal(goal)}>
                      <Check className="h-4 w-4" /> Mark milestone reached
                    </Button>
                  )}
                </GlassPanel>
              );
            })
          )}
        </div>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary"><Target className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Your direction</span></div>
            <p className="mt-5 text-4xl font-bold text-white">{overall}%</p>
            <p className="mt-1 text-sm text-muted-foreground">average progress across your goals</p>
            <ProgressBar value={overall} className="mt-5" />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{completed} milestone{completed === 1 ? '' : 's'} reached. {petName} is noticing the effort between them too.</p>
          </GlassPanel>
          <GlassPanel className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{petName} says</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">“We can make the next step smaller whenever the path feels heavy.”</p>
          </GlassPanel>
        </div>
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <GlassPanel as="form" onSubmit={save} className="w-full max-w-lg p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{draft.id ? 'Adjust this direction' : 'Choose a direction'}</h3>
              <button type="button" onClick={() => setDraft(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <input required value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="What matters to you?" className="min-h-11 w-full rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none focus:border-primary/60" />
              <select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className="min-h-11 w-full rounded-xl border border-border bg-popover px-4 text-sm text-white outline-none focus:border-primary/60">
                {['Growth', 'Academic', 'Career', 'Fitness', 'Dream'].map((category) => <option key={category}>{category}</option>)}
              </select>
              <input type="date" value={draft.targetDate} onChange={(event) => setDraft((current) => ({ ...current, targetDate: event.target.value }))} className="min-h-11 w-full rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none focus:border-primary/60" />
              <label className="block">
                <span className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{draft.progressPercent}%</span></span>
                <input type="range" min="0" max="100" step="5" value={draft.progressPercent} onChange={(event) => setDraft((current) => ({ ...current, progressPercent: Number(event.target.value) }))} className="w-full" />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
              <Button type="submit" disabled={saving || !draft.title.trim()}>{saving ? 'Saving...' : 'Save goal'}</Button>
            </div>
          </GlassPanel>
        </div>
      )}
    </PageContainer>
  );
}
