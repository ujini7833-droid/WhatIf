export interface Alternative {
  id: string;
  name: string;
  description: string;
}

interface AlternativeStepProps {
  alternatives: Alternative[];
  onChange: (id: string, field: 'name' | 'description', value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const AlternativeStep = ({ alternatives, onChange, onAdd, onRemove }: AlternativeStepProps) => (
  <section className="decision-step-content">
    <p className="decision-form-eyebrow">STEP 02 · ALTERNATIVES</p>
    <h1>어떤 것들을 비교할까요?</h1>
    <p className="decision-form-description">선택지와 간단한 설명을 적어주세요. 두 개 이상 추가할 수 있어요.</p>

    <div className="decision-entry-list">
      {alternatives.map((alternative, index) => (
        <article className="decision-entry-card" key={alternative.id}>
          <div className="decision-entry-card-header">
            <span className="decision-entry-number">OPTION {String(index + 1).padStart(2, '0')}</span>
            {alternatives.length > 2 && (
              <button className="decision-remove-button" type="button" onClick={() => onRemove(alternative.id)}>
                삭제
              </button>
            )}
          </div>
          <label className="decision-control-label" htmlFor={`alternative-name-${alternative.id}`}>선택지 이름</label>
          <input
            id={`alternative-name-${alternative.id}`}
            className="decision-control"
            value={alternative.name}
            onChange={(event) => onChange(alternative.id, 'name', event.target.value)}
            placeholder={index === 0 ? '예: 강릉' : index === 1 ? '예: 춘천' : '선택지 이름'}
            maxLength={60}
          />
          <label className="decision-control-label" htmlFor={`alternative-description-${alternative.id}`}>설명 <span>선택</span></label>
          <textarea
            id={`alternative-description-${alternative.id}`}
            className="decision-control decision-control-textarea"
            value={alternative.description}
            onChange={(event) => onChange(alternative.id, 'description', event.target.value)}
            placeholder="이 선택지에 대해 간단히 설명해주세요."
            rows={2}
            maxLength={200}
          />
        </article>
      ))}
    </div>

    <button className="decision-add-button" type="button" onClick={onAdd}>＋ 선택지 추가</button>
  </section>
);

export default AlternativeStep;
