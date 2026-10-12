// import RadarChart from './RadarChart';
// import RankingItem from './RankingItem';
import './DecisionPreview.css';
/*
interface Ranking {
    rank: number;
    name: string;
    score: number;
}

const rankings: Ranking[] = [
    { rank: 1, name: '강릉', score: 4.3 },
    { rank: 2, name: '춘천', score: 4.2 },
    { rank: 3, name: '부산', score: 3.7 },
];
*/

const DecisionPreview = () => {
    return (
        <div className="decision-preview">
            {/* <div className="decision-preview-chart">
                <RadarChart />
            </div> */}

            <div className="decision-preview-card">
                <div className="decision-preview-header">
                    <div>
                        <span className="decision-preview-label">
                            YOUR DECISION
                        </span>

                        <h2>
                            11월 여행은 어디로?
                        </h2>
                    </div>

                    <button
                        className="decision-preview-more"
                        type="button"
                        aria-label="View more"
                    >
                        →
                    </button>
                </div>

                {/* <div className="decision-preview-ranking">
                    {rankings.map((item) => (
                        <RankingItem
                            key={item.name}
                            rank={item.rank}
                            name={item.name}
                            score={item.score}
                        />
                    ))}
                </div> */}

                <div className="decision-preview-footer">
                    <span>
                        5개의 기준으로 비교했어요.
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
