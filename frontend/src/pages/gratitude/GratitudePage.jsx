import { useEffect, useState } from 'react';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { gratitudeService } from '../../services/index.js';

const initialForm = { happyMoment: '', gratefulFor: '', proudAchievement: '' };

export function GratitudePage({ pet, refreshKey = 0, triggerRefresh }) {
  const [form, setForm] = useState(initialForm);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      setHistory((await gratitudeService.history()) || []);
    } catch (err) {
      setError(err.message || 'Your gratitude memories could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setReaction('');
    try {
      await gratitudeService.create(form);
      setForm(initialForm);
      setReaction(`${petName} is holding onto this bright moment with you. Thank you for sharing it.`);
      await load({ quiet: true });
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'Your gratitude entry could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label={`${petName} is gathering your bright moments...`} />;

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">A gentle pause with {petName}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Notice what felt meaningful</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          There is no perfect answer. A tiny moment can be enough to keep.
        </p>
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
      {reaction && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-cyan-200">
          {reaction}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <GlassPanel as="form" onSubmit={save} className="space-y-5 p-5 md:p-6">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Today’s reflection</p>
          </div>

          {[
            ['happyMoment', 'A moment that made you feel lighter', 'Maybe a message, a laugh, fresh air, or a quiet minute...'],
            ['gratefulFor', 'Something you are grateful for', 'A person, a place, an opportunity, or something simple...'],
            ['proudAchievement', 'Something you are proud of', 'Effort counts, even when nobody else saw it...'],
          ].map(([key, label, placeholder]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-medium text-white">{label}</span>
              <textarea
                value={form[key]}
                onChange={(event) => update(key, event.target.value)}
                placeholder={placeholder}
                required
                className="min-h-24 w-full resize-y rounded-2xl border border-border bg-input-background p-4 text-sm leading-relaxed text-white/85 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
            </label>
          ))}

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={saving || Object.values(form).some((value) => !value.trim())}
          >
            <Sparkles className="h-4 w-4" />
            {saving ? `${petName} is saving this...` : 'Keep this moment'}
          </Button>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">A note from {petName}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              “Gratitude does not mean every day was easy. It simply helps us notice what supported you inside it.”
            </p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Moments you kept</p>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                {history.length}
              </span>
            </div>
            <div className="mt-4 max-h-[430px] space-y-3 overflow-y-auto custom-scrollbar">
              {history.length === 0 ? (
                <EmptyState
                  icon="✦"
                  title="No memories saved yet"
                  description="Your first small bright moment can begin this collection."
                />
              ) : (
                history.slice(0, 8).map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-border bg-white/[0.02] p-4">
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{entry.gratefulFor}</p>
                  </div>
                ))
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
