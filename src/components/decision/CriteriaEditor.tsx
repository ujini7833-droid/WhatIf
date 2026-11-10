import type { Criterion } from '../../types/decision';
import './CriteriaEditor.css';
import './DecisionEntry.css';
import './DecisionInfoStep.css';

export type { Criterion } from '../../types/decision';

interface CriteriaEditorProps {
  criteria: Criterion[];
  onChange: (id: string, field: 'name' | 'description', value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const CriteriaEditor = ({ criteria, onChange, onAdd, onRemove }: CriteriaEditorProps) => (
  <section className="decision-step-content">
    <p className="decision-info-eyebrow">STEP 03 · CRITERIA</p>
    <h1>무엇을 기준으로 판단할까요?</h1>
    <p className="decision-form-description">선택지를 비교할 평가 기준을 추가하거나 수정해보세요.</p>

    <div className="decision-entry-list">
      {criteria.map((criterion, index) => (
        <article className="decision-entry-card decision-criterion-card" key={criterion.id}>
          <div className="decision-entry-card-header">
            <span className="decision-entry-number">CRITERION {String(index + 1).padStart(2, '0')}</span>
            {criteria.length > 2 && (
              <button className="decision-remove-button" type="button" onClick={() => onRemove(criterion.id)}>삭제</button>
            )}
          </div>
          <div className="decision-criterion-fields">
            <div>
              <label className="decision-info-label" htmlFor={`criterion-name-${criterion.id}`}>기준</label>
              <input
                id={`criterion-name-${criterion.id}`}
                className="decision-info-input"
                value={criterion.name}
                onChange={(event) => onChange(criterion.id, 'name', event.target.value)}
                placeholder="예: 비용"
                maxLength={40}
              />
            </div>
            <div>
              <label className="decision-info-label" htmlFor={`criterion-description-${criterion.id}`}>설명</label>
              <input
                id={`criterion-description-${criterion.id}`}
                className="decision-info-input"
                value={criterion.description}
                onChange={(event) => onChange(criterion.id, 'description', event.target.value)}
                placeholder="예: 전체 여행 경비"
                maxLength={100}
              />
            </div>
          </div>
        </article>
      ))}
    </div>

    <button className="decision-add-button" type="button" onClick={onAdd}>＋ 평가 기준 추가</button>
  </section>
);

export default CriteriaEditor;
