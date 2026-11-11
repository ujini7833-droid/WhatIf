import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Header from '../components/common/Header/Header';
import type { Criterion, DecisionRecord } from '../types/decision';
import { useDecisionStore } from '../store/decisionStore';
import { calculateResults, distributeWeight } from '../utils/calculateScore';
import ScoreChart from '../components/decision/ScoreChart';
import WeightSlider from '../components/decision/WeightSlider';
import '../components/decision/DecisionInfoStep.css';
import checkIcon from '../assets/check.svg';
import './DecisionLayout.css';
import './ResultPage.css';

const ResultPage = () => {
  const currentDecision = useDecisionStore((state) => state.currentDecision);
  const completedDecisions = useDecisionStore((state) => state.completedDecisions);
  const completeDecision = useDecisionStore((state) => state.completeDecision);
  const requestedId = new URLSearchParams(window.location.search).get('id');
  const completedRecord = requestedId
    ? completedDecisions.find((record) => record.id === requestedId)
    : undefined;
  const draft = requestedId
    ? (currentDecision?.id === requestedId ? currentDecision : completedRecord?.draft ?? null)
    : currentDecision;
  const [simulationCriteria, setSimulationCriteria] = useState<Criterion[]>(() => draft?.criteria ?? []);
  const [selectedAlternative, setSelectedAlternative] = useState('');
  const [reason, setReason] = useState('');
  const [showError, setShowError] = useState(false);
  const [savedRecord, setSavedRecord] = useState<DecisionRecord | null>(null);
  const visibleSavedRecord = savedRecord ?? (draft ? completedDecisions.find((record) => record.id === draft.id) ?? null : null);
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
    const completedAt = new Date();
    const record: DecisionRecord = {
      id: draft.id,
      draft,
      title: draft.title,
      description: reason.trim() || draft.description || `최종 선택: ${chosen.name}`,
      selectedAlternative: chosen.name,
      finalScore: baseResults.find((result) => result.id === chosen.id)?.score ?? 0,
      date: completedAt.toLocaleDateString('sv-SE').replaceAll('-', '.'),
      updatedAt: completedAt.toISOString(),
      status: 'completed',
    };
    completeDecision(record);
    setSavedRecord(record);
    setShowError(false);
  };

  return (
    <>
      <Header />
      <main className="decision-page outcome-page">
        <div className="outcome-heading">
          <div className="outcome-eyebrow-row">
            <a className="outcome-edit-link" href={`/decision?edit=${encodeURIComponent(draft.id)}`} aria-label="결정 수정">
              <ChevronLeft size={20} strokeWidth={3} aria-hidden="true" />
            </a>
            <p className="decision-info-eyebrow">{view === 'what-if' ? 'WHAT-IF SIMULATION' : view === 'complete' ? 'DECISION COMPLETE' : 'DECISION RESULTS'}</p>
          </div>
          <h1>{draft.title}</h1>
          <p>{draft.description || pageDescription}</p>
        </div>

        <nav className="outcome-nav" aria-label="결정 결과 메뉴">
          <a className={view === 'results' ? 'active' : ''} href={`/result?id=${encodeURIComponent(draft.id)}`}>결과</a>
          <a className={view === 'what-if' ? 'active' : ''} href={`/what-if?id=${encodeURIComponent(draft.id)}`}>What-if</a>
          <a className={view === 'complete' ? 'active' : ''} href={`/complete?id=${encodeURIComponent(draft.id)}`}>결정 완료</a>
        </nav>

        <section className="decision-form-card outcome-card">
          {!visibleSavedRecord && (
            <div className="outcome-section-heading">
              <div>
                <h2>{pageTitle}</h2>
                <p>{pageDescription}</p>
              </div>
            </div>
          )}

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
                <a className="decision-next-button" href={`/what-if?id=${encodeURIComponent(draft.id)}`}>가중치 시뮬레이션 <span aria-hidden="true">→</span></a>
                <a className="decision-secondary-link" href={`/complete?id=${encodeURIComponent(draft.id)}`}>최종 선택 확정하기</a>
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
                <div className="decision-simulation-summary">
                  <div className="decision-rank-changes">
                    {simulationResults.map((result, index) => {
                      const oldRank = baseResults.findIndex((item) => item.id === result.id) + 1;
                      const change = oldRank - index - 1;
                      return <p key={result.id}><span>{result.name}</span><strong>{change === 0 ? '순위 유지' : `${Math.abs(change)}순위 ${change > 0 ? '상승' : '하락'}`}</strong></p>;
                    })}
                  </div>
                  <a className="decision-next-button" href={`/complete?id=${encodeURIComponent(draft.id)}`}>최종 선택 확정하기 <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          )}

          {view === 'complete' && (
            visibleSavedRecord ? (
              <div className="decision-complete-state">
                <span className="decision-complete-check" aria-hidden="true">
                  <img src={checkIcon} alt="" />
                </span>
                <h2>결정을 기록했어요.</h2>
                <p>{visibleSavedRecord.title} · 최종 선택: {visibleSavedRecord.selectedAlternative}</p>
                <button className="decision-home-button" type="button" onClick={() => window.location.assign('/')}>
                  홈으로 돌아가기 <span aria-hidden="true">→</span>
                </button>
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
                
                <label className="decision-info-label" htmlFor="decision-reason">선택 이유 <span className="decision-info-optional">선택</span></label>
                <textarea id="decision-reason" className="decision-info-textarea result-reason-textarea" value={reason} onChange={(event) => 
                  setReason(event.target.value)} 
                  placeholder="이 선택지를 고른 이유를 적어주세요." 
                  rows={3} 
                />
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
