import { useEffect, useRef, useState } from 'react';
import Header from '../components/common/Header/Header';
import AlternativeStep from '../components/decision/AlternativeStep';
import CriteriaEditor from '../components/decision/CriteriaEditor';
import DecisionInfoStep from '../components/decision/DecisionInfoStep';
import DecisionProgress from '../components/decision/DecisionProgress';
import ScoreMatrix from '../components/decision/ScoreMatrix';
import WeightSlider from '../components/decision/WeightSlider';
import { decisionTemplates } from '../data/decisionTemplates';
import { useDecisionStore } from '../store/decisionStore';
import type { DecisionDraft } from '../types/decision';
import { createEmptyScores, distributeWeight, normalizeWeights } from '../utils/calculateScore';
import './DecisionLayout.css';
import './DecisionPage.css';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;


const loadTemplate = () => {
  const templateId = new URLSearchParams(window.location.search).get('template');
  return decisionTemplates.find((template) => template.id === templateId) ?? null;
};

const DecisionPage = () => {
  const currentDecision = useDecisionStore((state) => state.currentDecision);
  const currentStep = useDecisionStore((state) => state.currentStep);
  const startDecision = useDecisionStore((state) => state.startDecision);
  const resumeDecision = useDecisionStore((state) => state.resumeDecision);
  const updateDecision = useDecisionStore((state) => state.updateDecision);
  const setStoreStep = useDecisionStore((state) => state.setCurrentStep);
  const removeProgress = useDecisionStore((state) => state.removeProgress);
  const [showValidation, setShowValidation] = useState(false);
  const initialized = useRef(false);
  const emptyDecision: DecisionDraft = {
    id: '',
    title: '',
    description: '',
    alternatives: [
      { id: 'alternative-1', name: '', description: '' },
      { id: 'alternative-2', name: '', description: '' },
    ],
    criteria: [
      { id: 'criterion-1', name: '', description: '', weight: 50 },
      { id: 'criterion-2', name: '', description: '', weight: 50 },
    ],
    scores: {},
  };
  const decision = currentDecision ?? emptyDecision;
  const { id: decisionId, title, description, alternatives, criteria, scores } = decision;
  const weightTotal = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const validationMessage = currentStep === 1
    ? !title.trim() ? '결정 상황을 입력하면 다음 단계로 넘어갈 수 있어요.' : ''
    : currentStep === 2
      ? alternatives.length < 2
        ? '선택지를 두 개 이상 추가해주세요.'
        : alternatives.some((item) => !item.name.trim())
          ? '선택지 이름을 모두 입력해주세요.'
          : ''
      : currentStep === 3
        ? criteria.length < 2
          ? '평가 기준을 두 개 이상 추가해주세요.'
          : criteria.some((item) => !item.name.trim())
            ? '평가 기준 이름을 모두 입력해주세요.'
            : ''
        : currentStep === 4 && weightTotal !== 100
          ? '가중치 합계를 100%로 맞춰주세요.'
          : '';
  const canAdvance = validationMessage === '';

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (editId) {
      const store = useDecisionStore.getState();
      const completedDraft = store.completedDecisions.find((record) => record.id === editId)?.draft;
      const existingDraft = completedDraft ?? (store.currentDecision?.id === editId ? store.currentDecision : null);
      if (existingDraft) {
        startDecision(existingDraft, 5, true);
        return;
      }
    }

    const progressId = params.get('id');
    if (progressId && resumeDecision(progressId)) return;

    const template = loadTemplate();
    const initialDraft: DecisionDraft = {
      id: createId('decision'),
      title: template?.title ?? '',
      description: template?.description ?? '',
      alternatives: emptyDecision.alternatives,
      criteria: template?.criteria ?? emptyDecision.criteria,
      scores: createEmptyScores(template?.criteria ?? emptyDecision.criteria),
    };
    startDecision(initialDraft, 1, Boolean(template));
  }, [resumeDecision, startDecision]);

  const updateAlternative = (id: string, field: 'name' | 'description', value: string) => {
    const previousValue = alternatives.find((item) => item.id === id)?.[field] ?? '';
    updateDecision({ alternatives: alternatives.map((item) => item.id === id ? { ...item, [field]: value } : item) });

    if (field === 'name') {
      if (value.trim()) setShowValidation(false);
      else if (previousValue.trim()) setShowValidation(true);
    }
  };

  const addAlternative = () => {
    const id = createId('alternative');
    updateDecision({
      alternatives: [...alternatives, { id, name: '', description: '' }],
      scores,
    });
  };

  const removeAlternative = (id: string) => {
    updateDecision({
      alternatives: alternatives.filter((item) => item.id !== id),
      scores: Object.fromEntries(Object.entries(scores).map(([criterionId, row]) => {
        const nextRow = { ...row };
        delete nextRow[id];
        return [criterionId, nextRow];
      })),
    });
  };

  const updateCriterion = (id: string, field: 'name' | 'description', value: string) => {
    const previousValue = criteria.find((item) => item.id === id)?.[field] ?? '';
    updateDecision({ criteria: criteria.map((item) => item.id === id ? { ...item, [field]: value } : item) });

    if (field === 'name') {
      if (value.trim()) setShowValidation(false);
      else if (previousValue.trim()) setShowValidation(true);
    }
  };

  const addCriterion = () => {
    const id = createId('criterion');
    updateDecision({
      criteria: [...criteria, { id, name: '', description: '', weight: 0 }],
      scores: { ...scores, [id]: {} },
    });
  };

  const removeCriterion = (id: string) => {
    const nextScores = { ...scores };
    delete nextScores[id];
    updateDecision({ criteria: normalizeWeights(criteria.filter((item) => item.id !== id)), scores: nextScores });
  };

  const updateScore = (criterionId: string, alternativeId: string, score: number) => {
    updateDecision({ scores: { ...scores, [criterionId]: { ...scores[criterionId], [alternativeId]: score } } });
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !title.trim()) {
      setShowValidation(true);
      return;
    }
    if (currentStep === 2 && (alternatives.length < 2 || alternatives.some((item) => !item.name.trim()))) {
      setShowValidation(true);
      return;
    }
    if (currentStep === 3 && (criteria.length < 2 || criteria.some((item) => !item.name.trim()))) {
      setShowValidation(true);
      return;
    }
    if (currentStep === 4 && weightTotal !== 100) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);
    if (currentStep < 5) {
      setStoreStep(currentStep + 1);
      return;
    }

    const draft = { ...decision, title: title.trim(), description: description.trim() };
    updateDecision(draft);
    const isEditingCompleted = useDecisionStore.getState().completedDecisions.some((record) => record.id === decisionId);
    if (!isEditingCompleted) removeProgress(decisionId);
    window.location.assign('/result');
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <DecisionInfoStep
          title={title}
          description={description}
          showTitleError={showValidation && !title.trim()}
          onTitleChange={(value) => {
            updateDecision({ title: value });
            if (value.trim()) setShowValidation(false);
            else if (title.trim()) setShowValidation(true);
          }}
          onDescriptionChange={(value) => updateDecision({ description: value })}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <AlternativeStep alternatives={alternatives} onChange={updateAlternative} onAdd={addAlternative} onRemove={removeAlternative} />
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <CriteriaEditor criteria={criteria} onChange={updateCriterion} onAdd={addCriterion} onRemove={removeCriterion} />
        </>
      );
    }

    if (currentStep === 4) {
      return (
        <section className="decision-step-content">
          <p className="decision-info-eyebrow">STEP 04 · WEIGHTS</p>
          <h1>각 기준은 얼마나 중요한가요?</h1>
          <p className="decision-form-description">가중치는 판단의 우선순위예요. 슬라이더로 조정하거나 각 기준의 가중치를 직접 입력해보세요.</p>
          <WeightSlider
            criteria={criteria}
            allowManualInput
            onChange={(id, value) => {
              const nextCriteria = criteria.map((criterion) => criterion.id === id ? { ...criterion, weight: value } : criterion);
              updateDecision({ criteria: nextCriteria });
              setShowValidation(nextCriteria.reduce((sum, criterion) => sum + criterion.weight, 0) !== 100);
            }}
            onRangeChange={(id, value) => {
              updateDecision({ criteria: distributeWeight(criteria, id, value) });
              setShowValidation(false);
            }}
          />
        </section>
      );
    }

    return (
      <section className="decision-step-content">
        <p className="decision-info-eyebrow">STEP 05 · SCORING</p>
        <h1>각 선택지는 기준을 얼마나 만족하나요?</h1>
        <p className="decision-form-description">각 기준에 따라 선택지를 1점부터 5점까지 평가해주세요.</p>
        <ScoreMatrix alternatives={alternatives} criteria={criteria} scores={scores} onChange={updateScore} />
      </section>
    );
  };

  return (
    <>
      <Header />
      <main className="decision-page">
        <DecisionProgress currentStep={currentStep} />
        <section className="decision-form-card">
          {/*
          <div className="decision-draft-save">
            {showSavedMessage && <p className="decision-saved-message" role="status">임시저장이 완료되었어요</p>}
            <button className="decision-save-button" type="button" onClick={handleSaveProgress}>
              임시저장
            </button>
          </div>
          */}
          {renderStep()}
          {validationMessage && showValidation && currentStep !== 1 && (
            <p className="decision-validation-message" role="status">
              {validationMessage}
            </p>
          )}
          <div className="decision-form-actions">
            <button className="decision-back-button" type="button" onClick={() => setStoreStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
              이전
            </button>
            <div className="decision-form-action-group">
              <div className="decision-next-button-wrap" onPointerDown={() => { if (!canAdvance) setShowValidation(true); }}>
                <button
                  className="decision-next-button"
                  type="button"
                  onClick={goToNextStep}
                  disabled={!canAdvance}
                >
                  {currentStep === 5 ? '결과 확인' : '다음 단계'} <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DecisionPage;
