import { useEffect, useMemo, useState } from 'react';
import { Award, Lock, RotateCcw, Sparkles, Target, Trophy } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { GlassPanel } from '../../components/ui/GlassPanel.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { PageContainer } from '../../components/ui/PageContainer.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { badgeService, gardenService } from '../../services/index.js';

export function BadgesChallengesPage({ pet, refreshKey = 0 }) {
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState(null);
  const [tab, setTab] = useState('badges');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const petName = pet?.name || pet?.petName || 'Luna';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [badgeData, challengeData, progressData] = await Promise.all([
        badgeService.list(),
        badgeService.challenges(),
        gardenService.progress(),
      ]);
      setBadges(badgeData || []);
      setChallenges(challengeData || []);
      setProgress(progressData);
    } catch (err) {
      setError(err.message || 'Your milestones could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const earned = useMemo(() => badges.filter((badge) => badge.earned), [badges]);
  const badgePct = badges.length ? Math.round((earned.length / badges.length) * 100) : 0;
  const completedChallenges = challenges.filter((challenge) => challenge.completed).length;

  if (loading) return <LoadingState label={`${petName} is gathering the moments you have grown through...`} />;

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Milestones with {petName}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Proof of the effort behind your growth</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Badges celebrate what already happened. Challenges gently point toward what you can try next.
          </p>
        </div>
        <div className="flex rounded-2xl border border-border bg-white/[0.02] p-1">
          {[
            ['badges', 'Badges'],
            ['challenges', 'Challenges'],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              onClick={() => setTab(value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                tab === value ? 'bg-primary/15 text-cyan-200' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-red-300">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={load} className="inline-flex items-center gap-1 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </div>
      )}

      {earned.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-cyan-200">
          {petName} is proud of the {earned.length} milestone{earned.length === 1 ? '' : 's'} you have earned. Each one remembers real effort.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {tab === 'badges' && (
            badges.length === 0 ? (
              <EmptyState icon="🏆" title="Your milestone shelf is ready" description="As you care for yourself and your goals, earned badges will appear here." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <GlassPanel key={badge.badgeName} className={`flex min-h-52 flex-col p-5 ${badge.earned ? 'border-primary/25' : 'opacity-60'}`}>
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${badge.earned ? 'border-primary/30 bg-primary/15 text-primary' : 'border-border bg-white/5 text-muted-foreground'}`}>
                      {badge.earned ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{badge.rarity || 'Milestone'}</p>
                    <h3 className="mt-2 text-base font-semibold text-white">{badge.badgeName}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{badge.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                      <span className="text-cyan-200">+{badge.xpReward} XP</span>
                      <span className="text-muted-foreground">{badge.earned ? 'Earned' : 'Still growing'}</span>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            )
          )}

          {tab === 'challenges' && (
            challenges.length === 0 ? (
              <EmptyState icon="✦" title="No active challenges right now" description={`${petName} will let you know when a new shared challenge is ready.`} />
            ) : (
              <div className="space-y-4">
                {challenges.map((challenge) => {
                  const pct = challenge.target ? Math.min(100, Math.round((challenge.progress / challenge.target) * 100)) : 0;
                  return (
                    <GlassPanel key={challenge.id} className="p-5 md:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{challenge.challengeType}</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">{challenge.challengeName}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {challenge.completed ? `${petName} says: “We did this together.”` : `${petName} will notice every step, not only the finish.`}
                          </p>
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-cyan-200">+{challenge.rewardXp} XP</span>
                      </div>
                      <div className="mt-5 flex justify-between text-xs"><span className="text-muted-foreground">Shared progress</span><span className="font-semibold text-white">{challenge.progress}/{challenge.target}</span></div>
                      <ProgressBar value={pct} className="mt-2" />
                    </GlassPanel>
                  );
                })}
              </div>
            )
          )}
        </div>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary"><Award className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Milestone shelf</span></div>
            <p className="mt-5 text-4xl font-bold text-white">{earned.length}<span className="text-lg text-muted-foreground">/{badges.length}</span></p>
            <p className="mt-1 text-sm text-muted-foreground">badges earned</p>
            <ProgressBar value={badgePct} className="mt-5" />
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 text-primary"><Target className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Active growth</span></div>
            <p className="mt-5 text-4xl font-bold text-white">{completedChallenges}<span className="text-lg text-muted-foreground">/{challenges.length}</span></p>
            <p className="mt-1 text-sm text-muted-foreground">challenges completed</p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">{petName} says</span></div>
            <p className="mt-3 text-sm leading-relaxed text-white/75">“Your level {progress?.level || 1} shows time and care. It does not measure your worth.”</p>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => setTab(tab === 'badges' ? 'challenges' : 'badges')}>
              View {tab === 'badges' ? 'challenges' : 'badges'}
            </Button>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
