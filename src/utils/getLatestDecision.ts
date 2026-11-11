import type { DecisionDraft, DecisionRecord, InProgressDecision } from '../types/decision';

const parseTimestamp = (value?: string) => {
  const timestamp = Date.parse(value?.replaceAll('.', '-') ?? '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getLatestDecision = (
  inProgress: InProgressDecision[],
  completed: DecisionRecord[],
  currentDecision: DecisionDraft | null,
): DecisionDraft | null => {
  const candidates = [
    ...inProgress.map((decision) => ({
      draft: decision,
      updatedAt: parseTimestamp(decision.updatedAt),
    })),
    ...completed.flatMap((record) => record.draft ? [{
      draft: record.draft,
      updatedAt: parseTimestamp(record.updatedAt ?? record.date),
    }] : []),
  ];

  if (currentDecision && !candidates.some(({ draft }) => draft.id === currentDecision.id)) {
    candidates.push({
      draft: currentDecision,
      updatedAt: Number(currentDecision.id.match(/-(\d{13})-/)?.[1] ?? 0),
    });
  }

  return candidates.sort((first, second) => second.updatedAt - first.updatedAt)[0]?.draft ?? null;
};

export const hasDecisionChartData = (draft: DecisionDraft) => (
  draft.alternatives.length >= 2
  && draft.alternatives.every((alternative) => alternative.name.trim())
  && draft.criteria.length >= 2
  && draft.criteria.every((criterion) => criterion.name.trim())
  && draft.criteria.every((criterion) => draft.alternatives.every((alternative) => (
    Number.isFinite(draft.scores[criterion.id]?.[alternative.id])
  )))
);
