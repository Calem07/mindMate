export function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(checkins) {
  if (!checkins?.length) return 0;

  const dates = Array.from(
    new Set(
      checkins.map((c) => {
        const d = new Date(c.createdAt);
        return getLocalDateString(d);
      }),
    ),
  ).sort((a, b) => new Date(b) - new Date(a));

  if (!dates.length) return 0;

  const todayStr = getLocalDateString(new Date());
  const yesterdayStr = getLocalDateString(new Date(Date.now() - 86400000));

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0;

  let streakCount = 0;
  const currentDate = new Date(dates[0]);

  for (let i = 0; i < dates.length; i++) {
    const expectedStr = getLocalDateString(currentDate);
    if (dates[i] === expectedStr) {
      streakCount += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streakCount;
}

export function calculateWellnessScore(
  mood,
  stressLevel,
  energyLevel,
  sleepHours,
  sleepQuality,
  socialInteraction,
) {
  let moodVal = 60;
  switch (mood?.toUpperCase()) {
    case 'EXCELLENT':
      moodVal = 100;
      break;
    case 'GOOD':
      moodVal = 80;
      break;
    case 'NEUTRAL':
      moodVal = 60;
      break;
    case 'STRESSED':
      moodVal = 40;
      break;
    case 'SAD':
      moodVal = 20;
      break;
    default:
      break;
  }

  const stressFactor = (6 - stressLevel) * 20;
  const energyFactor = energyLevel * 20;
  const sleepFactor = Math.min(sleepHours * 12.5, 100);
  const qualityFactor = sleepQuality * 20;
  const socialFactor = socialInteraction * 20;

  const score = Math.round(
    (moodVal + stressFactor + energyFactor + sleepFactor + qualityFactor + socialFactor) / 6,
  );
  return Math.max(0, Math.min(100, score));
}
