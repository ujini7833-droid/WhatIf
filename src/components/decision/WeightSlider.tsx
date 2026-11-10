import { useState } from 'react';
import type { Criterion } from './CriteriaEditor';
import './WeightSlider.css';

interface WeightSliderProps {
  criteria: Criterion[];
  onChange: (id: string, value: number) => void;
  onRangeChange?: (id: string, value: number) => void;
  simulated?: boolean;
  allowManualInput?: boolean;
}

const WeightSlider = ({ criteria, onChange, onRangeChange, simulated = false, allowManualInput = false }: WeightSliderProps) => {
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const total = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);

  return (
    <div className="decision-weight-list">
      {criteria.map((criterion) => (
        <div className="decision-weight-row" key={criterion.id}>
          <div className="decision-weight-heading">
            <div>
              <span className="decision-weight-name">{criterion.name || '이름 없는 기준'}</span>
              {criterion.description && <span className="decision-weight-description">{criterion.description}</span>}
            </div>
            {allowManualInput ? (
              <label className="decision-weight-input-wrap">
                <input
                  className="decision-weight-input"
                  type="text"
                  inputMode="numeric"
                  min="0"
                  max="100"
                  value={manualValues[criterion.id] ?? String(criterion.weight)}
                  onFocus={(event) => {
                    setManualValues((current) => ({ ...current, [criterion.id]: String(criterion.weight) }));
                    event.currentTarget.select();
                  }}
                  onChange={(event) => {
                    const rawValue = event.target.value.replace(/\D/g, '');
                    const value = rawValue.replace(/^0+(?=\d)/, '');
                    setManualValues((current) => ({ ...current, [criterion.id]: value }));
                    onChange(criterion.id, value === '' ? 0 : Math.min(100, Number(value)));
                  }}
                  onBlur={() => setManualValues((current) => {
                    const next = { ...current };
                    delete next[criterion.id];
                    return next;
                  })}
                  aria-label={`${criterion.name || '기준'} 가중치 직접 입력`}
                />
                <span>%</span>
              </label>
            ) : (
              <strong>{criterion.weight}%</strong>
            )}
          </div>
          <input
            className="decision-weight-range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={criterion.weight}
            onChange={(event) => (onRangeChange ?? onChange)(criterion.id, Number(event.target.value))}
            aria-label={`${criterion.name} 가중치${simulated ? ' 시뮬레이션' : ''}`}
          />
        </div>
      ))}
      <div className={`decision-weight-total ${total === 100 ? 'is-balanced' : 'is-unbalanced'}`}>
        <span>가중치 합계</span>
        <strong>{total}% <small>{total === 100 ? '균형이 맞아요' : '합계가 100%가 되도록 조정해주세요'}</small></strong>
      </div>
    </div>
  );
};

export default WeightSlider;
