import { useState } from 'react';
import Header from '../components/common/Header/Header';
import AlternativeStep, { type Alternative } from '../components/decision/AlternativeStep';
import CriteriaEditor, { type Criterion } from '../components/decision/CriteriaEditor';
import DecisionInfoStep from '../components/decision/DecisionInfoStep';
import DecisionProgress from '../components/decision/DecisionProgress';
import ScoreMatrix from '../components/decision/ScoreMatrix';
import WeightSlider from '../components/decision/WeightSlider';
import './DecisionLayout.css';
import './DecisionPage.css';

const initialCriteria: Criterion[] = [
  { id: 'cost', name: '비용', description: '전체 여행 경비', weight: 30 },
  { id: 'travel-time', name: '이동 시간', description: '왕복 교통 소요 시간', weight: 25 },
  { id: 'sights', name: '볼거리', description: '관광 및 구경할 요소', weight: 20 },
  { id: 'atmosphere', name: '분위기', description: '한적하고 여유로운 정도', weight: 15 },
  { id: 'accessibility', name: '접근성', description: '대중교통 이용 편의성', weight: 10 },
];

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const distributeWeight = (criteria: Criterion[], targetId: string, targetWeight: number) => {
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

const normalizeWeights = (criteria: Criterion[]) => {
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

const DecisionPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: 'alternative-1', name: '', description: '' },
    { id: 'alternative-2', name: '', description: '' },
  ]);
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(initialCriteria.map((criterion) => [
      criterion.id,
      { 'alternative-1': 3, 'alternative-2': 3 },
    ])),
  );
  const [showValidation, setShowValidation] = useState(false);
  const weightTotal = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);

  const updateAlternative = (id: string, field: 'name' | 'description', value: string) => {
    setAlternatives((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
    setShowValidation(false);
  };

  const addAlternative = () => {
    const id = createId('alternative');
    setAlternatives((current) => [...current, { id, name: '', description: '' }]);
    setScores((current) => Object.fromEntries(Object.entries(current).map(([criterionId, row]) => [
      criterionId,
      { ...row, [id]: 3 },
    ])));
  };

  const removeAlternative = (id: string) => {
    setAlternatives((current) => current.filter((item) => item.id !== id));
    setScores((current) => Object.fromEntries(Object.entries(current).map(([criterionId, row]) => {
      const nextRow = { ...row };
      delete nextRow[id];
      return [criterionId, nextRow];
    })));
  };

  const updateCriterion = (id: string, field: 'name' | 'description', value: string) => {
    setCriteria((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
    setShowValidation(false);
  };

  const addCriterion = () => {
    const id = createId('criterion');
    setCriteria((current) => [...current, { id, name: '', description: '', weight: 0 }]);
    setScores((current) => ({
      ...current,
      [id]: Object.fromEntries(alternatives.map((alternative) => [alternative.id, 3])),
    }));
  };

  const removeCriterion = (id: string) => {
    setCriteria((current) => normalizeWeights(current.filter((item) => item.id !== id)));
    setScores((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const updateScore = (criterionId: string, alternativeId: string, score: number) => {
    setScores((current) => ({
      ...current,
      [criterionId]: { ...current[criterionId], [alternativeId]: score },
    }));
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
      setCurrentStep((step) => step + 1);
      return;
    }

    const draft = { id: createId('decision'), title: title.trim(), description: description.trim(), alternatives, criteria, scores };
    sessionStorage.setItem('whatif-current-decision', JSON.stringify(draft));
    window.location.assign('/result');
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <DecisionInfoStep
          title={title}
          description={description}
          showTitleError={showValidation && !title.trim()}
          onTitleChange={(value) => { setTitle(value); setShowValidation(false); }}
          onDescriptionChange={setDescription}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <AlternativeStep alternatives={alternatives} onChange={updateAlternative} onAdd={addAlternative} onRemove={removeAlternative} />
          {showValidation && <p className="decision-validation-message">선택지 이름을 모두 입력해주세요. 선택지는 두 개 이상 필요해요.</p>}
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <CriteriaEditor criteria={criteria} onChange={updateCriterion} onAdd={addCriterion} onRemove={removeCriterion} />
          {showValidation && <p className="decision-validation-message">평가 기준 이름을 모두 입력해주세요. 기준은 두 개 이상 필요해요.</p>}
        </>
      );
    }

    if (currentStep === 4) {
      return (
        <section className="decision-step-content">
          <p className="decision-info-eyebrow">STEP 04 · WEIGHTS</p>
          <h1>각 기준은 얼마나 중요한가요?</h1>
          <p className="decision-form-description">가중치는 판단의 우선순위를 나타내요. 슬라이더를 움직이면 나머지 기준의 비율을 유지하며 합계가 100%로 맞춰집니다.</p>
          <WeightSlider criteria={criteria} onChange={(id, value) => setCriteria((current) => distributeWeight(current, id, value))} />
          {showValidation && <p className="decision-validation-message">가중치 합계가 100%인지 확인해주세요.</p>}
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
          {renderStep()}
          <div className="decision-form-actions">
            <button className="decision-back-button" type="button" onClick={() => { setShowValidation(false); setCurrentStep((step) => Math.max(1, step - 1)); }} disabled={currentStep === 1}>
              이전
            </button>
            <button className="decision-next-button" type="button" onClick={goToNextStep}>
              {currentStep === 5 ? '결과 확인' : '다음 단계'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default DecisionPage;
