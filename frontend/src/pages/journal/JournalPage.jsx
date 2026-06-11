import { useEffect, useState } from 'react';
import { BookOpen, Plus, RotateCcw, Save, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { journalService } from '../../services/index.js';

const blankEntry = { id: null, title: '', content: '' };

function Notice({ error = false, children }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${
      error ? 'border-destructive/25 bg-destructive/10 text-red-300' : 'border-primary/20 bg-primary/10 text-cyan-200'
    }`}>
      {children}
    </div>
  );
}

export function JournalPage({ pet, refreshKey = 0, triggerRefresh }) {
  const [entries, setEntries] = useState([]);
  const [active, setActive] = useState(blankEntry);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const selectEntry = (entry) => setActive({ ...entry });

  const load = async ({ keepSelection = true, quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const data = (await journalService.list()) || [];
      setEntries(data);
      if (keepSelection && active.id) {
        const refreshed = data.find((entry) => entry.id === active.id);
        setActive(refreshed ? { ...refreshed } : blankEntry);
      } else if (!keepSelection && data[0]) {
        setActive({ ...data[0] });
      }
    } catch (err) {
      setError(err.message || 'Your journal could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load({ keepSelection: false });
    // Reload only when the shell signals that companion-linked data changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const save = async (event) => {
    event.preventDefault();
    if (!active.title.trim() || !active.content.trim()) return;
    setSaving(true);
    setError('');
    setReaction('');
    try {
      const saved = active.id
        ? await journalService.update(active.id, { title: active.title, content: active.content })
        : await journalService.create({ title: active.title, content: active.content });
      setActive({ ...saved });
      setReaction(`${petName} read your reflection and found a few gentle patterns to share.`);
      await load({ quiet: true });
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'Your reflection could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!active.id) return;
    setDeleting(true);
    setError('');
    setReaction('');
    try {
      await journalService.remove(active.id);
      setEntries((current) => current.filter((entry) => entry.id !== active.id));
      setActive(blankEntry);
      setReaction(`${petName} let that page go with you. You can begin again whenever you need.`);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That entry could not be removed.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState label={`${petName} is opening your private journal...`} />;

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Reflect with {petName}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">A quiet place for what is real</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Write freely. After saving, {petName} can offer a gentle summary without judging your experience.
        </p>
      </div>

      {error && (
        <Notice error>
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={() => load()} className="inline-flex items-center gap-1 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </Notice>
      )}
      {reaction && <Notice>{reaction}</Notice>}

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <GlassPanel className="flex min-h-[620px] flex-col p-4">
          <Button
            className="w-full"
            onClick={() => {
              setActive(blankEntry);
              setReaction('');
            }}
          >
            <Plus className="h-4 w-4" /> New reflection
          </Button>

          <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {entries.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  icon="📖"
                  title="Your first page is waiting"
                  description={`${petName} will be here when you are ready to write.`}
                />
              </div>
            ) : (
              entries.map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  onClick={() => selectEntry(entry)}
                  className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                    active.id === entry.id
                      ? 'border-primary/30 bg-primary/10'
                      : 'border-border bg-white/[0.02] hover:border-primary/20'
                  }`}
                >
                  <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                    {entry.emotion ? ` · ${entry.emotion.toLowerCase()}` : ''}
                  </p>
                </button>
              ))
            )}
          </div>

          <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
            Your journal is personal. AI enrichment runs only after you choose to save.
          </p>
        </GlassPanel>

        <form onSubmit={save} className="space-y-5">
          <GlassPanel className="p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {active.id ? 'Your reflection' : 'A new page'}
                </span>
              </div>
              {active.id && (
                <button
                  type="button"
                  onClick={remove}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {deleting ? 'Removing...' : 'Remove'}
                </button>
              )}
            </div>

            <input
              value={active.title}
              onChange={(event) => setActive((current) => ({ ...current, title: event.target.value }))}
              placeholder="Give this moment a title"
              maxLength={180}
              className="w-full border-0 bg-transparent text-2xl font-bold tracking-tight text-white outline-none placeholder:text-white/25"
              required
            />
            <textarea
              value={active.content}
              onChange={(event) => setActive((current) => ({ ...current, content: event.target.value }))}
              placeholder="What has been on your mind?"
              className="mt-5 min-h-[300px] w-full resize-y rounded-2xl border border-border bg-input-background p-4 text-sm leading-7 text-white/85 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              required
            />
            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={saving || !active.title.trim() || !active.content.trim()}>
                <Save className="h-4 w-4" />
                {saving ? `${petName} is reflecting...` : 'Save reflection'}
              </Button>
            </div>
          </GlassPanel>

          {active.id && (active.summary || active.keyConcerns || active.emotion) && (
            <GlassPanel className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">{petName} noticed</p>
              </div>
              {active.emotion && (
                <span className="mt-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Emotional tone: {active.emotion.toLowerCase()}
                </span>
              )}
              {active.summary && <p className="mt-4 text-sm leading-relaxed text-white/80">{active.summary}</p>}
              {active.keyConcerns && (
                <div className="mt-4 rounded-2xl border border-border bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Worth holding gently</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{active.keyConcerns}</p>
                </div>
              )}
            </GlassPanel>
          )}
        </form>
      </div>
    </PageContainer>
  );
}
