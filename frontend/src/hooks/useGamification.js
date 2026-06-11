import { useCallback, useEffect, useState } from 'react';
import { gardenService } from '../services/index.js';

export function useGamification(refreshKey = 0) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await gardenService.progress();
      setProgress(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const changeTheme = async (theme) => {
    await gardenService.setTheme(theme);
    await load();
  };

  return { progress, loading, reload: load, changeTheme };
}
