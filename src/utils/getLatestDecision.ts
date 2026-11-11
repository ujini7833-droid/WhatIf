import type { DecisionDraft, DecisionRecord, InProgressDecision } from '../types/decision';

const parseTimestamp = (value?: string) => {
  const timestamp = Date.parse(value?.replaceAll('.', '-') ?? '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getIdTimestamp = (id: string) => Number(id.match(/-(\d{13})-/)?.[1] ?? 0);

export const getLatestDecision = (
  inProgress: InProgressDecision[],
  completed: DecisionRecord[],
  currentDecision: DecisionDraft | null,
): DecisionDraft | null => {
  const completedById = new Map(completed.map((record) => [record.id, record]));
  const progressById = new Map(inProgress.map((decision) => [decision.id, decision]));

  const candidates = [
    ...inProgress
      .filter((decision) => !completedById.has(decision.id))
      .map((decision) => ({
        draft: decision,
        updatedAt: parseTimestamp(decision.updatedAt),
      })),
    ...completed.flatMap((record) => {
      const draft = record.draft
        ?? (currentDecision?.id === record.id ? currentDecision : null)
        ?? progressById.get(record.id)
        ?? null;

      return draft ? [{
        draft,
        updatedAt: Math.max(
          parseTimestamp(record.updatedAt),
          parseTimestamp(record.date),
          getIdTimestamp(record.id),
        ),
      }] : [];
    }),
  ];

  if (currentDecision && !candidates.some(({ draft }) => draft.id === currentDecision.id)) {
    candidates.push({
      draft: currentDecision,
      updatedAt: Math.max(
        parseTimestamp(progressById.get(currentDecision.id)?.updatedAt),
        parseTimestamp(completedById.get(currentDecision.id)?.updatedAt),
        getIdTimestamp(currentDecision.id),
      ),
    });
  }

  return candidates
    .sort((first, second) => second.updatedAt - first.updatedAt)
    .find(({ draft }) => hasDecisionChartData(draft))?.draft ?? null;
};

export const hasDecisionChartData = (draft: DecisionDraft) => (
  draft.alternatives.length >= 2
  && draft.alternatives.every((alternative) => alternative.name.trim())
  && draft.criteria.length >= 2
  && draft.criteria.every((criterion) => criterion.name.trim())
  && Object.values(draft.scores).some((criterionScores) => (
    Object.values(criterionScores).some((score) => Number.isFinite(score))
  ))
);
