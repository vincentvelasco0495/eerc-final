export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function getCompletionState(completed, total) {
  if (!total) return 0;

  return Math.min(100, (completed / total) * 100);
}

export function shuffleList(items = []) {
  const list = [...items];

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }

  return list;
}

export function getBadgeTone(badge) {
  if (badge === 'Top 10') return 'warning';
  if (badge === 'Most Improved') return 'success';

  return 'info';
}

export function createTodayLabel() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
