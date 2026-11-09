import { useState } from 'react';
import Header from '../components/common/Header/Header';
import type { Alternative } from '../components/decision/AlternativeStep';
import type { Criterion } from '../components/decision/CriteriaEditor';
import ScoreChart, { type ResultScore } from '../components/decision/ScoreChart';
import WeightSlider from '../components/decision/WeightSlider';
import './DecisionPage.css';

interface DecisionDraft {
  id: string;
  title: string;
  description: string;
  alternatives: Alternative[];
  criteria: Criterion[];
  scores: Record<string, Record<string, number>>;
}

interface DecisionRecord {
  id: string;
  title: string;
  description: string;
  selectedAlternative: string;
  finalScore: number;
  date: string;
  status: 'completed';
}

const loadDraft = (): DecisionDraft | null => {
  try {
    const value = sessionStorage.getItem('whatif-current-decision');
    return value ? JSON.parse(value) as DecisionDraft : null;
  } catch {
    return null;
  }
};

const calculateResults = (
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

const distributeWeight = (criteria: Criterion[], targetId: string, value: number) => {
  const targetWeight = Math.max(0, Math.min(100, Math.round(value)));
  const others = criteria.filter((criterion) => criterion.id !== targetId);
  const total = others.reduce((sum, criterion) => sum + criterion.weight, 0);
  let distributed = 0;

  return criteria.map((criterion) => {
    if (criterion.id === targetId) return { ...criterion, weight: targetWeight };
    const index = others.findIndex((item) => item.id === criterion.id);
    const weight = index === others.length - 1
      ? 100 - targetWeight - distributed
      : total > 0
        ? Math.floor(((100 - targetWeight) * criterion.weight) / total)
        : Math.floor((100 - targetWeight) / Math.max(others.length, 1));
    distributed += weight;
    return { ...criterion, weight };
  });
};

const ResultPage = () => {
  const [draft] = useState(loadDraft);
  const [simulationCriteria, setSimulationCriteria] = useState<Criterion[]>(() => draft?.criteria ?? []);
  const [selectedAlternative, setSelectedAlternative] = useState('');
  const [reason, setReason] = useState('');
  const [showError, setShowError] = useState(false);
  const [savedRecord, setSavedRecord] = useState<DecisionRecord | null>(null);
  const view = window.location.pathname === '/what-if'
    ? 'what-if'
    : window.location.pathname === '/complete'
      ? 'complete'
      : 'results';

  if (!draft) {
    return (
      <>
        <Header />
        <main className="decision-page">
          <section className="decision-form-card decision-empty-state">
            <h1>결정 정보를 찾을 수 없어요.</h1>
            <p>새로운 결정을 만들고 결과 화면으로 다시 이동해주세요.</p>
            <button className="decision-next-button" type="button" onClick={() => window.location.assign('/decision')}>결정 만들기</button>
          </section>
        </main>
      </>
    );
  }

  const baseResults = calculateResults(draft);
  const simulationResults = calculateResults(draft, simulationCriteria);
  const pageTitle = view === 'what-if'
    ? '가중치를 바꾸면 결과도 달라질까요?'
    : view === 'complete'
      ? '최종 결정을 확정해볼까요?'
      : '결정 결과를 확인해보세요.';
  const pageDescription = view === 'what-if'
    ? '시뮬레이션 가중치를 조절해 순위 변화를 살펴보세요. 원래 결과는 그대로 보존됩니다.'
    : view === 'complete'
      ? '최종 선택과 이유를 기록해두면 나중에 결정 과정을 돌아볼 수 있어요.'
      : '각 점수에 기준별 가중치를 곱해 계산했어요. 가장 높은 선택지가 위에 표시됩니다.';

  const saveDecision = () => {
    if (!selectedAlternative) {
      setShowError(true);
      return;
    }
    const chosen = draft.alternatives.find((alternative) => alternative.id === selectedAlternative);
    if (!chosen) return;
    const record: DecisionRecord = {
      id: draft.id,
      title: draft.title,
      description: reason.trim() || draft.description || `최종 선택: ${chosen.name}`,
      selectedAlternative: chosen.name,
      finalScore: baseResults.find((result) => result.id === chosen.id)?.score ?? 0,
      date: new Date().toLocaleDateString('sv-SE').replaceAll('-', '.'),
      status: 'completed',
    };
    try {
      const saved = JSON.parse(localStorage.getItem('whatif-decisions') ?? '[]') as DecisionRecord[];
      localStorage.setItem('whatif-decisions', JSON.stringify([record, ...saved.filter((item) => item.id !== record.id)]));
    } catch {
      localStorage.setItem('whatif-decisions', JSON.stringify([record]));
    }
    setSavedRecord(record);
    setShowError(false);
  };

  return (
    <>
      <Header />
      <main className="decision-page outcome-page">
        <div className="outcome-heading">
          <p className="decision-form-eyebrow">{view === 'what-if' ? 'WHAT-IF SIMULATION' : view === 'complete' ? 'DECISION COMPLETE' : 'DECISION RESULTS'}</p>
          <h1>{draft.title}</h1>
          <p>{draft.description || pageDescription}</p>
        </div>

        <nav className="outcome-nav" aria-label="결정 결과 메뉴">
          <a className={view === 'results' ? 'active' : ''} href="/result">결과</a>
          <a className={view === 'what-if' ? 'active' : ''} href="/what-if">What-if</a>
          <a className={view === 'complete' ? 'active' : ''} href="/complete">결정 완료</a>
        </nav>

        <section className="decision-form-card outcome-card">
          <div className="outcome-section-heading">
            <div>
              <h2>{pageTitle}</h2>
              <p>{pageDescription}</p>
            </div>
          </div>

          {view === 'results' && (
            <>
              <div className="decision-results-layout">
                <div className="decision-ranking-list">
                  {baseResults.map((result, index) => (
                    <article className={`decision-ranking-card ${index === 0 ? 'winner' : ''}`} key={result.id}>
                      <span className="decision-ranking-place">{index + 1}<small>위</small></span>
                      <span className="decision-ranking-name">{result.name}</span>
                      <strong>{result.score.toFixed(2)}<small> / 5</small></strong>
                    </article>
                  ))}
                </div>
                <ScoreChart alternatives={draft.alternatives} results={baseResults} />
              </div>
              <p className="decision-result-note">총점 = Σ(기준별 점수 × 가중치). 점수는 결정을 돕는 참고 자료예요.</p>
              <div className="outcome-actions">
                <a className="decision-next-button" href="/what-if">가중치 시뮬레이션 <span aria-hidden="true">→</span></a>
                <a className="decision-secondary-link" href="/complete">최종 선택 확정하기</a>
              </div>
            </>
          )}

          {view === 'what-if' && (
            <div className="decision-simulation-layout">
              <WeightSlider
                criteria={simulationCriteria}
                simulated
                onChange={(id, value) => setSimulationCriteria((current) => distributeWeight(current, id, value))}
              />
              <div className="decision-simulation-results">
                <div className="decision-chart-legend"><span>원래 결과</span><span>시뮬레이션</span></div>
                <ScoreChart alternatives={draft.alternatives} results={simulationResults} comparisonResults={baseResults} />
                <div className="decision-rank-changes">
                  {simulationResults.map((result, index) => {
                    const oldRank = baseResults.findIndex((item) => item.id === result.id) + 1;
                    const change = oldRank - index - 1;
                    return <p key={result.id}><span>{result.name}</span><strong>{change === 0 ? '순위 유지' : `${Math.abs(change)}계단 ${change > 0 ? '상승' : '하락'}`}</strong></p>;
                  })}
                </div>
                <a className="decision-next-button" href="/complete">최종 선택 확정하기 <span aria-hidden="true">→</span></a>
              </div>
            </div>
          )}

          {view === 'complete' && (
            savedRecord ? (
              <div className="decision-complete-state">
                <span className="decision-complete-check" aria-hidden="true">✓</span>
                <h2>결정을 기록했어요.</h2>
                <p>{savedRecord.title} · 최종 선택: {savedRecord.selectedAlternative}</p>
                <button className="decision-next-button" type="button" onClick={() => window.location.assign('/')}>홈으로 돌아가기</button>
              </div>
            ) : (
              <div className="decision-complete-form">
                <div className="decision-final-options">
                  {baseResults.map((result, index) => (
                    <label className={`decision-final-option ${selectedAlternative === result.id ? 'selected' : ''}`} key={result.id}>
                      <input type="radio" name="final-choice" value={result.id} checked={selectedAlternative === result.id} onChange={() => { setSelectedAlternative(result.id); setShowError(false); }} />
                      <span className="decision-final-rank">{index + 1}위</span>
                      <span className="decision-final-name">{result.name}</span>
                      <strong>{result.score.toFixed(2)}점</strong>
                    </label>
                  ))}
                </div>
                <label className="decision-control-label" htmlFor="decision-reason">선택 이유 <span>선택</span></label>
                <textarea id="decision-reason" className="decision-control decision-control-textarea" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="이 선택지를 고른 이유를 적어주세요." rows={3} />
                {showError && <p className="decision-validation-message">최종 선택지를 하나 골라주세요.</p>}
                <button className="decision-save-button" type="button" onClick={saveDecision}>이 결정 완료하기</button>
              </div>
            )
          )}
        </section>
      </main>
    </>
  );
};

export default ResultPage;
