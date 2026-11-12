export interface Alternative {
  id: string;
  name: string;
  description: string;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export type ScoreMap = Record<string, Record<string, number>>;

export interface DecisionDraft {
  id: string;
  title: string;
  description: string;
  alternatives: Alternative[];
  criteria: Criterion[];
  scores: ScoreMap;
}

export interface InProgressDecision extends DecisionDraft {
  currentStep: number;
  updatedAt: string;
  isManuallySaved?: boolean;
}

export interface DecisionRecord {
  id: string;
  draft: DecisionDraft;
  title: string;
  description: string;
  selectedAlternative: string;
  finalScore: number;
  date: string;
  updatedAt?: string;
  status: 'completed';
}
