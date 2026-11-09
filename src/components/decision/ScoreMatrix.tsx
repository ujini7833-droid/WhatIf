import type { Alternative } from './AlternativeStep';
import type { Criterion } from './CriteriaEditor';
import './ScoreMatrix.css';

type ScoreMap = Record<string, Record<string, number>>;

interface ScoreMatrixProps {
  alternatives: Alternative[];
  criteria: Criterion[];
  scores: ScoreMap;
  onChange: (criterionId: string, alternativeId: string, score: number) => void;
}

const ScoreMatrix = ({ alternatives, criteria, scores, onChange }: ScoreMatrixProps) => (
  <div className="decision-matrix-wrap">
    <table className="decision-matrix">
      <thead>
        <tr>
          <th>평가 기준</th>
          {alternatives.map((alternative) => <th key={alternative.id}>{alternative.name || '선택지'}</th>)}
        </tr>
      </thead>
      <tbody>
        {criteria.map((criterion) => (
          <tr key={criterion.id}>
            <th scope="row">
              <span>{criterion.name || '기준'}</span>
              <small>{criterion.weight}%</small>
            </th>
            {alternatives.map((alternative) => (
              <td key={alternative.id}>
                <span className="decision-score-select-wrap">
                  <select
                    className="decision-score-select"
                    value={scores[criterion.id]?.[alternative.id] ?? 3}
                    onChange={(event) => onChange(criterion.id, alternative.id, Number(event.target.value))}
                    aria-label={`${alternative.name}의 ${criterion.name} 점수`}
                  >
                    {[1, 2, 3, 4, 5].map((score) => <option value={score} key={score}>{score}점</option>)}
                  </select>
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <p className="decision-matrix-hint">1점은 기준을 거의 만족하지 않음, 5점은 매우 잘 만족함을 뜻해요.</p>
  </div>
);

export default ScoreMatrix;
