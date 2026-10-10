// import RadarChart from './RadarChart';
// import RankingItem from './RankingItem';
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
        <div className="decision_preview">
            {/* <div className="decision_preview_chart">
                <RadarChart />
            </div> */}

            <div className="decision_preview_card">
                <div className="decision_preview_header">
                    <div>
                        <span className="decision_preview_label">
                            YOUR DECISION
                        </span>

                        <h2>
                            11월 여행은 어디로?
                        </h2>
                    </div>

                    <button
                        className="decision_preview_more"
                        type="button"
                        aria-label="View more"
                    >
                        →
                    </button>
                </div>

                {/* <div className="decision_preview_ranking">
                    {rankings.map((item) => (
                        <RankingItem
                            key={item.name}
                            rank={item.rank}
                            name={item.name}
                            score={item.score}
                        />
                    ))}
                </div> */}

                <div className="decision_preview_footer">
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
