import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Brain, Clock3, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { checkinService, examService, reflectionService } from '../../services/index.js';

function average(items, key) {
  if (!items.length) return 0;
  return Number((items.reduce((sum, item) => sum + Number(item[key] || 0), 0) / items.length).toFixed(1));
}

export function AIReflectionsPage({ pet, refreshKey = 0 }) {
  const [checkins, setCheckins] = useState([]);
  const [exams, setExams] = useState([]);
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const loadContext = async () => {
    setLoading(true);
    setError('');
    try {
      const [checkinData, examData] = await Promise.all([
        checkinService.history(),
        examService.list(),
      ]);
      setCheckins(checkinData || []);
      setExams(examData || []);
    } catch (err) {
      setError(err.message || 'Reflection context could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContext();
    // Reload only when app shell data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const context = useMemo(() => {
    const recent = checkins.slice(-7);
    return {
      checkins: recent.length,
      wellness: Math.round(average(recent, 'wellnessScore')),
      sleep: average(recent, 'sleepHours'),
      stress: average(recent, 'stressLevel'),
      study: exams.reduce((sum, exam) => sum + Number(exam.studyMinutes || 0), 0),
    };
  }, [checkins, exams]);

  const generate = async () => {
    setGenerating(true);
    setError('');
    setReaction('');
    try {
      const data = await reflectionService.weekly();
      setReflection(data?.content || '');
      setReaction(`${petName} gathered your week into a gentler story. Read it slowly.`);
    } catch (err) {
      setError(err.message || 'The weekly reflection could not be generated.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingState label={`${petName} is gathering this week’s context...`} />;

  if (error && !checkins.length && !reflection) {
    return (
      <EmptyState
        icon="!"
        title="Reflection context is unavailable"
        description={error}
        action={<Button onClick={loadContext}><RotateCcw className="h-4 w-4" /> Try again</Button>}
      />
    );
  }

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Weekly reflection with {petName}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Turn the week into something you can hold</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          This is a supportive synthesis, not a diagnosis. It helps you notice patterns and choose one kind next step.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {reaction && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-cyan-200">
          {reaction}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <GlassPanel className="p-5 md:p-6">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">{petName}’s weekly synthesis</p>
          </div>
          <div className="mt-5 rounded-3xl border border-border bg-white/[0.02] p-5">
            {reflection ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-white/80">{reflection}</p>
            ) : (
              <div className="py-10 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-white">Ready when you are</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Generate a reflection when you want {petName} to summarize your recent check-ins, study effort, and care patterns.
                </p>
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={generate} disabled={generating}>
              <Sparkles className="h-4 w-4" />
              {generating ? 'Reflecting...' : reflection ? 'Refresh reflection' : 'Generate reflection'}
            </Button>
            <Button variant="ghost" onClick={loadContext}><RotateCcw className="h-4 w-4" /> Reload context</Button>
          </div>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary">
              <BookOpenText className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Context used</span>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Check-ins</span><span className="text-white">{context.checkins}/7</span></div>
                <ProgressBar value={(context.checkins / 7) * 100} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-border bg-white/[0.02] p-3">
                  <p className="text-muted-foreground">Wellness</p>
                  <p className="mt-1 text-xl font-bold text-white">{context.wellness || 0}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/[0.02] p-3">
                  <p className="text-muted-foreground">Sleep</p>
                  <p className="mt-1 text-xl font-bold text-white">{context.sleep || 0}h</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/[0.02] p-3">
                  <p className="text-muted-foreground">Stress</p>
                  <p className="mt-1 text-xl font-bold text-white">{context.stress || 0}/5</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/[0.02] p-3">
                  <p className="text-muted-foreground">Study</p>
                  <p className="mt-1 text-xl font-bold text-white">{context.study}m</p>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">{petName} reminds you</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              “A reflection is not a grade. It is a way to notice what helped, what hurt, and what we can make smaller next week.”
            </p>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
