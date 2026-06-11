import { useEffect, useState } from 'react';
import { FigmaGrowthGardenView } from '../../components/figma/garden/FigmaGrowthGardenView.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { gardenService } from '../../services/index.js';

/** Approved Figma Growth Garden + gamification APIs. */
export function GardenPage({ pet, gardenTheme = 'forest', changeTheme }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    gardenService
      .progress()
      .then((data) => {
        if (!cancelled) setProgress(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
  }, [pet?.level]);

  const handleTheme = (theme) => {
    changeTheme?.(theme);
  };

  if (loading) {
    return <LoadingState label="Growing your garden…" />;
  }

  let theme = gardenTheme;
  if (theme === 'cozy_autumn') theme = 'autumn';

  return (
    <FigmaGrowthGardenView
      gardenTheme={theme}
      onThemeChange={handleTheme}
      level={progress?.level ?? pet?.level ?? 8}
      petName={pet?.name || 'Luna'}
      petLevel={pet?.level ?? 12}
    />
  );
}
