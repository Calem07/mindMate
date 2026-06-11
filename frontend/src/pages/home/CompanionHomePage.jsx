import { useEffect, useMemo, useState } from 'react';
import { DashboardView } from '../../components/figma/dashboard/DashboardView.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { gardenService, checkinService } from '../../services/index.js';
import { getSession } from '../../lib/auth.js';

/** Approved Figma Dashboard — API-wired wrapper only (no layout changes). */
export function CompanionHomePage({ companion, refreshKey = 0 }) {
  const [progress, setProgress] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { name: userName } = getSession();
  const petName = companion?.name || companion?.petName || 'Luna';
  const level = companion?.level ?? progress?.level ?? 12;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([gardenService.progress(), checkinService.history()])
      .then(([prog, history]) => {
        if (cancelled) return;
        setProgress(prog);
        setCheckins(history || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const bondPct = useMemo(() => {
    if (companion?.petXp) {
      const mod = companion.petXp % 250;
      return Math.round((mod / 250) * 100) || 82;
    }
    if (progress?.xp) {
      return Math.min(100, Math.round((progress.xp % 1000) / 10));
    }
    return 82;
  }, [companion?.petXp, progress?.xp]);

  const insight =
    companion?.insight ||
    'I am here with you today. Every small step we take together builds lasting confidence.';

  if (loading) return <LoadingState label={`${petName} is getting ready…`} />;

  if (error) {
    return (
      <EmptyState
        title="Could not reach your companion"
        description={error}
        action={<Button onClick={() => window.location.reload()}>Try again</Button>}
      />
    );
  }

  void checkins;

  return (
    <DashboardView
      userName={userName || 'friend'}
      petName={petName}
      level={level}
      bondPct={bondPct}
      insight={insight}
    />
  );
}
