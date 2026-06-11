import { useCallback, useEffect, useState } from 'react';
import { companionService } from '../services/index.js';

export function useCompanion(refreshKey = 0) {
  const [companion, setCompanion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companionService.get();
      if (data?.hasSelectedCompanion) {
        setCompanion(data);
        localStorage.setItem('user_pet', JSON.stringify(data));
      } else {
        setCompanion(null);
        localStorage.removeItem('user_pet');
      }
    } catch (e) {
      setError(e.message);
      const saved = localStorage.getItem('user_pet');
      if (saved) {
        try {
          setCompanion(JSON.parse(saved));
        } catch {
          /* ignore */
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { companion, loading, error, reload: load };
}
