import type { Criterion, DecisionDraft } from '../types/decision';

export interface ResultScore {
  id: string;
  name: string;
  score: number;
}

export const calculateResults = (
  draft: DecisionDraft,
  criteria: Criterion[] = draft.criteria,
): ResultScore[] => draft.alternatives
  .map((alternative) => ({
    id: alternative.id,
    name: alternative.name,
    score: criteria.reduce(
      (total, criterion) => total + ((draft.scores[criterion.id]?.[alternative.id] ?? 3) * criterion.weight) / 100,
      0,
    ),
  }))
  .sort((first, second) => second.score - first.score);

export const distributeWeight = (criteria: Criterion[], targetId: string, targetWeight: number) => {
  const safeWeight = Math.max(0, Math.min(100, Math.round(targetWeight)));
  const others = criteria.filter((criterion) => criterion.id !== targetId);
  const otherTotal = others.reduce((sum, criterion) => sum + criterion.weight, 0);
  let distributed = 0;

  return criteria.map((criterion) => {
    if (criterion.id === targetId) return { ...criterion, weight: safeWeight };
    const otherIndex = others.findIndex((other) => other.id === criterion.id);
    const isLast = otherIndex === others.length - 1;
    const weight = isLast
      ? 100 - safeWeight - distributed
      : otherTotal > 0
        ? Math.floor(((100 - safeWeight) * criterion.weight) / otherTotal)
        : Math.floor((100 - safeWeight) / Math.max(others.length, 1));
    distributed += weight;
    return { ...criterion, weight };
  });
};

export const normalizeWeights = (criteria: Criterion[]) => {
  if (!criteria.length) return criteria;
  const total = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  let distributed = 0;
  return criteria.map((criterion, index) => {
    const weight = index === criteria.length - 1
      ? 100 - distributed
      : total > 0
        ? Math.floor((criterion.weight / total) * 100)
        : Math.floor(100 / criteria.length);
    distributed += weight;
    return { ...criterion, weight };
  });
};

export const createEmptyScores = (criteria: Criterion[]) =>
  Object.fromEntries(criteria.map((criterion) => [criterion.id, {}]));
