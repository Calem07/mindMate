import { useEffect, useMemo, useState } from 'react';
import { Lock, Mail, RotateCcw, Send, Sparkles, Unlock } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { reflectionService } from '../../services/index.js';

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function splitLetter(content = '') {
  if (content.startsWith('[Locked until')) {
    return { title: 'A sealed letter', body: content };
  }
  const [first, ...rest] = content.split('\n\n');
  return {
    title: rest.length ? first : 'A letter from the past',
    body: rest.length ? rest.join('\n\n') : content,
  };
}

export function FutureMePage({ pet, refreshKey = 0, triggerRefresh }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState(tomorrow());
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      setLetters((await reflectionService.letters()) || []);
    } catch (err) {
      setError(err.message || 'Your letters could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Reload only when app shell data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const processed = useMemo(
    () =>
      letters.map((letter, index) => {
        const locked = letter.content?.startsWith('[Locked until') || new Date(`${letter.unlockDate}T00:00:00`) > new Date();
        const parsed = splitLetter(letter.content);
        return { ...letter, ...parsed, locked, index };
      }),
    [letters],
  );
  const locked = processed.filter((letter) => letter.locked);
  const unlocked = processed.filter((letter) => !letter.locked);

  const generate = async () => {
    setGenerating(true);
    setError('');
    setReaction('');
    try {
      const data = await reflectionService.futureMe();
      setTitle(`A note from ${petName} and me`);
      setContent(data?.content || '');
      setReaction(`${petName} drafted a starting point. Edit it until it sounds like you.`);
    } catch (err) {
      setError(err.message || 'AI assistance could not generate a letter.');
    } finally {
      setGenerating(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim() || !unlockDate) return;
    setSaving(true);
    setError('');
    setReaction('');
    try {
      await reflectionService.writeLetter(`${title.trim()}\n\n${content.trim()}`, unlockDate);
      setTitle('');
      setContent('');
      setUnlockDate(tomorrow());
      setReaction(`${petName} sealed this letter safely. Future you will meet it when the time is right.`);
      await load({ quiet: true });
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'Your future letter could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label={`${petName} is opening the time-capsule shelf...`} />;

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Future Me with {petName}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Send care forward</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Write a letter for a later version of you. Locked letters stay sealed until their unlock date.
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
      {reaction && <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-cyan-200">{reaction}</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GlassPanel as="form" onSubmit={save} className="space-y-5 p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Mail className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Write a letter</p>
            </div>
            <Button type="button" variant="secondary" onClick={generate} disabled={generating}>
              <Sparkles className="h-4 w-4" />
              {generating ? 'Drafting...' : 'AI assist'}
            </Button>
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A title future you will recognize"
            required
            className="min-h-11 w-full rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none focus:border-primary/60"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Dear future me..."
            required
            className="min-h-[300px] w-full resize-y rounded-2xl border border-border bg-input-background p-4 text-sm leading-7 text-white/85 outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Unlock date</span>
            <input
              type="date"
              value={unlockDate}
              min={tomorrow()}
              onChange={(event) => setUnlockDate(event.target.value)}
              required
              className="min-h-11 w-full rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none focus:border-primary/60"
            />
          </label>
          <Button type="submit" disabled={saving || !title.trim() || !content.trim()}>
            <Send className="h-4 w-4" />
            {saving ? 'Sealing...' : 'Seal letter'}
          </Button>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{petName} guards</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-white/[0.02] p-4">
                <Lock className="h-4 w-4 text-primary" />
                <p className="mt-3 text-2xl font-bold text-white">{locked.length}</p>
                <p className="text-xs text-muted-foreground">sealed</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/[0.02] p-4">
                <Unlock className="h-4 w-4 text-primary" />
                <p className="mt-3 text-2xl font-bold text-white">{unlocked.length}</p>
                <p className="text-xs text-muted-foreground">open</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              “I’ll keep these safe. You do not have to become someone perfect to deserve kindness from your past self.”
            </p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <p className="text-sm font-semibold text-white">Letter shelf</p>
            <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto custom-scrollbar">
              {processed.length === 0 ? (
                <EmptyState icon="✉" title="No letters sealed yet" description="A small note to future you can start the shelf." />
              ) : (
                processed.map((letter) => (
                  <button
                    type="button"
                    key={`${letter.unlockDate}-${letter.index}`}
                    onClick={() => !letter.locked && setSelected(letter)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      letter.locked
                        ? 'border-border bg-white/[0.02] opacity-70'
                        : 'border-primary/20 bg-primary/5 hover:border-primary/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {letter.locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Unlock className="h-4 w-4 text-primary" />}
                        <span className="text-sm font-semibold text-white">{letter.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{letter.unlockDate}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {letter.locked ? 'This letter is still sealed.' : letter.body}
                    </p>
                  </button>
                ))
              )}
            </div>
          </GlassPanel>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <GlassPanel className="max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary">Opened letter</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{selected.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Unlocked {selected.unlockDate}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/80">{selected.body}</p>
          </GlassPanel>
        </div>
      )}
    </PageContainer>
  );
}
