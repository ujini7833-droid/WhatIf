import './RankingItem.css';

interface RankingItemProps {
    rank: number;
    name: string;
    score: number;
}

const RankingItem = ({
    rank,
    name,
    score,
}: RankingItemProps) => {

    const percentage = (score / 5) * 100;

    return (
        <div className="ranking-item">

            <span className={
                `ranking-item-rank ${rank === 1 ? 'ranking-item-rank--first' : ''}`
            }>
                {rank}
            </span>

            <div className="ranking-item-info">

                <div className="ranking-item-top">
                    <span className="ranking-item-name">
                        {name}
                    </span>

                    <span className="ranking-item-score">
                        {score.toFixed(2)}
                    </span>
                </div>

                <div className="ranking-item-bar">
                    <div
                    className="ranking-item-progress"
                    style={{
                        width: `${percentage}%`
                    }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RankingItem;