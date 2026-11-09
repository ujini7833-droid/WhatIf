import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Alternative } from './AlternativeStep';
import './ScoreChart.css';

export interface ResultScore {
  id: string;
  name: string;
  score: number;
}

interface ScoreChartProps {
  alternatives: Alternative[];
  results: ResultScore[];
  comparisonResults?: ResultScore[];
}

const ScoreChart = ({ alternatives, results, comparisonResults }: ScoreChartProps) => {
  const data = alternatives.map((alternative) => ({
    name: alternative.name || '선택지',
    result: results.find((item) => item.id === alternative.id)?.score ?? 0,
    comparison: comparisonResults?.find((item) => item.id === alternative.id)?.score ?? 0,
  }));

  return (
    <div className="decision-chart" role="img" aria-label="선택지별 가중 점수 비교 차트">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 4 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#a3a7bd', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 5]} tick={{ fill: '#747990', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ background: '#171a2d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}
            formatter={(value) => [Number(value).toFixed(2), '가중 점수']}
          />
          {comparisonResults && <Bar dataKey="comparison" name="기존 결과" fill="#747990" radius={[5, 5, 0, 0]} />}
          <Bar dataKey="result" name={comparisonResults ? '시뮬레이션' : '가중 점수'} fill="#8c68ff" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
