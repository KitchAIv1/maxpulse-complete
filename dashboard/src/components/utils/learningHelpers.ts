export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateProgress = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};

export const getBadgeForCompletion = (completedCount: number, totalModules: number, pathBadge: string): string | null => {
  if (completedCount === 4) {
    return 'Communication Expert';
  } else if (completedCount === totalModules) {
    return pathBadge;
  }
  return null;
};

export const shouldShowCelebration = (completedCount: number, totalModules: number): boolean => {
  return completedCount === 4 || completedCount === totalModules;
};