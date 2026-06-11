import { useEffect, useState } from 'react';
import { FigmaCompanionView } from '../../components/figma/companion/FigmaCompanionView.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { companionService } from '../../services/index.js';

/**
 * Approved Figma AI Companion screen + live chat API.
 * Visual layout is FigmaCompanionView — do not restyle here.
 */
export function CompanionPage({ pet, refreshKey = 0, triggerRefresh }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    companionService
      .history()
      .then((data) => {
        if (!cancelled) setHistory(data || []);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
  }, [refreshKey]);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    const userMsg = {
      sender: 'STUDENT',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => [...prev, userMsg]);
    try {
      const data = await companionService.chat(text.trim());
      setHistory((prev) => [
        ...prev,
        {
          sender: 'MINDMATE',
          content: data.reply,
          createdAt: new Date().toISOString(),
          crisisDetected: data.crisisDetected,
        },
      ]);
      triggerRefresh?.();
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        {
          sender: 'MINDMATE',
          content: 'I had trouble connecting — can we try again in a moment?',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  if (loading) {
    return <LoadingState label={`Connecting with ${pet?.name || 'Luna'}…`} />;
  }

  return (
    <FigmaCompanionView
      petName={pet?.name || 'Luna'}
      level={pet?.level ?? 12}
      bondPct={pet?.petXp ? Math.round(((pet.petXp % 250) / 250) * 100) : 82}
      messages={history}
      onSendMessage={sendMessage}
    />
  );
}
