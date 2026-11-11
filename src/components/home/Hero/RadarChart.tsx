import {
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    RadarChart as RechartsRadarChart,
    ResponsiveContainer,
} from 'recharts';
import type { DecisionDraft } from '../../../types/decision';
import { hasDecisionChartData } from '../../../utils/getLatestDecision';
import './RadarChart.css';

const radarColors = ['#9B5CFF', '#5C9BFF', '#FF5C5C', '#20CBB8', '#F5B942'];

const RadarChart = ({ decision }: { decision: DecisionDraft }) => {
    if (!hasDecisionChartData(decision)) return null;

    const data = decision.criteria.map((criterion) => ({
        subject: criterion.name,
        ...Object.fromEntries(decision.alternatives.map((alternative) => [
            alternative.id,
            decision.scores[criterion.id][alternative.id],
        ])),
    }));

    return (
        <div className="radar-chart">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tick={false}
                        axisLine={false}
                    />
                    {decision.alternatives.map((alternative, index) => (
                        <Radar
                            key={alternative.id}
                            name={alternative.name}
                            dataKey={alternative.id}
                            stroke={radarColors[index % radarColors.length]}
                            fill={radarColors[index % radarColors.length]}
                            fillOpacity={0.35}
                        />
                    ))}
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChart;
