import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DecisionDraft, DecisionRecord, InProgressDecision } from '../types/decision';

interface DecisionStore {
  currentDecision: DecisionDraft | null;
  currentStep: number;
  inProgressDecisions: InProgressDecision[];
  completedDecisions: DecisionRecord[];
  startDecision: (decision: DecisionDraft, currentStep?: number, saveImmediately?: boolean) => void;
  resumeDecision: (id: string) => boolean;
  updateDecision: (updates: Partial<DecisionDraft>) => void;
  setCurrentStep: (step: number) => void;
  saveProgress: () => void;
  removeProgress: (id: string) => void;
  completeDecision: (record: DecisionRecord) => void;
  selectDecision: (decision: DecisionDraft) => void;
  removeDecision: (id: string) => void;
}

const readLegacyData = () => {
  try {
    const inProgress = JSON.parse(localStorage.getItem('whatif-in-progress-decisions') ?? '[]') as InProgressDecision[];
    const completed = JSON.parse(localStorage.getItem('whatif-decisions') ?? '[]') as DecisionRecord[];
    const sessionDraft = localStorage.getItem('whatif-current-decision');
    return {
      inProgressDecisions: inProgress,
      completedDecisions: completed,
      currentDecision: sessionDraft ? JSON.parse(sessionDraft) as DecisionDraft : null,
      currentStep: 1,
    };
  } catch {
    return {
      inProgressDecisions: [] as InProgressDecision[],
      completedDecisions: [] as DecisionRecord[],
      currentDecision: null,
      currentStep: 1,
    };
  }
};

const upsertProgress = (items: InProgressDecision[], decision: DecisionDraft, currentStep: number) => {
  const progress: InProgressDecision = {
    ...decision,
    currentStep,
    updatedAt: new Date().toISOString(),
  };
  return [progress, ...items.filter((item) => item.id !== decision.id)];
};

export const useDecisionStore = create<DecisionStore>()(persist((set, get) => ({
  ...readLegacyData(),

  startDecision: (decision, currentStep = 1, saveImmediately = false) => set((state) => ({
    currentDecision: decision,
    currentStep,
    inProgressDecisions: saveImmediately
      ? upsertProgress(state.inProgressDecisions, decision, currentStep)
      : state.inProgressDecisions,
  })),

  resumeDecision: (id) => {
    const progress = get().inProgressDecisions.find((item) => item.id === id);
    if (!progress) return false;
    set({
      currentDecision: {
        id: progress.id,
        title: progress.title,
        description: progress.description,
        alternatives: progress.alternatives,
        criteria: progress.criteria,
        scores: progress.scores,
      },
      currentStep: progress.currentStep,
    });
    return true;
  },

  updateDecision: (updates) => {
    let invalidatedCompletionId: string | null = null;

    set((state) => {
      if (!state.currentDecision) return state;
      const currentDecision = { ...state.currentDecision, ...updates };
      const hasChanges = (Object.keys(updates) as Array<keyof DecisionDraft>).some((key) => (
        JSON.stringify(state.currentDecision?.[key]) !== JSON.stringify(updates[key])
      ));
      const wasCompleted = hasChanges
        && state.completedDecisions.some((record) => record.id === currentDecision.id);
      if (wasCompleted) invalidatedCompletionId = currentDecision.id;

      return {
        currentDecision,
        inProgressDecisions: upsertProgress(state.inProgressDecisions, currentDecision, state.currentStep),
        completedDecisions: wasCompleted
          ? state.completedDecisions.filter((record) => record.id !== currentDecision.id)
          : state.completedDecisions,
      };
    });

    if (invalidatedCompletionId) {
      try {
        const legacyCompleted = JSON.parse(localStorage.getItem('whatif-decisions') ?? '[]') as DecisionRecord[];
        localStorage.setItem(
          'whatif-decisions',
          JSON.stringify(legacyCompleted.filter((record) => record.id !== invalidatedCompletionId)),
        );
      } catch {
        // Zustand's persisted state remains the source of truth if legacy storage is unavailable.
      }
    }
  },

  setCurrentStep: (currentStep) => set((state) => ({
    currentStep,
    inProgressDecisions: state.currentDecision
      ? upsertProgress(state.inProgressDecisions, state.currentDecision, currentStep)
      : state.inProgressDecisions,
  })),

  saveProgress: () => set((state) => state.currentDecision
    ? { inProgressDecisions: upsertProgress(state.inProgressDecisions, state.currentDecision, state.currentStep) }
    : state),

  removeProgress: (id) => {
    set((state) => ({
      inProgressDecisions: state.inProgressDecisions.filter((item) => item.id !== id),
    }));
    try {
      const legacy = JSON.parse(localStorage.getItem('whatif-in-progress-decisions') ?? '[]') as InProgressDecision[];
      localStorage.setItem('whatif-in-progress-decisions', JSON.stringify(legacy.filter((item) => item.id !== id)));
    } catch {
      // Zustand's persisted state remains the source of truth if legacy storage is unavailable.
    }
  },

  completeDecision: (record) => {
    set((state) => ({
      currentDecision: record.draft ?? state.currentDecision,
      completedDecisions: [record, ...state.completedDecisions.filter((item) => item.id !== record.id)],
      inProgressDecisions: state.inProgressDecisions.filter((item) => item.id !== record.id),
    }));
    try {
      const legacyProgress = JSON.parse(localStorage.getItem('whatif-in-progress-decisions') ?? '[]') as InProgressDecision[];
      const legacyCompleted = JSON.parse(localStorage.getItem('whatif-decisions') ?? '[]') as DecisionRecord[];
      localStorage.setItem('whatif-in-progress-decisions', JSON.stringify(legacyProgress.filter((item) => item.id !== record.id)));
      localStorage.setItem('whatif-decisions', JSON.stringify([record, ...legacyCompleted.filter((item) => item.id !== record.id)]));
    } catch {
      // Zustand's persisted state remains the source of truth if legacy storage is unavailable.
    }
  },

  removeDecision: (id) => {
    set((state) => ({
      currentDecision: state.currentDecision?.id === id ? null : state.currentDecision,
      currentStep: state.currentDecision?.id === id ? 1 : state.currentStep,
      inProgressDecisions: state.inProgressDecisions.filter((item) => item.id !== id),
      completedDecisions: state.completedDecisions.filter((item) => item.id !== id),
    }));

    try {
      const inProgress = JSON.parse(localStorage.getItem('whatif-in-progress-decisions') ?? '[]') as InProgressDecision[];
      const completed = JSON.parse(localStorage.getItem('whatif-decisions') ?? '[]') as DecisionRecord[];
      localStorage.setItem('whatif-in-progress-decisions', JSON.stringify(inProgress.filter((item) => item.id !== id)));
      localStorage.setItem('whatif-decisions', JSON.stringify(completed.filter((item) => item.id !== id)));
      const current = localStorage.getItem('whatif-current-decision');
      if (current && (JSON.parse(current) as DecisionDraft).id === id) {
        localStorage.removeItem('whatif-current-decision');
      }
    } catch {
      // Zustand's persisted state remains the source of truth if legacy storage is unavailable.
    }
  },

  selectDecision: (currentDecision) => set({ currentDecision }),
}), {
  name: 'whatif-decision-store',
  version: 1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    currentDecision: state.currentDecision,
    currentStep: state.currentStep,
    inProgressDecisions: state.inProgressDecisions,
    completedDecisions: state.completedDecisions,
  }),
}));
