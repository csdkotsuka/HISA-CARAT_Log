import type { DailyLog } from '../types';
import type { AvatarStyle } from './storage';

export interface StreakInfo {
  currentStreak: number;
  activeDaysLastWeek: number;
  unlockedStyles: AvatarStyle[];
  activeStyle: AvatarStyle;
  nextMilestone: number;
  progressPercent: number;
  badgeLabel: string;
  cheerMessage: string;
}

export const calculateStreakInfo = (
  logs: DailyLog[],
  userSelectedStyle: AvatarStyle | null
): StreakInfo => {
  if (!logs || logs.length === 0) {
    return {
      currentStreak: 0,
      activeDaysLastWeek: 0,
      unlockedStyles: ['dot'],
      activeStyle: userSelectedStyle || 'dot',
      nextMilestone: 3,
      progressPercent: 10,
      badgeLabel: 'Level 1: はじめの一歩 🪽',
      cheerMessage: 'セルフケアを始めてハニを進化させよう！👼',
    };
  }

  // Get unique log dates with active care (>= 2 exercises or logged)
  const activeDates = new Set(
    logs
      .filter((l) => {
        const count = Object.values(l.exercises || {}).filter(Boolean).length;
        return count >= 1 || l.painVas !== undefined;
      })
      .map((l) => l.date)
  );

  // Check last 7 days activity
  const today = new Date();
  let daysInLastWeek = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (activeDates.has(dateStr)) {
      daysInLastWeek++;
    }
  }

  // Calculate consecutive streak back from today or yesterday
  let streak = 0;
  const checkDate = new Date(today);
  const todayStr = checkDate.toISOString().slice(0, 10);

  // If today is not logged, check if yesterday was logged
  if (!activeDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().slice(0, 10);
    if (activeDates.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Determine unlocked avatar styles
  const unlockedStyles: AvatarStyle[] = ['dot'];
  if (streak >= 3 || daysInLastWeek >= 3) {
    unlockedStyles.push('illust');
  }
  if (streak >= 7 || daysInLastWeek >= 5) {
    unlockedStyles.push('photo');
  }

  // Active avatar: user preferred (if unlocked), else default to 'dot' (so user sees their starting dot-art)
  let activeStyle: AvatarStyle = 'dot';
  if (userSelectedStyle && unlockedStyles.includes(userSelectedStyle)) {
    activeStyle = userSelectedStyle;
  }

  let nextMilestone = 3;
  let progressPercent = 30;
  let badgeLabel = 'Level 1: ぽこぽこドット絵ハニ 👾';
  let cheerMessage = 'あと少しで水彩イラストハニがアンロック！🌸';

  if (unlockedStyles.includes('photo')) {
    nextMilestone = 7;
    progressPercent = 100;
    badgeLabel = 'Level 3: リアルハニ完全体 📸💎✨';
    cheerMessage = 'パーフェクト達成！本物のキラキラハニと一緒だよ🥰';
  } else if (unlockedStyles.includes('illust')) {
    nextMilestone = 7;
    progressPercent = Math.min(90, Math.round((streak / 7) * 100));
    badgeLabel = 'Level 2: やわらか水彩イラスト 🎨';
    cheerMessage = `連続${streak}日達成中！あと${Math.max(1, 7 - streak)}日でリアル写真アンロック📸✨`;
  } else {
    progressPercent = Math.min(65, Math.round((streak / 3) * 100));
  }

  return {
    currentStreak: streak,
    activeDaysLastWeek: daysInLastWeek,
    unlockedStyles,
    activeStyle,
    nextMilestone,
    progressPercent,
    badgeLabel,
    cheerMessage,
  };
};

export const getAvatarImagePath = (style: AvatarStyle): string => {
  switch (style) {
    case 'dot':
      return '/jeonghan_dot.jpg';
    case 'illust':
      return '/jeonghan_avatar.jpg';
    case 'photo':
      return '/jeonghan_photo.jpg';
  }
};
