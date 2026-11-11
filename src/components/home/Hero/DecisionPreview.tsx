import { useDecisionStore } from '../../../store/decisionStore';
import { calculateResults } from '../../../utils/calculateScore';
import { getLatestDecision, hasDecisionChartData } from '../../../utils/getLatestDecision';
import RadarChart from './RadarChart';
import RankingItem from './RankingItem';
import './DecisionPreview.css';

const DecisionPreview = () => {
    const inProgress = useDecisionStore((state) => state.inProgressDecisions);
    const completed = useDecisionStore((state) => state.completedDecisions);
    const currentDecision = useDecisionStore((state) => state.currentDecision);
    const decision = getLatestDecision(inProgress, completed, currentDecision);

    if (!decision || !hasDecisionChartData(decision)) return null;

    const rankings = calculateResults(decision);

    return (
        <div className="decision-preview">
            <div className="decision-preview-chart">
                <RadarChart decision={decision} />
            </div>

            <div className="decision-preview-card">
                <div className="decision-preview-header">
                    <div>
                        <span className="decision-preview-label">
                            YOUR DECISION
                        </span>

                        <h2>{decision.title}</h2>
                    </div>

                    <button
                        className="decision-preview-more"
                        type="button"
                        aria-label="View more"
                    >
                        →
                    </button>
                </div>

                <div className="decision-preview-ranking">
                    {rankings.slice(0, 3).map((item, index) => (
                        <RankingItem
                            key={item.id}
                            rank={index + 1}
                            name={item.name}
                            score={item.score}
                        />
                    ))}
                </div>

                <div className="decision-preview-footer">
                    <span>
                        {decision.criteria.length}개의 기준으로 비교했어요.
                    </span>

                    <button type="button">
                        자세히 보기 →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DecisionPreview;
