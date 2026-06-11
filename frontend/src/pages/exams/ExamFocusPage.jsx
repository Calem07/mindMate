import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, GraduationCap, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { examService } from '../../services/index.js';

function daysUntil(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

export function ExamFocusPage({ pet, refreshKey = 0, triggerRefresh }) {
  const [exams, setExams] = useState([]);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reaction, setReaction] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const data = (await examService.list()) || [];
      setExams(data);
      setSelectedId((current) => current || String(data[0]?.id || ''));
    } catch (err) {
      setError(err.message || 'Your exam plan could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const totalMinutes = useMemo(() => exams.reduce((sum, exam) => sum + exam.studyMinutes, 0), [exams]);
  const selectedExam = exams.find((exam) => String(exam.id) === String(selectedId));

  const addExam = async (event) => {
    event.preventDefault();
    if (!subject.trim() || !examDate) return;
    setSaving(true);
    setError('');
    setReaction('');
    try {
      const created = await examService.create({
        subject: subject.trim(),
        examDate: new Date(`${examDate}T12:00:00`).toISOString(),
        studyMinutes: 0,
      });
      setExams((current) => [created, ...current]);
      setSelectedId(String(created.id));
      setSubject('');
      setExamDate('');
      setReaction(`${petName} added ${created.subject} to your shared plan. We only need to take it one session at a time.`);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That exam could not be added.');
    } finally {
      setSaving(false);
    }
  };

  const logStudy = async (minutes) => {
    if (!selectedExam) return;
    setBusy(true);
    setError('');
    setReaction('');
    try {
      const updated = await examService.study(selectedExam.id, minutes);
      setExams((current) => current.map((exam) => (exam.id === updated.id ? updated : exam)));
      setReaction(`${petName} stayed with you for ${minutes} focused minutes. That effort is enough to celebrate.`);
      triggerRefresh?.();
    } catch (err) {
      setError(err.message || 'That study session could not be logged.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingState label={`${petName} is arranging your study plan...`} />;

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Prepare with {petName}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Exam focus without the pressure spiral</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Keep the next session small and visible. Preparation grows one calm block at a time.
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <GlassPanel as="form" onSubmit={addExam} className="p-5 md:p-6">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Add to the plan</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto]">
              <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject or exam name" required className="min-h-11 rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none focus:border-primary/60" />
              <input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} required className="min-h-11 rounded-xl border border-border bg-input-background px-4 text-sm text-white outline-none focus:border-primary/60" />
              <Button type="submit" disabled={saving || !subject.trim() || !examDate}><Plus className="h-4 w-4" /> {saving ? 'Adding...' : 'Add'}</Button>
            </div>
          </GlassPanel>

          {exams.length === 0 ? (
            <EmptyState icon="📚" title="No exams in your plan" description={`${petName} can help you turn the next exam into a few manageable sessions.`} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {exams.map((exam) => {
                const days = daysUntil(exam.examDate);
                const pct = Math.min(100, Math.round(exam.studyMinutes / 3));
                return (
                  <button type="button" key={exam.id} onClick={() => setSelectedId(String(exam.id))} className="text-left">
                    <GlassPanel className={`h-full p-5 transition-colors ${String(exam.id) === String(selectedId) ? 'border-primary/35 bg-primary/5' : 'hover:border-primary/20'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-white">{exam.subject}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(exam.examDate).toLocaleDateString()}</p>
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                          {days < 0 ? 'Completed date' : days === 0 ? 'Today' : `${days} days`}
                        </span>
                      </div>
                      <div className="mt-5 flex justify-between text-xs"><span className="text-muted-foreground">Preparation time</span><span className="font-semibold text-white">{exam.studyMinutes} min</span></div>
                      <ProgressBar value={pct} className="mt-2" />
                    </GlassPanel>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary"><GraduationCap className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">{petName}’s focus plan</span></div>
            {selectedExam ? (
              <>
                <h3 className="mt-5 text-lg font-semibold text-white">{selectedExam.subject}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Choose a session that feels possible right now. You can stop after it.</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button disabled={busy} onClick={() => logStudy(25)}><Clock3 className="h-4 w-4" /> 25 min</Button>
                  <Button variant="secondary" disabled={busy} onClick={() => logStudy(50)}><Clock3 className="h-4 w-4" /> 50 min</Button>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Add or select an exam to begin a focus session.</p>
            )}
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Shared effort</span></div>
            <p className="mt-5 text-4xl font-bold text-white">{totalMinutes}</p>
            <p className="mt-1 text-sm text-muted-foreground">minutes prepared together</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">“I see the time you are giving this. Rest is part of the plan too.”</p>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
